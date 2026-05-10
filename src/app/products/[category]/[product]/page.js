import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ProductClient from '@/components/ProductClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { category: categoryId, product: productId } = await params;
  
  const { data: product } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('slug', productId)
    .single();

  if (!product) return { title: 'Product Not Found' };

  const canonicalUrl = `/products/${categoryId}/${productId}`;

  return {
    title: product.meta_title || `${product.name} | Alpine Power Tools India`,
    description: product.meta_description || product.description,
    keywords: [product.name, product.categories?.name, "industrial tools India", "wholesale saw blades", product.id],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      url: canonicalUrl,
      title: `${product.name} | Alpine Power Tools`,
      description: product.description,
      images: [{ url: product.images?.[0] || `/og/${productId}.jpg` }],
    },
  };
}

export default async function ProductPage({ params }) {
  const { category: categoryId, product: productId } = await params;
  
  const { data: product } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('slug', productId)
    .single();

  if (!product || product.categories?.slug !== categoryId) {
    notFound();
  }

  // Map product to expected format
  const mappedProduct = {
    ...product,
    id: product.slug,
    title: product.name,
    image: product.images?.[0] || '/assets/placeholder.png',
  };

  const mappedCategory = {
    ...product.categories,
    id: product.categories.slug,
    title: product.categories.name
  };

  const productUrl = `/products/${categoryId}/${productId}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": mappedProduct.title,
      "description": mappedProduct.description,
      "image": mappedProduct.image,
      "sku": mappedProduct.id,
      "brand": {
        "@type": "Brand",
        "name": "Alpine"
      },
      "category": mappedCategory.title,
      "offers": {
        "@type": "Offer",
        "url": productUrl,
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock"
      }
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="label-tag">LOADING PRODUCT DETAILS...</div>
        </div>
      }>
        <ProductClient category={mappedCategory} product={mappedProduct} />
      </Suspense>
    </div>
  );
}
