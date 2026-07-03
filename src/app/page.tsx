'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from '@/components/public/Navbar';
import Hero from '@/components/public/Hero';
import StatsCounter from '@/components/public/StatsCounter';
import FilterBar from '@/components/public/FilterBar';
import FeaturedStory from '@/components/public/FeaturedStory';
import TestimonialGallery from '@/components/public/TestimonialGallery';
import RotatingQuotes from '@/components/public/RotatingQuotes';
import CTASection from '@/components/public/CTASection';
import Footer from '@/components/public/Footer';
import ScrollProgress from '@/components/public/ScrollProgress';
import CursorGlow from '@/components/public/CursorGlow';
import VideoModal from '@/components/public/VideoModal';

interface Testimonial {
  id: string;
  name: string;
  title_es: string;
  title_en: string;
  body_es: string;
  body_en: string;
  type: 'photo' | 'video' | 'written';
  imageUrl: string;
  videoUrl: string;
  category: string;
  tags: string[];
  monthsAsClient: number;
  featured: boolean;
  status: string;
  createdAt: string;
}

export default function Home() {
  const [locale, setLocale] = useState<'es' | 'en'>('es');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTag, setActiveTag] = useState('all');
  const [activeType, setActiveType] = useState('all');
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setTestimonials(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const t = (key: string) => {
    const es: Record<string, string> = {
      'hero.title': 'Historias Reales de Transformación',
      'hero.subtitle': 'Descubre cómo productos de VitalHealth están cambiando vidas. Testimonios reales, resultados reales.',
      'hero.cta': 'Descubre las historias',
      'hero.scrollHint': 'Desliza para explorar',
      'stats.stories': 'Historias verificadas',
      'stats.clients': 'Clientes transformados',
      'stats.products': 'Productos con resultados',
      'filters.all': 'Todos',
      'filters.products': 'Productos',
      'filters.results': 'Resultados',
      'filters.types': 'Tipo',
      'filters.photo': 'Foto',
      'filters.video': 'Video',
      'filters.written': 'Historia',
      'featured.badge': 'Historia del mes',
      'featured.viewFull': 'Ver historia completa',
      'quotes.title': 'Lo que dicen nuestros clientes',
      'cta.title': '¿Tienes una historia que contar?',
      'cta.subtitle': 'Tu experiencia puede inspirar a otros. Compártenos cómo VitalHealth transformó tu vida.',
      'cta.button': 'Comparte tu historia',
      'testimonial.viewStory': 'Ver historia',
      'testimonial.client': 'Cliente',
      'footer.rights': '© 2026 VitalStories. Todos los derechos reservados.',
      'footer.powered': 'Distribuidor autorizado VitalHealth',
      'nav.language': 'EN',
      'nav.share': 'Comparte tu historia',
    };
    const en: Record<string, string> = {
      'hero.title': 'Real Stories of Transformation',
      'hero.subtitle': 'Discover how VitalHealth products are changing lives. Real testimonials, real results.',
      'hero.cta': 'Discover the stories',
      'hero.scrollHint': 'Scroll to explore',
      'stats.stories': 'Verified stories',
      'stats.clients': 'Transformed clients',
      'stats.products': 'Products with results',
      'filters.all': 'All',
      'filters.products': 'Products',
      'filters.results': 'Results',
      'filters.types': 'Type',
      'filters.photo': 'Photo',
      'filters.video': 'Video',
      'filters.written': 'Story',
      'featured.badge': 'Story of the month',
      'featured.viewFull': 'View full story',
      'quotes.title': 'What our clients say',
      'cta.title': 'Do you have a story to tell?',
      'cta.subtitle': 'Your experience can inspire others. Share with us how VitalHealth transformed your life.',
      'cta.button': 'Share your story',
      'testimonial.viewStory': 'View story',
      'testimonial.client': 'Client',
      'footer.rights': '© 2026 VitalStories. All rights reserved.',
      'footer.powered': 'Authorized VitalHealth Distributor',
      'nav.language': 'ES',
      'nav.share': 'Share your story',
    };
    return locale === 'es' ? es[key] || key : en[key] || key;
  };

  const getLocalizedField = (testimonial: Testimonial, field: 'title' | 'body') => {
    return locale === 'es' ? testimonial[`${field}_es`] : testimonial[`${field}_en`];
  };

  const filtered = testimonials.filter((t) => {
    if (t.status !== 'published') return false;
    if (activeCategory !== 'all' && t.category !== activeCategory) return false;
    if (activeTag !== 'all' && !t.tags.includes(activeTag)) return false;
    if (activeType !== 'all' && t.type !== activeType) return false;
    return true;
  });

  const featured = testimonials.find((t) => t.featured && t.status === 'published');

  return (
    <main className="min-h-screen bg-vital-dark">
      <ScrollProgress />
      <CursorGlow />

      <Navbar locale={locale} setLocale={setLocale} t={t} />

      <Hero t={t} />

      <StatsCounter testimonials={testimonials} t={t} />

      <FilterBar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        activeTag={activeTag}
        setActiveTag={setActiveTag}
        activeType={activeType}
        setActiveType={setActiveType}
        t={t}
      />

      {featured && (
        <FeaturedStory
          testimonial={featured}
          getLocalizedField={getLocalizedField}
          t={t}
          onView={() => setSelectedTestimonial(featured)}
        />
      )}

      {loading ? (
        <div className="py-20 text-center text-vital-text-muted text-sm">Cargando historias...</div>
      ) : (
        <TestimonialGallery
          testimonials={filtered}
          getLocalizedField={getLocalizedField}
          t={t}
          onSelect={setSelectedTestimonial}
        />
      )}

      <RotatingQuotes
        testimonials={testimonials}
        getLocalizedField={getLocalizedField}
        t={t}
      />

      <CTASection t={t} />

      <Footer t={t} />

      <AnimatePresence>
        {selectedTestimonial && (
          <VideoModal
            testimonial={selectedTestimonial}
            getLocalizedField={getLocalizedField}
            t={t}
            onClose={() => setSelectedTestimonial(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
