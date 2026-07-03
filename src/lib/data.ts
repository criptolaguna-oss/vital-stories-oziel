import { isSupabaseConfigured, getAdminClient, getPublicClient } from './supabase';

export interface Testimonial {
  id: string;
  name: string;
  title_es: string;
  title_en: string;
  body_es: string;
  body_en: string;
  type: 'photo' | 'video' | 'written';
  imageUrl: string;
  videoUrl: string;
  category: string;
  tags: string[];
  monthsAsClient: number;
  featured: boolean;
  status: 'published' | 'draft';
  createdAt: string;
}

// Mapea fila de Supabase (snake_case) a Testimonial (camelCase)
function mapRow(row: any): Testimonial {
  return {
    id: String(row.id),
    name: row.name || '',
    title_es: row.title_es || '',
    title_en: row.title_en || '',
    body_es: row.body_es || '',
    body_en: row.body_en || '',
    type: row.type || 'written',
    imageUrl: row.image_url || '',
    videoUrl: row.video_url || '',
    category: row.category || 'nourish',
    tags: row.tags || [],
    monthsAsClient: row.months_as_client || 1,
    featured: row.featured || false,
    status: row.status || 'draft',
    createdAt: row.created_at || new Date().toISOString(),
  };
}

function mapToRow(t: Partial<Testimonial>): any {
  const row: any = {};
  if (t.name !== undefined) row.name = t.name;
  if (t.title_es !== undefined) row.title_es = t.title_es;
  if (t.title_en !== undefined) row.title_en = t.title_en;
  if (t.body_es !== undefined) row.body_es = t.body_es;
  if (t.body_en !== undefined) row.body_en = t.body_en;
  if (t.type !== undefined) row.type = t.type;
  if (t.imageUrl !== undefined) row.image_url = t.imageUrl;
  if (t.videoUrl !== undefined) row.video_url = t.videoUrl;
  if (t.category !== undefined) row.category = t.category;
  if (t.tags !== undefined) row.tags = t.tags;
  if (t.monthsAsClient !== undefined) row.months_as_client = t.monthsAsClient;
  if (t.featured !== undefined) row.featured = t.featured;
  if (t.status !== undefined) row.status = t.status;
  return row;
}

// Fallback a JSON local si Supabase no está configurado
async function getLocalData(): Promise<Testimonial[]> {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const file = path.join(process.cwd(), 'data', 'testimonials.json');
    const raw = fs.readFileSync(file, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  if (isSupabaseConfigured()) {
    try {
      const client = getAdminClient();
      const { data, error } = await client
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapRow);
    } catch (e) {
      console.error('Supabase getAll error, usando fallback local:', e);
      return getLocalData();
    }
  }
  return getLocalData();
}

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  if (isSupabaseConfigured()) {
    try {
      const client = getPublicClient();
      const { data, error } = await client
        .from('testimonials')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapRow);
    } catch (e) {
      console.error('Supabase getPublished error, fallback local:', e);
      const local = await getLocalData();
      return local.filter((t) => t.status === 'published');
    }
  }
  const local = await getLocalData();
  return local.filter((t) => t.status === 'published');
}

export async function createTestimonial(data: Partial<Testimonial>): Promise<Testimonial> {
  if (isSupabaseConfigured()) {
    const client = getAdminClient();
    const row = mapToRow(data);
    const { data: result, error } = await client
      .from('testimonials')
      .insert(row)
      .select()
      .single();
    if (error) throw error;
    return mapRow(result);
  }
  // Fallback local
  const all = await getLocalData();
  const newT: Testimonial = {
    id: Date.now().toString(),
    name: data.name || '',
    title_es: data.title_es || '',
    title_en: data.title_en || '',
    body_es: data.body_es || '',
    body_en: data.body_en || '',
    type: data.type || 'written',
    imageUrl: data.imageUrl || '',
    videoUrl: data.videoUrl || '',
    category: data.category || 'nourish',
    tags: data.tags || [],
    monthsAsClient: data.monthsAsClient || 1,
    featured: data.featured || false,
    status: data.status || 'draft',
    createdAt: new Date().toISOString(),
  };
  all.unshift(newT);
  const fs = await import('fs');
  const path = await import('path');
  fs.writeFileSync(
    path.join(process.cwd(), 'data', 'testimonials.json'),
    JSON.stringify(all, null, 2)
  );
  return newT;
}

export async function updateTestimonial(id: string, data: Partial<Testimonial>): Promise<Testimonial | null> {
  if (isSupabaseConfigured()) {
    const client = getAdminClient();
    const row = mapToRow(data);
    const { data: result, error } = await client
      .from('testimonials')
      .update(row)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return mapRow(result);
  }
  const all = await getLocalData();
  const idx = all.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...data, id };
  const fs = await import('fs');
  const path = await import('path');
  fs.writeFileSync(
    path.join(process.cwd(), 'data', 'testimonials.json'),
    JSON.stringify(all, null, 2)
  );
  return all[idx];
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const client = getAdminClient();
    const { error } = await client.from('testimonials').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
  const all = await getLocalData();
  const filtered = all.filter((t) => t.id !== id);
  if (filtered.length === all.length) return false;
  const fs = await import('fs');
  const path = await import('path');
  fs.writeFileSync(
    path.join(process.cwd(), 'data', 'testimonials.json'),
    JSON.stringify(filtered, null, 2)
  );
  return true;
}
