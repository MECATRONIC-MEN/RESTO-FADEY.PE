/** Contenido demo del panel cliente — reemplazar por API/DB */
export const RECENT_COURSES = [
  { id: '1', title: 'Facturación electrónica SUNAT', progress: 60, duration: '45 min' },
  { id: '2', title: 'Control de inventario en cocina', progress: 30, duration: '32 min' },
  { id: '3', title: 'Mapa de mesas y turnos', progress: 100, duration: '28 min' },
] as const;

export const FEATURED_VIDEOS = [
  { id: '1', title: 'Tour del panel de ventas', tag: 'Nuevo' },
  { id: '2', title: 'Configurar menú QR', tag: 'Popular' },
  { id: '3', title: 'Reportes diarios', tag: null },
] as const;

export const ACTIVE_PROMOTIONS = [
  { id: '1', title: 'Capacitación gratuita marzo', endsAt: '31 Mar 2026' },
  { id: '2', title: 'Descuento módulo delivery', endsAt: '15 Abr 2026' },
] as const;

export const SYSTEM_NEWS = [
  { id: '1', title: 'Nueva integración SUNAT en desarrollo', date: '12 May 2026' },
  { id: '2', title: 'Actualización del módulo de mesas', date: '5 May 2026' },
  { id: '3', title: 'Soporte extendido fines de semana', date: '1 May 2026' },
] as const;

export const QUICK_LINKS = [
  { href: '/dashboard/beneficios', label: 'Beneficios', icon: 'gift' as const },
  { href: '/dashboard/promociones', label: 'Promociones', icon: 'tag' as const },
  { href: '/dashboard/cursos', label: 'Cursos', icon: 'book' as const },
  { href: '/dashboard/videos', label: 'Videos', icon: 'play' as const },
  { href: '/dashboard/academia', label: 'Academia', icon: 'graduation' as const },
  { href: '/dashboard/recursos', label: 'Recursos', icon: 'folder' as const },
] as const;
