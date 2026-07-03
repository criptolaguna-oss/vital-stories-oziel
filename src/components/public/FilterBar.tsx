'use client';

import { motion } from 'framer-motion';

interface FilterBarProps {
  activeCategory: string;
  setActiveCategory: (c: string) => void;
  activeTag: string;
  setActiveTag: (t: string) => void;
  activeType: string;
  setActiveType: (t: string) => void;
  t: (key: string) => string;
}

const categories = ['all', 'awaken', 'detox', 'nourish', 'restore', 'kids'];
const tags = ['all', 'energy', 'weight', 'wellness', 'sleep', 'immunity'];
const types = ['all', 'photo', 'video', 'written'];

const categoryLabels: Record<string, Record<string, string>> = {
  es: { all: 'Todos', awaken: 'Awaken', detox: 'Detox', nourish: 'Nourish', restore: 'Restore', kids: 'Kids' },
  en: { all: 'All', awaken: 'Awaken', detox: 'Detox', nourish: 'Nourish', restore: 'Restore', kids: 'Kids' },
};
const tagLabels: Record<string, Record<string, string>> = {
  es: { all: 'Todos', energy: 'Energía', weight: 'Peso', wellness: 'Bienestar', sleep: 'Sueño', immunity: 'Inmunidad' },
  en: { all: 'All', energy: 'Energy', weight: 'Weight', wellness: 'Wellness', sleep: 'Sleep', immunity: 'Immunity' },
};
const typeLabels: Record<string, Record<string, string>> = {
  es: { all: 'Todos', photo: 'Fotos', video: 'Videos', written: 'Historias' },
  en: { all: 'All', photo: 'Photos', video: 'Videos', written: 'Stories' },
};

export default function FilterBar({ activeCategory, setActiveCategory, activeTag, setActiveTag, activeType, setActiveType, t }: FilterBarProps) {
  // We determine locale from the tag labels to keep it simple
  const locale = t('filters.all') === 'All' ? 'en' : 'es';

  const renderPills = (items: string[], active: string, setActive: (v: string) => void, labels: Record<string, string>) => (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => setActive(item)}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
            active === item
              ? 'bg-vital-green text-vital-dark shadow-lg shadow-vital-green/30'
              : 'glass text-vital-text-secondary hover:text-vital-text hover:border-vital-green/30'
          }`}
        >
          {labels[item]}
        </button>
      ))}
    </div>
  );

  return (
    <section className="sticky top-0 z-40 py-4 px-6 glass" id="gallery">
      <div className="max-w-6xl mx-auto space-y-3">
        {/* Products row */}
        <div className="flex items-center gap-3">
          <span className="text-vital-text-muted text-xs font-medium uppercase tracking-wider w-24 shrink-0 hidden sm:block">{t('filters.products')}</span>
          {renderPills(categories, activeCategory, setActiveCategory, categoryLabels[locale])}
        </div>

        {/* Tags row */}
        <div className="flex items-center gap-3">
          <span className="text-vital-text-muted text-xs font-medium uppercase tracking-wider w-24 shrink-0 hidden sm:block">{t('filters.results')}</span>
          {renderPills(tags, activeTag, setActiveTag, tagLabels[locale])}
        </div>

        {/* Type row */}
        <div className="flex items-center gap-3">
          <span className="text-vital-text-muted text-xs font-medium uppercase tracking-wider w-24 shrink-0 hidden sm:block">{t('filters.types')}</span>
          {renderPills(types, activeType, setActiveType, typeLabels[locale])}
        </div>
      </div>
    </section>
  );
}
