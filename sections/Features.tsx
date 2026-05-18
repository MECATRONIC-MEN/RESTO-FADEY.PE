'use client';

import { FEATURES } from '@/lib/data';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AnimatedCard } from '@/components/ui/AnimatedCard';

export function Features() {
  return (
    <section id="funciones" className="section-padding relative">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          badge="Funciones"
          title="Todo lo que tu restaurante necesita"
          highlightLast="necesita"
          subtitle="Herramientas potentes diseñadas para optimizar cada aspecto de tu operación."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <AnimatedCard key={feature.title} delay={index * 0.05} className="group">
                <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-brand-cyan/20 to-brand-blue/15 p-3 transition-all group-hover:shadow-glow-cyan">
                  <Icon className="h-6 w-6 text-brand-cyan" />
                </div>
                <h3 className="font-display text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-brand-mist">{feature.description}</p>
              </AnimatedCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
