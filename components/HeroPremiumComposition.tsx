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
  /** Animar chips flotantes (hero carousel) */
  animate?: boolean;
}

function accentGlow(accent: 'cyan' | 'orange' | 'gold' | 'mixed') {
  switch (accent) {
    case 'orange':
      return 'from-orange-500/25 via-transparent to-brand-gold/10';
    case 'gold':
      return 'from-brand-gold/30 via-transparent to-brand-cyan/10';
    case 'mixed':
      return 'from-brand-cyan/25 via-orange-500/15 to-brand-gold/20';
    default:
      return 'from-brand-cyan/30 via-brand-blue/15 to-transparent';
  }
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
      className={cn(
        'relative h-full w-full overflow-hidden bg-[#060d18]',
        className
      )}
    >
      {/* Fondo tecnológico */}
      <motion.div
        className={cn(
          'pointer-events-none absolute inset-0 bg-gradient-to-br opacity-90',
          config.gradient
        )}
        animate={animate ? { opacity: [0.75, 1, 0.75] } : undefined}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className={cn(
          'pointer-events-none absolute -inset-[20%] bg-gradient-radial blur-3xl',
          accentGlow(config.accentLine)
        )}
        animate={animate ? { scale: [1, 1.06, 1], opacity: [0.5, 0.85, 0.5] } : undefined}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Grid futurista */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]"
        aria-hidden
      >
        <defs>
          <pattern id={`grid-${compositionId}`} width="32" height="32" patternUnits="userSpaceOnUse">
            <path
              d="M 32 0 L 0 0 0 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-brand-cyan"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${compositionId})`} />
      </svg>

      {/* Líneas diagonales */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id={`line-${compositionId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3BC9F4" stopOpacity="0" />
            <stop offset="45%" stopColor="#3BC9F4" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.line
          x1="8%"
          y1="92%"
          x2="92%"
          y2="12%"
          stroke={`url(#line-${compositionId})`}
          strokeWidth="1.5"
          animate={animate ? { opacity: [0.2, 0.65, 0.2] } : undefined}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.line
          x1="95%"
          y1="55%"
          x2="35%"
          y2="95%"
          stroke="#FF8C42"
          strokeWidth="1"
          strokeOpacity="0.35"
          animate={animate ? { opacity: [0.1, 0.4, 0.1] } : undefined}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        />
      </svg>

      {/* Capas de captura */}
      {config.layers.map((layer, i) => (
        <motion.div
          key={layer.src}
          className={cn(layer.className, 'overflow-hidden')}
          style={{ clipPath: layer.clip }}
          initial={false}
          animate={
            animate
              ? {
                  y: i % 2 === 0 ? [0, -4, 0] : [0, 3, 0],
                }
              : undefined
          }
          transition={{
            duration: 5 + i * 0.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
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
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-[#060d18]/85 via-[#060d18]/25 to-transparent"
              animate={animate ? { opacity: [0.55, 0.75, 0.55] } : undefined}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      ))}

      {/* Glass overlay central */}
      <div
        className="pointer-events-none absolute inset-[18%] z-[8] rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] via-transparent to-brand-cyan/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[2px]"
        style={{
          clipPath: 'polygon(12% 0, 100% 18%, 88% 100%, 0 82%)',
        }}
      />

      {/* Viñeta y borde luminoso */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[9] rounded-[inherit] ring-1 ring-inset ring-white/10"
        animate={animate ? { boxShadow: ['inset 0 0 40px rgba(59,201,244,0.08)', 'inset 0 0 60px rgba(59,201,244,0.18)', 'inset 0 0 40px rgba(59,201,244,0.08)'] } : undefined}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[9] h-1/3 bg-gradient-to-t from-[#060d18] to-transparent"
        aria-hidden
      />

      {/* KPIs flotantes */}
      {config.metrics.map((metric, i) => (
        <motion.div
          key={metric.label}
          className={cn(
            'absolute z-20 max-w-[42%] rounded-xl border px-2.5 py-1.5 shadow-lg backdrop-blur-md sm:px-3 sm:py-2',
            metric.className
          )}
          style={{ ...(metric.className.includes('left') ? {} : {}) }}
          initial={false}
          animate={
            animate
              ? {
                  y: [0, i % 2 === 0 ? -6 : 5, 0],
                  opacity: [0.92, 1, 0.92],
                }
              : undefined
          }
          transition={{
            duration: 4.5 + (metric.delay ?? 0),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: metric.delay ?? i * 0.2,
          }}
        >
          <p className="text-[8px] font-medium uppercase tracking-wider opacity-75 sm:text-[9px]">
            {metric.label}
          </p>
          <p className="font-display text-sm font-bold leading-tight sm:text-base">{metric.value}</p>
          {metric.sub ? (
            <p className="text-[9px] opacity-80 sm:text-[10px]">{metric.sub}</p>
          ) : null}
        </motion.div>
      ))}

      {/* Partículas */}
      {animate &&
        [
          { top: '22%', left: '48%' },
          { top: '48%', left: '72%' },
          { top: '68%', left: '38%' },
        ].map((p, i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute z-20 h-1 w-1 rounded-full bg-brand-cyan shadow-glow-cyan"
            style={{ top: p.top, left: p.left }}
            animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{
              duration: 2.8 + i * 0.4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}
    </motion.div>
  );
}
