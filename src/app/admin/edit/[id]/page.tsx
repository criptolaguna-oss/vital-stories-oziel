'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import TestimonialForm from '@/components/admin/TestimonialForm';

export default function EditTestimonialPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/testimonials')
      .then((r) => {
        if (r.status === 401) { router.push('/admin/login'); return null; }
        return r.json();
      })
      .then((all) => {
        if (Array.isArray(all)) {
          const found = all.find((t: any) => t.id === params.id);
          setData(found || null);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id, router]);

  return (
    <AdminShell>
      {loading ? (
        <div className="text-vital-text-muted text-sm">Cargando...</div>
      ) : data ? (
        <TestimonialForm mode="edit" initial={data} />
      ) : (
        <div className="text-vital-text-muted text-sm">Testimonio no encontrado.</div>
      )}
    </AdminShell>
  );
}
