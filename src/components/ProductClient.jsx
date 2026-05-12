"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Check, ChevronRight, X
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function ProductClient({ category, product }) {
  // Normalize tiers to an array
  const tiers = Array.isArray(product.tiers) ? product.tiers : Object.values(product.tiers || {});
  
  const [selectedTierIdx, setSelectedTierIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(tiers[0]?.sizes?.[0] || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formStatus, setFormStatus] = useState('idle');

  if (!product) return null;

  const currentTier = tiers[selectedTierIdx];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    
    const formData = {
      name: e.target[0].value,
      company: e.target[1].value,
      phone: e.target[2].value,
      email: e.target[3].value,
      message: e.target[4].value,
      product_name: `${product.title} (${currentTier.title} - ${selectedSize})`,
    };

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormStatus('sent');
        setTimeout(() => {
          setIsModalOpen(false);
          setFormStatus('idle');
        }, 3000);
      } else {
        throw new Error('Failed to send');
      }
    } catch (err) {
      alert("Failed to send inquiry. Please try again.");
      setFormStatus('idle');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      
      {/* 1. Breadcrumbs */}
      <nav style={{ paddingTop: 'calc(68px + 1.5rem)', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontFamily: 'var(--font-barlow-condensed)', fontWeight: 700, color: 'var(--text-secondary)' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>HOME</Link>
            <ChevronRight size={12} />
            <Link href="/products" style={{ color: 'inherit', textDecoration: 'none' }}>PRODUCTS</Link>
            <ChevronRight size={12} />
            <Link href={`/products/${category.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>{category.title.toUpperCase()}</Link>
            <ChevronRight size={12} />
            <span style={{ color: 'var(--accent-color)' }}>{product.title.toUpperCase()}</span>
          </div>
        </div>
      </nav>

      {/* 2. Main Product Info */}
      <section className="section" style={{ paddingTop: '2.5rem' }}>
        <div className="container">
          <div className="grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: 'clamp(2rem, 6vw, 5rem)',
            alignItems: 'start'
          }}>
            
            {/* Left Column: Image Box */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ 
                aspectRatio: '1 / 1', 
                backgroundColor: 'var(--bg-secondary)', 
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <Image 
                  src={product.image && product.image !== '/assets/placeholder.png' ? product.image : `/assets/${product.id === 'turbo-diamond-blade' ? 'diamond_blade.png' : product.id === 'segmented-blade' ? 'diamond_blade.png' : 'product_placeholder.png'}`}
                  alt={product.title}
                  fill
                  style={{ objectFit: 'contain', padding: '10%' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </motion.div>

              {/* Right Column: Information & Selection */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
              
              <h1 style={{ 
                fontSize: 'clamp(32px, 5vw, 64px)', 
                lineHeight: 1, 
                marginBottom: '1.25rem',
                fontWeight: 900,
                letterSpacing: '-0.01em',
                fontFamily: 'var(--font-barlow-condensed)'
              }}>
                {product.id === 'turbo-diamond-blade' ? "Turbo Diamond Saw Blade for High-Speed Granite & Tile Cutting" : 
                 product.id === 'segmented-blade' ? "Segmented Diamond Blade for Aggressive Concrete & Masonry Cutting" : 
                 product.title.toUpperCase()}
              </h1>

              {/* Step 1: Select Performance Tier */}
              <div style={{ marginBottom: '2.5rem', marginTop: '1.5rem' }}>
                <h2 style={{ fontSize: '0.85rem', color: '#A8CC00', fontWeight: 700, marginBottom: '1.25rem', letterSpacing: '0.05em' }}>
                  1. SELECT PERFORMANCE TIER
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {tiers.map((tier, idx) => {
                    const isActive = selectedTierIdx === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedTierIdx(idx);
                          setSelectedSize(tier.sizes?.[0] || '');
                        }}
                        style={{
                          width: '100%',
                          padding: '1.25rem 1.5rem',
                          backgroundColor: isActive ? `${tier.color}10` : '#fff',
                          border: `1px solid ${isActive ? tier.color : '#eee'}`,
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1.25rem',
                          transition: 'all 0.2s ease',
                          borderRadius: '4px'
                        }}
                      >
                        <div style={{ 
                          width: '12px', height: '12px', borderRadius: '50%', backgroundColor: tier.color || 'var(--accent-color)',
                          boxShadow: isActive ? `0 0 10px ${tier.color}` : 'none'
                        }} />
                        <div style={{ flexGrow: 1 }}>
                          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#000', marginBottom: '0.15rem', fontFamily: 'var(--font-barlow-condensed)' }}>{(tier.title || '').toUpperCase()}</div>
                          <div style={{ fontSize: '0.85rem', color: '#666', fontWeight: 500 }}>{tier.desc || tier.description}</div>
                        </div>
                        {isActive && <Check size={20} color={tier.color} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Select Size */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '0.85rem', color: '#A8CC00', fontWeight: 700, marginBottom: '1.25rem', letterSpacing: '0.05em' }}>
                  2. SELECT SIZE
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
                  {currentTier.sizes.map((size) => {
                    const isActive = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        style={{
                          padding: '0.85rem',
                          backgroundColor: isActive ? '#000' : '#fff',
                          border: `1px solid ${isActive ? '#000' : '#eee'}`,
                          color: isActive ? '#fff' : '#333',
                          fontFamily: 'var(--font-barlow-condensed)',
                          fontWeight: 700,
                          fontSize: '1rem',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Final Button */}
              <button 
                onClick={() => setIsModalOpen(true)}
                style={{ 
                  backgroundColor: '#A8CC00', 
                  color: '#000',
                  width: '100%',
                  padding: '1.25rem',
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-barlow-condensed)',
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase'
                }}
              >
                SEND A QUOTE
              </button>

              {/* Key Specifications Table */}
              <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '3rem', paddingTop: '2rem' }}>
                <h2 style={{ fontSize: '0.85rem', color: '#A8CC00', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: '0.05em' }}>
                  TECHNICAL SPECIFICATIONS
                </h2>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {product.specs?.map((spec, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>{spec.label.toUpperCase()}</span>
                      <span style={{ fontWeight: 800, fontSize: '0.9rem', fontFamily: 'var(--font-barlow-condensed)', color: '#000' }}>{spec.value.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Quote Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ 
            position: 'fixed', 
            inset: 0, 
            backgroundColor: 'rgba(0,0,0,0.85)', 
            backdropFilter: 'blur(8px)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 2000,
            padding: '1rem'
          }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ 
                backgroundColor: '#fff', 
                color: '#000',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative',
                borderRadius: '4px'
              }}
            >
              {/* Modal Header */}
              <div style={{ 
                padding: '1.5rem 2rem', 
                borderBottom: '1px solid #eee', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                backgroundColor: '#fff',
                zIndex: 10
              }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-barlow-condensed)', letterSpacing: '0.02em' }}>REQUEST A QUOTE</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: '#000', cursor: 'pointer', padding: '0.5rem', display: 'flex' }}
                >
                  <X size={24} />
                </button>
              </div>

              <div style={{ padding: '2rem' }}>
                {formStatus === 'sent' ? (
                  <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#A8CC00', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                      <Check size={32} color="#000" />
                    </div>
                    <h3 style={{ marginBottom: '0.5rem' }}>INQUIRY SENT</h3>
                    <p style={{ color: '#666' }}>Thank you. Our technical team will get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#999', fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '0.05em' }}>PRODUCT</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{product.title}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#999', fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '0.05em' }}>CATEGORY</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{category?.title}</div>
                      </div>
                      {currentTier && (
                        <div>
                          <div style={{ fontSize: '0.7rem', color: '#999', fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '0.05em' }}>TIER</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: currentTier.color }}>{currentTier.title}</div>
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#999', fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '0.05em' }}>SIZE</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{selectedSize || "N/A"}</div>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>FULL NAME</label>
                        <input required type="text" style={{ width: '100%', padding: '0.85rem', border: '1px solid #ddd', fontSize: '1rem', borderRadius: '2px' }} placeholder="Your Name" />
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>COMPANY NAME</label>
                          <input type="text" style={{ width: '100%', padding: '0.85rem', border: '1px solid #ddd', fontSize: '1rem', borderRadius: '2px' }} placeholder="Company" />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>PHONE NUMBER</label>
                          <input required type="tel" style={{ width: '100%', padding: '0.85rem', border: '1px solid #ddd', fontSize: '1rem', borderRadius: '2px' }} placeholder="+91" />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>EMAIL ADDRESS</label>
                        <input required type="email" style={{ width: '100%', padding: '0.85rem', border: '1px solid #ddd', fontSize: '1rem', borderRadius: '2px' }} placeholder="your@email.com" />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>MESSAGE (OPTIONAL)</label>
                        <textarea style={{ width: '100%', padding: '0.85rem', border: '1px solid #ddd', fontSize: '1rem', borderRadius: '2px', minHeight: '100px', resize: 'vertical' }} placeholder="Any specific requirements?"></textarea>
                      </div>

                      <button 
                        type="submit" 
                        disabled={formStatus === 'sending'}
                        style={{ 
                          backgroundColor: '#000', 
                          color: '#fff', 
                          padding: '1rem', 
                          border: 'none', 
                          fontWeight: 800, 
                          fontSize: '1rem', 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          fontFamily: 'var(--font-barlow-condensed)',
                          letterSpacing: '0.05em',
                          marginTop: '1rem'
                        }}
                      >
                        {formStatus === 'sending' ? 'SENDING...' : 'SUBMIT REQUEST'}
                        <ChevronRight size={18} />
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
