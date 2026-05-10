import { Barlow_Condensed, Barlow } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import HeaderWrapper from "@/components/HeaderWrapper";
import FooterWrapper from "@/components/FooterWrapper";
import FloatingContactWrapper from "@/components/FloatingContactWrapper";
import SplashWrapper from "@/components/SplashWrapper";
import { SpeedInsights } from "@vercel/speed-insights/next";

const barlowCondensed = Barlow_Condensed({ 
  weight: ['400', '500', '600', '700', '800'],
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-barlow-condensed',
});

const barlow = Barlow({ 
  weight: ['400', '500'],
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-barlow',
});

export const metadata = {
  metadataBase: new URL('https://www.alpinepowertools.com'),
  title: {
    default: "Industrial Diamond Blades & TCT Saw Blades India | Alpine Power Tools",
    template: "%s | Alpine Power Tools India"
  },
  description: "Alpine Power Tools India - Leading industrial supplier of batch-tested diamond blades, TCT saw blades, and cutting discs. Built for Indian voltage & conditions.",
  keywords: ["diamond blades India", "TCT saw blades India", "industrial power tools distributor India", "cutting discs manufacturer", "power tools supplier India", "diamond blade price India", "wholesale power tools India"],
  authors: [{ name: "Alpine Corporation" }],
  creator: "Alpine Corporation",
  publisher: "Alpine Corporation",
  alternates: {
    canonical: '/',
  },
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'Alpine Power Tools',
    title: 'Industrial Diamond Blades & TCT Saw Blades India | Alpine Power Tools',
    description: 'Alpine Power Tools is a leading supplier of industrial diamond blades, TCT saw blades, and cutting discs in India. Built for professional distributors.',
    images: [
      {
        url: '/og/home.jpg',
        width: 1200,
        height: 630,
        alt: 'Alpine Power Tools Industrial Catalogue',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Industrial Diamond Blades & TCT Saw Blades India | Alpine Power Tools',
    description: 'Alpine Power Tools is a leading supplier of industrial diamond blades, TCT saw blades, and cutting discs in India.',
    images: ['/og/home.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" suppressHydrationWarning className={`${barlowCondensed.variable} ${barlow.variable}`}>
      <head>
      </head>
      <body className={barlow.className}>
        <ThemeProvider>
          <SplashWrapper>
            <HeaderWrapper />
            <main>
              {children}
            </main>
            <FooterWrapper />
            <FloatingContactWrapper />
          </SplashWrapper>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
