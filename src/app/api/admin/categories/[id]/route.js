import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/session';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/admin/categories/[id]
export async function GET(request, { params }) {
  const isAuth = await requireAuth();
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }

  return NextResponse.json({ category: data });
}

// PATCH /api/admin/categories/[id]
export async function PATCH(request, { params }) {
  const isAuth = await requireAuth();
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from('categories')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ category: data });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// DELETE /api/admin/categories/[id]
export async function DELETE(request, { params }) {
  const isAuth = await requireAuth();
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  // Check if category has products
  const { count } = await supabaseAdmin
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', id);

  if (count > 0) {
    return NextResponse.json(
      { error: `Cannot delete: this category has ${count} product(s). Delete or move them first.` },
      { status: 409 }
    );
  }

  const { error } = await supabaseAdmin
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
