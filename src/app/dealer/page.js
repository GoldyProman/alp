import DealerClient from '@/components/DealerClient';

export const metadata = {
  title: "Become a Power Tools Distributor in India | Alpine Corporation",
  description: "Join India's most reliable power tools distributor network. Partner with Alpine for high-margin industrial diamond blades and TCT saws. Fast 48h dispatch nationwide.",
  keywords: ["become a tools distributor India", "Alpine franchise", "power tools dealership", "hardware supply business"],
  alternates: {
    canonical: 'https://www.alpinepowertools.com/dealer',
  },
  openGraph: {
    url: 'https://www.alpinepowertools.com/dealer',
    title: 'Become a Power Tools Distributor India | Alpine Franchise',
    description: 'Grow your hardware supply business with Alpine Corporation. Reliable stock, high margins, and premium industrial quality.',
    images: [{ url: 'https://www.alpinepowertools.com/og/dealer.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Become a Power Tools Distributor in India | Alpine Corporation',
    description: 'Join India\'s most reliable power tools distributor network. Partner with Alpine for high-margin industrial diamond blades and TCT saws. Fast 48h dispatch nationwide.',
    images: ['https://www.alpinepowertools.com/og/dealer.jpg'],
  },
};

export default function Dealer() {
  return <DealerClient />;
}
