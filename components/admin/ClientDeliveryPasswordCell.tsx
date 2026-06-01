'use client';

import { useState } from 'react';
import { Copy, Eye, EyeOff, Save } from 'lucide-react';

export function ClientDeliveryPasswordCell({
  userId,
  password,
  onStored,
}: {
  userId: string;
  password: string | null | undefined;
  onStored?: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [stored, setStored] = useState(password ?? null);
  const [busy, setBusy] = useState(false);

  if (!stored) {
    async function registerCurrent() {
      const value = window.prompt(
        'Ingrese la contraseña actual del cliente (no se cambiará el acceso, solo se guardará para entrega):'
      );
      if (!value?.trim()) return;
      setBusy(true);
      try {
        const res = await fetch(`/api/users/${userId}/delivery-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: value.trim() }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error ?? 'Error');
        setStored(value.trim());
        onStored?.();
      } catch (e) {
        alert(e instanceof Error ? e.message : 'Error');
      } finally {
        setBusy(false);
      }
    }

    return (
      <div className="space-y-1">
        <span className="text-xs text-brand-slate">No registrada para entrega</span>
        <button
          type="button"
          disabled={busy}
          onClick={registerCurrent}
          className="flex items-center gap-1 text-xs text-brand-cyan hover:underline disabled:opacity-60"
        >
          <Save className="h-3 w-3" />
          Registrar contraseña actual
        </button>
      </div>
    );
  }

  function copy() {
    if (!stored) return;
    void navigator.clipboard.writeText(stored);
    alert('Contraseña copiada');
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-xs text-brand-gold-light">
        {visible ? stored : '••••••••••'}
      </span>
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="rounded p-1 text-brand-mist hover:bg-white/10"
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
      </button>
      <button
        type="button"
        onClick={copy}
        className="rounded p-1 text-brand-mist hover:bg-white/10"
        aria-label="Copiar contraseña"
      >
        <Copy className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
