'use client';

import { useState } from 'react';
import { Loader2, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { TestimonialPremium } from '@/lib/landing-data';

export interface VisitorRatingFormValues {
  name: string;
  restaurant: string;
  role: string;
  comment: string;
  result: string;
  rating: number;
}

interface VisitorRatingModalProps {
  open: boolean;
  onClose: () => void;
  onSubmitted: (preview: TestimonialPremium) => void;
}

const EMPTY: VisitorRatingFormValues = {
  name: '',
  restaurant: '',
  role: '',
  comment: '',
  result: '',
  rating: 5,
};

export function VisitorRatingModal({ open, onClose, onSubmitted }: VisitorRatingModalProps) {
  const [form, setForm] = useState<VisitorRatingFormValues>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-brand-soft placeholder:text-brand-slate focus:border-brand-cyan/50 focus:outline-none focus:ring-1 focus:ring-brand-cyan/30';

  function handleClose() {
    setForm(EMPTY);
    setError(null);
    setSuccess(false);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          restaurant: form.restaurant,
          role: form.role,
          comment: form.comment,
          result: form.result || undefined,
          rating: form.rating,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? 'No se pudo enviar');
      setSuccess(true);
      onSubmitted(json.data.preview as TestimonialPremium);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar tu calificación');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        onClick={handleClose}
        aria-label="Cerrar"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rating-modal-title"
        className="relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-brand-gold/25 bg-brand-navy p-6 shadow-glow-gold"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 id="rating-modal-title" className="font-display text-lg font-semibold text-brand-soft">
              Deja tu calificación
            </h2>
            <p className="mt-1 text-sm text-brand-mist">
              Cuéntanos tu experiencia con Resto Fadey. Revisamos cada mensaje antes de publicarlo.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1 text-brand-mist hover:bg-white/10"
            aria-label="Cerrar formulario"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          <div className="space-y-4 text-center">
            <p className="rounded-xl border border-brand-cyan/30 bg-brand-cyan/10 px-4 py-3 text-sm text-brand-soft">
              ¡Gracias! Recibimos tu calificación. Aparecerá en esta sección una vez aprobada.
            </p>
            <Button type="button" variant="premium" className="w-full" onClick={handleClose}>
              Cerrar
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="mb-2 block text-sm font-medium text-brand-mist">
                Calificación (estrellas) *
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, rating: value }))}
                    className="rounded p-1 transition-transform hover:scale-110"
                    aria-label={`${value} estrellas`}
                  >
                    <Star
                      className={`h-8 w-8 ${
                        value <= form.rating
                          ? 'fill-brand-gold text-brand-gold'
                          : 'text-white/25'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="rating-name" className="mb-2 block text-sm font-medium text-brand-mist">
                Nombre completo *
              </label>
              <input
                id="rating-name"
                required
                className={inputClass}
                placeholder="Ej. Carlos Mendoza"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div>
              <label
                htmlFor="rating-restaurant"
                className="mb-2 block text-sm font-medium text-brand-mist"
              >
                Restaurante / negocio *
              </label>
              <input
                id="rating-restaurant"
                required
                className={inputClass}
                placeholder="Ej. La Casona Criolla"
                value={form.restaurant}
                onChange={(e) => setForm((f) => ({ ...f, restaurant: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="rating-role" className="mb-2 block text-sm font-medium text-brand-mist">
                Cargo *
              </label>
              <input
                id="rating-role"
                required
                className={inputClass}
                placeholder="Ej. Dueño, Gerente, Administración"
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              />
            </div>

            <div>
              <label
                htmlFor="rating-comment"
                className="mb-2 block text-sm font-medium text-brand-mist"
              >
                Comentario *
              </label>
              <textarea
                id="rating-comment"
                required
                rows={4}
                className={inputClass}
                placeholder="Describe tu experiencia con la plataforma"
                value={form.comment}
                onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="rating-result" className="mb-2 block text-sm font-medium text-brand-mist">
                Resultado destacado (opcional)
              </label>
              <input
                id="rating-result"
                className={inputClass}
                placeholder="Ej. +30% ventas, SUNAT 100%"
                value={form.result}
                onChange={(e) => setForm((f) => ({ ...f, result: e.target.value }))}
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            )}

            <Button type="submit" variant="premium" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando…
                </>
              ) : (
                'Enviar calificación'
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
