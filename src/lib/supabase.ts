import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Variables de entorno (configurar en .env.local y Vercel)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Cliente público (lectura, respeta RLS) — para el frontend
let publicClient: SupabaseClient | null = null;
export function getPublicClient(): SupabaseClient {
  if (!publicClient) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY');
    }
    publicClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return publicClient;
}

// Cliente admin (service_role, bypass RLS) — SOLO en el servidor
let adminClient: SupabaseClient | null = null;
export function getAdminClient(): SupabaseClient {
  if (!adminClient) {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      throw new Error('Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
    }
    adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return adminClient;
}

export function isSupabaseConfigured(): boolean {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
}
