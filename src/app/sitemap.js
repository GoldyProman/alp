import { supabase } from '@/lib/supabase';

export default async function sitemap() {
  const baseUrl = 'https://www.alpinepowertools.com';
  
  // Get all active categories
  const { data: categories } = await supabase
    .from('categories')
    .select('slug, created_at')
    .eq('is_active', true);

  // Get all active products with their category slug
  const { data: products } = await supabase
    .from('products')
    .select('slug, category_id, categories!inner(slug), updated_at, created_at')
    .eq('is_active', true);

  // Static pages
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/dealer`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Dynamic category pages
  const categoryRoutes = (categories || []).map((cat) => ({
    url: `${baseUrl}/products/${cat.slug}`,
    lastModified: cat.created_at ? new Date(cat.created_at) : new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // Dynamic product pages
  const productRoutes = (products || []).map((prod) => {
    // If we have categories nested from the join, use it
    const catSlug = prod.categories?.slug || 'uncategorized';
    return {
      url: `${baseUrl}/products/${catSlug}/${prod.slug}`,
      lastModified: prod.updated_at ? new Date(prod.updated_at) : (prod.created_at ? new Date(prod.created_at) : new Date()),
      changeFrequency: 'weekly',
      priority: 0.8,
    };
  });

  return [...routes, ...categoryRoutes, ...productRoutes];
}
