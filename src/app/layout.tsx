import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VitalStories — Historias Reales de Transformación',
  description: 'Descubre cómo los productos de VitalHealth están cambiando vidas. Testimonios reales, resultados reales.',
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
