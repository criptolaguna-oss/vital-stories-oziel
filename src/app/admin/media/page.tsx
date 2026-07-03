'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';

interface MediaItem {
  name: string;
  url: string;
  size: number;
  type: string;
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const loadMedia = async () => {
    try {
      const res = await fetch('/api/media');
      if (res.status === 401) { router.push('/admin/login'); return; }
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      setItems([]);
    }
    setLoading(false);
  };

  useEffect(() => { loadMedia(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', file);
      await fetch('/api/upload', { method: 'POST', body: fd });
    }
    setUploading(false);
    loadMedia();
    if (e.target) e.target.value = '';
  };

  const handleDelete = async (filename: string) => {
    if (!confirm('¿Eliminar este archivo?')) return;
    await fetch(`/api/media?filename=${encodeURIComponent(filename)}`, { method: 'DELETE' });
    loadMedia();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-vital-text text-xl font-medium">Multimedia</h1>
          <p className="text-vital-text-muted text-sm mt-0.5">{items.length} archivos</p>
        </div>
        <label className="inline-flex items-center gap-2 bg-gradient-to-r from-vital-green to-vital-green-dark text-white font-medium text-sm px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-vital-green/30 transition-all cursor-pointer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
          {uploading ? 'Subiendo...' : 'Subir archivos'}
          <input type="file" multiple accept="image/*,video/*" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      {loading ? (
        <div className="text-vital-text-muted text-sm">Cargando...</div>
      ) : items.length === 0 ? (
        <div className="bg-vital-card border border-white/[0.06] rounded-2xl p-10 text-center">
          <div className="text-4xl mb-3">📁</div>
          <p className="text-vital-text font-medium mb-1">Sin archivos</p>
          <p className="text-vital-text-muted text-sm">Sube tu primera imagen o video.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((item, i) => (
            <div key={i} className="bg-vital-card border border-white/[0.06] rounded-2xl overflow-hidden group">
              <div className="aspect-square bg-[#0a0d0b] flex items-center justify-center relative">
                {item.type.startsWith('image/') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                ) : item.type.startsWith('video/') ? (
                  <video src={item.url} className="w-full h-full object-cover" muted />
                ) : (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2f4438" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                )}
                <button
                  onClick={() => handleDelete(item.name)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center hover:bg-red-500/80 transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>
                </button>
              </div>
              <div className="p-2.5">
                <p className="text-vital-text text-xs font-medium truncate">{item.name}</p>
                <p className="text-vital-text-muted text-[10px]">{formatSize(item.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
