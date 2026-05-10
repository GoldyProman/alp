"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { Menu, X, Search, ChevronDown, Plus, Minus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AlpineLogo from './AlpineLogo';
export default function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [dynamicCategories, setDynamicCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDynamicCategories(data);
      })
      .catch(err => console.error("Header fetch error:", err));
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 0 && dynamicCategories.length > 0) {
      const q = searchQuery.toLowerCase();
      let results = [];
      dynamicCategories.forEach(category => {
        category.products?.forEach(p => {
          if (p.title.toLowerCase().includes(q) || 
              category.title.toLowerCase().includes(q)) {
            results.push({ ...p, categoryTitle: category.title, categoryId: category.id });
          }
        });
      });
      setSuggestions(results.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, dynamicCategories]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const AccordionCategory = ({ category, closeMenu }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div 
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '0.35rem 0', borderBottom: '1px solid var(--border-color)' }} 
          onClick={() => setIsOpen(!isOpen)}
        >
          <Link href={`/products/${category.id}`} onClick={closeMenu} style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '1.05rem', color: 'var(--text-primary)', textDecoration: 'none' }}>
            {category.title}
          </Link>
          <button style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            {isOpen ? <Minus size={16} /> : <Plus size={16} />}
          </button>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ padding: '0.5rem 0 0.25rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {category.products.map(p => (
                  <Link 
                    key={p.id} 
                    href={`/products/${category.id}/${p.id}`} 
                    onClick={closeMenu} 
                    style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none', transition: 'color 0.2s ease' }} 
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    {p.title}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '68px',
      zIndex: 1000,
      backgroundColor: scrolled ? 'var(--bg-primary)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border-color)' : '1px solid transparent',
      transition: 'all 0.35s ease'
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        height: '100%',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <AlpineLogo style={{ height: '40px', width: 'auto', color: 'var(--text-primary)' }} />
        </Link>

        {/* Right Actions Container */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 1.5rem)' }}>
          {/* Desktop Nav */}
          <nav className="desktop-only" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            {navLinks.map((link) => (
              link.name === 'Products' ? (
                <div 
                  key={link.path}
                  onMouseEnter={() => setIsMegaMenuOpen(true)}
                  onMouseLeave={() => setIsMegaMenuOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', height: '100%' }}
                >
                  <Link 
                    href={link.path}
                    className="nav-text"
                    style={{ position: 'relative', padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {link.name} <ChevronDown size={16} />
                  </Link>
                </div>
              ) : (
                <Link 
                  key={link.path} 
                  href={link.path}
                  className="nav-text"
                  style={{ position: 'relative', padding: '0.5rem 0' }}
                >
                  {link.name}
                </Link>
              )
            ))}

            <Link href="/dealer" className="nav-text dealer-btn-desktop" style={{ 
              color: 'var(--accent-color)', 
              border: '1px solid var(--accent-color)', 
              padding: '0.4rem 1rem' 
            }}>
              BECOME A DISTRIBUTOR
            </Link>
          </nav>

          {/* Universal Search Icon */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            style={{ 
              background: 'transparent', border: 'none', color: 'var(--text-primary)', 
              cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.5rem' 
            }}
            aria-label="Open Search"
          >
            <Search size={22} />
          </button>

          {/* Mobile Nav Toggle */}
          <button 
            className="mobile-only"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', padding: '0.5rem' }}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                display: 'flex',
                position: 'fixed',
                top: '68px',
                right: 0,
                width: '100%',
                height: 'calc(100vh - 68px)',
                backgroundColor: 'var(--bg-primary)',
                flexDirection: 'column',
                padding: '2rem',
                borderTop: '1px solid var(--border-color)',
                zIndex: 999
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {navLinks.map((link) => (
                  <div key={link.path} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    {link.name === 'Products' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Link href={link.path} className="nav-text" style={{ fontSize: '1.25rem' }} onClick={() => setIsMobileMenuOpen(false)}>
                            {link.name}
                          </Link>
                          <button onClick={() => setMobileProductsOpen(!mobileProductsOpen)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', padding: '0.5rem' }}>
                            {mobileProductsOpen ? <Minus size={20} /> : <Plus size={20} />}
                          </button>
                        </div>
                        <AnimatePresence>
                          {mobileProductsOpen && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                              <div style={{ paddingTop: '1rem', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {dynamicCategories.map(cat => (
                                  <AccordionCategory key={cat.id} category={cat} closeMenu={() => setIsMobileMenuOpen(false)} />
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link 
                        href={link.path}
                        className="nav-text"
                        style={{ display: 'block', fontSize: '1.25rem', paddingBottom: '1rem' }}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    )}
                  </div>
                ))}

                <Link 
                  href="/dealer" 
                  className="nav-text"
                  style={{ color: 'var(--accent-color)', fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  BECOME A DISTRIBUTOR
                </Link>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Mega Menu Overlay */}
      <AnimatePresence>
        {isMegaMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => setIsMegaMenuOpen(true)}
            onMouseLeave={() => setIsMegaMenuOpen(false)}
            style={{
              position: 'absolute',
              top: '68px',
              left: 0,
              right: 0,
              backgroundColor: 'var(--bg-primary)',
              borderBottom: '1px solid var(--border-color)',
              borderTop: '1px solid var(--border-color)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              padding: '1.5rem 0',
              zIndex: 990
            }}
          >
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', maxWidth: '1100px' }}>
              {dynamicCategories.map(cat => (
                <AccordionCategory key={cat.id} category={cat} closeMenu={() => setIsMegaMenuOpen(false)} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Width Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '68px',
              backgroundColor: 'var(--bg-primary)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              zIndex: 1010
            }}
          >
            <div className="container" style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '1rem' }}>
              <form onSubmit={handleSearch} style={{ flexGrow: 1, display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.5rem 1rem' }}>
                <Search size={20} style={{ color: 'var(--text-secondary)', marginRight: '1rem' }} />
                <input 
                  type="text" 
                  placeholder="Search products, materials..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '1.1rem' }}
                />
              </form>

              {/* Category Quick Filters */}
              <div className="desktop-only" style={{ display: 'flex', gap: '0.5rem' }}>
                {dynamicCategories.map(category => (
                  <button 
                    key={category.id}
                    onClick={() => {
                      setSearchQuery(category.title);
                    }}
                    className="btn-outline"
                    style={{ 
                      fontSize: '0.7rem', padding: '0.4rem 0.8rem', cursor: 'pointer',
                      borderColor: 'var(--accent-color)', color: 'var(--text-primary)',
                      textTransform: 'uppercase', fontWeight: 600,
                      backgroundColor: searchQuery === category.title ? 'var(--bg-secondary)' : 'transparent'
                    }}
                  >
                    {category.title.split(' ')[0]}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setIsSearchOpen(false)}
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.5rem', display: 'flex', borderRadius: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '68px',
                left: 0,
                right: 0,
                backgroundColor: 'var(--bg-primary)',
                borderBottom: '1px solid var(--border-color)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                paddingBottom: '1rem'
              }}>
                <div className="container">
                  <div className="label-tag" style={{ padding: '1rem 0 0.5rem', color: 'var(--text-secondary)' }}>SUGGESTIONS</div>
                  {suggestions.map((item, idx) => (
                    <button 
                      key={idx}
                      onClick={() => {
                        setSearchQuery(item.title);
                        router.push(`/products?search=${encodeURIComponent(item.title)}`);
                        setIsSearchOpen(false);
                      }}
                      style={{
                        display: 'flex', flexDirection: 'column',
                        width: '100%', textAlign: 'left',
                        padding: '1rem',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: idx !== suggestions.length - 1 ? '1px solid var(--border-color)' : 'none',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <span style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{item.title}</span>
                      <span className="label-tag" style={{ color: 'var(--text-secondary)' }}>{item.categoryTitle}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
