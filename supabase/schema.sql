-- ============================================================
-- tu networker stories — Esquema de Base de Datos Supabase
-- ============================================================
-- Ejecuta TODO este archivo en:
-- Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- 1. TABLA DE TESTIMONIOS ------------------------------------
create table if not exists public.testimonials (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  title_es        text not null,
  title_en        text default '',
  body_es         text not null,
  body_en         text default '',
  type            text not null default 'written' check (type in ('photo','video','written')),
  image_url       text default '',
  video_url       text default '',
  category        text not null default 'wellness',
  tags            text[] default '{}',
  months_as_client integer default 1,
  featured        boolean default false,
  status          text not null default 'draft' check (status in ('published','draft')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Índices para rendimiento
create index if not exists idx_testimonials_status on public.testimonials(status);
create index if not exists idx_testimonials_featured on public.testimonials(featured);
create index if not exists idx_testimonials_created_at on public.testimonials(created_at desc);

-- 2. ACTUALIZAR updated_at automáticamente -------------------
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists testimonials_updated_at on public.testimonials;
create trigger testimonials_updated_at
  before update on public.testimonials
  for each row execute function public.handle_updated_at();

-- 3. ROW LEVEL SECURITY (RLS) -------------------------------
-- Pública para leer testimonios publicados, escritura solo autenticada

alter table public.testimonials enable row level security;

drop policy if exists "Public can read published testimonials" on public.testimonials;
create policy "Public can read published testimonials"
  on public.testimonials for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists "Authenticated can manage testimonials" on public.testimonials;
create policy "Authenticated can manage testimonials"
  on public.testimonials for all
  to authenticated
  using (true) with check (true);

-- 4. STORAGE BUCKET PARA ARCHIVOS ---------------------------
insert into storage.buckets (id, name, public)
values ('testimonials', 'testimonials', true)
on conflict (id) do nothing;

-- Políticas de storage
drop policy if exists "Public read access to testimonials bucket" on storage.objects;
create policy "Public read access to testimonials bucket"
  on storage.objects for select
  to public
  using (bucket_id = 'testimonials');

drop policy if exists "Authenticated upload to testimonials bucket" on storage.objects;
create policy "Authenticated upload to testimonials bucket"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'testimonials');

drop policy if exists "Authenticated delete from testimonials bucket" on storage.objects;
create policy "Authenticated delete from testimonials bucket"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'testimonials');

-- 5. DATOS DE EJEMPLO ----------------------------------------
insert into public.testimonials (name, title_es, title_en, body_es, body_en, type, category, tags, months_as_client, featured, status) values
('María González', 'Cómo recuperé mi energía y mi confianza', 'How I recovered my energy and confidence', 'Cuando empecé no tenía muchas expectativas. Llevaba años con poca energía y dificultad para mantener un peso saludable. A las pocas semanas empecé a notar el cambio: dormía mejor y me levantaba con ánimo. Hoy comparto mi historia para que otros sepan que sí es posible.', 'When I started I didn''t have many expectations. I''d spent years with low energy and difficulty maintaining a healthy weight.', 'video', 'wellness', array['energy','weight','wellness'], 8, true, 'published'),
('Ana López', 'Bajé 12 kg en 4 meses', 'I lost 12 kg in 4 months', 'Gracias al acompañamiento constante y a la guía que recibí, logré un cambio que no pensaba era posible.', 'Thanks to the constant support and guidance I received, I achieved a change I didn''t think was possible.', 'photo', 'wellness', array['weight','wellness'], 4, false, 'published'),
('Jorge Martínez', 'Mi día a día cambió por completo', 'My day-to-day changed completely', 'Desde que cambié mis hábitos y empecé a cuidarme, mi productividad subió y el estrés bajó.', 'Since I changed my habits and started taking care of myself, my productivity went up and stress went down.', 'video', 'wellness', array['energy','wellness'], 6, false, 'published'),
('Carlos Ramírez', 'El acompañamiento marcó la diferencia', 'The support made all the difference', 'Lo que más valoro es el acompañamiento personalizado. No solo hay productos, hay alguien que te enseña a cambiar tu estilo de vida.', 'What I value most is the personalized support.', 'photo', 'wellness', array['wellness','immunity'], 10, false, 'published'),
('Sofía Rodríguez', '6 meses de cambio total', '6 months of total change', 'Empecé con pequeños cambios y luego tomó impulso. Mi piel, mi energía, mi sueño... todo mejoró.', 'I started with small changes and then it gained momentum.', 'written', 'wellness', array['energy','sleep','wellness'], 6, false, 'published'),
('Roberto Silva', 'Mi sistema inmune nunca fue tan fuerte', 'My immune system was never this strong', 'Desde que empecé a cuidarme, no me he enfermado una sola vez.', 'Since I started taking care of myself, I haven''t gotten sick once.', 'photo', 'wellness', array['immunity','wellness'], 12, false, 'published'),
('Laura Mendoza', 'Mis hijos ya no se enferman cada mes', 'My kids no longer get sick every month', 'Gracias a la guía que recibí, la salud de mis hijos dio un giro de 180 grados.', 'Thanks to the guidance I received.', 'video', 'wellness', array['immunity','wellness'], 9, false, 'published'),
('Fernando Torres', 'Dormir 8 horas era un lujo, ahora es mi normalidad', 'Sleeping 8 hours was a luxury, now it''s my normal', 'Sufría de insomnio crónico. Después de 3 meses con el acompañamiento adecuado, mi sueño se regularizó.', 'I suffered from chronic insomnia.', 'written', 'wellness', array['sleep','wellness','energy'], 3, false, 'published')
on conflict do nothing;

-- ✅ Listo. La tabla y bucket están creados.
