'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface TestimonialFormProps {
  initial?: any;
  mode: 'create' | 'edit';
}

const allTags = ['energy', 'weight', 'wellness', 'sleep', 'immunity'];
const tagLabels: Record<string, string> = {
  energy: '⚡ Energía',
  weight: '⚖️ Peso',
  wellness: '💛 Bienestar',
  sleep: '😴 Sueño',
  immunity: '🛡️ Inmunidad',
};

export default function TestimonialForm({ initial, mode }: TestimonialFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    name: initial?.name || '',
    title_es: initial?.title_es || '',
    title_en: initial?.title_en || '',
    body_es: initial?.body_es || '',
    body_en: initial?.body_en || '',
    type: initial?.type || 'written',
    imageUrl: initial?.imageUrl || '',
    videoUrl: initial?.videoUrl || '',
    tags: initial?.tags || [],
    monthsAsClient: initial?.monthsAsClient || 1,
    featured: initial?.featured || false,
    status: initial?.status || 'draft',
  });

  const update = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const toggleTag = (tag: string) => {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t: string) => t !== tag) : [...f.tags, tag],
    }));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok && data.url) {
        update('imageUrl', data.url);
      } else {
        setMessage(data.error || 'Error al subir');
      }
    } catch {
      setMessage('Error de conexión');
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const url = mode === 'create' ? '/api/testimonials' : `/api/testimonials/${initial.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json();
        setMessage(data.error || 'Error al guardar');
      }
    } catch {
      setMessage('Error de conexión');
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="w-8 h-8 rounded-full bg-vital-card border border-white/10 flex items-center justify-center hover:border-vital-green/30 transition-colors">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
        </Link>
        <h1 className="text-vital-text text-xl font-medium">
          {mode === 'create' ? 'Nueva historia' : 'Editar historia'}
        </h1>
      </div>

      {message && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
          {message}
        </div>
      )}

      <div className="space-y-5">
        {/* Nombre */}
        <div>
          <label className="block text-vital-text-secondary text-xs font-medium mb-2 uppercase tracking-wider">Nombre del cliente *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className="admin-input w-full"
            placeholder="Ej. María González"
            required
          />
        </div>

        {/* Título ES */}
        <div>
          <label className="block text-vital-text-secondary text-xs font-medium mb-2 uppercase tracking-wider">Título (Español) *</label>
          <input
            type="text"
            value={form.title_es}
            onChange={(e) => update('title_es', e.target.value)}
            className="admin-input w-full"
            placeholder="Ej. Cómo recuperé mi energía"
            required
          />
        </div>

        {/* Título EN */}
        <div>
          <label className="block text-vital-text-secondary text-xs font-medium mb-2 uppercase tracking-wider">Título (Inglés)</label>
          <input
            type="text"
            value={form.title_en}
            onChange={(e) => update('title_en', e.target.value)}
            className="admin-input w-full"
            placeholder="Ej. How I recovered my energy"
          />
        </div>

        {/* Body ES */}
        <div>
          <label className="block text-vital-text-secondary text-xs font-medium mb-2 uppercase tracking-wider">Testimonio (Español) *</label>
          <textarea
            value={form.body_es}
            onChange={(e) => update('body_es', e.target.value)}
            className="admin-input w-full min-h-[120px] resize-y"
            placeholder="El testimonio completo en español..."
            required
          />
        </div>

        {/* Body EN */}
        <div>
          <label className="block text-vital-text-secondary text-xs font-medium mb-2 uppercase tracking-wider">Testimonio (Inglés)</label>
          <textarea
            value={form.body_en}
            onChange={(e) => update('body_en', e.target.value)}
            className="admin-input w-full min-h-[120px] resize-y"
            placeholder="The full testimonial in English..."
          />
        </div>

        {/* Grid de selección */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Tipo */}
          <div>
            <label className="block text-vital-text-secondary text-xs font-medium mb-2 uppercase tracking-wider">Tipo</label>
            <select
              value={form.type}
              onChange={(e) => update('type', e.target.value)}
              className="admin-input w-full"
            >
              <option value="written">📝 Historia escrita</option>
              <option value="photo">📷 Foto</option>
              <option value="video">🎬 Video</option>
            </select>
          </div>

          {/* Meses */}
          <div>
            <label className="block text-vital-text-secondary text-xs font-medium mb-2 uppercase tracking-wider">Meses como cliente</label>
            <input
              type="number"
              min="1"
              value={form.monthsAsClient}
              onChange={(e) => update('monthsAsClient', parseInt(e.target.value) || 1)}
              className="admin-input w-full"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-vital-text-secondary text-xs font-medium mb-2 uppercase tracking-wider">Estado</label>
            <select
              value={form.status}
              onChange={(e) => update('status', e.target.value)}
              className="admin-input w-full"
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-vital-text-secondary text-xs font-medium mb-2 uppercase tracking-wider">Etiquetas de resultado</label>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  form.tags.includes(tag)
                    ? 'bg-vital-green text-vital-dark'
                    : 'bg-vital-card border border-white/[0.08] text-vital-text-muted hover:border-vital-green/30'
                }`}
              >
                {tagLabels[tag]}
              </button>
            ))}
          </div>
        </div>

        {/* Media */}
        <div className="bg-vital-card border border-white/[0.06] rounded-2xl p-5">
          <label className="block text-vital-text-secondary text-xs font-medium mb-3 uppercase tracking-wider">Multimedia</label>

          {/* Upload */}
          <div className="flex items-center gap-3 mb-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 bg-vital-green/15 text-vital-green px-4 py-2.5 rounded-xl text-sm hover:bg-vital-green/25 transition-all disabled:opacity-50"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
              {uploading ? 'Subiendo...' : 'Subir imagen'}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleUpload} className="hidden" />
            {form.imageUrl && (
              <div className="flex items-center gap-2">
                <img src={form.imageUrl} alt="preview" className="w-10 h-10 rounded-lg object-cover" />
                <button type="button" onClick={() => update('imageUrl', '')} className="text-vital-text-muted hover:text-red-400 text-xs">Quitar</button>
              </div>
            )}
          </div>

          {/* Image URL */}
          <div className="mb-3">
            <input
              type="text"
              value={form.imageUrl}
              onChange={(e) => update('imageUrl', e.target.value)}
              className="admin-input w-full"
              placeholder="O pega una URL de imagen..."
            />
          </div>

          {/* Video URL */}
          <div>
            <input
              type="text"
              value={form.videoUrl}
              onChange={(e) => update('videoUrl', e.target.value)}
              className="admin-input w-full"
              placeholder="URL del video (YouTube, Vimeo, o subido)..."
            />
          </div>
        </div>

        {/* Featured */}
        <label className="flex items-center gap-3 cursor-pointer">
          <button
            type="button"
            onClick={() => update('featured', !form.featured)}
            className={`relative w-11 h-6 rounded-full transition-colors ${form.featured ? 'bg-vital-green' : 'bg-white/10'}`}
          >
            <motion.div
              animate={{ x: form.featured ? 22 : 2 }}
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white"
            />
          </button>
          <span className="text-vital-text-secondary text-sm">Marcar como historia destacada (historia del mes)</span>
        </label>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-vital-green to-vital-green-dark text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-vital-green/30 transition-all disabled:opacity-50"
          >
            {saving ? 'Guardando...' : mode === 'create' ? 'Crear historia' : 'Guardar cambios'}
          </button>
          <Link href="/admin" className="text-vital-text-muted hover:text-vital-text px-6 py-3 text-sm">
            Cancelar
          </Link>
        </div>
      </div>
    </form>
  );
}
