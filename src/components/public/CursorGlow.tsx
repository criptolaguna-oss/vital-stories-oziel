'use client';

import { useEffect, useState } from 'react';

export default function CursorGlow() {
  const [pos, setPos] = useState({ x: -500, y: -500 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show on desktop
    if (window.innerWidth < 768) return;

    setVisible(true);

    const handler = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="cursor-glow"
      style={{
        left: pos.x,
        top: pos.y,
        opacity: pos.x === -500 ? 0 : 1,
      }}
    />
  );
}
