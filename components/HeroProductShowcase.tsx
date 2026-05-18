'use client';

import { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { ProductScreenshotCarousel } from '@/components/ProductScreenshotCarousel';
import type { HeroSlide } from '@/lib/data';
import { cn } from '@/lib/utils';

interface HeroProductShowcaseProps {
  slides: HeroSlide[];
  className?: string;
}

const CORNER_MARKERS = [
  { className: 'left-1/2 top-0 -translate-x-1/2 -translate-y-1/2', gold: false },
  { className: 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2', gold: true },
  { className: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2', gold: false },
  { className: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2', gold: false },
] as const;

function RotatingFrame({
  inset,
  duration,
  reverse,
  reducedMotion,
  dashed,
  children,
}: {
  inset: string;
  duration: number;
  reverse?: boolean;
  reducedMotion: boolean;
  dashed?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      className={cn(
        'pointer-events-none absolute rounded-[1.75rem]',
        inset,
        dashed ? 'border border-dashed border-brand-cyan/20' : 'border border-brand-cyan/25'
      )}
      animate={reducedMotion ? undefined : { rotate: reverse ? -360 : 360 }}
      transition={
        reducedMotion ? undefined : { duration, repeat: Infinity, ease: 'linear' }
      }
    >
      {children}
    </motion.div>
  );
}

function CornerSquare({
  className,
  gold,
  size = 'h-4 w-4 sm:h-5 sm:w-5',
  reducedMotion,
  duration,
  reverse,
}: {
  className: string;
  gold?: boolean;
  size?: string;
  reducedMotion: boolean;
  duration: number;
  reverse?: boolean;
}) {
  return (
    <motion.div
      className={cn('absolute', className)}
      animate={reducedMotion ? undefined : { rotate: reverse ? 360 : -360 }}
      transition={
        reducedMotion ? undefined : { duration, repeat: Infinity, ease: 'linear' }
      }
    >
      <div
        className={cn(
          'rounded-lg border backdrop-blur-sm',
          size,
          gold
            ? 'border-brand-gold/45 bg-brand-gold/15 shadow-glow-gold'
            : 'border-brand-cyan/40 bg-brand-cyan/10 shadow-glow-cyan'
        )}
      />
    </motion.div>
  );
}

export function HeroProductShowcase({ slides, className }: HeroProductShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 22 });

  const parallaxX = useTransform(springX, [-0.5, 0.5], [-10, 10]);
  const parallaxY = useTransform(springY, [-0.5, 0.5], [-8, 8]);
  const glowX = useTransform(springX, [-0.5, 0.5], [-14, 14]);
  const glowY = useTransform(springY, [-0.5, 0.5], [-12, 12]);

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn(
        'relative mx-auto w-full max-w-[720px] lg:max-w-none',
        'aspect-[4/3] min-h-[320px] sm:min-h-[380px] lg:min-h-[440px] xl:min-h-[500px]',
        className
      )}
    >
      <motion.div
        style={{ x: reducedMotion ? 0 : glowX, y: reducedMotion ? 0 : glowY }}
        className="pointer-events-none absolute inset-[6%] rounded-[2rem] bg-gradient-to-br from-brand-cyan/30 via-brand-blue/15 to-brand-gold/12 blur-3xl"
      />

      <RotatingFrame inset="inset-[2%]" duration={88} reducedMotion={!!reducedMotion} />
      <RotatingFrame
        inset="inset-[6%]"
        duration={64}
        reverse
        dashed
        reducedMotion={!!reducedMotion}
      />

      <RotatingFrame inset="inset-[10%]" duration={48} reducedMotion={!!reducedMotion}>
        {CORNER_MARKERS.map((m, i) => (
          <CornerSquare
            key={i}
            className={m.className}
            gold={m.gold}
            size="h-3.5 w-3.5 sm:h-4 sm:w-4"
            reducedMotion={!!reducedMotion}
            duration={48}
            reverse
          />
        ))}
      </RotatingFrame>

      <RotatingFrame inset="inset-[4%]" duration={36} reverse reducedMotion={!!reducedMotion}>
        {[
          { className: 'left-[20%] top-[8%]', gold: false },
          { className: 'right-[15%] top-[18%]', gold: true },
          { className: 'right-[8%] bottom-[22%]', gold: false },
          { className: 'left-[12%] bottom-[15%]', gold: false },
          { className: 'left-[45%] top-[2%]', gold: false },
          { className: 'right-[42%] bottom-[4%]', gold: true },
        ].map((m, i) => (
          <CornerSquare
            key={i}
            className={cn('absolute', m.className)}
            gold={m.gold}
            size="h-2.5 w-2.5 sm:h-3 sm:w-3"
            reducedMotion={!!reducedMotion}
            duration={36}
          />
        ))}
      </RotatingFrame>

      <motion.div
        className="pointer-events-none absolute inset-[12%] rounded-3xl border border-white/10 bg-gradient-to-br from-brand-cyan/8 via-transparent to-brand-gold/5 backdrop-blur-[1px]"
        animate={
          reducedMotion
            ? undefined
            : { rotate: [0, 0.8, 0, -0.8, 0], scale: [1, 1.008, 1] }
        }
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-35"
        aria-hidden
      >
        <defs>
          <linearGradient id="hero-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3BC9F4" stopOpacity="0" />
            <stop offset="50%" stopColor="#3BC9F4" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.line
          x1="12%"
          y1="18%"
          x2="88%"
          y2="82%"
          stroke="url(#hero-line-grad)"
          strokeWidth="1"
          animate={reducedMotion ? undefined : { opacity: [0.15, 0.55, 0.15] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.line
          x1="88%"
          y1="22%"
          x2="12%"
          y2="78%"
          stroke="url(#hero-line-grad)"
          strokeWidth="1"
          animate={reducedMotion ? undefined : { opacity: [0.1, 0.45, 0.1] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </svg>

      {!reducedMotion &&
        [
          { top: '16%', left: '20%', delay: 0 },
          { top: '70%', left: '14%', delay: 0.9 },
          { top: '24%', left: '80%', delay: 1.3 },
          { top: '65%', left: '84%', delay: 0.5 },
        ].map((p, i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-brand-cyan shadow-glow-cyan"
            style={{ top: p.top, left: p.left }}
            animate={{ opacity: [0.25, 0.85, 0.25], scale: [0.85, 1.15, 0.85] }}
            transition={{
              duration: 3.2 + i * 0.35,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: p.delay,
            }}
          />
        ))}

      <motion.div
        style={{ x: reducedMotion ? 0 : parallaxX, y: reducedMotion ? 0 : parallaxY }}
        className="absolute inset-[14%] z-10 flex items-center justify-center sm:inset-[16%] lg:inset-[15%]"
        whileHover={reducedMotion ? undefined : { scale: 1.015 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      >
        <motion.div
          animate={reducedMotion ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-full"
        >
          <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-brand-cyan/45 via-brand-blue/30 to-brand-gold/25 blur-2xl" />
          <div className="relative rounded-xl ring-1 ring-brand-cyan/35 ring-offset-1 ring-offset-brand-navy/50">
            <ProductScreenshotCarousel slides={slides} embedded />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="badge-tech pointer-events-none absolute left-[4%] top-[10%] z-20 hidden text-[10px] sm:inline-flex"
        animate={reducedMotion ? undefined : { y: [0, -5, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        POS en vivo
      </motion.div>
      <motion.div
        className="badge-tech pointer-events-none absolute bottom-[12%] right-[2%] z-20 hidden text-[10px] sm:inline-flex"
        animate={reducedMotion ? undefined : { y: [0, 5, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
      >
        En la nube
      </motion.div>
    </div>
  );
}
