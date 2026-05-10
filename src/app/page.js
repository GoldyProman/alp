import HomeClient from '@/components/HomeClient';

export const metadata = {
  title: "Professional Power Tools Supplier in India | Alpine Power Tools",
  description: "Alpine Power Tools is India's leading supplier of batch-tested industrial diamond blades, TCT saw blades, and cutting discs. 48h dispatch for wholesale dealers.",
  keywords: ["diamond blades India", "TCT saw blades", "cutting discs supplier", "wholesale power tools India", "industrial tools distributor", "diamond blade price"],
  alternates: {
    canonical: 'https://www.alpinepowertools.com/',
  },
  openGraph: {
    url: 'https://www.alpinepowertools.com/',
    title: 'Industrial Diamond Blades & TCT Saw Blades India | Alpine Power Tools',
    description: 'India\'s most reliable industrial cutting solutions. Batch-tested diamond blades and TCT saws with 48h dispatch.',
    images: [{ url: 'https://www.alpinepowertools.com/og/home.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Power Tools Supplier in India | Alpine Power Tools',
    description: 'Alpine Power Tools is India\'s leading supplier of batch-tested industrial diamond blades, TCT saw blades, and cutting discs. 48h dispatch for wholesale dealers.',
    images: ['https://www.alpinepowertools.com/og/home.jpg'],
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([{
            "@context": "https://schema.org",
            "@type": ["Organization", "LocalBusiness"],
            "@id": "https://www.alpinepowertools.com/#organization",
            "name": "Alpine Corporation",
            "alternateName": "Alpine Power Tools",
            "url": "https://www.alpinepowertools.com",
            "logo": "https://www.alpinepowertools.com/logo.png",
            "image": "https://www.alpinepowertools.com/og/home.jpg",
            "email": "info.alpinepowertools@gmail.com",
            "telephone": "+919591380236",
            "priceRange": "₹₹",
            "sameAs": [
              "https://youtube.com/@alpinepowertools",
              "https://www.instagram.com/alpinepowertools07",
              "https://wa.me/919591380236"
            ],
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "IN"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+919591380236",
              "contactType": "customer service",
              "areaServed": "IN",
              "availableLanguage": ["en", "hi"]
            }
          }, {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": "https://www.alpinepowertools.com",
            "name": "Alpine Power Tools",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.alpinepowertools.com/products?search={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }, {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{
              "@type": "Question",
              "name": "What types of diamond blades does Alpine sell?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Alpine specializes in high-performance Turbo Diamond Blades for clean finishes and Segmented Diamond Blades for aggressive cutting in concrete, granite, and masonry."
              }
            }, {
              "@type": "Question",
              "name": "What is the dispatch time for orders?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We guarantee a 48-hour dispatch time for all authorized dealer and wholesale orders across India to ensure your stock remains consistent."
              }
            }, {
              "@type": "Question",
              "name": "How to become an Alpine distributor?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "You can apply through our 'Become a Distributor' page. We offer distributor-friendly margins and technical support for long-term industrial partnerships."
              }
            }, {
              "@type": "Question",
              "name": "Are Alpine tools suitable for Indian voltage?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, every Alpine product is batch-tested and engineered specifically to handle Indian voltage fluctuations and harsh industrial environments."
              }
            }, {
              "@type": "Question",
              "name": "What sizes are available for saw blades?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We offer a wide range of sizes from 4-inch (105mm) for handheld tools up to 18-inch (450mm) for heavy-duty industrial road and bridge construction."
              }
            }, {
              "@type": "Question",
              "name": "Where does Alpine supply tools in India?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Alpine Corporation supplies industrial-grade tools to contractors and hardware dealers nationwide, with a strong presence in major industrial hubs."
              }
            }]
          }])
        }}
      />
      <HomeClient />
    </>
  );
}
