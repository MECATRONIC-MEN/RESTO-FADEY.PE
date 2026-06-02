'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  getSectionIdFromHref,
  isLandingHashHref,
  landingHashHref,
  scrollToSectionIdWithRetry,
  setPendingLandingSection,
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
  const router = useRouter();
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
    e.preventDefault();
    onNavigate?.();

    const go = () => {
      scrollToSectionIdWithRetry(sectionId);
      if (window.location.hash !== `#${sectionId}`) {
        window.history.pushState(null, '', targetHref);
      }
    };

    if (pathname === '/') {
      if (onNavigate) {
        requestAnimationFrame(() => {
          window.setTimeout(go, 50);
          window.setTimeout(go, 350);
        });
      } else {
        go();
      }
      return;
    }

    setPendingLandingSection(sectionId);
    router.push(targetHref);
  };

  return (
    <Link href={targetHref} className={cn(className)} onClick={handleClick} scroll={false}>
      {children}
    </Link>
  );
}
