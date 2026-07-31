'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminShellProps {
  children: React.ReactNode;
}

const navItems = [
  { href: '/admin', label: 'Historias', icon: 'grid' },
  { href: '/admin/new', label: 'Nueva', icon: 'plus' },
  { href: '/admin/pending', label: 'Pendientes', icon: 'inbox' },
  { href: '/admin/media', label: 'Multimedia', icon: 'photo' },
  { href: '/admin/settings', label: 'Ajustes', icon: 'settings' },
];

// Cache simple en memoria para el conteo de pendientes (evita recargar)
let pendingCountCache: number | null = null;

function NavIcon({ name }: { name: string }) {
  const icons: Record<string, JSX.Element> = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </>
    ),
    plus: (
      <>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </>
    ),
    inbox: (
      <>
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      </>
    ),
    photo: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="M21 15l-5-5L5 21" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </>
    ),
  };
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
}

export default function AdminShell({ children }: AdminShellProps) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(pendingCountCache || 0);
  const router = useRouter();
  const pathname = usePathname();

  // Verificación de auth: SOLO una vez al montar, endpoint ligero (sin BD)
  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/check')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.authenticated) {
          router.push('/admin/login');
        } else {
          setAuthed(true);
        }
      })
      .catch(() => {
        if (!cancelled) router.push('/admin/login');
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  // Conteo de pendientes: una sola vez (cacheado en memoria del navegador)
  useEffect(() => {
    if (!authed || pendingCountCache !== null) return;
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const count = data.filter((t: any) => t.status === 'draft').length;
          pendingCountCache = count;
          setPendingCount(count);
        }
      })
      .catch(() => {});
  }, [authed]);

  // Invalidar cache de pendientes cuando se navega a estas páginas
  useEffect(() => {
    if (pathname === '/admin' || pathname === '/admin/pending' || pathname === '/admin/new') {
      pendingCountCache = null;
      // Recargar conteo silenciosamente
      if (authed) {
        fetch('/api/testimonials')
          .then((r) => r.json())
          .then((data) => {
            if (Array.isArray(data)) {
              const count = data.filter((t: any) => t.status === 'draft').length;
              pendingCountCache = count;
              setPendingCount(count);
            }
          })
          .catch(() => {});
      }
    }
  }, [pathname, authed]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    pendingCountCache = null;
    router.push('/admin/login');
  };

  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-vital-green/30 border-t-vital-green rounded-full animate-spin" />
          <div className="text-vital-text-muted text-sm">Verificando acceso...</div>
        </div>
      </div>
    );
  }

  if (!authed) return null;

  return (
    <div className="min-h-screen flex bg-vital-dark">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 bg-[#0a0d0b] border-r border-white/[0.06] flex-col shrink-0">
        <div className="p-5 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-vital-green to-vital-green-dark flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a0d0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <div>
            <span className="text-vital-text font-medium text-sm block leading-tight">tu<span className="text-vital-green">networker</span></span>
            <span className="text-vital-text-muted text-[10px]">stories admin</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-vital-green/20 to-vital-green-dark/10 text-vital-green font-medium'
                    : 'text-vital-text-muted hover:text-vital-text hover:bg-white/[0.03]'
                }`}
              >
                <NavIcon name={item.icon} />
                <span>{item.label}</span>
                {item.href === '/admin/pending' && pendingCount > 0 && (
                  <span className="ml-auto bg-vital-gold text-[#1a1404] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/[0.06] space-y-1">
          <Link href="/" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-vital-text-muted hover:text-vital-text hover:bg-white/[0.03] transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Ver sitio
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-vital-text-muted hover:text-red-400 hover:bg-red-500/5 transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 glass px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vital-green to-vital-green-dark flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a0d0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <span className="text-vital-text font-medium text-sm">tu<span className="text-vital-green">networker</span></span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-vital-text p-1">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="md:hidden fixed inset-0 z-20 bg-vital-dark pt-20 px-6"
          >
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm transition-all ${
                      isActive
                        ? 'bg-vital-green/15 text-vital-green font-medium'
                        : 'text-vital-text-muted'
                    }`}
                  >
                    <NavIcon name={item.icon} />
                    {item.label}
                  </Link>
                );
              })}
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm text-red-400 mt-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Cerrar sesión
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
        <div className="p-5 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
