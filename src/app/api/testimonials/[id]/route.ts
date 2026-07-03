import { NextRequest, NextResponse } from 'next/server';
import { updateTestimonial, deleteTestimonial } from '@/lib/data';
import { verifyToken } from '@/lib/auth';

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('vital-admin-token')?.value;
  return token ? verifyToken(token) : false;
}

// PUT /api/testimonials/[id] - actualiza (solo admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const updated = await updateTestimonial(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }
}

// DELETE /api/testimonials/[id] - elimina (solo admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const ok = await deleteTestimonial(params.id);
  if (!ok) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
