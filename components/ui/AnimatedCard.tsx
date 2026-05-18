'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  glow?: boolean;
}

export function AnimatedCard({ children, className, delay = 0, glow = true }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
      whileHover={glow ? { y: -8, transition: { duration: 0.3 } } : undefined}
      className={cn('glass-card glow-border p-6', className)}
    >
      {children}
    </motion.div>
  );
}
