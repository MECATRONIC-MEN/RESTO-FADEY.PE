'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { TESTIMONIALS_PREMIUM, type TestimonialPremium } from '@/lib/landing-data';
import { SectionBackdrop } from '@/components/landing/SectionBackdrop';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { VisitorRatingModal } from '@/components/landing/VisitorRatingModal';

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [approvedFromApi, setApprovedFromApi] = useState<TestimonialPremium[]>([]);
  const [pendingPreviews, setPendingPreviews] = useState<TestimonialPremium[]>([]);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);

  const items = useMemo(
    () => [...TESTIMONIALS_PREMIUM, ...approvedFromApi, ...pendingPreviews],
    [approvedFromApi, pendingPreviews]
  );

  const total = items.length;

  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/ratings');
        const json = await res.json();
        if (!cancelled && json.success && Array.isArray(json.data)) {
          setApprovedFromApi(json.data as TestimonialPremium[]);
        }
      } catch {
        /* sin API o sin tabla: solo calificaciones estáticas */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (index >= total) setIndex(0);
  }, [index, total]);

  useEffect(() => {
    if (total === 0) return;
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next, total]);

  const t = items[index];

  function handleRatingSubmitted(preview: TestimonialPremium) {
    setPendingPreviews((prev) => {
      const exists = prev.some((p) => p.name === preview.name && p.comment === preview.comment);
      if (exists) return prev;
      return [preview, ...prev];
    });
  }

  if (!t) return null;

  return (
    <section id="testimonios" className="section-padding relative overflow-hidden">
      <SectionBackdrop variant="testimonials" />
      <div className="section-shell-content mx-auto max-w-4xl">
        <SectionHeader
          badge="Calificaciones"
          title="Restaurantes que confían en nosotros"
          subtitle="Resultados reales de negocios gastronómicos en Perú. También puedes dejar la tuya."
        />

        <div className="relative mt-14">
          <AnimatePresence mode="wait">
            <motion.article
              key={`${t.name}-${t.comment.slice(0, 24)}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="relative overflow-hidden rounded-2xl border border-brand-gold/25 bg-gradient-to-br from-white/10 to-brand-navy/60 p-8 shadow-glow-gold backdrop-blur-xl sm:p-10"
            >
              <Quote className="absolute right-6 top-6 h-10 w-10 text-brand-cyan/20" />
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-brand-cyan/30 bg-brand-cyan/10 font-display text-xl font-bold text-brand-cyan">
                  {t.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-brand-gold text-brand-gold" />
                    ))}
                  </div>
                  <p className="mt-4 text-lg leading-relaxed text-brand-soft sm:text-xl">
                    &ldquo;{t.comment}&rdquo;
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <div>
                      <p className="font-semibold text-brand-soft">{t.name}</p>
                      <p className="text-sm text-brand-green">{t.restaurant}</p>
                      <p className="text-xs text-brand-slate">{t.role}</p>
                    </div>
                    <span className="badge-premium">{t.result}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setRatingModalOpen(true)}
                className="absolute bottom-4 right-4 rounded-lg border border-brand-gold/35 bg-brand-gold/10 px-3 py-1.5 text-xs font-semibold text-brand-gold transition-colors hover:border-brand-gold/60 hover:bg-brand-gold/20 sm:text-sm"
              >
                Deja tu calificación
              </button>
            </motion.article>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prev}
              className="rounded-full border border-white/15 bg-white/5 p-2 text-brand-mist transition-colors hover:border-brand-cyan/40 hover:text-brand-cyan"
              aria-label="Calificación anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {items.map((item, i) => (
                <button
                  key={`${item.name}-${i}`}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? 'w-8 bg-brand-cyan' : 'w-2 bg-white/20'
                  }`}
                  aria-label={`Calificación ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              className="rounded-full border border-white/15 bg-white/5 p-2 text-brand-mist transition-colors hover:border-brand-cyan/40 hover:text-brand-cyan"
              aria-label="Siguiente calificación"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <VisitorRatingModal
        open={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
        onSubmitted={handleRatingSubmitted}
      />
    </section>
  );
}
