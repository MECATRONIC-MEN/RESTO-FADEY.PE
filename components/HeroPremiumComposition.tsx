'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  getCompositionById,
  type HeroCompositionId,
} from '@/lib/hero-compositions';

interface HeroPremiumCompositionProps {
  compositionId: HeroCompositionId;
  className?: string;
  animate?: boolean;
}

export function HeroPremiumComposition({
  compositionId,
  className,
  animate = true,
}: HeroPremiumCompositionProps) {
  const config = getCompositionById(compositionId);

  return (
    <motion.div
      layout
      className={cn('relative h-full w-full overflow-hidden bg-[#0a1118]', className)}
    >
      {/* Fondo sutil — sin animación agresiva */}
      <motion.div
        className={cn(
          'pointer-events-none absolute inset-0 bg-gradient-to-br',
          config.gradient
        )}
      />

      {/* Glow ambiental suave */}
      <div
        className="pointer-events-none absolute -right-1/4 top-0 h-2/3 w-1/2 rounded-full bg-brand-cyan/10 blur-3xl"
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute -left-1/4 bottom-0 h-1/2 w-1/2 rounded-full bg-brand-gold/8 blur-3xl"
        aria-hidden
        animate={animate ? { opacity: [0.4, 0.65, 0.4] } : undefined}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Capas reales del sistema */}
      {config.layers.map((layer, i) => (
        <motion.div
          key={layer.src}
          className={cn(layer.className, 'overflow-hidden rounded-sm')}
          style={{ clipPath: layer.clip }}
          initial={false}
          animate={animate ? { y: i === 0 ? [0, -3, 0] : [0, 2, 0] } : undefined}
          transition={{
            duration: 7 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.4,
          }}
        >
          <div className="relative h-full w-full">
            <Image
              src={layer.src}
              alt=""
              fill
              priority={layer.priority}
              className="object-cover"
              style={{ objectPosition: layer.objectPosition ?? 'top' }}
              sizes="(max-width: 1024px) 90vw, 55vw"
            />
            {/* Viñeta ligera — la UI sigue legible */}
            <div
              className={cn(
                'absolute inset-0',
                i === 0
                  ? 'bg-gradient-to-r from-transparent via-transparent to-black/25'
                  : 'bg-gradient-to-l from-black/20 via-transparent to-transparent'
              )}
            />
          </div>
        </motion.div>
      ))}

      {/* Separador diagonal sutil entre capas */}
      <div
        className="pointer-events-none absolute inset-y-0 left-[46%] z-[5] w-px bg-gradient-to-b from-transparent via-white/25 to-transparent"
        aria-hidden
      />

      {/* Borde exterior premium */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[9] rounded-[inherit] ring-1 ring-inset ring-white/8"
        aria-hidden
      />

      {/* Viñeta inferior para integrar con el hero */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[8] h-[18%] bg-gradient-to-t from-[#0a1118]/90 to-transparent"
        aria-hidden
      />

      {/* KPIs comerciales — máximo 2, discretos */}
      {config.metrics.map((metric) => (
        <motion.div
          key={metric.label}
          className={cn(
            'absolute z-20 max-w-[44%] rounded-lg border px-2.5 py-1.5 shadow-md backdrop-blur-sm sm:px-3 sm:py-2',
            metric.className
          )}
          animate={animate ? { y: [0, -4, 0] } : undefined}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <p className="text-[8px] font-medium uppercase tracking-wide opacity-80 sm:text-[9px]">
            {metric.label}
          </p>
          <p className="font-display text-sm font-bold leading-tight sm:text-base">{metric.value}</p>
          {metric.sub ? (
            <p className="text-[9px] opacity-75 sm:text-[10px]">{metric.sub}</p>
          ) : null}
        </motion.div>
      ))}
    </motion.div>
  );
}
