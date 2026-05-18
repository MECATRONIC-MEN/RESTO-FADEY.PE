'use client';

import { BENEFITS } from '@/lib/data';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { motion } from 'framer-motion';

export function Benefits() {
  return (
    <section id="beneficios" className="section-padding relative">
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          badge="Beneficios"
          title="Por qué elegir Resto Fadey"
          highlightLast="Resto Fadey"
          subtitle="Transforma la operación de tu restaurante con tecnología de punta."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 transition-all hover:border-brand-blue/30 hover:shadow-glow"
              >
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-cyan/15 blur-2xl transition-all group-hover:bg-brand-gold/15" />
                <div className="relative">
                  <div className="mb-4 inline-flex rounded-xl bg-brand-green/10 p-3">
                    <Icon className="h-7 w-7 text-brand-green" />
                  </div>
                  <h3 className="font-display text-xl font-semibold">{benefit.title}</h3>
                  <p className="mt-3 text-brand-mist">{benefit.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
