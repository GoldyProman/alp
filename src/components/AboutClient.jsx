"use client";

import { motion } from 'framer-motion';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

export default function AboutClient() {
  return (
    <>
      <section className="texture-bg" style={{ paddingTop: 'calc(68px + clamp(1.5rem, 3vw, 2.5rem))', paddingBottom: 'clamp(1.5rem, 3vw, 2.5rem)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} style={{ maxWidth: '900px' }}>
            <motion.div variants={fadeUp} className="label-tag" style={{ marginBottom: '0.6rem' }}>CORPORATE IDENTITY</motion.div>
            <motion.h1 variants={fadeUp} style={{ marginBottom: '1rem', fontSize: 'clamp(36px, 5.5vw, 72px)' }}>THE ALPINE STANDARD</motion.h1>
            <motion.p variants={fadeUp} style={{ fontSize: 'clamp(18px, 2vw, 24px)', maxWidth: '700px' }}>
              Alpine delivers high perfomance  power tools engineered for consistency and reliability. We focus on providing distributors and professionals with equipment that withstands rigorous daily operations without compromise.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0, borderBottom: 'none' }}>
        <div className="container" style={{ padding: 0 }}>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '0', border: '1px solid var(--border-color)', borderTop: 'none' }}>
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
              style={{ 
                minHeight: '420px', 
                borderRight: '1px solid var(--border-color)',
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                padding: 'clamp(1.5rem, 3.5vw, 3rem)',
                backgroundColor: 'var(--bg-primary)'
              }}
            >
              <motion.div variants={fadeUp} className="label-tag" style={{ marginBottom: '0.6rem' }}>PRACTICAL PERFORMANCE</motion.div>
              <motion.h2 variants={fadeUp} style={{ marginBottom: '1.25rem', fontSize: 'clamp(26px, 3.5vw, 38px)' }}>ENGINEERED FOR DAILY USE</motion.h2>
              <motion.p variants={fadeUp} style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                Every Alpine product is designed with a focus on practical performance, long service life, and reliable operation in real working environments. From workshops and fabrication units to construction and installation jobs, our tools are built to deliver dependable results day after day.
              </motion.p>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
              style={{ padding: 'clamp(1.5rem, 3.5vw, 3rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'var(--bg-secondary)' }}
            >
              <motion.div variants={fadeUp} className="label-tag" style={{ marginBottom: '0.6rem' }}>BUILT FOR REALITY</motion.div>
              <motion.h2 variants={fadeUp} style={{ marginBottom: '1.25rem' }}>ENGINEERED FOR THE HARSH DEMANDS OF THE JOB SITE.</motion.h2>
              <motion.p variants={fadeUp} style={{ marginBottom: '1rem', fontSize: '1.05rem' }}>
                Our tools are specifically manufactured to handle Indian industrial conditions—managing voltage fluctuations and harsh environments with ease. We prioritize consistent quality standards and a professional supply mindset to ensure our distributor network remains robust, supplied, and profitable.
              </motion.p>
              <motion.div variants={staggerContainer} style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <motion.div variants={fadeUp}>
                  <h4 className="nav-text" style={{ color: 'var(--accent-color)', marginBottom: '0.5rem' }}>CONSISTENT QUALITY</h4>
                  <p>Every tool meets rigorous industrial standards for identical output.</p>
                </motion.div>
                <motion.div variants={fadeUp}>
                  <h4 className="nav-text" style={{ color: 'var(--accent-color)', marginBottom: '0.5rem' }}>DISTRIBUTOR PARTNERSHIP</h4>
                  <p>Built on mutual growth, transparency, and clear margins.</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
