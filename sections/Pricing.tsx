'use client';

import { Check, Layers, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { PLANS } from '@/lib/data';
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
          title="Precios transparentes"
          subtitle="Cada plan incluye módulos claros y escalables. Empieza con lo esencial y crece hasta la suite completa con inteligencia de negocio."
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-6 max-w-3xl text-center text-sm text-brand-mist"
        >
          <span className="text-brand-cyan">Básico</span> → operación diaria ·{' '}
          <span className="text-brand-cyan">Pro</span> → inventario, pedidos y facturación ·{' '}
          <span className="text-brand-gold">Premium</span> → indicadores, personal y finanzas
          avanzadas
        </motion.p>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {PLANS.map((plan, index) => (
            <motion.article
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'relative flex flex-col rounded-2xl border p-8 transition-all duration-300',
                plan.highlighted
                  ? 'z-10 scale-[1.02] border-brand-gold/45 bg-premium-gradient shadow-glow-gold lg:scale-105'
                  : 'glass-card border-white/15 hover:border-brand-cyan/25 hover:shadow-glow-cyan'
              )}
            >
              {plan.badge && (
                <span className="badge-premium absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  {plan.badge}
                </span>
              )}

              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-2xl font-bold text-brand-soft">{plan.name}</h3>
                {plan.highlighted && (
                  <Sparkles className="h-5 w-5 shrink-0 text-brand-gold-light" aria-hidden />
                )}
              </div>

              <div className="mt-4 flex items-baseline gap-1">
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
