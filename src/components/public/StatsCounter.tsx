'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface StatsCounterProps {
  testimonials: any[];
  t: (key: string) => string;
}

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

export default function StatsCounter({ testimonials, t }: StatsCounterProps) {
  const published = testimonials.filter((t) => t.status === 'published').length;
  const videoCount = testimonials.filter((t) => t.type === 'video' && t.status === 'published').length;

  const stats = [
    { value: 150, suffix: '+', label: t('stats.stories'), icon: '💬', gradient: true },
    { value: 500, suffix: '+', label: t('stats.clients'), icon: '👥', gradient: false },
    { value: 12, suffix: '', label: t('stats.products'), icon: '🌿', gradient: false },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className={`rounded-2xl p-8 text-center ${
              stat.gradient
                ? 'bg-gradient-to-br from-vital-green-deeper to-vital-green-dark'
                : 'glass'
            }`}
          >
            <div className="text-4xl mb-3">{stat.icon}</div>
            <div className={`text-4xl md:text-5xl font-bold mb-2 ${
              stat.gradient ? 'text-white' : 'text-vital-green'
            }`}>
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
            </div>
            <div className={`text-sm ${
              stat.gradient ? 'text-white/70' : 'text-vital-text-secondary'
            }`}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
