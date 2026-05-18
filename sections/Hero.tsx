'use client';

import { motion } from 'framer-motion';
import { Play, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { HeroProductShowcase } from '@/components/HeroProductShowcase';
import { HERO_SLIDES } from '@/lib/data';
import { getWhatsAppUrl } from '@/lib/utils';

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-[min(100vh,920px)] overflow-hidden pt-20 pb-14 sm:pt-24 lg:pt-24 lg:pb-16"
    >
      <div className="relative mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10 xl:px-14">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)] lg:gap-8 xl:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl lg:max-w-none"
          >
            <h1 className="font-display text-4xl font-bold leading-[1.12] tracking-tight text-white text-balance sm:text-5xl lg:text-[3.15rem] xl:text-6xl">
              <span className="block">EL SISTEMA NÚMERO 1</span>
              <span className="mt-1 block">
                PARA&nbsp;RESTAURANTES
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-lg leading-relaxed text-brand-mist sm:text-xl lg:max-w-xl">
              Tecnología que potencia la gestión de tu restaurante. Ventas, cocina, delivery y
              control total desde una sola plataforma.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/demo" variant="primary">
                <Play size={18} />
                Solicitar Demo
              </Button>
              <Button href="#planes" variant="secondary">
                Ver Planes
              </Button>
              <Button href={getWhatsAppUrl()} variant="green" external>
                <MessageCircle size={18} />
                WhatsApp
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative w-full lg:-mr-2 xl:-mr-4 lg:-mt-2"
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
