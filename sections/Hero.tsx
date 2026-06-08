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

function HeroCircuitBackground() {
  return (
    <div className="hero-circuit-bg pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.14]"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="hero-circuit-grid"
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 60 H40 M80 60 H120 M60 0 V40 M60 80 V120"
              fill="none"
              stroke="rgba(59,201,244,0.35)"
              strokeWidth="0.5"
            />
            <circle cx="60" cy="60" r="2" fill="rgba(59,201,244,0.5)" />
            <circle cx="0" cy="60" r="1.5" fill="rgba(91,200,255,0.4)" />
            <circle cx="120" cy="60" r="1.5" fill="rgba(91,200,255,0.4)" />
            <circle cx="60" cy="0" r="1.5" fill="rgba(91,200,255,0.4)" />
            <circle cx="60" cy="120" r="1.5" fill="rgba(91,200,255,0.4)" />
          </pattern>
          <linearGradient id="hero-circuit-fade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(59,201,244,0.15)" />
            <stop offset="50%" stopColor="rgba(27,140,255,0.08)" />
            <stop offset="100%" stopColor="rgba(59,201,244,0.12)" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-circuit-grid)" />
        <path
          d="M-20 80 Q200 40 400 100 T900 60 L1100 120"
          fill="none"
          stroke="url(#hero-circuit-fade)"
          strokeWidth="1"
        />
        <path
          d="M100 -20 Q350 120 600 80 T1100 200"
          fill="none"
          stroke="rgba(59,201,244,0.12)"
          strokeWidth="1"
        />
        <path
          d="M50 400 Q300 280 550 350 T1050 300"
          fill="none"
          stroke="rgba(91,200,255,0.1)"
          strokeWidth="1"
        />
      </svg>
      <div className="hero-circuit-glow absolute inset-0" />
    </div>
  );
}

function HeroCtaButtons({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Button href="/demo" variant="premium" className="w-full justify-center sm:w-auto">
        <Play size={18} />
        Solicitar Demo
      </Button>
      <Button href="/#modulos" variant="secondary" className="w-full justify-center sm:w-auto">
        Ver Funciones
      </Button>
      <Button
        href={getWhatsAppUrl(
          'Hola, quiero recibir un plan para mi restaurante, y deseo más información.'
        )}
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
      className="relative w-full max-w-full scroll-mt-24 overflow-hidden pb-10 pt-[max(5.75rem,calc(env(safe-area-inset-top,0px)+4.75rem))] sm:pb-14 sm:pt-28 lg:min-h-[min(100vh,920px)] lg:pb-16 lg:pt-24"
    >
      <HeroCircuitBackground />

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
