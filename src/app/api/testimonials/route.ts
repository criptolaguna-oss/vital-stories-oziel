import { NextRequest, NextResponse } from 'next/server';
import { getAllTestimonials, createTestimonial } from '@/lib/data';
import { verifyToken } from '@/lib/auth';

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('vital-admin-token')?.value;
  return token ? verifyToken(token) : false;
}

// GET /api/testimonials - lista todos (admin) o publicados
export async function GET(request: NextRequest) {
  const authed = isAuthenticated(request);
  const all = await getAllTestimonials();
  const data = authed ? all : all.filter((t) => t.status === 'published');
  return NextResponse.json(data);
}

// POST /api/testimonials - crea nuevo (solo admin)
export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const created = await createTestimonial(body);
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }
}
