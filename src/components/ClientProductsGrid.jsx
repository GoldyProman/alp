"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Search, Filter, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

export default function ClientProductsGrid({ categories }) {
  const [filter, setFilter] = useState("");

  const filteredCategories = categories.filter(cat => 
    cat.title.toLowerCase().includes(filter.toLowerCase()) ||
    cat.description.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

      {/* Categories Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '32px' 
      }}>
        <AnimatePresence mode="popLayout">
          {filteredCategories.map((category) => (
            <motion.div 
              key={category.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <Link 
                href={`/products/${category.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  className="category-card"
                >
                  {/* Category Image */}
                  <div style={{ 
                    aspectRatio: '1 / 1',
                    width: '100%',
                    backgroundColor: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    padding: '1.5rem',
                    borderBottom: '1px solid var(--border-color)',
                    position: 'relative'
                  }}>
                    {category.image && category.image !== '/assets/placeholder.png' ? (
                      <Image 
                        src={category.image} 
                        alt={category.title}
                        fill
                        style={{ objectFit: 'contain', padding: '1.5rem' }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div style={{ color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Add image</div>
                    )}
                  </div>

                  {/* Category Content */}
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <div className="label-tag" style={{ marginBottom: '0.5rem', color: 'var(--accent-color)' }}>COLLECTION</div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.6rem', textTransform: 'uppercase' }}>
                      {category.title}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', flexGrow: 1, lineHeight: 1.6 }}>
                      {category.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.8rem' }} className="arrow-parent">
                      VIEW CATEGORY <ChevronRight size={16} className="arrow-icon" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {filteredCategories.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <h3 style={{ color: 'var(--text-secondary)' }}>NO CATEGORIES MATCHED YOUR FILTER</h3>
          <button onClick={() => setFilter("")} className="btn-outline" style={{ marginTop: '1rem' }}>CLEAR FILTERS</button>
        </div>
      )}
    </div>
  );
}
