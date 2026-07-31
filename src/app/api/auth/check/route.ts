import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Endpoint ligero: solo verifica si el usuario está autenticado
// No consulta la base de datos (instantáneo)
export async function GET(request: NextRequest) {
  const token = request.cookies.get('vital-admin-token')?.value;
  const authed = token ? verifyToken(token) : false;
  return NextResponse.json({ authenticated: authed });
}
