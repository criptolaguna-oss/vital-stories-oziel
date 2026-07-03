import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { isSupabaseConfigured, getAdminClient } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('vital-admin-token')?.value;
  return token ? verifyToken(token) : false;
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No se encontró archivo' }, { status: 400 });
    }

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de archivo no permitido' }, { status: 400 });
    }

    // Validar tamaño (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'Archivo demasiado grande (máx 50MB)' }, { status: 400 });
    }

    const ext = file.name.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Si Supabase está configurado, subir al Storage
    if (isSupabaseConfigured()) {
      try {
        const client = getAdminClient();
        const { error } = await client.storage
          .from('testimonials')
          .upload(filename, buffer, {
            contentType: file.type,
            cacheControl: '3600',
          });

        if (error) throw error;

        // Obtener URL pública
        const { data: urlData } = client.storage
          .from('testimonials')
          .getPublicUrl(filename);

        return NextResponse.json({
          success: true,
          url: urlData.publicUrl,
          filename,
        });
      } catch (e) {
        console.error('Supabase upload error, fallback local:', e);
        // Caer al fallback local
      }
    }

    // Fallback: guardar en disco local
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    fs.writeFileSync(path.join(uploadDir, filename), buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
      filename,
    });
  } catch {
    return NextResponse.json({ error: 'Error al subir archivo' }, { status: 500 });
  }
}
