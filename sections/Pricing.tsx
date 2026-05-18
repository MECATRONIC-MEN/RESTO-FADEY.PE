'use client';

import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { PLANS } from '@/lib/data';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function Pricing() {
  return (
    <section id="planes" className="section-padding relative">
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          badge="Planes"
          title="Precios transparentes"
          subtitle="Elige el plan perfecto para tu restaurante. Sin costos ocultos."
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {PLANS.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'relative rounded-2xl border p-8 transition-all duration-300',
                plan.highlighted
                  ? 'z-10 scale-105 border-brand-gold/45 bg-premium-gradient shadow-glow-gold glow-border'
                  : 'glass-card border-white/15'
              )}
            >
              {plan.badge && (
                <span className="badge-premium absolute -top-3 left-1/2 -translate-x-1/2">
                  {plan.badge}
                </span>
              )}
              <h3 className="font-display text-2xl font-bold text-brand-soft">{plan.name}</h3>
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
              <p className="mt-4 text-sm text-brand-mist">{plan.description}</p>
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check
                      className={cn(
                        'mt-0.5 h-5 w-5 shrink-0',
                        plan.highlighted ? 'text-brand-gold-light' : 'text-brand-cyan'
                      )}
                    />
                    <span className="text-brand-soft/90">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                href="/demo"
                variant={plan.highlighted ? 'premium' : 'secondary'}
                className="mt-8 w-full"
              >
                Empezar ahora
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
