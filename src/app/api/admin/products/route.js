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

// GET /api/admin/products
export async function GET(request) {
  const isAuth = await requireAuth();
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const status = searchParams.get('status') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from('products')
    .select(`
      *,
      categories(id, name, slug)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) query = query.ilike('name', `%${search}%`);
  if (category) query = query.eq('category_id', category);
  if (status === 'active') query = query.eq('is_active', true);
  if (status === 'inactive') query = query.eq('is_active', false);
  if (status === 'featured') query = query.eq('is_featured', true);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    products: data,
    total: count,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  });
}

// POST /api/admin/products
export async function POST(request) {
  const isAuth = await requireAuth();
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const {
      name,
      slug,
      category_id,
      description,
      full_description,
      images = [],
      tiers = [],
      specifications = [],
      sizes = [],
      tags = [],
      is_active = true,
      is_featured = false,
      meta_title,
      meta_description,
      sort_order = 0,
    } = body;

    if (!name) return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    if (!category_id) return NextResponse.json({ error: 'Category is required' }, { status: 400 });

    const finalSlug = slug || slugify(name);

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([{
        name: name.trim(),
        slug: finalSlug,
        category_id,
        description: description || '',
        full_description: full_description || '',
        images,
        tiers,
        specifications,
        sizes,
        tags,
        is_active,
        is_featured,
        meta_title: meta_title || name,
        meta_description: meta_description || description || '',
        sort_order,
      }])
      .select(`*, categories(id, name, slug)`)
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'A product with this slug already exists' }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ product: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
