/** Altura aproximada del navbar fijo para scroll a anclas */
export const NAV_SCROLL_OFFSET = 96;

const PENDING_SECTION_KEY = 'resto-fadey-pending-section';

/** Guarda la sección destino antes de navegar a la home (App Router a veces pierde el hash). */
export function setPendingLandingSection(id: string) {
  try {
    sessionStorage.setItem(PENDING_SECTION_KEY, id);
  } catch {
    /* ignore */
  }
}

export function consumePendingLandingSection(): string | null {
  try {
    const id = sessionStorage.getItem(PENDING_SECTION_KEY);
    if (id) sessionStorage.removeItem(PENDING_SECTION_KEY);
    return id;
  } catch {
    return null;
  }
}

export function getSectionIdFromHref(href: string): string | null {
  const hashIndex = href.indexOf('#');
  if (hashIndex === -1) return null;
  const id = href.slice(hashIndex + 1);
  return id || null;
}

export function isLandingHashHref(href: string): boolean {
  return getSectionIdFromHref(href) !== null && (href.startsWith('#') || href.startsWith('/#'));
}

export function scrollToSectionId(id: string, behavior: ScrollBehavior = 'smooth') {
  const el = document.getElementById(id);
  if (!el) return false;

  try {
    el.scrollIntoView({ behavior, block: 'start' });
  } catch {
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_SCROLL_OFFSET;
    window.scrollTo({ top: Math.max(0, top), behavior });
  }
  return true;
}

/** Reintenta el scroll (menú móvil, layout en animación, hidratación). */
export function scrollToSectionIdWithRetry(
  id: string,
  behavior: ScrollBehavior = 'smooth',
  delaysMs: number[] = [0, 50, 150, 400]
) {
  const run = () => scrollToSectionId(id, behavior);
  run();
  const timers = delaysMs.slice(1).map((ms) => window.setTimeout(run, ms));
  return () => timers.forEach((t) => window.clearTimeout(t));
}

export function landingHashHref(sectionId: string): string {
  return `/#${sectionId}`;
}
