'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  consumePendingLandingSection,
  getSectionIdFromHref,
  scrollToSectionIdWithRetry,
} from '@/lib/nav-scroll';

/** Al cargar la home con hash (#planes, etc.), desplaza a la sección correcta. */
export function HashScrollOnLoad() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/') return;

    const run = (behavior: ScrollBehavior = 'auto') => {
      const pending = consumePendingLandingSection();
      const hash = window.location.hash;
      const id = pending ?? (hash ? getSectionIdFromHref(hash) : null);
      if (!id) return () => {};
      if (pending && window.location.hash !== `#${id}`) {
        window.history.replaceState(null, '', `/#${id}`);
      }
      return scrollToSectionIdWithRetry(id, behavior);
    };

    let cancelRetry = run();
    const t = window.setTimeout(() => {
      cancelRetry?.();
      cancelRetry = run('auto');
    }, 150);

    const onHashChange = () => {
      cancelRetry?.();
      cancelRetry = run('smooth');
    };
    window.addEventListener('hashchange', onHashChange);

    return () => {
      cancelRetry?.();
      window.clearTimeout(t);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [pathname]);

  return null;
}
