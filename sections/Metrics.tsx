'use client';

import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/landing/AnimatedCounter';
import { LANDING_METRICS } from '@/lib/landing-data';
import { SectionHeader } from '@/components/ui/SectionHeader';

export function Metrics() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(59,201,244,0.08),transparent)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          badge="Impacto real"
          title="Resultados que escalan con tu operación"
          subtitle="Métricas de restaurantes que ya centralizaron ventas, cocina, inventario y finanzas en una sola plataforma."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {LANDING_METRICS.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -4, borderColor: 'rgb(77, 183, 215)' }}
              className="glow-border rounded-2xl border border-white/15 bg-white/[0.06] p-6 text-center backdrop-blur-md transition-shadow hover:shadow-glow-cyan"
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
