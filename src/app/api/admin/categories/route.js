import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/session';
import { supabaseAdmin } from '@/lib/supabase';

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// GET /api/admin/categories
export async function GET(request) {
  const isAuth = await requireAuth();
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';

  let query = supabaseAdmin
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Categories fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ categories: data });
}

// POST /api/admin/categories
export async function POST(request) {
  const isAuth = await requireAuth();
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      full_description,
      image_url,
      banner_url,
      meta_title,
      meta_description,
      is_active = true,
      sort_order = 0,
    } = body;

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const finalSlug = slug || slugify(name);

    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert([{
        name: name.trim(),
        slug: finalSlug,
        description: description || '',
        full_description: full_description || '',
        image_url: image_url || null,
        banner_url: banner_url || null,
        meta_title: meta_title || name,
        meta_description: meta_description || description || '',
        is_active,
        sort_order,
      }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'A category with this slug already exists' }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ category: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
