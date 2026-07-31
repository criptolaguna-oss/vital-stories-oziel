import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'tu networker stories — Historias Reales de Transformación',
  description: 'Historias reales de transformación. Testimonios reales, resultados reales.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
