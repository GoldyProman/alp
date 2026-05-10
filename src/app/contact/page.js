import ContactClient from '@/components/ContactClient';

export const metadata = {
  title: "Contact Alpine Power Tools India | Wholesale Inquiries & Support",
  description: "Get in touch with Alpine Power Tools for wholesale pricing, dealer inquiries, and technical support. Call/WhatsApp +91 9591380236 or email our India office.",
  keywords: ["contact Alpine Power Tools", "power tools wholesale India", "tools technical support", "Alpine tools customer care"],
  alternates: {
    canonical: 'https://www.alpinepowertools.com/contact',
  },
  openGraph: {
    url: 'https://www.alpinepowertools.com/contact',
    title: 'Contact Alpine Power Tools | Support & Wholesale Inquiries',
    description: 'Reach out to us via WhatsApp or email for bulk orders and industrial tool support in India.',
    images: [{ url: 'https://www.alpinepowertools.com/og/contact.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Alpine Power Tools India | Wholesale Inquiries & Support',
    description: 'Get in touch with Alpine Power Tools for wholesale pricing, dealer inquiries, and technical support. Call/WhatsApp +91 9591380236 or email our India office.',
    images: ['https://www.alpinepowertools.com/og/contact.jpg'],
  },
};

export default function Contact() {
  return <ContactClient />;
}
