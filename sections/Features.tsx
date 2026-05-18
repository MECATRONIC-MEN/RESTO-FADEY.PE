'use client';

import { motion } from 'framer-motion';
import { FEATURES } from '@/lib/data';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  FeaturePremiumCard,
  containerVariants,
} from '@/components/landing/FeaturePremiumCard';

export function Features() {
  return (
    <section id="funciones" className="section-padding relative overflow-hidden">
      {/* Fondo tecnológico — solo en esta sección */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <motion.div
          className="absolute left-1/2 top-0 h-[480px] w-[min(100%,900px)] -translate-x-1/2 rounded-full bg-brand-cyan/10 blur-[120px]"
          animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(59,201,244,0.12),transparent_65%)]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(59,201,244,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,201,244,0.8) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          badge="Ecosistema completo"
          title="Todo lo que tu restaurante necesita"
          highlightLast="necesita"
          subtitle="Más que un POS básico: operación, inventario, finanzas e inteligencia en una plataforma premium diseñada para escalar tu restaurante."
        />

        <motion.div
          className="mt-6 flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {['Operación', 'Inventario', 'Finanzas', 'Análisis'].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-brand-cyan/20 bg-brand-cyan/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-brand-cyan"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        <motion.div
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
        >
          {FEATURES.map((feature, index) => (
            <FeaturePremiumCard key={feature.title} feature={feature} index={index} />
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mx-auto mt-12 max-w-2xl text-center text-sm text-brand-slate"
        >
          <span className="text-brand-gold">+21 módulos</span> integrados · Actualizaciones
          continuas · Diseñado para restaurantes que exigen más que un sistema básico
        </motion.p>
      </div>
    </section>
  );
}
