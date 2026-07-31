'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AdminShell from '@/components/admin/AdminShell';

export default function PendingPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setTestimonials(data.filter((t) => t.status === 'draft'));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const publish = async (id: string) => {
    const res = await fetch(`/api/testimonials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'published' }),
    });
    if (res.ok) {
      setTestimonials(testimonials.filter((t) => t.id !== id));
    }
  };

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar este testimonio?')) return;
    const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
    if (res.ok) setTestimonials(testimonials.filter((t) => t.id !== id));
  };

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-vital-text text-xl font-medium">Pendientes</h1>
        <p className="text-vital-text-muted text-sm mt-0.5">{testimonials.length} borradores esperando revisión</p>
      </div>

      {loading ? (
        <div className="text-vital-text-muted text-sm">Cargando...</div>
      ) : testimonials.length === 0 ? (
        <div className="bg-vital-card border border-white/[0.06] rounded-2xl p-10 text-center">
          <div className="text-4xl mb-3">✅</div>
          <p className="text-vital-text font-medium mb-1">Todo al día</p>
          <p className="text-vital-text-muted text-sm">No hay testimonios pendientes.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-vital-card border border-vital-gold/20 rounded-2xl p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-vital-gold/15 flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f4d03f" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-vital-text text-sm font-medium truncate">{t.title_es || 'Sin título'}</p>
                <p className="text-vital-text-muted text-xs">{t.name}</p>
              </div>
              <button onClick={() => publish(t.id)} className="bg-vital-green text-vital-dark text-xs font-medium px-3 py-2 rounded-lg hover:shadow-lg hover:shadow-vital-green/30 transition-all">
                Publicar
              </button>
              <Link href={`/admin/edit/${t.id}`} className="p-2 text-vital-text-muted hover:text-vital-text">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
              </Link>
              <button onClick={() => remove(t.id)} className="p-2 text-vital-text-muted hover:text-red-400">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
