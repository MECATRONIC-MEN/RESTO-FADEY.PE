'use client';

import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { AnimatedBorderCard } from '@/components/landing/AnimatedBorderCard';
import { AnimatedCounter } from '@/components/landing/AnimatedCounter';
import { LANDING_METRICS } from '@/lib/landing-data';
import { SectionBackdrop } from '@/components/landing/SectionBackdrop';
import { SectionHeader } from '@/components/ui/SectionHeader';

export function Metrics() {
  return (
    <section className="section-padding relative overflow-x-hidden">
      <SectionBackdrop variant="metrics" />
      <div className="section-shell-content mx-auto max-w-7xl">
        <SectionHeader
          badge="Impacto real"
          title="Resultados que escalan con tu operación"
          subtitle="Métricas de restaurantes que ya centralizaron ventas, cocina, inventario y finanzas en una sola plataforma."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {LANDING_METRICS.map((metric, index) => (
            <AnimatedBorderCard
              key={metric.id}
              variant="white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -4 }}
              style={{ '--liquid-delay': `${index * 0.55}s` } as CSSProperties}
              className="h-full"
              innerClassName="p-6 text-center"
            >
              <p className="font-display text-3xl font-bold gradient-text sm:text-4xl">
                <AnimatedCounter
                  value={metric.value}
                  suffix={metric.suffix}
                  prefix={metric.prefix}
                  decimals={metric.id === 'orders' ? 1 : 0}
                />
              </p>
              <p className="mt-2 text-sm text-brand-mist">{metric.label}</p>
            </AnimatedBorderCard>
          ))}
        </div>
      </div>
    </section>
  );
}
