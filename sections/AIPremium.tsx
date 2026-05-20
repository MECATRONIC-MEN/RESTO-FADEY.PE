'use client';

import { motion } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';
import { AI_FEATURES } from '@/lib/landing-data';
import { SectionHeader } from '@/components/ui/SectionHeader';

export function AIPremium() {
  return (
    <section id="ia" className="section-padding relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_70%_30%,rgba(212,175,55,0.12),transparent_55%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          badge="Inteligencia empresarial"
          title="IA que anticipa tu operación"
          highlightLast="operación"
          subtitle="Predicción, alertas y recomendaciones para vender más, desperdiciar menos y decidir con datos."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-brand-gold/30 bg-gradient-to-br from-brand-gold/10 via-brand-navy/80 to-brand-cyan/10 p-6 shadow-glow-gold sm:p-8"
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-gold/20 blur-3xl" />
            <Brain className="relative h-12 w-12 shrink-0 text-brand-gold-light" />
            <h3 className="relative mt-4 font-display text-2xl font-bold text-brand-soft">
              Motor predictivo Resto Fadey
            </h3>
            <p className="relative mt-3 text-sm leading-relaxed text-brand-mist">
              Analiza ventas históricas, estacionalidad y comportamiento del local para sugerir compras,
              turnos y promociones en el momento correcto.
            </p>
            <div className="relative mt-auto flex flex-col justify-end gap-3 pt-6">
              {['Predicción de ventas por turno', 'Alertas de stock y merma', 'Horarios pico automáticos'].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-brand-soft"
                  >
                    <Sparkles className="h-4 w-4 shrink-0 text-brand-gold-light" />
                    {item}
                  </div>
                )
              )}
            </div>
          </motion.div>

          <div className="grid h-full auto-rows-fr gap-4 sm:grid-cols-2">
            {AI_FEATURES.map((feature, i) => (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ scale: 1.02 }}
                className="flex h-full min-h-[7.5rem] flex-col rounded-xl border border-brand-cyan/20 bg-white/5 p-5 backdrop-blur-sm transition-shadow hover:border-brand-cyan/40 hover:shadow-glow-cyan"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-cyan">
                  {feature.metric}
                </p>
                <h4 className="mt-2 font-display text-lg font-semibold text-brand-soft">
                  {feature.title}
                </h4>
                <p className="mt-1 flex-1 text-sm text-brand-mist">{feature.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
