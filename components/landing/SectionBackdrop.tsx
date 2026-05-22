import { cn } from '@/lib/utils';

export type SectionBackdropVariant =
  | 'metrics'
  | 'modules'
  | 'benefits'
  | 'video'
  | 'testimonials'
  | 'faq'
  | 'contract'
  | 'contact'
  | 'footer';

type SectionBackdropProps = {
  variant: SectionBackdropVariant;
  className?: string;
};

/** Capas de fondo multicapa por sección (identidad visual única, coherente con marca). */
export function SectionBackdrop({ variant, className }: SectionBackdropProps) {
  return (
    <div
      className={cn('section-backdrop pointer-events-none absolute inset-0', `section-backdrop--${variant}`, className)}
      aria-hidden
    >
      <div className="section-backdrop__base" />
      <div className="section-backdrop__pattern" />
      <div className="section-backdrop__mesh" />
      <div className="section-backdrop__glow" />
      <div className="section-backdrop__accent" />
      <div className="section-backdrop__fade-top" />
      <div className="section-backdrop__fade-bottom" />
    </div>
  );
}
