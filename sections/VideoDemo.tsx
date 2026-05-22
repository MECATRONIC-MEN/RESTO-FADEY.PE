'use client';

import { motion } from 'framer-motion';
import { Play, Monitor } from 'lucide-react';
import Link from 'next/link';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { SectionBackdrop } from '@/components/landing/SectionBackdrop';

export function VideoDemo() {
  return (
    <section className="section-padding relative overflow-hidden">
      <SectionBackdrop variant="video" />
      <div className="section-shell-content mx-auto max-w-5xl">
        <SectionHeader
          badge="Demo en acción"
          title="Mira la plataforma en funcionamiento"
          subtitle="POS, delivery, cocina y reportes en un flujo real diseñado para restaurantes de alto volumen."
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mt-12 overflow-hidden rounded-2xl border border-white/20 shadow-2xl glow-border"
        >
          <div className="relative aspect-video w-full bg-gradient-to-br from-brand-navy via-brand-deep to-brand-navy">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-brand-cyan/40 bg-brand-cyan/10 shadow-glow-cyan">
                <Monitor className="h-10 w-10 text-brand-cyan" />
              </div>
              <p className="max-w-md text-sm text-brand-mist">
                Solicita una demo en vivo y te mostramos POS, cocina, inventario y reportes con tu
                operación real.
              </p>
              <Link
                href="/demo"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Play className="h-5 w-5" />
                Ver demo personalizada
              </Link>
            </div>
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage: `linear-gradient(rgba(59,201,244,0.15) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(59,201,244,0.15) 1px, transparent 1px)`,
                backgroundSize: '32px 32px',
              }}
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 flex justify-center"
        >
          <Button href="/#modulos" variant="secondary">
            Ver todos los módulos
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
