import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

const sizes = {
  sm: { img: 36, text: 'text-lg' },
  md: { img: 44, text: 'text-xl' },
  lg: { img: 56, text: 'text-2xl' },
};

export function Logo({ className, showText = true, size = 'md', href = '/' }: LogoProps) {
  const s = sizes[size];

  const content = (
    <>
      <Image
        src="/images/logo.png"
        alt="Resto Fadey"
        width={s.img}
        height={s.img}
        className="h-auto w-auto object-contain"
        priority={size === 'md'}
      />
      {showText && (
        <span className={cn('font-display font-bold tracking-tight', s.text)}>
          Resto<span className="text-brand-gold">-FADEY</span>
        </span>
      )}
    </>
  );

  return (
    <Link href={href} className={cn('flex items-center gap-2.5 group', className)}>
      {content}
    </Link>
  );
}
