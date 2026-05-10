import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import ClientProductsGrid from '@/components/ClientProductsGrid';

export const metadata = {
  title: "Industrial Power Tools & Cutting Discs Catalogue | Alpine Power Tools India",
  description: "Explore our wholesale catalogue of industrial diamond blades, TCT saw blades, and cutting discs. Professional-grade tools for Indian construction & fabrication.",
  keywords: ["power tools catalogue", "diamond blade wholesale", "TCT saw catalogue", "industrial cutting tools", "Alpine tools price list"],
  alternates: {
    canonical: 'https://www.alpinepowertools.com/products',
  },
  openGraph: {
    url: 'https://www.alpinepowertools.com/products',
    title: 'Industrial Product Catalogue | Alpine Power Tools India',
    description: 'Explore our full range of industrial diamond blades and TCT saw blades. High-performance tools for Indian construction and industry.',
    images: [{ url: 'https://www.alpinepowertools.com/og/products.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Industrial Power Tools & Cutting Discs Catalogue | Alpine Power Tools India',
    description: 'Explore our wholesale catalogue of industrial diamond blades, TCT saw blades, and cutting discs. Professional-grade tools for Indian construction & fabrication.',
    images: ['https://www.alpinepowertools.com/og/products.jpg'],
  },
};

export default async function ProductsPage() {
  const { data: dbCategories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  const mappedCategories = (dbCategories || []).map(cat => ({
    id: cat.slug,
    title: cat.name,
    description: cat.description,
    image: cat.image_url,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": mappedCategories.map((cat, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://www.alpinepowertools.com/products/${cat.id}`
    }))
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Page Header (Server Rendered) */}
      <section className="texture-bg" style={{ paddingTop: 'calc(68px + 2.5rem)', paddingBottom: '2.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ maxWidth: '900px' }}>
            <div className="label-tag" style={{ marginBottom: '1rem' }}>INDUSTRIAL CATALOGUE</div>
            <h1 style={{ marginBottom: '1.5rem', fontSize: 'clamp(32px, 5vw, 64px)' }}>Industrial Diamond Blades & Cutting Tools India</h1>
            <p style={{ fontSize: '1.2rem', maxWidth: '700px', color: 'var(--text-secondary)' }}>
              Explore our specialized tool ranges, engineered for precision across diverse industrial applications in the Indian market.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid (Server Rendered Structure, Client Animations) */}
      <div className="container" style={{ paddingBottom: '3.5rem', paddingTop: '2.5rem' }}>
        <Suspense fallback={
          <div style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="label-tag">LOADING CATALOGUE...</div>
          </div>
        }>
          <ClientProductsGrid categories={mappedCategories} />
        </Suspense>
      </div>
    </div>
  );
}
