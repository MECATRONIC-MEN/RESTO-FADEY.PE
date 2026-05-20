'use client';

import { motion } from 'framer-motion';
import { ModuleExplorer } from '@/components/landing/ModuleExplorer';
import { SectionHeader } from '@/components/ui/SectionHeader';

export function ModuleExplorerSection() {
  return (
    <section id="modulos" className="section-padding relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-brand-blue/10 blur-[120px]" />
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-brand-gold/8 blur-[100px]" />
      </div>
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          badge="Plataforma modular"
          title="Un ecosistema, todos los módulos"
          highlightLast="módulos"
          subtitle="Explora cada área de tu restaurante. Haz clic en un módulo y el panel cambia al instante — sin recargar la página."
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mt-12"
        >
          <ModuleExplorer />
        </motion.div>
      </div>
    </section>
  );
}
