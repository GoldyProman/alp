"use client";

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Animation Variants
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const StatsCounter = ({ value, label }) => (
  <motion.div variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
    <div style={{ color: 'var(--accent-color)', fontSize: 'clamp(3rem, 10vw, 3.5rem)', fontWeight: 800, fontFamily: 'var(--font-barlow-condensed)', lineHeight: 1 }}>
      {value}
    </div>
    <div className="label-tag" style={{ color: 'var(--text-secondary)', fontSize: 'clamp(15px, 2.5vw, 15px)' }}>{label}</div>
  </motion.div>
);

export default function HomeClient() {
  return (
    <>
      {/* HERO SECTION */}
      <section 
        className="texture-bg" 
        style={{ 
          minHeight: 'clamp(580px, 90vh, 900px)', 
          display: 'flex', 
          alignItems: 'center', 
          position: 'relative', 
          overflow: 'hidden',
          paddingTop: 'clamp(72px, 10vh, 100px)',
          paddingBottom: 'clamp(1.5rem, 3vw, 3rem)',
          borderBottom: '1px solid var(--border-color)'
        }}
      >
        
        <div className="container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer}
            style={{ maxWidth: '1200px', margin: '0 auto' }}
          >
            {/* Main Content Group */}
            <div style={{ marginBottom: 'clamp(1.25rem, 2.5vw, 2rem)' }}>
              <motion.div variants={fadeUp} className="label-tag" style={{ color: 'var(--text-secondary)', marginBottom: '0.6rem', letterSpacing: '0.2em' }}>
                TRUSTED BY CONTRACTORS & DISTRIBUTORS ACROSS INDIA
              </motion.div>
              
              <motion.h1 variants={fadeUp} style={{ 
                marginBottom: '1rem', 
                fontSize: 'clamp(52px, 12vw, 84px)',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                maxWidth: '18ch'
              }}>
                PROFESSIONAL POWER TOOLS SUPPLIER IN INDIA
              </motion.h1>
              
              <motion.p variants={fadeUp} style={{ 
                fontSize: 'clamp(18px, 3.5vw, 18px)', 
                marginBottom: '1.5rem', 
                maxWidth: '65ch',
                lineHeight: 1.6,
                opacity: 0.9
              }}>
                Professional-grade power tools and equipment built for reliability, precision, and everyday heavy-duty use.
              </motion.p>
              
              <motion.div variants={fadeUp} style={{ 
                display: 'flex', 
                gap: '0.75rem', 
                flexWrap: 'wrap',
                alignItems: 'stretch'
              }}>
                <Link href="/products" className="btn btn-primary arrow-parent" style={{ minWidth: '170px', height: '50px' }}>
                  VIEW PRODUCTS <ArrowRight size={18} className="arrow-icon" />
                </Link>
                <Link href="/dealer" className="btn btn-outline arrow-parent" style={{ minWidth: '170px', height: '50px' }}>
                  BECOME A DISTRIBUTOR <ArrowRight size={18} className="arrow-icon" />
                </Link>
              </motion.div>
            </div>

            {/* Premium Stats Bar */}
            <motion.div 
              variants={staggerContainer} 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
                gap: 'clamp(1rem, 3vw, 3rem)',
                paddingTop: 'clamp(1rem, 2vw, 1.75rem)',
                borderTop: '1px solid var(--border-color)',
                marginTop: '0.5rem'
              }}
            >
              <StatsCounter value="FAST" label="DISTRIBUTOR SUPPORT" />
              <StatsCounter value="HEAVY" label="DUTY BUILD" />
              <StatsCounter value="48H" label="DISPATCH" />
              <StatsCounter value="100%" label="BATCH TESTED" />
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative Element */}
        <svg className="ghost-triangle desktop-only" viewBox="0 0 100 100" style={{ zIndex: 0, opacity: 0.1, color: 'var(--border-color)' }}>
          <path d="M50 10 L10 90 L35 90 L50 60 L65 90 L90 90 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </section>

      {/* EXPLORE CATEGORIES */}
      <section className="section" style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            style={{ marginBottom: '1.25rem', textAlign: 'center' }}
          >
            <div className="label-tag" style={{ marginBottom: '0.5rem' }}>PRODUCT RANGE</div>
            <h2>Industrial Cutting Solutions & Power Tool Catalogue</h2>
          </motion.div>

          <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {[
              { title: 'DIAMOND TOOLS', desc: 'High-performance diamond blades and segments for heavy-duty industrial cutting.', path: '/products?category=diamond-blades' },
              { title: 'TCT TOOLS', desc: 'Precision TCT saws and cutters engineered for clean finishes and long life.', path: '/products?category=tct-blades' },
              { title: 'CUTTING BLADES', desc: 'Durable abrasive and specialty cutting solutions for all industrial applications.', path: '/products?category=abrasive-discs' }
            ].map((cat, i) => (
              <motion.div 
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                whileHover={{ y: -8 }}
                style={{
                  border: '1px solid var(--border-color)',
                  padding: '1.75rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: 'var(--bg-secondary)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', backgroundColor: 'var(--accent-color)' }} />
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--text-primary)', letterSpacing: '0.02em' }}>{cat.title}</h3>
                <p style={{ marginBottom: '1.25rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{cat.desc}</p>
                <div style={{ marginTop: 'auto' }}>
                  <Link href={cat.path} className="arrow-parent" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    color: 'var(--accent-color)', 
                    fontWeight: 700,
                    fontFamily: 'var(--font-barlow-condensed)',
                    fontSize: '0.9rem',
                    letterSpacing: '0.1em'
                  }}>
                    EXPLORE COLLECTION <ArrowRight size={18} className="arrow-icon" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-container" style={{ display: 'flex', whiteSpace: 'nowrap', overflow: 'hidden' }}>
        <div className="marquee-content" style={{ display: 'inline-block', paddingRight: '2rem', animation: 'marquee 20s linear infinite' }}>
          DIAMOND BLADES &nbsp;&middot;&nbsp; TCT CUTTING &nbsp;&middot;&nbsp; METAL FABRICATION &nbsp;&middot;&nbsp; WOODWORKING &nbsp;&middot;&nbsp; INDUSTRIAL GRADE &nbsp;&middot;&nbsp; DISTRIBUTOR NETWORK &nbsp;&middot;&nbsp; 48H DISPATCH &nbsp;&middot;&nbsp; PRECISION ENGINEERED &nbsp;&middot;&nbsp;
          DIAMOND BLADES &nbsp;&middot;&nbsp; TCT CUTTING &nbsp;&middot;&nbsp; METAL FABRICATION &nbsp;&middot;&nbsp; WOODWORKING &nbsp;&middot;&nbsp; INDUSTRIAL GRADE &nbsp;&middot;&nbsp; DISTRIBUTOR NETWORK &nbsp;&middot;&nbsp; 48H DISPATCH &nbsp;&middot;&nbsp; PRECISION ENGINEERED &nbsp;&middot;&nbsp;
          DIAMOND BLADES &nbsp;&middot;&nbsp; TCT CUTTING &nbsp;&middot;&nbsp; METAL FABRICATION &nbsp;&middot;&nbsp; WOODWORKING &nbsp;&middot;&nbsp; INDUSTRIAL GRADE &nbsp;&middot;&nbsp; DISTRIBUTOR NETWORK &nbsp;&middot;&nbsp; 48H DISPATCH &nbsp;&middot;&nbsp; PRECISION ENGINEERED &nbsp;&middot;&nbsp;
          DIAMOND BLADES &nbsp;&middot;&nbsp; TCT CUTTING &nbsp;&middot;&nbsp; METAL FABRICATION &nbsp;&middot;&nbsp; WOODWORKING &nbsp;&middot;&nbsp; INDUSTRIAL GRADE &nbsp;&middot;&nbsp; DISTRIBUTOR NETWORK &nbsp;&middot;&nbsp; 48H DISPATCH &nbsp;&middot;&nbsp; PRECISION ENGINEERED &nbsp;&middot;&nbsp;
        </div>
      </div>

      {/* ABOUT PREVIEW */}
      <section className="section" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            style={{ maxWidth: '800px' }}
          >
            <motion.div variants={fadeUp} className="label-tag" style={{ marginBottom: '0.6rem' }}>ABOUT ALPINE</motion.div>
            <motion.h2 variants={fadeUp} style={{ marginBottom: '1.25rem' }}>BATCH-TESTED FOR CONSISTENCY AND RELIABILITY.</motion.h2>
            <motion.p variants={fadeUp} style={{ marginBottom: '1rem', fontSize: '1.15rem' }}>
              Professional power tools and equipment engineered for durability, precision, and dependable performance.
            </motion.p>
            <motion.p variants={fadeUp} style={{ marginBottom: '1.75rem' }}>
              Our tools are specifically manufactured to handle Indian industrial conditions—managing voltage fluctuations and harsh environments with ease. We prioritize consistent quality standards and a professional supply mindset to ensure our <Link href="/products/diamond-blades" style={{ color: 'inherit', textDecoration: 'underline' }}>industrial diamond blades</Link> and tool network remains robust, supplied, and profitable.
            </motion.p>
            <motion.div variants={fadeUp} style={{ marginTop: '1rem' }}>
              <Link href="/about" className="btn btn-outline arrow-parent">
                LEARN MORE <ArrowRight size={18} className="arrow-icon" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* WHY ALPINE CORPORATION? */}
      <section className="section" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'clamp(1.5rem, 3vw, 3rem)' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
              <motion.div variants={fadeUp} className="label-tag" style={{ marginBottom: '0.6rem' }}>OUR ADVANTAGE</motion.div>
              <motion.h2 variants={fadeUp} style={{ marginBottom: '1rem' }}>Leading Industrial Power Tools Supplier in India</motion.h2>
              <motion.p variants={fadeUp} style={{ marginBottom: '1.5rem' }}>
                We don't just sell tools; we build robust power tools. Every Alpine product is engineered to deliver identical, high-performance output, ensuring professionals can rely on them day in and day out.
              </motion.p>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
              className="flush-grid"
            >
              {[
                { num: '01', title: 'Consistent Performance', desc: 'Every batch tested for identical output.' },
                { num: '02', title: 'Built for Indian Conditions', desc: 'Handles voltage fluctuations & harsh environments.' },
                { num: '03', title: 'Distributor-Friendly Pricing', desc: 'Margins designed for long-term partnerships.' },
                { num: '04', title: 'Reliable Supply Chain', desc: 'Stable inventory and fast dispatch.' }
              ].map((feature, i) => (
                <motion.div key={i} variants={fadeUp} style={{ padding: '1.5rem' }}>
                  <div className="condensed" style={{ color: 'var(--accent-color)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.6rem' }}>{feature.num}</div>
                  <h3 style={{ marginBottom: '0.35rem', fontSize: '1.1rem' }}>{feature.title}</h3>
                  <p style={{ fontSize: '1rem' }}>{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* PARTNER CTA SECTION */}
      <section 
        className="texture-bg"
        style={{ 
          backgroundColor: '#00A896',
          color: '#000000',
          padding: 'clamp(2.5rem, 5vw, 5rem) 0',
          borderTop: '1px solid rgba(0,0,0,0.1)',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} style={{ maxWidth: '900px', margin: '0 auto' }}>
            <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)', marginBottom: '1rem', lineHeight: 1.1 }}>
              PARTNER WITH ALPINE POWER TOOLS India.
            </motion.h2>
            <motion.p variants={fadeUp} style={{ color: '#000000', fontSize: 'clamp(16px, 1.6vw, 20px)', marginBottom: '2rem', fontWeight: 500, opacity: 0.8 }}>
              Join our growing network of authorized dealers and distributors across India and scale your power tools supply business.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link href="/contact" className="btn" style={{ 
                backgroundColor: '#000000', 
                color: '#00A896',
                padding: '0.85rem 2.25rem',
                fontSize: '1rem',
                fontWeight: 800
              }}>
                GET IN TOUCH <ArrowRight size={20} style={{ marginLeft: '10px' }} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
