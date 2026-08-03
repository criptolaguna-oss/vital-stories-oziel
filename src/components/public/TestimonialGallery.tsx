'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';

interface TestimonialGalleryProps {
  testimonials: any[];
  getLocalizedField: (t: any, field: 'title' | 'body') => string;
  t: (key: string) => string;
  onSelect: (t: any) => void;
}

const tagIcons: Record<string, string> = {
  energy: '⚡',
  weight: '⚖️',
  wellness: '💛',
  sleep: '😴',
  immunity: '🛡️',
};

function TestimonialCard({ testimonial, getLocalizedField, t, onSelect, index }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const initials = testimonial.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    const card = ref.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
  };

  const typeBadge = () => {
    if (testimonial.type === 'video') {
      return { label: 'VIDEO', bg: 'rgba(244,208,63,0.95)', color: '#1a1404', icon: '▶' };
    }
    if (testimonial.type === 'photo') {
      return { label: 'FOTO', bg: 'rgba(16,185,129,0.95)', color: '#03281d', icon: '📷' };
    }
    return { label: 'HISTORIA', bg: 'rgba(255,255,255,0.15)', color: '#f0f4f1', icon: '📝' };
  };

  const badge = typeBadge();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
      className="perspective-container"
    >
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => onSelect(testimonial)}
        className="card-3d cursor-pointer bg-vital-card border border-white/[0.07] rounded-2xl overflow-hidden group hover:border-vital-green/30 transition-colors"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Media preview */}
        <div className="relative h-44 bg-gradient-to-br from-[#1c2820] to-[#0f1611] flex items-center justify-center overflow-hidden">
          {/* Imagen real si existe */}
          {testimonial.imageUrl && testimonial.imageUrl.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={testimonial.imageUrl}
              alt={testimonial.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : testimonial.type === 'video' ? (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-vital-green to-vital-green-dark flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          ) : testimonial.type === 'photo' ? (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2f4438" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4a4530" strokeWidth="1.5">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="10" x2="20" y2="10" />
              <line x1="4" y1="14" x2="16" y2="14" />
              <line x1="4" y1="18" x2="14" y2="18" />
            </svg>
          )}

          {/* Play overlay si es video */}
          {testimonial.type === 'video' && testimonial.imageUrl && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
              <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#047857">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}

          {/* Type badge */}
          <span
            className="absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full"
            style={{ background: badge.bg, color: badge.color }}
          >
            {badge.icon} {badge.label}
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-vital-text font-medium text-sm mb-1 line-clamp-1">
            {getLocalizedField(testimonial, 'title')}
          </p>
          <p className="text-vital-text-muted text-xs mb-3 line-clamp-2">
            {getLocalizedField(testimonial, 'body')}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {testimonial.tags.slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-vital-green/10 text-vital-green"
              >
                {tagIcons[tag] || '•'} {tag}
              </span>
            ))}
          </div>

          {/* Author */}
          <div className="flex items-center gap-2 pt-3 border-t border-white/[0.05]">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-vital-green to-vital-green-dark flex items-center justify-center text-white text-[10px] font-medium">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-vital-text text-xs font-medium truncate">{testimonial.name}</p>
              <p className="text-vital-text-muted text-[10px]">{testimonial.monthsAsClient} meses</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function TestimonialGallery({ testimonials, getLocalizedField, t, onSelect }: TestimonialGalleryProps) {
  if (testimonials.length === 0) {
    return (
      <section className="py-20 px-6 text-center">
        <p className="text-vital-text-muted">No hay testimonios con estos filtros.</p>
      </section>
    );
  }

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              getLocalizedField={getLocalizedField}
              t={t}
              onSelect={onSelect}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
