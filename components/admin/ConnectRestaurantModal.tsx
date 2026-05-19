'use client';

import { useState } from 'react';
import { Link2, X, Loader2 } from 'lucide-react';

interface ConnectRestaurantModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ConnectRestaurantModal({ open, onClose, onSuccess }: ConnectRestaurantModalProps) {
  const [renderUrl, setRenderUrl] = useState('');
  const [clientId, setClientId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!open) return null;

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/clients/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ renderUrl: renderUrl.trim(), clientId: clientId.trim() }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error ?? 'No se pudo conectar');
      }
      setSuccess(json.data?.message ?? 'Restaurante conectado');
      setRenderUrl('');
      setClientId('');
      onSuccess();
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Cerrar"
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-brand-cyan/25 bg-brand-navy p-6 shadow-glow-cyan">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold text-brand-soft">Conectar restaurante</h2>
            <p className="mt-1 text-sm text-brand-mist">
              Solo URL Render y CLIENT_ID. El resto se obtiene automáticamente del POS.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-brand-mist hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleConnect} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-brand-mist">URL Render POS</label>
            <input
              required
              type="url"
              placeholder="https://tu-pos.onrender.com"
              value={renderUrl}
              onChange={(e) => setRenderUrl(e.target.value)}
              className="w-full rounded-lg border border-brand-cyan/20 bg-white/10 px-3 py-2.5 text-sm text-brand-soft placeholder:text-brand-slate focus:border-brand-cyan/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-brand-mist">CLIENT_ID (UUID)</label>
            <input
              required
              type="text"
              placeholder="b0000001-0000-4000-8000-000000000001"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full rounded-lg border border-brand-cyan/20 bg-white/10 px-3 py-2.5 font-mono text-xs text-brand-soft placeholder:text-brand-slate focus:border-brand-cyan/50 focus:outline-none"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex w-full items-center justify-center gap-2 py-2.5 text-sm disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
            {loading ? 'Conectando…' : 'Conectar restaurante'}
          </button>
        </form>
      </div>
    </div>
  );
}
