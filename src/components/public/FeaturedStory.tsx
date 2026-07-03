'use client';

import { motion } from 'framer-motion';

interface FeaturedStoryProps {
  testimonial: any;
  getLocalizedField: (t: any, field: 'title' | 'body') => string;
  t: (key: string) => string;
  onView: () => void;
}

export default function FeaturedStory({ testimonial, getLocalizedField, t, onView }: FeaturedStoryProps) {
  const initials = testimonial.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2);

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-vital-green-deeper via-vital-green-dark to-vital-green-dark p-8 md:p-12 min-h-[320px] flex flex-col justify-between"
        >
          {/* Decorative orbs */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-vital-gold/10 blur-[60px]" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-vital-green/20 blur-[80px]" />

          <div className="relative z-10">
            {/* Badge */}
            <span className="inline-block bg-vital-gold/20 text-vital-gold text-xs font-medium tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
              {t('featured.badge')}
            </span>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-white leading-tight mb-4 max-w-2xl">
              &ldquo;{getLocalizedField(testimonial, 'title')}&rdquo;
            </h2>

            <p className="text-white/70 text-base md:text-lg max-w-xl leading-relaxed">
              {getLocalizedField(testimonial, 'body').slice(0, 120)}...
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-between mt-8 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center text-white font-medium text-sm">
                {initials}
              </div>
              <div>
                <p className="text-white font-medium">{testimonial.name}</p>
                <p className="text-white/60 text-sm">
                  {testimonial.type === 'video' ? '🎬 Video' : testimonial.type === 'photo' ? '📷 Foto' : '📝 Historia'}
                  {' · '}{testimonial.monthsAsClient} {t('testimonial.client')}
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onView}
              className="bg-white/10 hover:bg-white/20 text-white font-medium text-sm px-6 py-3 rounded-full border border-white/20 transition-all"
            >
              {t('featured.viewFull')}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
