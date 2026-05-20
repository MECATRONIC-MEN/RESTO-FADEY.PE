'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  Play,
  MessageCircle,
  LayoutDashboard,
  Zap,
  Brain,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SaaSHeroDashboard } from '@/components/landing/SaaSHeroDashboard';
import { getWhatsAppUrl } from '@/lib/utils';

const QUICK_STATS = [
  { icon: BarChart3, label: 'Gestión en tiempo real' },
  { icon: Brain, label: 'Plataforma inteligente' },
  { icon: LayoutDashboard, label: 'Dashboard avanzado' },
  { icon: Zap, label: 'Automatización total' },
];

function HeroCtaButtons({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Button href="/demo" variant="premium" className="w-full justify-center sm:w-auto">
        <Play size={18} />
        Solicitar Demo
      </Button>
      <Button href="#modulos" variant="secondary" className="w-full justify-center sm:w-auto">
        Ver Funciones
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
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-brand-cyan/10 blur-[100px]" />
        <div className="absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-brand-gold/10 blur-[90px]" />
      </div>

      <div className="relative mx-auto w-full min-w-0 max-w-[1600px] px-4 sm:px-6 lg:px-10 xl:px-14">
        <div className="flex w-full min-w-0 flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-10 xl:gap-14">
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="order-1 w-full min-w-0"
          >
            <p className="badge-tech mb-4">SIN LIMITE, SIN RESTRICCIONES !</p>
            <h1 className="max-w-full font-display text-[clamp(1.75rem,5.5vw,3.25rem)] font-bold leading-[1.12] tracking-tight text-white">
              Automatiza y potencia tu restaurante con inteligencia empresarial{' '}
              <span className="gradient-text">¡ NO PIEDAS MAS CLIENTES !</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-mist sm:text-lg">
              No solo es un POS, Centraliza ventas, cocina, inventario, finanzas, reportes y
              automatización inteligente desde una sola plataforma moderna.
            </p>

            <ul className="mt-6 grid grid-cols-2 gap-2 sm:max-w-lg">
              {QUICK_STATS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-brand-mist sm:text-sm"
                >
                  <Icon className="h-4 w-4 shrink-0 text-brand-cyan" />
                  {label}
                </li>
              ))}
            </ul>

            <HeroCtaButtons className="mt-8 hidden w-full flex-col gap-3 lg:flex lg:flex-row lg:flex-wrap" />
          </motion.div>

          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="order-2 relative w-full min-w-0"
          >
            <SaaSHeroDashboard />
          </motion.div>

          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="order-3 w-full lg:hidden"
          >
            <HeroCtaButtons className="flex w-full flex-col gap-3" />
          </motion.div>
        </div>
      </div>
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/30 to-transparent"
        aria-hidden
      />
    </section>
  );
}
