import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import ClientProductGrid from '@/components/ClientProductGrid';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { category: categoryId } = await params;
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', categoryId)
    .single();

  if (!category) return { title: 'Category Not Found' };

  const fallbackDesc = `${category.name} — Professional power tools by Alpine Corporation. Wholesale supplier across India.`;
  const desc = category.meta_description || category.description || fallbackDesc;

  return {
    title: category.meta_title || `${category.name} | Alpine Power Tools`,
    description: desc,
    keywords: [category.name, "industrial saw blades", "power tool accessories India", "wholesale tools"],
    alternates: {
      canonical: `https://www.alpinepowertools.com/products/${categoryId}`,
    },
    openGraph: {
      url: `https://www.alpinepowertools.com/products/${categoryId}`,
      title: category.meta_title || `${category.name} | Alpine Power Tools`,
      description: desc,
      images: [{ url: category.image_url ? `https://www.alpinepowertools.com${category.image_url}` : `https://www.alpinepowertools.com/og/${categoryId}.jpg` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: category.meta_title || `${category.name} | Alpine Power Tools`,
      description: desc,
      images: [category.image_url ? `https://www.alpinepowertools.com${category.image_url}` : `https://www.alpinepowertools.com/og/${categoryId}.jpg`],
    },
  };
}

export default async function CategoryPage({ params }) {
  const { category: categoryId } = await params;
  
  const { data: category } = await supabase
    .from('categories')
    .select('*, products(*)')
    .eq('slug', categoryId)
    .single();

  if (!category) {
    notFound();
  }

  // Map products to match expected format
  const mappedProducts = (category.products || [])
    .filter(p => p.is_active)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    .map(p => ({
      id: p.slug,
      title: p.name,
      description: p.description,
      image: p.images?.[0] || '/assets/placeholder.png',
      tiers: p.tiers
    }));

  const mappedCategory = {
    ...category,
    id: category.slug,
    title: category.name,
    products: mappedProducts
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.alpinepowertools.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Products",
        "item": "https://www.alpinepowertools.com/products"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": mappedCategory.title,
        "item": `https://www.alpinepowertools.com/products/${mappedCategory.id}`
      }
    ]
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Breadcrumbs (Server Rendered) */}
      <nav style={{ paddingTop: 'calc(68px + 1.5rem)', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontFamily: 'var(--font-barlow-condensed)', fontWeight: 700, color: 'var(--text-secondary)' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>HOME</Link>
            <ChevronRight size={12} />
            <Link href="/products" style={{ color: 'inherit', textDecoration: 'none' }}>PRODUCTS</Link>
            <ChevronRight size={12} />
            <span style={{ color: 'var(--accent-color)' }}>{mappedCategory.title.toUpperCase()}</span>
          </div>
        </div>
      </nav>

      {/* Page Header (Server Rendered) */}
      <section style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ maxWidth: '900px' }}>
            <div className="label-tag" style={{ marginBottom: '0.6rem', color: 'var(--accent-color)' }}>INDUSTRIAL COLLECTION</div>
            <h1 style={{ marginBottom: '1rem', fontSize: 'clamp(28px, 4.5vw, 56px)', textTransform: 'uppercase' }}>
              {mappedCategory.id === 'diamond-blades' ? 'Industrial Diamond Saw Blades India' : 
               mappedCategory.id === 'tct-blades' ? 'Professional TCT Saw Blades India' : 
               mappedCategory.name}
            </h1>
            <p style={{ fontSize: '1.2rem', maxWidth: '700px', color: 'var(--text-secondary)' }}>
              {mappedCategory.description}
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid (Server Rendered Structure, Client Animations) */}
      <div className="container" style={{ paddingBottom: '3.5rem', paddingTop: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h3 className="nav-text" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>AVAILABLE MODELS ({mappedCategory.products.length})</h3>
        </div>
        <Suspense fallback={
          <div style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="label-tag">LOADING PRODUCTS...</div>
          </div>
        }>
          <ClientProductGrid category={mappedCategory} />
        </Suspense>
      </div>
    </div>
  );
}
