'use client';

import { useEffect, useState } from 'react';
import { Calendar, Infinity, X } from 'lucide-react';
import type { License } from '@/lib/domain/types';
import { toDateInputValue } from '@/lib/utils/license-expiry';

interface LicenseExpirationModalProps {
  license: License | null;
  clientLabel: string;
  onClose: () => void;
  onSaved: () => void;
}

export function LicenseExpirationModal({
  license,
  clientLabel,
  onClose,
  onSaved,
}: LicenseExpirationModalProps) {
  const [neverExpires, setNeverExpires] = useState(false);
  const [expiresAt, setExpiresAt] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!license) return;
    setNeverExpires(license.neverExpires);
    setExpiresAt(toDateInputValue(license.expiresAt));
    setError(null);
  }, [license]);

  if (!license) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/licenses/${license!.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          neverExpires,
          expiresAt: neverExpires ? null : expiresAt,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error ?? 'No se pudo guardar');
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-deep/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-brand-panel p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-brand-slate">Vencimiento</p>
            <h3 className="font-display text-xl font-bold text-brand-soft">{clientLabel}</h3>
            <p className="mt-1 font-mono text-xs text-brand-cyan">{license.licenseKey}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-brand-mist hover:bg-white/10"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <input
              type="radio"
              name="expiry-mode"
              checked={!neverExpires}
              onChange={() => setNeverExpires(false)}
              className="mt-1"
            />
            <div className="flex-1">
              <span className="flex items-center gap-2 text-sm font-medium text-brand-soft">
                <Calendar className="h-4 w-4 text-brand-cyan" />
                Con fecha de vencimiento
              </span>
              {!neverExpires && (
                <input
                  type="date"
                  required
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-brand-deep px-3 py-2 text-sm text-brand-soft"
                />
              )}
            </div>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <input
              type="radio"
              name="expiry-mode"
              checked={neverExpires}
              onChange={() => setNeverExpires(true)}
              className="mt-1"
            />
            <div>
              <span className="flex items-center gap-2 text-sm font-medium text-brand-soft">
                <Infinity className="h-4 w-4 text-brand-cyan" />
                Sin vencimiento (licencia permanente)
              </span>
              <p className="mt-1 text-xs text-brand-mist">
                No se extenderá la fecha al aprobar pagos; la licencia queda activa sin límite.
              </p>
            </div>
          </label>

          {error && <p className="text-sm text-red-300">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary px-4 py-2 text-sm">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="btn-primary px-4 py-2 text-sm">
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
