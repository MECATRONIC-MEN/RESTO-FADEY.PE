'use client';

import { motion } from 'framer-motion';
import { ModuleExplorer } from '@/components/landing/ModuleExplorer';
import { SectionBackdrop } from '@/components/landing/SectionBackdrop';
import { SectionHeader } from '@/components/ui/SectionHeader';

export function ModuleExplorerSection() {
  return (
    <section id="modulos" className="section-padding relative scroll-mt-24 overflow-hidden">
      <SectionBackdrop variant="modules" />
      <div className="section-shell-content mx-auto max-w-7xl">
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
