'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';

interface VideoModalProps {
  testimonial: any;
  getLocalizedField: (t: any, field: 'title' | 'body') => string;
  t: (key: string) => string;
  onClose: () => void;
}

export default function VideoModal({ testimonial, getLocalizedField, t, onClose }: VideoModalProps) {
  const initials = testimonial.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handler);
    };
  }, [onClose]);

  const tagLabels: Record<string, Record<string, string>> = {
    es: { energy: 'Energía', weight: 'Peso', wellness: 'Bienestar', sleep: 'Sueño', immunity: 'Inmunidad' },
    en: { energy: 'Energy', weight: 'Weight', wellness: 'Wellness', sleep: 'Sleep', immunity: 'Immunity' },
  };
  const locale = t('testimonial.client') === 'Client' ? 'en' : 'es';
  const tagIcons: Record<string, string> = { energy: '⚡', weight: '⚖️', wellness: '💛', sleep: '😴', immunity: '🛡️' };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] modal-backdrop flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-vital-card border border-white/[0.08] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Media header */}
        <div className="relative h-64 md:h-72 rounded-t-3xl bg-gradient-to-br from-vital-green-deeper to-vital-green-dark flex items-center justify-center overflow-hidden">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Type badge */}
          <span className="absolute top-4 left-4 bg-vital-gold text-[#1a1404] text-[10px] font-semibold px-3 py-1 rounded-full">
            {testimonial.type === 'video' ? '▶ VIDEO' : testimonial.type === 'photo' ? '📷 FOTO' : '📝 HISTORIA'}
          </span>

          {/* Play button for video */}
          {testimonial.type === 'video' && (
            <button className="w-16 h-16 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-transform hover:scale-110">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#047857">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          )}

          {testimonial.type !== 'video' && (
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-vital-gold/15 blur-[40px]" />
          )}
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Author */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-vital-green to-vital-green-dark flex items-center justify-center text-white font-medium text-sm">
              {initials}
            </div>
            <div className="flex-1">
              <p className="text-vital-text font-medium">{testimonial.name}</p>
              <p className="text-vital-text-muted text-xs flex items-center gap-1">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {new Date(testimonial.createdAt).toLocaleDateString(locale === 'es' ? 'es-MX' : 'en-US', { year: 'numeric', month: 'long' })}
              </p>
            </div>
            <span className="bg-vital-green/15 text-vital-green text-xs px-3 py-1.5 rounded-full border border-vital-green/30">
              {t('testimonial.client')} · {testimonial.monthsAsClient} {locale === 'es' ? 'meses' : 'months'}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-vital-text text-2xl font-serif font-medium leading-tight mb-4">
            {getLocalizedField(testimonial, 'title')}
          </h2>

          {/* Body */}
          <p className="text-vital-text-secondary text-base leading-relaxed mb-6">
            {getLocalizedField(testimonial, 'body')}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {testimonial.tags.map((tag: string) => (
              <span
                key={tag}
                className={`text-xs px-3 py-1.5 rounded-full ${
                  tag === 'weight'
                    ? 'bg-vital-gold/15 text-vital-gold'
                    : 'bg-vital-green/15 text-vital-green'
                }`}
              >
                {tagIcons[tag] || '•'} {tagLabels[locale][tag] || tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
