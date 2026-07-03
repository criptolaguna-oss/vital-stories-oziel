'use client';

import { useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';

export default function SettingsPage() {
  const [whatsapp, setWhatsapp] = useState('521234567890');
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // En producción esto se guardaría en BD / env
    try {
      localStorage.setItem('vital-whatsapp', whatsapp);
    } catch {}
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-vital-text text-xl font-medium">Ajustes</h1>
        <p className="text-vital-text-muted text-sm mt-0.5">Configuración general del sitio</p>
      </div>

      <form onSubmit={handleSave} className="max-w-xl space-y-6">
        {/* Cuenta */}
        <div className="bg-vital-card border border-white/[0.06] rounded-2xl p-5">
          <h2 className="text-vital-text text-sm font-medium mb-1">Cuenta de administrador</h2>
          <p className="text-vital-text-muted text-xs mb-4">Usuario actual: <span className="text-vital-green">oziel</span></p>
          <div className="text-xs text-vital-text-muted bg-vital-dark p-3 rounded-xl border border-white/[0.04]">
            💡 Para cambiar las credenciales, edita las variables de entorno en el servidor:
            <pre className="mt-2 text-vital-green/80 font-mono text-[10px]">ADMIN_USERNAME=oziel
ADMIN_PASSWORD=vital2026
SESSION_SECRET=tu-clave-secreta</pre>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="bg-vital-card border border-white/[0.06] rounded-2xl p-5">
          <h2 className="text-vital-text text-sm font-medium mb-1">WhatsApp de contacto</h2>
          <p className="text-vital-text-muted text-xs mb-4">Número al que se enviarán los mensajes del botón "Comparte tu historia"</p>
          <input
            type="text"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="admin-input w-full"
            placeholder="521234567890"
          />
        </div>

        {/* Información del sitio */}
        <div className="bg-vital-card border border-white/[0.06] rounded-2xl p-5">
          <h2 className="text-vital-text text-sm font-medium mb-3">Información del sitio</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-vital-text-muted">Framework</span>
              <span className="text-vital-text">Next.js 14</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-vital-text-muted">Hosting</span>
              <span className="text-vital-text">Hostinger</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-vital-text-muted">Idiomas</span>
              <span className="text-vital-text">Español · English</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-vital-text-muted">Versión</span>
              <span className="text-vital-green">1.0.0</span>
            </div>
          </div>
        </div>

        {savedMsg && (
          <div className="bg-vital-green/10 border border-vital-green/30 text-vital-green text-sm px-4 py-3 rounded-xl">
            ✅ Cambios guardados
          </div>
        )}

        <button
          type="submit"
          className="bg-gradient-to-r from-vital-green to-vital-green-dark text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-vital-green/30 transition-all"
        >
          Guardar cambios
        </button>
      </form>
    </AdminShell>
  );
}
