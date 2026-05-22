/** Altura aproximada del navbar fijo para scroll a anclas */
export const NAV_SCROLL_OFFSET = 96;

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
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_SCROLL_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior });
  return true;
}

export function landingHashHref(sectionId: string): string {
  return `/#${sectionId}`;
}
