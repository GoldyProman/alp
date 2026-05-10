import AboutClient from '@/components/AboutClient';

export const metadata = {
  title: "About Alpine Corporation | Leading Power Tools Supplier India",
  description: "Learn about Alpine Corporation, India's trusted industrial tools partner. We specialize in batch-tested diamond blades and TCT saws for harsh conditions.",
  keywords: ["about Alpine Corporation", "power tools supplier India", "industrial tools partner", "diamond blades supplier"],
  alternates: {
    canonical: 'https://www.alpinepowertools.com/about',
  },
  openGraph: {
    url: 'https://www.alpinepowertools.com/about',
    title: 'About Alpine Corporation | Industrial Tools India',
    description: 'Learn about our commitment to quality, batch-testing, and reliable industrial supply across India.',
    images: [{ url: 'https://www.alpinepowertools.com/og/about.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Alpine Corporation | Leading Power Tools Supplier India',
    description: 'Learn about Alpine Corporation, India\'s trusted industrial tools partner. We specialize in batch-tested diamond blades and TCT saws for harsh conditions.',
    images: ['https://www.alpinepowertools.com/og/about.jpg'],
  },
};

export default function About() {
  return <AboutClient />;
}
