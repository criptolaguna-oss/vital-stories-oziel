'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  locale: string;
  setLocale: (l: 'es' | 'en') => void;
  t: (key: string) => string;
}

export default function Navbar({ locale, setLocale, t }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const toggleLocale = () => setLocale(locale === 'es' ? 'en' : 'es');

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-vital-green to-vital-green-dark flex items-center justify-center group-hover:shadow-lg group-hover:shadow-vital-green/30 transition-shadow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a0d0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <span className="text-vital-text font-medium text-lg tracking-tight">
            tu<span className="text-vital-green">networker</span> stories
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {/* Language Switch */}
          <button
            onClick={toggleLocale}
            className="flex items-center gap-2 text-vital-text-secondary hover:text-vital-text text-sm transition-colors px-3 py-2 rounded-xl hover:bg-white/5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            {t('nav.language')}
          </button>

          {/* Share CTA */}
          <a
            href="#cta"
            className="bg-gradient-to-r from-vital-gold to-vital-gold-dark text-[#1a1404] font-medium text-sm px-5 py-2.5 rounded-full hover:shadow-lg hover:shadow-vital-gold/30 transition-all hover:scale-105 active:scale-95"
          >
            {t('nav.share')}
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-vital-text p-2"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass mt-2 mx-4 rounded-2xl overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-3">
              <button
                onClick={toggleLocale}
                className="flex items-center gap-2 text-vital-text-secondary text-sm p-3 rounded-xl hover:bg-white/5"
              >
                🌐 {t('nav.language')}
              </button>
              <a
                href="#cta"
                onClick={() => setMobileOpen(false)}
                className="bg-gradient-to-r from-vital-gold to-vital-gold-dark text-[#1a1404] font-medium text-sm px-5 py-3 rounded-full text-center"
              >
                {t('nav.share')}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
