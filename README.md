# 🌿 VitalStories — Web de Oziel (Distribuidor VitalHealth)

Landing page inmersiva con panel de administración para gestionar testimonios de clientes.

## ✨ Características

- 🎨 **Diseño premium oscuro** — verde esmeralda + dorado, glassmorphism, partículas animadas
- 🎬 **Efectos 3D en scroll** — cards con tilt 3D, animaciones GSAP/Framer Motion, cursor glow
- 🌐 **Bilingüe** — Español / English con switch en vivo
- 🖼️ **Galería de testimonios** — filtrado por producto, resultado y tipo (foto/video/historia)
- 🔐 **Panel de administración** — CRUD completo de testimonios + gestor multimedia
- 🗄️ **Supabase** — base de datos PostgreSQL + almacenamiento de archivos en la nube
- ⚡ **Next.js 14** — App Router, API Routes, optimización de imágenes

## 🚀 Setup (3 pasos)

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar Supabase
1. Crea un proyecto gratis en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor** y ejecuta el archivo [`supabase/schema.sql`](./supabase/schema.sql)
3. Ve a **Settings → API** y copia:
   - `Project URL`
   - `anon public key`
   - `service_role key`
4. Copia `.env.example` a `.env.local` y pega las credenciales

### 3. Ejecutar
```bash
npm run dev
```
- 🌐 Sitio: http://localhost:3000
- 🔐 Admin: http://localhost:3000/admin/login
  - Usuario: `oziel`
  - Contraseña: `vital2026`

## 📦 Deploy en Vercel

1. Sube el repo a GitHub
2. En [vercel.com](https://vercel.com) → "New Project" → importa el repo
3. Añade las variables de entorno (igual que `.env.local`)
4. Deploy ✅

## 🛠️ Stack

| Tecnología | Uso |
|-----------|-----|
| Next.js 14 | Framework + API Routes |
| TypeScript | Tipado |
| Tailwind CSS | Estilos |
| Framer Motion | Animaciones UI |
| Supabase | BD PostgreSQL + Storage |
| Canvas API | Partículas animadas |

## 📁 Estructura

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── admin/                # Panel de administración
│   └── api/                  # API Routes (CRUD, auth, upload)
├── components/
│   ├── public/               # Componentes del sitio público
│   └── admin/                # Componentes del panel admin
└── lib/
    ├── supabase.ts           # Cliente Supabase
    ├── data.ts               # Capa de datos (CRUD)
    └── auth.ts               # Autenticación admin
```

## ⚠️ Notas

- Sin credenciales de Supabase, la web usa `data/testimonials.json` como fallback local
- El sistema de archivos de Vercel es temporal → siempre usa Supabase en producción
- Cambia `ADMIN_PASSWORD` y `SESSION_SECRET` antes de producción
