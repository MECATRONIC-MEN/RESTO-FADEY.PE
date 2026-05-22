'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  getSectionIdFromHref,
  isLandingHashHref,
  landingHashHref,
  scrollToSectionId,
} from '@/lib/nav-scroll';
import { cn } from '@/lib/utils';

interface NavAnchorProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  onNavigate?: () => void;
}

export function NavAnchor({ href, className, children, onNavigate }: NavAnchorProps) {
  const pathname = usePathname();
  const sectionId = getSectionIdFromHref(href);
  const isHash = isLandingHashHref(href);
  const targetHref = sectionId ? landingHashHref(sectionId) : href;

  if (!isHash || !sectionId) {
    return (
      <Link href={href} className={className} onClick={onNavigate}>
        {children}
      </Link>
    );
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onNavigate?.();
    if (pathname === '/') {
      e.preventDefault();
      scrollToSectionId(sectionId);
      window.history.pushState(null, '', targetHref);
    }
  };

  return (
    <Link href={targetHref} className={cn(className)} onClick={handleClick} scroll={false}>
      {children}
    </Link>
  );
}
