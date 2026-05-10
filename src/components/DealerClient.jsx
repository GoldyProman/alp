"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

export default function DealerClient() {
  const [formData, setFormData] = useState({
    businessName: '', contactPerson: '', phone: '', email: '', city: '', businessType: '', message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email is not proper or inappropriate.";
    }

    const phoneRegex = /^\+?[\d\s-]{10,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone number is not proper or inappropriate.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.contactPerson,
          email: formData.email,
          phone: formData.phone,
          company: formData.businessName,
          city: formData.city,
          business_type: formData.businessType,
          message: formData.message,
          source: 'distributor'
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (err) {
      alert("Failed to submit application. Please try again.");
    }
  };

  return (
    <>
      <section className="texture-bg" style={{ paddingTop: 'calc(68px + 2.5rem)', paddingBottom: '2.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} style={{ maxWidth: '900px' }}>
            <motion.div variants={fadeUp} className="label-tag" style={{ marginBottom: '0.6rem' }}>DISTRIBUTOR NETWORK</motion.div>
            <motion.h1 variants={fadeUp} style={{ marginBottom: '1rem', fontSize: 'clamp(36px, 5.5vw, 72px)' }}>Become an Authorized Power Tools Distributor in India</motion.h1>
            <motion.p variants={fadeUp} style={{ fontSize: 'clamp(18px, 2vw, 24px)', maxWidth: '700px' }}>
              Join our growing network of authorized distributors across India. We supply industrial-grade cutting tools with consistent quality, stable pricing, and dedicated distributor support.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0, borderBottom: 'none' }}>
        <div className="container" style={{ padding: 0 }}>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '0', border: '1px solid var(--border-color)', borderTop: 'none' }}>
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
              style={{ padding: 'clamp(2rem, 3.5vw, 4rem)', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)' }}
            >
              <motion.div variants={fadeUp} className="label-tag" style={{ marginBottom: '0.6rem' }}>APPLICATION FORM</motion.div>
              <motion.h2 variants={fadeUp} style={{ marginBottom: '1.25rem' }}>Wholesale Industrial Tools Dealership Application</motion.h2>
              <motion.p variants={fadeUp} style={{ marginBottom: '1.75rem', fontSize: '1.05rem' }}>
                Fill in your details and our team will reach out within 48 hours to discuss partnership opportunities, margins, and supply capabilities.
              </motion.p>
              
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ padding: '3rem 2rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--accent-color)', textAlign: 'center' }}
                >
                  <CheckCircle2 size={48} style={{ color: 'var(--accent-color)', margin: '0 auto 1rem' }} />
                  <h3 style={{ marginBottom: '1rem' }}>APPLICATION RECEIVED</h3>
                  <p>Thank you, {formData.contactPerson}. Our team will contact you at {formData.email} within 48 hours to discuss partnership opportunities.</p>
                </motion.div>
              ) : (
                <motion.form variants={fadeUp} onSubmit={handleSubmit} noValidate>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label className="nav-text" style={{ display: 'block', marginBottom: '0.5rem' }}>BUSINESS NAME</label>
                    <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} style={{ 
                      width: '100%', padding: '1rem', background: 'transparent', 
                      border: '1px solid var(--border-color)', color: 'var(--text-primary)',
                      fontFamily: 'var(--font-barlow)', fontSize: '1rem'
                    }} placeholder="Company or shop name" required />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label className="nav-text" style={{ display: 'block', marginBottom: '0.5rem' }}>CONTACT PERSON</label>
                    <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} style={{ 
                      width: '100%', padding: '1rem', background: 'transparent', 
                      border: '1px solid var(--border-color)', color: 'var(--text-primary)',
                      fontFamily: 'var(--font-barlow)', fontSize: '1rem'
                    }} placeholder="Full name" required />
                  </div>
                  <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                      <label className="nav-text" style={{ display: 'block', marginBottom: '0.5rem' }}>PHONE NUMBER</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={{ 
                        width: '100%', padding: '1rem', background: 'transparent', 
                        border: `1px solid ${errors.phone ? '#ff4444' : 'var(--border-color)'}`, 
                        color: 'var(--text-primary)', fontFamily: 'var(--font-barlow)', fontSize: '1rem'
                      }} placeholder="+91" required />
                      {errors.phone && <span style={{ color: '#ff4444', fontSize: '0.85rem', display: 'block', marginTop: '0.5rem' }}>{errors.phone}</span>}
                    </div>
                    <div>
                      <label className="nav-text" style={{ display: 'block', marginBottom: '0.5rem' }}>EMAIL ADDRESS</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ 
                        width: '100%', padding: '1rem', background: 'transparent', 
                        border: `1px solid ${errors.email ? '#ff4444' : 'var(--border-color)'}`, 
                        color: 'var(--text-primary)', fontFamily: 'var(--font-barlow)', fontSize: '1rem'
                      }} placeholder="your@email.com" required />
                      {errors.email && <span style={{ color: '#ff4444', fontSize: '0.85rem', display: 'block', marginTop: '0.5rem' }}>{errors.email}</span>}
                    </div>
                  </div>
                  <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                      <label className="nav-text" style={{ display: 'block', marginBottom: '0.5rem' }}>CITY/REGION</label>
                      <input type="text" name="city" value={formData.city} onChange={handleChange} style={{ 
                        width: '100%', padding: '1rem', background: 'transparent', 
                        border: '1px solid var(--border-color)', color: 'var(--text-primary)',
                        fontFamily: 'var(--font-barlow)', fontSize: '1rem'
                      }} placeholder="e.g. Mumbai" required />
                    </div>
                    <div>
                      <label className="nav-text" style={{ display: 'block', marginBottom: '0.5rem' }}>CURRENT BUSINESS TYPE</label>
                      <select name="businessType" value={formData.businessType} onChange={handleChange} style={{ 
                        width: '100%', padding: '1rem', background: 'transparent', 
                        border: '1px solid var(--border-color)', color: 'var(--text-primary)',
                        fontFamily: 'var(--font-barlow)', fontSize: '1rem'
                      }} required>
                        <option value="" disabled style={{ background: 'var(--bg-primary)' }}>Select category</option>
                        <option value="retail" style={{ background: 'var(--bg-primary)' }}>Retail Hardware Store</option>
                        <option value="wholesale" style={{ background: 'var(--bg-primary)' }}>Wholesale Distributor</option>
                        <option value="contractor" style={{ background: 'var(--bg-primary)' }}>Construction Contractor</option>
                        <option value="other" style={{ background: 'var(--bg-primary)' }}>Other</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: '2.5rem' }}>
                    <label className="nav-text" style={{ display: 'block', marginBottom: '0.5rem' }}>YOUR MESSAGE</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} style={{ 
                      width: '100%', padding: '1rem', background: 'transparent', 
                      border: '1px solid var(--border-color)', color: 'var(--text-primary)',
                      fontFamily: 'var(--font-barlow)', fontSize: '1rem', minHeight: '120px', resize: 'vertical'
                    }} placeholder="Tell us about your business or any specific requirements..."></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    SUBMIT APPLICATION <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                  </button>
                </motion.form>
              )}
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
              style={{ padding: 'clamp(2rem, 3.5vw, 4rem)', display: 'flex', flexDirection: 'column' }}
            >
              <motion.div variants={fadeUp} className="label-tag" style={{ marginBottom: '0.6rem' }}>WHY PARTNER?</motion.div>
              <motion.h2 variants={fadeUp} style={{ marginBottom: '1rem' }}>THE ALPINE DISTRIBUTOR ADVANTAGE</motion.h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                <motion.div variants={fadeUp}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Stable Pricing</h3>
                  <p style={{ fontSize: '1rem' }}>Enjoy predictable margins protected from market volatility.</p>
                </motion.div>
                <motion.div variants={fadeUp}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Fast Dispatch</h3>
                  <p style={{ fontSize: '1rem' }}>Guaranteed 48-hour dispatch to keep your inventory healthy.</p>
                </motion.div>
                <motion.div variants={fadeUp}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Marketing Support</h3>
                  <p style={{ fontSize: '1rem' }}>Access to brand assets, displays, and promotional materials.</p>
                </motion.div>
                <motion.div variants={fadeUp}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Account Manager</h3>
                  <p style={{ fontSize: '1rem' }}>A dedicated single point of contact for all your business needs.</p>
                </motion.div>
              </div>

              {/* SEO Content Injection */}
              <motion.div variants={fadeUp} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent-color)' }}>Scale Your Business: Become a Power Tools Distributor in India</h3>
                <div style={{ fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                  <p style={{ marginBottom: '1rem' }}>
                    The Indian construction and fabrication industry is expanding rapidly, demanding tools that can withstand harsh environments and unstable voltage. Alpine Corporation is looking for driven partners to join our wholesale industrial tools dealership network. When you become a power tools distributor in India with Alpine, you aren't just selling tools—you are supplying unmatched reliability.
                  </p>
                  <p style={{ marginBottom: '1rem' }}>
                    As an Alpine franchise partner, you gain access to our extensive catalog of high-performance diamond blades, TCT saws, and cutting discs. We understand that as a diamond blade distributor in India, your reputation relies on product consistency. That is why every Alpine product is 100% batch-tested.
                  </p>
                  <p>
                    We are committed to your profitability. We offer highly competitive, distributor-friendly pricing, ensuring you have the margins necessary for long-term growth. To keep your inventory moving without delay, we guarantee a strict 48-hour dispatch timeframe for our distributor network.
                  </p>
                </div>
              </motion.div>
            </motion.div>
            
          </div>
        </div>
      </section>
    </>
  );
}
