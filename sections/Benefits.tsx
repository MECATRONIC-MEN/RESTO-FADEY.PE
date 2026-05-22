'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EcosystemCards } from '@/components/landing/EcosystemCards';
import { SectionBackdrop } from '@/components/landing/SectionBackdrop';

export function Benefits() {
  return (
    <section id="beneficios" className="section-padding relative scroll-mt-24 overflow-hidden">
      <SectionBackdrop variant="benefits" />
      <div className="section-shell-content mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader
            badge="Ecosistema completo"
            title="¿Por qué las empresas gastronómicas eligen Resto-FADEY?"
            highlightLast="Resto-FADEY?"
            subtitle="Centraliza operaciones, automatiza procesos y obtén control total de tu restaurante desde una sola plataforma inteligente."
          />
        </motion.div>

        <EcosystemCards />
      </div>
    </section>
  );
}
