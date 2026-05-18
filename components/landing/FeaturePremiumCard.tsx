'use client';

import { motion } from 'framer-motion';
import type { Feature } from '@/lib/data';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 120, damping: 18 },
  },
};

type FeaturePremiumCardProps = {
  feature: Feature;
  index: number;
};

export function FeaturePremiumCard({ feature, index }: FeaturePremiumCardProps) {
  const Icon = feature.icon;
  const isGold = feature.accent === 'gold';
  const floatDelay = (index % 5) * 0.4;

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -10, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
      className="group relative h-full"
    >
      {/* Glow exterior */}
      <div
        className={cn(
          'pointer-events-none absolute -inset-px rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100',
          isGold
            ? 'bg-gradient-to-br from-brand-gold/40 via-brand-cyan/20 to-brand-blue/30'
            : 'bg-gradient-to-br from-brand-cyan/50 via-brand-electric/30 to-brand-blue/40'
        )}
        aria-hidden
      />

      <div
        className={cn(
          'relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-2xl border p-6 backdrop-blur-xl transition-all duration-500',
          'bg-gradient-to-br from-white/[0.09] via-brand-panel/40 to-brand-deep/60',
          isGold
            ? 'border-brand-gold/20 group-hover:border-brand-gold/45 group-hover:shadow-glow-gold'
            : 'border-brand-cyan/15 group-hover:border-brand-cyan/40 group-hover:shadow-glow-cyan'
        )}
      >
        {/* Patrón tecnológico */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59,201,244,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,201,244,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
          }}
          aria-hidden
        />

        {/* Línea decorativa superior */}
        <div
          className={cn(
            'absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/60 to-transparent opacity-60 transition-opacity group-hover:opacity-100',
            isGold && 'via-brand-gold/70'
          )}
          aria-hidden
        />

        {/* Esquina UI */}
        <div
          className="absolute right-4 top-4 flex gap-1 opacity-40 group-hover:opacity-80"
          aria-hidden
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan" />
          <span className="h-1.5 w-1.5 rounded-full bg-brand-mist/50" />
          <span
            className={cn('h-1.5 w-1.5 rounded-full', isGold ? 'bg-brand-gold' : 'bg-brand-blue')}
          />
        </div>

        {/* Icono flotante */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 4 + floatDelay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={cn(
            'relative mb-5 inline-flex rounded-2xl border p-4 transition-all duration-500',
            'group-hover:scale-110 group-hover:shadow-glow-cyan',
            isGold
              ? 'border-brand-gold/35 bg-gradient-to-br from-brand-gold/25 to-brand-cyan/10'
              : 'border-brand-cyan/30 bg-gradient-to-br from-brand-cyan/25 to-brand-blue/15'
          )}
        >
          <Icon
            className={cn(
              'h-8 w-8 transition-colors duration-300',
              isGold ? 'text-brand-gold-light' : 'text-brand-cyan',
              'group-hover:text-brand-sky'
            )}
            strokeWidth={1.75}
          />
          <motion.div
            className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-brand-cyan shadow-glow-cyan"
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
            aria-hidden
          />
        </motion.div>

        <h3 className="font-display text-xl font-semibold tracking-tight text-white">
          {feature.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-mist">
          {feature.description}
        </p>

        {/* Highlights tipo dashboard */}
        <ul className="mt-5 space-y-2 border-t border-white/10 pt-4">
          {feature.highlights.map((item, i) => (
            <li
              key={item}
              className="flex items-center gap-2 text-xs text-brand-soft/90 transition-colors group-hover:text-brand-soft"
            >
              <span
                className={cn(
                  'flex h-4 w-4 shrink-0 items-center justify-center rounded-md text-[9px] font-bold',
                  isGold
                    ? 'bg-brand-gold/20 text-brand-gold-light'
                    : 'bg-brand-cyan/15 text-brand-cyan'
                )}
              >
                {i + 1}
              </span>
              <span className="leading-snug">{item}</span>
            </li>
          ))}
        </ul>

        {/* Indicador inferior */}
        <div
          className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-widest text-brand-slate"
          aria-hidden
        >
          <span className="opacity-60">Módulo activo</span>
          <span
            className={cn(
              'h-1 w-8 rounded-full bg-gradient-to-r',
              isGold ? 'from-brand-gold/80 to-brand-cyan/40' : 'from-brand-cyan to-brand-blue/40'
            )}
          />
        </div>
      </div>
    </motion.article>
  );
}

export { containerVariants, cardVariants };
