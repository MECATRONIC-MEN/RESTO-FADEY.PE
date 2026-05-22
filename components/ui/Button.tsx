'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  getSectionIdFromHref,
  isLandingHashHref,
  landingHashHref,
  scrollToSectionId,
} from '@/lib/nav-scroll';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'premium' | 'green' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  external?: boolean;
  children: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  premium: 'btn-premium',
  green: 'btn-green',
  ghost:
    'inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-brand-mist transition-colors hover:text-brand-soft',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3',
  lg: 'px-8 py-4 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  external,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(variants[variant], size !== 'md' && sizes[size], className);
  const pathname = usePathname();

  if (href) {
    const sectionId = getSectionIdFromHref(href);
    if (!external && sectionId && isLandingHashHref(href)) {
      const targetHref = landingHashHref(sectionId);
      return (
        <Link
          href={targetHref}
          className={classes}
          scroll={false}
          onClick={(e) => {
            if (pathname === '/') {
              e.preventDefault();
              scrollToSectionId(sectionId);
              window.history.pushState(null, '', targetHref);
            }
          }}
        >
          <motion.span
            className="inline-flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {children}
          </motion.span>
        </Link>
      );
    }

    if (external) {
      return (
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {children}
        </motion.a>
      );
    }
    return (
      <Link href={href} className={classes}>
        <motion.span
          className="inline-flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {children}
        </motion.span>
      </Link>
    );
  }

  return (
    <motion.button
      className={classes}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
