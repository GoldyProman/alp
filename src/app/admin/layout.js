import { Barlow_Condensed, Barlow } from "next/font/google";
import "../globals.css";
import "./admin.css";

const barlowCondensed = Barlow_Condensed({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ["latin"],
  variable: '--font-barlow-condensed',
});

const barlow = Barlow({
  weight: ['400', '500'],
  subsets: ["latin"],
  variable: '--font-barlow',
});

export const metadata = {
  title: {
    default: "Admin Panel | Alpine Power Tools",
    template: "%s | Alpine Admin"
  },
  description: "Admin dashboard for Alpine Power Tools",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return (
    <div 
      data-theme="light" 
      className={`${barlowCondensed.variable} ${barlow.variable} admin-root-wrapper`}
      style={{ minHeight: '100vh', background: 'var(--admin-bg)', color: 'var(--admin-text)' }}
    >
      {children}
    </div>
  );
}
