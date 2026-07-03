-- ============================================================
-- VitalStories — Esquema de Base de Datos Supabase
-- ============================================================
-- Ejecuta este archivo en: Supabase Dashboard → SQL Editor → New Query
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
  category        text not null default 'nourish' check (category in ('awaken','detox','nourish','restore','kids')),
  tags            text[] default '{}',
  months_as_client integer default 1,
  featured        boolean default false,
  status          text not null default 'draft' check (status in ('published','draft')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Índices para rendimiento
create index if not exists idx_testimonials_status on public.testimonials(status);
create index if not exists idx_testimonials_category on public.testimonials(category);
create index if not exists idx_testimonials_featured on public.testimonials(featured);
create index if not exists idx_testimonials_created_at on public.testimonials(created_at desc);

-- Comentarios
comment on table public.testimonials is 'Testimonios de clientes de VitalHealth';
comment on column public.testimonials.type is 'Tipo: photo, video o written';
comment on column public.testimonials.category is 'Línea de producto: awaken, detox, nourish, restore, kids';

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
-- La tabla es legible públicamente SOLO para testimonios publicados
-- Escritura/edición solo con service_role key (servidor)

alter table public.testimonials enable row level security;

-- Política: cualquiera puede LEER testimonios publicados
drop policy if exists "Public can read published testimonials" on public.testimonials;
create policy "Public can read published testimonials"
  on public.testimonials for select
  to anon, authenticated
  using (status = 'published');

-- Política: usuarios autenticados (admin) pueden hacer todo
drop policy if exists "Authenticated can manage testimonials" on public.testimonials;
create policy "Authenticated can manage testimonials"
  on public.testimonials for all
  to authenticated
  using (true) with check (true);

-- 4. STORAGE BUCKET PARA ARCHIVOS ---------------------------
-- Bucket público para imágenes y videos de testimonios
insert into storage.buckets (id, name, public)
values ('testimonials', 'testimonials', true)
on conflict (id) do nothing;

-- Política de storage: lectura pública
drop policy if exists "Public read access to testimonials bucket" on storage.objects;
create policy "Public read access to testimonials bucket"
  on storage.objects for select
  to public
  using (bucket_id = 'testimonials');

-- Política de storage: escritura solo autenticada
drop policy if exists "Authenticated upload to testimonials bucket" on storage.objects;
create policy "Authenticated upload to testimonials bucket"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'testimonials');

-- Política de storage: borrado solo autenticado
drop policy if exists "Authenticated delete from testimonials bucket" on storage.objects;
create policy "Authenticated delete from testimonials bucket"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'testimonials');

-- 5. DATOS DE EJEMPLO (opcional) ----------------------------
-- Descomenta para insertar testimonios de ejemplo
/*
insert into public.testimonials (name, title_es, title_en, body_es, body_en, type, category, tags, months_as_client, featured, status) values
('María González', 'Cómo recuperé mi energía y mi confianza', 'How I recovered my energy and confidence', 'Cuando empecé no tenía muchas expectativas. Llevaba años con poca energía y dificultad para mantener un peso saludable. A las pocas semanas empecé a notar el cambio: dormía mejor y me levantaba con ánimo. Hoy comparto mi historia para que otros sepan que sí es posible.', 'When I started I didn''t have many expectations. I''d spent years with low energy and difficulty maintaining a healthy weight. Within a few weeks I started noticing the change: I slept better and woke up with energy.', 'video', 'nourish', array['energy','weight','wellness'], 8, true, 'published'),
('Ana López', 'Bajé 12 kg en 4 meses', 'I lost 12 kg in 4 months', 'Gracias a los productos de VitalHealth y al acompañamiento constante, logré un cambio que no pensaba era posible.', 'Thanks to VitalHealth products and constant support, I achieved a change I didn''t think was possible.', 'photo', 'detox', array['weight','wellness'], 4, false, 'published'),
('Jorge Martínez', 'Mi día a día cambió por completo', 'My day-to-day changed completely', 'Desde que incluí los adaptógenos de Awaken en mi rutina, mi productividad subió y el estrés bajó.', 'Since I included Awaken adaptogens in my routine, my productivity went up and stress went down.', 'video', 'awaken', array['energy','wellness'], 6, false, 'published'),
('Carlos Ramírez', 'El acompañamiento marcó la diferencia', 'The support made all the difference', 'Lo que más valoro es el acompañamiento personalizado. No solo venden productos, te enseñan a cambiar tu estilo de vida de raíz.', 'What I value most is the personalized support.', 'photo', 'restore', array['wellness','immunity'], 10, false, 'published'),
('Sofía Rodríguez', '6 meses de cambio total', '6 months of total change', 'Empecé con Detox y luego incorporé Nourish. La combinación fue perfecta.', 'I started with Detox and then incorporated Nourish.', 'written', 'detox', array['energy','sleep','wellness'], 6, false, 'published'),
('Roberto Silva', 'Mi sistema inmune nunca fue tan fuerte', 'My immune system was never this strong', 'Desde que uso Restore, no me he enfermado una sola vez.', 'Since using Restore, I haven''t gotten sick once.', 'photo', 'restore', array['immunity','wellness'], 12, false, 'published'),
('Laura Mendoza', 'Mis hijos ya no se enferman cada mes', 'My kids no longer get sick every month', 'Gracias a la línea Kids de VitalHealth, la salud de mis hijos dio un giro de 180 grados.', 'Thanks to the Kids line from VitalHealth.', 'video', 'kids', array['immunity','wellness'], 9, false, 'published'),
('Fernando Torres', 'Dormir 8 horas era un lujo, ahora es mi normalidad', 'Sleeping 8 hours was a luxury', 'Sufría de insomnio crónico. Después de 3 meses con los productos de VitalHealth, mi sueño se regularizó.', 'I suffered from chronic insomnia.', 'written', 'awaken', array['sleep','wellness','energy'], 3, false, 'published');
*/
