'use client';

interface FooterProps {
  t: (key: string) => string;
}

export default function Footer({ t }: FooterProps) {
  return (
    <footer className="border-t border-white/[0.06] py-10 px-6 mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-vital-green to-vital-green-dark flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a0d0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <div>
              <p className="text-vital-text font-medium text-sm">
                Vital<span className="text-vital-green">Stories</span>
              </p>
              <p className="text-vital-text-muted text-xs">{t('footer.powered')}</p>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-vital-text-muted text-xs text-center">
            {t('footer.rights')}
          </p>

          {/* Admin link */}
          <a
            href="/admin"
            className="text-vital-text-muted hover:text-vital-green text-xs transition-colors flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
