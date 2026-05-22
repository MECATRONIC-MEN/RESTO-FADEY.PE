'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getSectionIdFromHref, scrollToSectionId } from '@/lib/nav-scroll';

/** Al cargar la home con hash (#planes, etc.), desplaza a la sección correcta. */
export function HashScrollOnLoad() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/') return;

    const run = (behavior: ScrollBehavior = 'auto') => {
      const hash = window.location.hash;
      if (!hash) return;
      const id = getSectionIdFromHref(hash);
      if (id) scrollToSectionId(id, behavior);
    };

    run();
    const t = window.setTimeout(() => run('auto'), 150);

    const onHashChange = () => run('smooth');
    window.addEventListener('hashchange', onHashChange);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [pathname]);

  return null;
}
