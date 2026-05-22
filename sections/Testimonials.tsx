'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { TESTIMONIALS_PREMIUM } from '@/lib/landing-data';
import { SectionBackdrop } from '@/components/landing/SectionBackdrop';
import { SectionHeader } from '@/components/ui/SectionHeader';

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const total = TESTIMONIALS_PREMIUM.length;

  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);

  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next]);

  const t = TESTIMONIALS_PREMIUM[index];

  return (
    <section id="testimonios" className="section-padding relative overflow-hidden">
      <SectionBackdrop variant="testimonials" />
      <div className="section-shell-content mx-auto max-w-4xl">
        <SectionHeader
          badge="Testimonios"
          title="Restaurantes que confían en nosotros"
          subtitle="Resultados reales de negocios gastronómicos en Perú."
        />

        <div className="relative mt-14">
          <AnimatePresence mode="wait">
            <motion.article
              key={t.name}
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
            </motion.article>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prev}
              className="rounded-full border border-white/15 bg-white/5 p-2 text-brand-mist transition-colors hover:border-brand-cyan/40 hover:text-brand-cyan"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS_PREMIUM.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? 'w-8 bg-brand-cyan' : 'w-2 bg-white/20'
                  }`}
                  aria-label={`Testimonio ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              className="rounded-full border border-white/15 bg-white/5 p-2 text-brand-mist transition-colors hover:border-brand-cyan/40 hover:text-brand-cyan"
              aria-label="Siguiente"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
