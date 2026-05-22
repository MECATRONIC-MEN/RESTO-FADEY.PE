'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export type AnimatedBorderVariant = 'tech' | 'premium' | 'white';

/** Grosor del borde líquido celeste (base 2px → ecosystem 4px) */
export type LiquidBorderWeight = 'default' | 'ecosystem';

const SHELL_CLASS: Record<AnimatedBorderVariant, string> = {
  tech: 'tech-border-shell',
  premium: 'premium-border-shell',
  white: 'white-border-shell',
};

const INNER_CLASS: Record<AnimatedBorderVariant, string> = {
  tech: 'tech-border-inner',
  premium: 'premium-border-inner',
  white: 'white-border-inner',
};

interface AnimatedBorderCardProps extends HTMLMotionProps<'article'> {
  variant: AnimatedBorderVariant;
  /** Solo variant tech: ecosystem = 2× grosor base */
  borderWeight?: LiquidBorderWeight;
  innerClassName?: string;
  children: React.ReactNode;
}

export function AnimatedBorderCard({
  variant,
  borderWeight = 'default',
  className,
  innerClassName,
  children,
  ...motionProps
}: AnimatedBorderCardProps) {
  return (
    <motion.article
      className={cn(
        SHELL_CLASS[variant],
        variant === 'tech' && borderWeight === 'ecosystem' && 'tech-border-shell--ecosystem',
        className
      )}
      {...motionProps}
    >
      <div className={cn(INNER_CLASS[variant], innerClassName)}>{children}</div>
    </motion.article>
  );
}
