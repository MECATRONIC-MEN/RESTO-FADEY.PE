'use client';

import { useState } from 'react';
import { Copy, KeyRound, Loader2, X } from 'lucide-react';
import type { GeneratePosLinkResult, SaasPlan } from '@/lib/domain/types';
import { ClientPortalCredentialsCard } from './ClientPortalCredentialsCard';

interface GeneratePosLinkModalProps {
  open: boolean;
  plans: SaasPlan[];
  onClose: () => void;
  onSuccess: () => void;
}

export function GeneratePosLinkModal({
  open,
  plans,
  onClose,
  onSuccess,
}: GeneratePosLinkModalProps) {
  const [restaurantName, setRestaurantName] = useState('');
  const [planId, setPlanId] = useState('');
  const [ruc, setRuc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratePosLinkResult | null>(null);

  if (!open) return null;

  function handleClose() {
    setResult(null);
    setError(null);
    setRestaurantName('');
    setPlanId('');
    setRuc('');
    onClose();
  }

  function copy(text: string, label: string) {
    void navigator.clipboard.writeText(text);
    alert(`${label} copiado`);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/licenses/generate-pos-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantName: restaurantName.trim(),
          planId,
          ruc: ruc.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error ?? 'No se pudieron generar las llaves');
      }
      setResult(json.data as GeneratePosLinkResult);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
        aria-label="Cerrar"
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-brand-cyan/25 bg-brand-navy p-6 shadow-glow-cyan">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold text-brand-soft">
              Generar llaves POS Render
            </h2>
            <p className="mt-1 text-sm text-brand-mist">
              Crea CLIENT_ID y clave de licencia para configurar el POS antes de conectarlo.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1 text-brand-mist hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {result ? (
          <div className="space-y-4">
            <p className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">
              {result.message}
            </p>

            <dl className="space-y-2 rounded-lg border border-white/10 bg-white/5 p-4 text-sm">
              <div className="flex items-center justify-between gap-2">
                <dt className="text-brand-slate">CLIENT_ID</dt>
                <dd className="flex items-center gap-2 font-mono text-xs text-brand-cyan">
                  {result.bundle.clientId}
                  <button
                    type="button"
                    onClick={() => copy(result.bundle.clientId, 'CLIENT_ID')}
                    className="rounded p-1 hover:bg-white/10"
                    aria-label="Copiar CLIENT_ID"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-brand-slate">Clave de licencia</dt>
                <dd className="flex items-center gap-2 font-mono text-xs text-brand-cyan">
                  {result.bundle.licenseKey}
                  <button
                    type="button"
                    onClick={() => copy(result.bundle.licenseKey, 'Clave')}
                    className="rounded p-1 hover:bg-white/10"
                    aria-label="Copiar clave"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </dd>
              </div>
            </dl>

            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-xs font-medium uppercase tracking-wider text-brand-slate">
                  Variables Render (.env)
                </p>
                <button
                  type="button"
                  onClick={() => copy(result.bundle.envTemplate, 'Variables Render')}
                  className="flex items-center gap-1 text-xs text-brand-cyan hover:underline"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copiar todo
                </button>
              </div>
              <pre className="max-h-48 overflow-auto rounded-lg border border-white/10 bg-brand-deep/80 p-3 font-mono text-[10px] leading-relaxed text-brand-mist">
                {result.bundle.envTemplate}
              </pre>
            </div>

            {result.portalAccess && (
              <ClientPortalCredentialsCard
                credentials={result.portalAccess}
                title="Acceso al panel del cliente (creado automáticamente)"
              />
            )}

            <button type="button" onClick={handleClose} className="btn-primary w-full py-2.5 text-sm">
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-brand-mist">
                Nombre del restaurante
              </label>
              <input
                required
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="Pollería Kuelap"
                className="w-full rounded-lg border border-brand-cyan/20 bg-white/10 px-3 py-2.5 text-sm text-brand-soft placeholder:text-brand-slate focus:border-brand-cyan/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-brand-mist">Plan</label>
              <select
                required
                value={planId}
                onChange={(e) => setPlanId(e.target.value)}
                className="w-full rounded-lg border border-brand-cyan/20 bg-white/10 px-3 py-2.5 text-sm text-brand-soft focus:border-brand-cyan/50 focus:outline-none"
              >
                <option value="">Seleccionar plan…</option>
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-brand-mist">RUC (opcional)</label>
              <input
                value={ruc}
                onChange={(e) => setRuc(e.target.value)}
                placeholder="20123456789"
                className="w-full rounded-lg border border-brand-cyan/20 bg-white/10 px-3 py-2.5 text-sm text-brand-soft placeholder:text-brand-slate focus:border-brand-cyan/50 focus:outline-none"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex w-full items-center justify-center gap-2 py-2.5 text-sm disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
              {loading ? 'Generando…' : 'Generar llaves'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
