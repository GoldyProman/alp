"use client";

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

export default function ContactClient() {
  const [formState, setFormState] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState('sending');
    
    const formData = {
      name: e.target[0].value,
      email: e.target[1].value,
      subject: e.target[2].value,
      message: e.target[3].value,
      source: 'contact'
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormState('sent');
      } else {
        throw new Error('Failed to send');
      }
    } catch (err) {
      alert("Failed to send message. Please try again.");
      setFormState('idle');
    }
  };

  return (
    <>
      <section className="texture-bg" style={{ paddingTop: 'calc(68px + 2.5rem)', paddingBottom: '2.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} style={{ maxWidth: '900px' }}>
            <motion.div variants={fadeUp} className="label-tag" style={{ marginBottom: '0.6rem' }}>GET IN TOUCH</motion.div>
            <motion.h1 variants={fadeUp} style={{ marginBottom: '1rem', fontSize: 'clamp(36px, 5.5vw, 72px)' }}>CONTACT DIRECTORY</motion.h1>
            <motion.p variants={fadeUp} style={{ fontSize: 'clamp(18px, 2vw, 24px)', maxWidth: '700px' }}>
              Whether you're a contractor, fabricator, or retailer — we're here to answer your questions about our industrial power tools, distributor partnerships, and bulk pricing.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0, borderBottom: 'none' }}>
        <div className="container" style={{ padding: 0 }}>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '0', border: '1px solid var(--border-color)', borderTop: 'none' }}>
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
              style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'transparent', borderRight: '1px solid var(--border-color)' }}
            >
              {[
                { label: 'EMAIL', value: 'info.alpinepowertools@gmail.com', sub: 'Reply within 24 hours' },
                { label: 'PHONE', value: '+91 95913 80236', sub: 'Mon–Sat, 9 AM – 6 PM IST', isPhone: true },
                { label: 'LOCATION', value: 'VEERAPUR ROAD', sub: 'Hubli, India' }
              ].map((contact, i) => (
                <div key={i} style={{ 
                  padding: 'clamp(1.5rem, 3.5vw, 3rem)', 
                  borderBottom: i !== 2 ? '1px solid var(--border-color)' : 'none',
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <div className="label-tag" style={{ marginBottom: '0.6rem', color: 'var(--text-secondary)' }}>{contact.label}</div>
                  <div style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', fontWeight: 800, color: 'var(--accent-color)', fontFamily: 'var(--font-barlow-condensed)' }}>
                    {contact.isPhone ? <a href={`tel:${contact.value}`} style={{ color: 'inherit', textDecoration: 'none' }}>{contact.value}</a> : contact.value}
                  </div>
                  <div style={{ marginTop: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{contact.sub}</div>
                </div>
              ))}
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
              style={{ padding: 'clamp(2rem, 3.5vw, 4rem)', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-secondary)' }}
            >
              <motion.div variants={fadeUp} className="label-tag" style={{ marginBottom: '0.6rem' }}>ENQUIRY FORM</motion.div>
              <motion.h2 variants={fadeUp} style={{ marginBottom: '1.75rem' }}>SEND US A MESSAGE</motion.h2>
              
              {formState === 'sent' ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  style={{ textAlign: 'center', padding: '3rem 0' }}
                >
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <Send size={32} color="#000" />
                  </div>
                  <h3 style={{ marginBottom: '0.5rem' }}>MESSAGE SENT</h3>
                  <p>Thank you for reaching out. We'll get back to you shortly.</p>
                </motion.div>
              ) : (
                <motion.form variants={fadeUp} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label className="nav-text" style={{ display: 'block', marginBottom: '0.5rem' }}>FULL NAME</label>
                    <input type="text" style={{ 
                      width: '100%', padding: '1rem', background: 'transparent', 
                      border: '1px solid var(--border-color)', color: 'var(--text-primary)',
                      fontFamily: 'var(--font-barlow)', fontSize: '1rem'
                    }} placeholder="Enter your name" required />
                  </div>
                  <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="nav-text" style={{ display: 'block', marginBottom: '0.5rem' }}>EMAIL ADDRESS</label>
                      <input type="email" style={{ 
                        width: '100%', padding: '1rem', background: 'transparent', 
                        border: '1px solid var(--border-color)', color: 'var(--text-primary)',
                        fontFamily: 'var(--font-barlow)', fontSize: '1rem'
                      }} placeholder="your@email.com" required />
                    </div>
                    <div>
                      <label className="nav-text" style={{ display: 'block', marginBottom: '0.5rem' }}>SUBJECT</label>
                      <select style={{ 
                        width: '100%', padding: '1rem', background: 'transparent', 
                        border: '1px solid var(--border-color)', color: 'var(--text-primary)',
                        fontFamily: 'var(--font-barlow)', fontSize: '1rem'
                      }}>
                        <option style={{ background: 'var(--bg-primary)' }}>General Inquiry</option>
                        <option style={{ background: 'var(--bg-primary)' }}>Product Support</option>
                        <option style={{ background: 'var(--bg-primary)' }}>Wholesale Pricing</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="nav-text" style={{ display: 'block', marginBottom: '0.5rem' }}>YOUR MESSAGE</label>
                    <textarea style={{ 
                      width: '100%', padding: '1rem', background: 'transparent', 
                      border: '1px solid var(--border-color)', color: 'var(--text-primary)',
                      fontFamily: 'var(--font-barlow)', fontSize: '1rem', minHeight: '150px', resize: 'vertical'
                    }} placeholder="How can we help you?" required></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={formState === 'sending'}
                    style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                  >
                    {formState === 'sending' ? 'SENDING...' : 'DISPATCH MESSAGE'} 
                    {formState !== 'sending' && <ArrowRight size={20} />}
                  </button>
                </motion.form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
