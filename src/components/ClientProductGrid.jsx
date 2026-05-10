"use client";

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function ClientProductGrid({ category }) {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
      gap: '24px' 
    }}>
      {category.products.map((product) => (
        <Link 
          key={product.id}
          href={`/products/${category.id}/${product.id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              overflow: 'hidden',
              height: '100%',
              transition: 'all 0.3s ease'
            }}
            whileHover={{ y: -5, borderColor: 'var(--accent-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
          >
            {/* Product Image */}
            <div style={{ 
              aspectRatio: '1 / 1',
              width: '100%',
              backgroundColor: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '1.5rem',
              borderBottom: '1px solid var(--border-color)'
            }}>
              <div style={{ color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Add image</div>
            </div>

            {/* Product Content */}
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {product.title}
              </h4>
              
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', flexGrow: 1, lineHeight: 1.5 }}>
                {product.applications}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, fontSize: '0.75rem', marginTop: 'auto', color: 'var(--text-primary)' }} className="arrow-parent">
                SELECT OPTIONS <ChevronRight size={14} className="arrow-icon" />
              </div>
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}
