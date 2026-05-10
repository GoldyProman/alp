import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/categories - Public categories with active products
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        id, name, slug, description, image_url,
        products (
          id, name, slug, description, images, tiers
        )
      `)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    // Filter out inactive products manually if needed, or rely on RLS
    // The products query will respect RLS if supabase (anon) is used.
    
    const mapped = data.map(cat => ({
      id: cat.slug,
      title: cat.name,
      description: cat.description,
      image: cat.image_url,
      products: (cat.products || []).map(p => ({
        id: p.slug,
        title: p.name,
        description: p.description,
        image: p.images?.[0] || '/assets/placeholder.png',
        tiers: p.tiers
      }))
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
