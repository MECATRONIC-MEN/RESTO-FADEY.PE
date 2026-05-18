'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Play, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { HeroProductShowcase } from '@/components/HeroProductShowcase';
import { HERO_SLIDES } from '@/lib/data';
import { getWhatsAppUrl } from '@/lib/utils';

function HeroCtaButtons({ className }: { className?: string }) {
  return (
    <div className={className}>
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
  );
}

export function Hero() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="inicio"
      className="relative w-full max-w-full overflow-hidden pb-10 pt-[max(5.75rem,calc(env(safe-area-inset-top,0px)+4.75rem))] sm:pb-14 sm:pt-28 lg:min-h-[min(100vh,920px)] lg:pb-16 lg:pt-24"
    >
      <div className="relative mx-auto w-full min-w-0 max-w-[1600px] px-4 sm:px-6 lg:px-10 xl:px-14">
        <div className="flex w-full min-w-0 flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)] lg:items-center lg:gap-8 xl:gap-12">
          {/* Texto */}
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="order-1 w-full min-w-0 max-w-full"
          >
            <p className="mb-4 inline-flex max-w-full rounded-full border border-brand-gold/45 bg-brand-gold/15 px-3 py-1.5 text-[11px] font-semibold uppercase leading-snug tracking-wide text-brand-gold-light shadow-glow-gold sm:mb-5 sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.1em]">
              ¡ELEVA EL NIVEL DE TU NEGOCIO!
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

            <HeroCtaButtons className="mt-8 hidden w-full min-w-0 flex-col gap-3 lg:flex lg:flex-row lg:flex-wrap" />
          </motion.div>

          {/* Imagen — antes que los botones en móvil */}
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="order-2 relative w-full min-w-0 max-w-full lg:-mr-2 lg:-mt-2 xl:-mr-4"
          >
            <HeroProductShowcase slides={HERO_SLIDES} />
          </motion.div>

          {/* Botones solo móvil/tablet — después de la imagen */}
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="order-3 w-full min-w-0 lg:hidden"
          >
            <HeroCtaButtons className="flex w-full flex-col gap-3" />
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
