import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { isSupabaseConfigured, getAdminClient } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('vital-admin-token')?.value;
  return token ? verifyToken(token) : false;
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  // Si Supabase está configurado, listar del Storage
  if (isSupabaseConfigured()) {
    try {
      const client = getAdminClient();
      const { data, error } = await client.storage.from('testimonials').list('', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      });
      if (error) throw error;

      const items = (data || []).map((file: any) => {
        const { data: urlData } = client.storage.from('testimonials').getPublicUrl(file.name);
        let type = 'application/octet-stream';
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '')) type = `image/${ext}`;
        else if (ext === 'mp4') type = 'video/mp4';
        return {
          name: file.name,
          url: urlData.publicUrl,
          size: file.metadata?.size || 0,
          type,
        };
      });

      return NextResponse.json({ items });
    } catch (e) {
      console.error('Supabase media list error, fallback local:', e);
    }
  }

  // Fallback: listar del disco local
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const items: Array<{ name: string; url: string; size: number; type: string }> = [];

  if (fs.existsSync(uploadDir)) {
    const files = fs.readdirSync(uploadDir);
    for (const name of files) {
      const filepath = path.join(uploadDir, name);
      const stat = fs.statSync(filepath);
      if (stat.isFile()) {
        const ext = path.extname(name).toLowerCase();
        let type = 'application/octet-stream';
        if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) type = `image/${ext.slice(1)}`;
        else if (ext === '.mp4') type = 'video/mp4';
        items.push({ name, url: `/uploads/${name}`, size: stat.size, type });
      }
    }
  }

  return NextResponse.json({ items });
}

export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  if (!filename) {
    return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 });
  }

  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return NextResponse.json({ error: 'Nombre inválido' }, { status: 400 });
  }

  // Supabase
  if (isSupabaseConfigured()) {
    try {
      const client = getAdminClient();
      const { error } = await client.storage.from('testimonials').remove([filename]);
      if (error) throw error;
      return NextResponse.json({ success: true });
    } catch (e) {
      console.error('Supabase media delete error, fallback local:', e);
    }
  }

  // Fallback local
  const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
  if (!fs.existsSync(filepath)) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }
  fs.unlinkSync(filepath);
  return NextResponse.json({ success: true });
}
