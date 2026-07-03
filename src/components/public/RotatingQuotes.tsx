'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RotatingQuotesProps {
  testimonials: any[];
  getLocalizedField: (t: any, field: 'title' | 'body') => string;
  t: (key: string) => string;
}

export default function RotatingQuotes({ testimonials, getLocalizedField, t }: RotatingQuotesProps) {
  const published = testimonials.filter((t) => t.status === 'published');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % published.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [published.length]);

  if (published.length === 0) return null;

  const current = published[index];
  const initials = current.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2);

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background quote icon */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-vital-green/[0.04] text-[300px] font-serif leading-none select-none pointer-events-none">
        &ldquo;
      </div>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <p className="text-vital-gold text-xs tracking-widest uppercase font-medium mb-8">
          {t('quotes.title')}
        </p>

        <div className="min-h-[180px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <p className="text-2xl md:text-3xl font-serif italic text-vital-text leading-relaxed">
                &ldquo;{getLocalizedField(current, 'title')}&rdquo;
              </p>

              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-vital-green to-vital-green-dark flex items-center justify-center text-white text-xs font-medium">
                  {initials}
                </div>
                <div className="text-left">
                  <p className="text-vital-text font-medium text-sm">{current.name}</p>
                  <p className="text-vital-text-muted text-xs">Cliente · {current.monthsAsClient} meses</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {published.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-8 bg-vital-green' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
