'use client';

import { useState, useEffect } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import TestimonialForm from '@/components/admin/TestimonialForm';

export default function EditTestimonialPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then((all) => {
        if (Array.isArray(all)) {
          const found = all.find((t: any) => t.id === params.id);
          setData(found || null);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

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
