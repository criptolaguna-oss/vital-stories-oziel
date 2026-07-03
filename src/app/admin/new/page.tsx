'use client';

import AdminShell from '@/components/admin/AdminShell';
import TestimonialForm from '@/components/admin/TestimonialForm';

export default function NewTestimonialPage() {
  return (
    <AdminShell>
      <TestimonialForm mode="create" />
    </AdminShell>
  );
}
