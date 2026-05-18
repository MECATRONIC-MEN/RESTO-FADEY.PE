'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { HeroSlide } from '@/lib/data';
import { HeroPremiumComposition } from '@/components/HeroPremiumComposition';

interface ProductScreenshotCarouselProps {
  slides: HeroSlide[];
  intervalMs?: number;
  /** Sin animación flotante externa — usado dentro de HeroProductShowcase */
  embedded?: boolean;
}

export function ProductScreenshotCarousel({
  slides,
  intervalMs = 4500,
  embedded = false,
}: ProductScreenshotCarouselProps) {
  const [index, setIndex] = useState(0);

  const goTo = useCallback(
    (next: number) => {
      setIndex((next + slides.length) % slides.length);
    },
    [slides.length]
  );

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => goTo(index + 1), intervalMs);
    return () => clearInterval(timer);
  }, [index, goTo, intervalMs, slides.length]);

  const current = slides[index];

  const content = (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-xl border border-white/20 bg-[#060d18] shadow-2xl',
        embedded ? 'shadow-brand-cyan/25' : 'shadow-black/50 rounded-2xl'
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-gradient-to-r from-brand-deep/90 to-brand-navy/90 px-3 py-2 sm:px-4 sm:py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full bg-red-400" />
          <span className="h-2 w-2 shrink-0 rounded-full bg-yellow-400" />
          <span className="h-2 w-2 shrink-0 rounded-full bg-green-400" />
          <AnimatePresence mode="wait">
            <motion.span
              key={current.caption}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="ml-1 truncate text-[10px] font-medium text-brand-mist sm:ml-2 sm:text-xs"
            >
              {current.caption}
            </motion.span>
          </AnimatePresence>
        </div>
        <span className="shrink-0 text-[9px] font-medium text-brand-slate sm:text-[10px]">
          {index + 1}/{slides.length}
        </span>
      </div>

      <div className="relative aspect-[16/10] min-h-[200px] bg-[#060d18] sm:min-h-[240px] lg:min-h-[280px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.compositionId}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="absolute inset-0"
            role="img"
            aria-label={current.alt}
          >
            <HeroPremiumComposition
              compositionId={current.compositionId}
              animate
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-1.5 border-t border-white/10 bg-brand-deep/80 px-3 py-2 sm:gap-2 sm:px-4 sm:py-2.5">
        {slides.map((slide, i) => (
          <button
            key={slide.compositionId}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Ver ${slide.caption}`}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300 sm:h-2',
              i === index
                ? 'w-6 bg-gradient-to-r from-brand-cyan to-brand-blue sm:w-8'
                : 'w-1.5 bg-white/20 hover:bg-brand-cyan/50 sm:w-2'
            )}
          />
        ))}
      </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className="relative w-full lg:scale-[1.06] lg:origin-center"
    >
      <div className="absolute -inset-6 rounded-3xl bg-gradient-to-r from-brand-cyan/30 via-brand-blue/20 to-brand-gold/20 blur-3xl" />
      <div className="relative">{content}</div>
    </motion.div>
  );
}
