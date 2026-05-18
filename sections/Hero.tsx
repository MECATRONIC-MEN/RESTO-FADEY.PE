'use client';

import { motion } from 'framer-motion';
import { Shield, Play, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { HeroProductShowcase } from '@/components/HeroProductShowcase';
import { HERO_SLIDES } from '@/lib/data';
import { getWhatsAppUrl } from '@/lib/utils';

export function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen overflow-hidden pt-28 pb-20 lg:pt-36">
      <div className="relative mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10 xl:px-14">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)] lg:gap-10 xl:gap-14">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl lg:max-w-none"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="badge-premium mb-6 inline-flex items-center gap-2 px-4 py-2"
            >
              <Shield className="h-4 w-4 text-brand-gold-light" />
              <span className="text-sm font-medium">Compatible con SUNAT</span>
            </motion.div>

            <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.25rem] xl:text-7xl">
              EL SISTEMA NÚMERO UNO
              <br />
              PARA RESTAURANTES
            </h1>

            <p className="mt-6 max-w-lg text-lg text-brand-mist sm:text-xl lg:max-w-xl">
              Tecnología que potencia la gestión de tu restaurante. Ventas, cocina, delivery y
              control total desde una sola plataforma.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
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
            className="relative w-full lg:-mr-2 xl:-mr-4"
          >
            <HeroProductShowcase slides={HERO_SLIDES} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
