'use client';

import { Check, Layers, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { PLANS } from '@/lib/data';
import { PLAN_DISPLAY_NAMES } from '@/lib/landing-data';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function Pricing() {
  return (
    <section id="planes" className="section-padding relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(59,201,244,0.08),transparent)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          badge="Planes"
          title="Inversión clara, valor premium"
          subtitle="Comparativa moderna para escalar: empieza con lo esencial y crece hasta la suite empresarial con IA."
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-6 w-full max-w-7xl overflow-x-auto text-center text-[11px] whitespace-nowrap text-brand-mist sm:text-xs md:text-sm [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <span className="text-brand-cyan">Básico</span> → operación diaria ·{' '}
          <span className="text-brand-cyan">Profesional</span> → inventario y facturación ·{' '}
          <span className="text-brand-gold">Empresarial</span> → inventario inteligente, requerimientos y asistencia administrativa total
        </motion.p>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {PLANS.map((plan, index) => (
            <motion.article
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: plan.highlighted ? -6 : -4 }}
              className={cn(
                'relative flex flex-col rounded-2xl border p-8 transition-all duration-300',
                plan.highlighted
                  ? 'z-10 border-brand-gold/45 bg-premium-gradient shadow-glow-gold lg:scale-[1.03]'
                  : 'glass-card border-white/15 hover:border-brand-cyan/30 hover:shadow-glow-cyan'
              )}
            >
              {plan.badge && (
                <span className="badge-premium absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  {plan.badge}
                </span>
              )}

              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-2xl font-bold text-brand-soft">
                  {PLAN_DISPLAY_NAMES[plan.name] ?? plan.name}
                </h3>
                {plan.highlighted && (
                  <Sparkles className="h-5 w-5 shrink-0 text-brand-gold-light" aria-hidden />
                )}
              </div>

              <div className="mt-4">
                <div className="flex flex-wrap items-baseline gap-1">
                  <span
                    className={cn(
                      'font-display text-4xl font-bold',
                      plan.highlighted ? 'kpi-gold' : 'gradient-text'
                    )}
                  >
                    {plan.price}
                  </span>
                  <span className="text-brand-mist">{plan.period}</span>
                </div>
                {plan.semestralNote && (
                  <p
                    className={cn(
                      'mt-2 inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium',
                      plan.highlighted
                        ? 'border-brand-gold/35 bg-brand-gold/10 text-brand-gold-light'
                        : 'border-white/15 bg-white/5 text-brand-mist'
                    )}
                  >
                    {plan.semestralNote}
                  </p>
                )}
              </div>

              <p
                className={cn(
                  'mt-3 text-sm font-medium',
                  plan.highlighted ? 'text-brand-gold-light' : 'text-brand-cyan'
                )}
              >
                {plan.tagline}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-brand-mist">{plan.description}</p>

              {plan.includesFrom && (
                <div className="mt-6 flex items-center gap-2 rounded-lg border border-brand-cyan/20 bg-brand-cyan/5 px-3 py-2 text-xs font-medium text-brand-cyan">
                  <Layers className="h-4 w-4 shrink-0" />
                  Incluye todo el Plan {plan.includesFrom}, más:
                </div>
              )}

              <div className="mt-6 flex-1">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-slate">
                  {plan.includesFrom ? 'Módulos adicionales' : 'Módulos incluidos'}
                </p>
                <ul className="space-y-3">
                  {plan.modules.map((module) => (
                    <li key={module} className="flex items-start gap-3 text-sm">
                      <Check
                        className={cn(
                          'mt-0.5 h-5 w-5 shrink-0',
                          plan.highlighted ? 'text-brand-gold-light' : 'text-brand-cyan'
                        )}
                      />
                      <span className="leading-snug text-brand-soft/95">{module}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 border-t border-white/10 pt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-slate">
                  También incluye
                </p>
                <ul className="space-y-2">
                  {plan.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-xs text-brand-mist">
                      <span
                        className={cn(
                          'mt-1.5 h-1 w-1 shrink-0 rounded-full',
                          plan.highlighted ? 'bg-brand-gold' : 'bg-brand-cyan'
                        )}
                      />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                href="/demo"
                variant={plan.highlighted ? 'premium' : 'secondary'}
                className="mt-8 w-full"
              >
                Empezar ahora
              </Button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
