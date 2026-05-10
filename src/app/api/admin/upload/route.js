import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/session';
import { supabaseAdmin } from '@/lib/supabase';

const BUCKET_NAME = 'alpine-media';

// POST /api/admin/upload - upload a file to Supabase Storage
export async function POST(request) {
  const isAuth = await requireAuth();
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images (JPEG, PNG, WebP, GIF, SVG) are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const safeOriginalName = file.name
      .replace(/\.[^.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .slice(0, 40);
    const fileName = `${folder}/${timestamp}-${safeOriginalName}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Storage upload error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return NextResponse.json({
      url: publicUrl,
      path: data.path,
      name: file.name,
      size: file.size,
      type: file.type,
    }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

// DELETE /api/admin/upload - delete a file from storage
export async function DELETE(request) {
  const isAuth = await requireAuth();
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { path } = await request.json();
    if (!path) return NextResponse.json({ error: 'File path is required' }, { status: 400 });

    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// GET /api/admin/upload - list media files
export async function GET(request) {
  const isAuth = await requireAuth();
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const folder = searchParams.get('folder') || '';

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const filesWithUrls = (data || [])
    .filter((f) => f.name !== '.emptyFolderPlaceholder')
    .map((file) => {
      const path = folder ? `${folder}/${file.name}` : file.name;
      const { data: { publicUrl } } = supabaseAdmin.storage
        .from(BUCKET_NAME)
        .getPublicUrl(path);
      return { ...file, path, url: publicUrl };
    });

  return NextResponse.json({ files: filesWithUrls });
}
