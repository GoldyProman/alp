"use client";

import Link from 'next/link';
import AlpineLogo from './AlpineLogo';

export default function Footer() {
  return (
    <footer style={{ 
      borderTop: '1px solid var(--border-color)', 
      paddingTop: 'clamp(1.5rem, 3vw, 2.25rem)',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)'
    }}>
      <div className="container">

        {/* Main Footer Content: Brand | Links Row */}
        <div className="footer-grid" style={{ marginBottom: '1.5rem' }}>

          {/* Column 1: Brand & Info */}
          <div className="footer-brand">
            <Link href="/" style={{ display: 'flex', alignItems: 'center', marginBottom: '1.25rem' }}>
              <AlpineLogo style={{ height: '48px', width: 'auto', color: 'var(--text-primary)' }} />
            </Link>
            <p style={{ fontSize: '0.92rem', lineHeight: '1.6', opacity: 0.8, marginBottom: '1.25rem' }}>
              Alpine Corporation provides professional-grade power tools and industrial solutions engineered for durability, precision, and dependable everyday performance.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span className="label-tag" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>GET IN TOUCH</span>
              <a href="mailto:info.alpinepowertools@gmail.com" className="footer-email">
                info.alpinepowertools@gmail.com
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links + Social Media in one row */}
          <div className="footer-links-row">

            {/* Quick Links */}
            <div className="footer-links-section">
              <h4 className="footer-col-heading">QUICK LINKS</h4>
              <ul className="footer-link-list">
                <li><Link href="/" className="footer-link">Home</Link></li>
                <li><Link href="/products" className="footer-link">Products</Link></li>
                <li><Link href="/about" className="footer-link">About Us</Link></li>
                <li><Link href="/contact" className="footer-link">Contact</Link></li>
                <li><Link href="/dealer" className="footer-link dealer-link">Become A Distributor</Link></li>
              </ul>
            </div>

            {/* Social Media */}
            <div className="footer-links-section">
              <h4 className="footer-col-heading">SOCIAL MEDIA</h4>
              <ul className="footer-link-list">
                <li><a href="https://youtube.com/@alpinepowertools?si=-LiEV8AbDrbjMJT8" target="_blank" rel="noopener noreferrer" className="footer-link">YouTube</a></li>
                <li><a href="https://www.instagram.com/alpinepowertools07?igsh=cG1ydzF1em9nM3hz" target="_blank" rel="noopener noreferrer" className="footer-link">Instagram</a></li>
                <li><a href="https://wa.me/919591380236" target="_blank" rel="noopener noreferrer" className="footer-link">WhatsApp</a></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="nav-text" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
            &copy; {new Date().getFullYear()} ALPINE. ALL RIGHTS RESERVED.
          </div>
          <div className="nav-text" style={{ color: 'var(--accent-color)', fontSize: '0.75rem', fontWeight: 700 }}>
            MADE FOR INDIA.
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ── Link base style (both columns) ── */
        .footer-link {
          font-family: var(--font-barlow-condensed);
          font-weight: 500;
          font-size: 0.9rem;
          letter-spacing: 0.06em;
          color: var(--text-secondary);
          text-decoration: none;
          display: inline-block;
          transition: color 0.3s ease, transform 0.3s ease;
        }
        .footer-link:hover {
          color: var(--accent-color);
          transform: translateX(4px);
        }
        .dealer-link {
          color: var(--accent-color);
        }

        /* ── Email ── */
        .footer-email {
          font-size: 0.88rem;
          color: var(--accent-color);
          text-decoration: none;
          font-weight: 600;
          font-family: var(--font-barlow-condensed);
        }

        /* ── Column heading ── */
        .footer-col-heading {
          font-family: var(--font-barlow-condensed);
          font-weight: 700;
          font-size: 0.78rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--text-primary);
          margin: 0 0 0.85rem 0;
        }

        /* ── Vertical list (desktop default) ── */
        .footer-link-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }

        /* ── Main grid: Brand | Links ── */
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: clamp(1.5rem, 4vw, 4rem);
          align-items: start;
        }

        /* ── Links row: Quick Links | Social Media side-by-side ── */
        .footer-links-row {
          display: flex;
          flex-direction: row;
          gap: clamp(2rem, 4vw, 4rem);
          align-items: flex-start;
        }

        /* ── Bottom bar ── */
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          padding-top: 1rem;
          padding-bottom: 1rem;
          border-top: 1px solid var(--border-color);
        }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
            text-align: center;
          }
          .footer-brand {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .footer-links-row {
            justify-content: center;
            gap: 2.5rem;
          }
          .footer-links-section {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .footer-link-list {
            align-items: center;
          }
          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
