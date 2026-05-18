'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Play, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { HeroProductShowcase } from '@/components/HeroProductShowcase';
import { HERO_SLIDES } from '@/lib/data';
import { getWhatsAppUrl } from '@/lib/utils';

export function Hero() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="inicio"
      className="relative w-full max-w-full overflow-hidden pt-[4.5rem] pb-10 sm:pt-24 sm:pb-14 lg:min-h-[min(100vh,920px)] lg:pt-24 lg:pb-16"
    >
      <div className="relative mx-auto w-full min-w-0 max-w-[1600px] px-4 sm:px-6 lg:px-10 xl:px-14">
        <div className="grid w-full min-w-0 grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)] lg:gap-8 xl:gap-12">
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full min-w-0 max-w-full"
          >
            <p className="mb-3 max-w-full text-xs font-semibold uppercase leading-snug tracking-wide text-brand-gold-light sm:mb-4 sm:text-sm sm:tracking-[0.12em]">
              <span className="block sm:inline">¡ELEVA EL NIVEL DE</span>{' '}
              <span className="block sm:inline">TU NEGOCIO!</span>
            </p>
            <h1 className="max-w-full font-display text-[clamp(1.65rem,6.5vw,3.75rem)] font-bold leading-[1.15] tracking-tight text-white">
              <span className="block">EL SISTEMA</span>
              <span className="block">NÚMERO UNO</span>
              <span className="mt-0.5 block">PARA RESTAURANTES</span>
            </h1>

            <p className="mt-4 max-w-full text-base leading-relaxed text-brand-mist sm:mt-5 sm:text-lg lg:max-w-xl">
              Tecnología que potencia la gestión de tu restaurante. Ventas, cocina, delivery y
              control total desde una sola plataforma.
            </p>

            <div className="mt-6 flex w-full min-w-0 flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              <Button href="/demo" variant="primary" className="w-full justify-center sm:w-auto">
                <Play size={18} />
                Solicitar Demo
              </Button>
              <Button href="#planes" variant="secondary" className="w-full justify-center sm:w-auto">
                Ver Planes
              </Button>
              <Button
                href={getWhatsAppUrl()}
                variant="green"
                external
                className="w-full justify-center sm:w-auto"
              >
                <MessageCircle size={18} />
                WhatsApp
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative w-full min-w-0 max-w-full lg:-mr-2 lg:-mt-2 xl:-mr-4"
          >
            <HeroProductShowcase slides={HERO_SLIDES} />
          </motion.div>
        </div>
      </div>
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#051222] to-transparent"
        aria-hidden
      />
    </section>
  );
}
