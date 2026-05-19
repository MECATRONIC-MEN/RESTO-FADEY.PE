'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  MoreHorizontal,
  Eye,
  CreditCard,
  PauseCircle,
  PlayCircle,
  ExternalLink,
  Wifi,
  Trash2,
} from 'lucide-react';
import type { SaasClient } from '@/lib/domain/types';

interface RestaurantClientActionsProps {
  client: SaasClient;
  onChanged: () => void;
}

export function RestaurantClientActions({ client, onChanged }: RestaurantClientActionsProps) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  async function patchAction(action: 'suspend' | 'reactivate') {
    setBusy(true);
    try {
      const res = await fetch(`/api/clients/${client.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Error');
      onChanged();
      setOpen(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error');
    } finally {
      setBusy(false);
    }
  }

  async function checkHealth() {
    setBusy(true);
    try {
      const res = await fetch(`/api/clients/${client.id}/health`, { method: 'POST' });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Error');
      alert(json.data?.label ?? (json.data?.online ? 'POS conectado' : 'Sin conexión'));
      onChanged();
      setOpen(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error');
    } finally {
      setBusy(false);
    }
  }

  async function removeFromPanel() {
    if (
      !confirm(
        `¿Eliminar "${client.businessName}" solo del panel SaaS?\n\nNo se borrará Render ni la base del POS.`
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/clients/${client.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Error');
      onChanged();
      setOpen(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error');
    } finally {
      setBusy(false);
    }
  }

  async function showDetails() {
    setBusy(true);
    try {
      const res = await fetch(`/api/clients/${client.id}`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Error');
      const c = json.data as SaasClient;
      const lines = [
        `Restaurante: ${c.businessName}`,
        c.ruc ? `RUC: ${c.ruc}` : null,
        `Contacto: ${c.contactName}`,
        `Email: ${c.email}`,
        `Tel: ${c.phone || '—'}`,
        `Plan: ${c.planId}`,
        `Licencia: ${c.licenseStatus}`,
        c.licenseExpiresAt
          ? `Vence: ${new Date(c.licenseExpiresAt).toLocaleDateString('es-PE')}`
          : null,
        c.renderUrl ? `Render: ${c.renderUrl}` : null,
        c.systemVersion ? `Versión POS: ${c.systemVersion}` : null,
        `ID: ${c.id}`,
      ].filter(Boolean);
      alert(lines.join('\n'));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error');
    } finally {
      setBusy(false);
      setOpen(false);
    }
  }

  function copyRenderUrl() {
    if (!client.renderUrl) {
      alert('Sin URL Render configurada');
      return;
    }
    void navigator.clipboard.writeText(client.renderUrl);
    alert('URL copiada al portapapeles');
    setOpen(false);
  }

  const itemClass =
    'flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-brand-mist hover:bg-white/10 disabled:opacity-50';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={busy}
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg p-2 text-brand-mist hover:bg-white/10 disabled:opacity-50"
        aria-label="Acciones"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-1 min-w-[200px] rounded-xl border border-brand-cyan/20 bg-brand-navy py-1 shadow-lg">
          <button type="button" className={itemClass} onClick={showDetails}>
            <Eye className="h-4 w-4 shrink-0" />
            Ver detalles
          </button>
          <Link
            href="/admin/payments"
            className={itemClass}
            onClick={() => setOpen(false)}
          >
            <CreditCard className="h-4 w-4 shrink-0" />
            Ver pagos
          </Link>
          {client.licenseStatus !== 'suspendido' ? (
            <button type="button" className={itemClass} onClick={() => patchAction('suspend')}>
              <PauseCircle className="h-4 w-4 shrink-0" />
              Suspender licencia
            </button>
          ) : (
            <button type="button" className={itemClass} onClick={() => patchAction('reactivate')}>
              <PlayCircle className="h-4 w-4 shrink-0" />
              Reactivar licencia
            </button>
          )}
          <button type="button" className={itemClass} onClick={copyRenderUrl}>
            <ExternalLink className="h-4 w-4 shrink-0" />
            Ver Render URL
          </button>
          <button type="button" className={itemClass} onClick={checkHealth}>
            <Wifi className="h-4 w-4 shrink-0" />
            Ver estado conexión
          </button>
          <button
            type="button"
            className={`${itemClass} text-red-300 hover:bg-red-400/10`}
            onClick={removeFromPanel}
          >
            <Trash2 className="h-4 w-4 shrink-0" />
            Eliminar del panel
          </button>
        </div>
      )}
    </div>
  );
}
