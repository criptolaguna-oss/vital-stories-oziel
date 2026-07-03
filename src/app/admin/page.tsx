'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AdminShell from '@/components/admin/AdminShell';

interface Testimonial {
  id: string;
  name: string;
  title_es: string;
  type: string;
  category: string;
  status: string;
  createdAt: string;
}

const categoryColors: Record<string, string> = {
  awaken: 'from-emerald-900 to-emerald-700',
  detox: 'from-teal-900 to-teal-700',
  nourish: 'from-green-900 to-green-700',
  restore: 'from-lime-900 to-lime-700',
  kids: 'from-yellow-900 to-yellow-700',
};

function TypeIcon({ type }: { type: string }) {
  if (type === 'video') {
    return (
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10231a] to-[#0c1813] flex items-center justify-center">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="#10b981"><path d="M8 5v14l11-7z" /></svg>
      </div>
    );
  }
  if (type === 'photo') {
    return (
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1c2820] to-[#0f1611] flex items-center justify-center">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="M21 15l-5-5L5 21" /></svg>
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#24221a] to-[#15130d] flex items-center justify-center">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#f4d03f" strokeWidth="1.5"><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="10" x2="20" y2="10" /><line x1="4" y1="14" x2="16" y2="14" /></svg>
    </div>
  );
}

function DashboardContent() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/testimonials')
      .then((r) => {
        if (r.status === 401) { router.push('/admin/login'); return null; }
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setTestimonials(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este testimonio?')) return;
    const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setTestimonials(testimonials.filter((t) => t.id !== id));
    }
  };

  const handleToggleStatus = async (t: Testimonial) => {
    const newStatus = t.status === 'published' ? 'draft' : 'published';
    const res = await fetch(`/api/testimonials/${t.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setTestimonials(testimonials.map((x) => x.id === t.id ? { ...x, status: newStatus } : x));
    }
  };

  const filtered = testimonials.filter((t) => {
    if (filter !== 'all' && t.status !== filter) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.title_es.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    published: testimonials.filter((t) => t.status === 'published').length,
    videos: testimonials.filter((t) => t.type === 'video').length,
    pending: testimonials.filter((t) => t.status === 'draft').length,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-vital-text text-xl font-medium">Historias</h1>
          <p className="text-vital-text-muted text-sm mt-0.5">{stats.published} publicadas · {stats.pending} pendientes</p>
        </div>
        <Link href="/admin/new" className="inline-flex items-center gap-2 bg-gradient-to-r from-vital-gold to-vital-gold-dark text-[#1a1404] font-medium text-sm px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-vital-gold/20 transition-all">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Nueva historia
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gradient-to-br from-vital-green-deeper to-vital-green-dark rounded-2xl p-4">
          <p className="text-white/70 text-xs mb-1">Publicadas</p>
          <p className="text-white text-2xl font-semibold">{stats.published}</p>
        </div>
        <div className="bg-vital-card border border-white/[0.07] rounded-2xl p-4">
          <p className="text-vital-text-muted text-xs mb-1">Videos</p>
          <p className="text-vital-green text-2xl font-semibold">{stats.videos}</p>
        </div>
        <div className="bg-vital-card border border-vital-gold/30 rounded-2xl p-4">
          <p className="text-vital-text-muted text-xs mb-1">Pendientes</p>
          <p className="text-vital-gold text-2xl font-semibold">{stats.pending}</p>
        </div>
      </div>

      {/* Filters + search */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex gap-1 bg-vital-card rounded-xl p-1 border border-white/[0.06]">
          {(['all', 'published', 'draft'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === f ? 'bg-vital-green/20 text-vital-green' : 'text-vital-text-muted hover:text-vital-text'
              }`}
            >
              {f === 'all' ? 'Todas' : f === 'published' ? 'Publicadas' : 'Pendientes'}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Buscar testimonios..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-input flex-1 min-w-[200px]"
        />
      </div>

      {/* List */}
      <div className="bg-vital-card border border-white/[0.06] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-vital-text-muted text-sm">Cargando...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-vital-text-muted text-sm">No hay testimonios.</div>
        ) : (
          filtered.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-3 p-3.5 border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02] transition-colors"
            >
              <TypeIcon type={t.type} />
              <div className="flex-1 min-w-0">
                <p className="text-vital-text text-sm font-medium truncate">{t.title_es || 'Sin título'}</p>
                <p className="text-vital-text-muted text-xs">{t.name} · {t.type === 'video' ? 'Video' : t.type === 'photo' ? 'Foto' : 'Historia'}</p>
              </div>
              <span className={`text-[10px] px-2.5 py-1 rounded-full hidden sm:inline-block ${
                t.status === 'published' ? 'bg-vital-green/15 text-vital-green' : 'bg-vital-gold/15 text-vital-gold'
              }`}>
                {t.status === 'published' ? 'Publicado' : 'Pendiente'}
              </span>
              <button
                onClick={() => handleToggleStatus(t)}
                title={t.status === 'published' ? 'Ocultar' : 'Publicar'}
                className="p-2 text-vital-text-muted hover:text-vital-green transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              </button>
              <Link href={`/admin/edit/${t.id}`} className="p-2 text-vital-text-muted hover:text-vital-text transition-colors">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
              </Link>
              <button onClick={() => handleDelete(t.id)} className="p-2 text-vital-text-muted hover:text-red-400 transition-colors">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminShell>
      <DashboardContent />
    </AdminShell>
  );
}
