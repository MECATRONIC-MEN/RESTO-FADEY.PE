export type HeroCompositionId =
  | 'ventas-reportes'
  | 'cocina-delivery'
  | 'inventario-almacenes'
  | 'facturacion-sunat'
  | 'dashboard-general';

export const HERO_SOURCE = '/images/hero/sources';

export interface CompositionLayer {
  src: string;
  clip: string;
  className: string;
  objectPosition?: string;
  priority?: boolean;
}

export interface FloatingMetric {
  label: string;
  value: string;
  sub?: string;
  className: string;
}

export interface HeroCompositionConfig {
  id: HeroCompositionId;
  title: string;
  caption: string;
  alt: string;
  description: string;
  gradient: string;
  layers: CompositionLayer[];
  metrics: FloatingMetric[];
  accentLine: 'cyan' | 'orange' | 'gold' | 'mixed';
}

/**
 * Parejas elegidas por compatibilidad de color y módulo:
 * 1. Informes (azul claro) + Indicadores (dark azul) — finanzas
 * 2. Cocina + Mesas (naranja) — operación salón
 * 3. Almacenes + Panel en vivo (dark/gold) — stock y KPIs
 * 4. Informes + QR mesa — ventas digitales / comprobantes
 * 5. Panel en vivo + Indicadores — vista más completa (2 capas)
 */
export const HERO_COMPOSITIONS: HeroCompositionConfig[] = [
  {
    id: 'ventas-reportes',
    title: 'Ventas y reportes',
    caption: 'Resto-FADEY — Ventas y reportes',
    alt: 'Informes de ventas e indicadores financieros — Resto Fadey',
    description:
      'Informes de caja, IGV y gráficos junto al centro de indicadores en tiempo real.',
    gradient: 'from-brand-deep/80 via-brand-navy/60 to-brand-deep/90',
    accentLine: 'cyan',
    layers: [
      {
        src: `${HERO_SOURCE}/s03-informes-azul.png`,
        clip: 'polygon(0 0, 62% 0, 56% 100%, 0 100%)',
        className: 'absolute inset-0 z-[1] scale-[1.02] origin-top-left',
        objectPosition: 'top left',
        priority: true,
      },
      {
        src: `${HERO_SOURCE}/s05-indicadores.png`,
        clip: 'polygon(44% 0, 100% 0, 100% 100%, 38% 100%)',
        className: 'absolute inset-0 z-[2] scale-[1.02] origin-top-right shadow-[-12px_0_40px_rgba(0,0,0,0.45)]',
        objectPosition: 'top right',
      },
    ],
    metrics: [
      {
        label: 'Ventas hoy',
        value: 'S/ 8,420',
        sub: '+14%',
        className: 'left-[5%] top-[7%] border-brand-cyan/35 bg-brand-deep/90 text-brand-cyan',
      },
      {
        label: 'Pedidos',
        value: '127',
        className: 'right-[5%] bottom-[10%] border-white/15 bg-black/55 text-white',
      },
    ],
  },
  {
    id: 'cocina-delivery',
    title: 'Cocina y salón',
    caption: 'Resto-FADEY — Cocina y mesas',
    alt: 'Panel de cocina y mapa de mesas con pedidos — Resto Fadey',
    description:
      'Comandas en cocina conectadas al mapa de mesas y cobro en salón.',
    gradient: 'from-[#1a1310]/95 via-[#120e0c]/90 to-[#0a0808]/95',
    accentLine: 'orange',
    layers: [
      {
        src: `${HERO_SOURCE}/s07-cocina.png`,
        clip: 'polygon(0 0, 58% 0, 52% 100%, 0 100%)',
        className: 'absolute inset-0 z-[1] scale-[1.03] origin-left',
        objectPosition: 'left top',
        priority: true,
      },
      {
        src: `${HERO_SOURCE}/s06-mesas-naranja.png`,
        clip: 'polygon(46% 0, 100% 0, 100% 100%, 40% 100%)',
        className: 'absolute inset-0 z-[2] scale-[1.02] origin-right shadow-[-10px_0_32px_rgba(0,0,0,0.5)]',
        objectPosition: 'right top',
      },
    ],
    metrics: [
      {
        label: 'En cocina',
        value: '6 pedidos',
        className: 'left-[5%] top-[8%] border-orange-400/40 bg-black/50 text-orange-100',
      },
      {
        label: 'Mesas activas',
        value: '9',
        className: 'right-[5%] bottom-[9%] border-orange-400/35 bg-orange-950/60 text-orange-50',
      },
    ],
  },
  {
    id: 'inventario-almacenes',
    title: 'Inventario y almacenes',
    caption: 'Resto-FADEY — Inventario',
    alt: 'Almacenes, stock y panel operativo con alertas — Resto Fadey',
    description:
      'Control de almacenes, valor de inventario y alertas desde el panel en vivo.',
    gradient: 'from-brand-darker/95 via-brand-charcoal/40 to-brand-darker/95',
    accentLine: 'gold',
    layers: [
      {
        src: `${HERO_SOURCE}/s04-almacenes.png`,
        clip: 'polygon(0 0, 60% 0, 54% 100%, 0 100%)',
        className: 'absolute inset-0 z-[1] scale-[1.02] origin-top',
        objectPosition: 'top center',
        priority: true,
      },
      {
        src: `${HERO_SOURCE}/s01-panel-vivo.png`,
        clip: 'polygon(42% 0, 100% 0, 100% 100%, 36% 100%)',
        className: 'absolute inset-0 z-[2] scale-[1.03] origin-top-right shadow-[-10px_0_36px_rgba(0,0,0,0.55)]',
        objectPosition: 'top left',
      },
    ],
    metrics: [
      {
        label: 'Valor inventario',
        value: 'S/ 32,800',
        className: 'right-[5%] top-[8%] border-emerald-400/35 bg-black/55 text-emerald-200',
      },
      {
        label: 'Stock bajo',
        value: '4 ítems',
        className: 'left-[5%] bottom-[9%] border-brand-gold/35 bg-brand-gold/10 text-brand-gold-light',
      },
    ],
  },
  {
    id: 'facturacion-sunat',
    title: 'Ventas digitales',
    caption: 'Resto-FADEY — QR y reportes',
    alt: 'Informes de ventas y pedido por QR en mesa — Resto Fadey',
    description:
      'Reportes financieros integrados con carta digital y pedido por QR en mesa.',
    gradient: 'from-brand-deep/90 via-brand-navy/70 to-brand-deep/90',
    accentLine: 'cyan',
    layers: [
      {
        src: `${HERO_SOURCE}/s03-informes-azul.png`,
        clip: 'polygon(0 0, 68% 0, 62% 100%, 0 100%)',
        className: 'absolute inset-0 z-[1] scale-[1.02] origin-top-left',
        objectPosition: 'top left',
        priority: true,
      },
      {
        src: `${HERO_SOURCE}/s02-qr-mesa.png`,
        clip: 'polygon(58% 8%, 100% 0, 100% 92%, 52% 100%)',
        className: 'absolute inset-0 z-[2] scale-[0.98] origin-center shadow-[-8px_0_28px_rgba(0,0,0,0.35)]',
        objectPosition: 'center',
      },
    ],
    metrics: [
      {
        label: 'Caja',
        value: 'Abierta',
        className: 'left-[5%] top-[8%] border-emerald-400/35 bg-emerald-950/50 text-emerald-200',
      },
      {
        label: 'QR mesas',
        value: 'Activas',
        className: 'right-[5%] bottom-[10%] border-brand-cyan/30 bg-white/95 text-emerald-800',
      },
    ],
  },
  {
    id: 'dashboard-general',
    title: 'Control total',
    caption: 'Resto-FADEY — Panel completo',
    alt: 'Panel en vivo e indicadores del restaurante — Resto Fadey',
    description:
      'Centro de mando con KPIs en vivo, ventas, cocina, delivery e inventario.',
    gradient: 'from-brand-darker/95 via-brand-navy/50 to-brand-darker/95',
    accentLine: 'mixed',
    layers: [
      {
        src: `${HERO_SOURCE}/s01-panel-vivo.png`,
        clip: 'polygon(0 0, 58% 0, 52% 100%, 0 100%)',
        className: 'absolute inset-0 z-[1] scale-[1.02] origin-top',
        objectPosition: 'top center',
        priority: true,
      },
      {
        src: `${HERO_SOURCE}/s05-indicadores.png`,
        clip: 'polygon(44% 0, 100% 0, 100% 100%, 38% 100%)',
        className: 'absolute inset-0 z-[2] scale-[1.02] origin-top-right shadow-[-12px_0_40px_rgba(0,0,0,0.5)]',
        objectPosition: 'top right',
      },
    ],
    metrics: [
      {
        label: 'Ventas período',
        value: 'S/ 124K',
        sub: '+11%',
        className: 'left-[4%] top-[6%] border-brand-cyan/40 bg-brand-deep/90 text-brand-cyan',
      },
      {
        label: 'Caja',
        value: 'Abierta',
        className: 'right-[4%] bottom-[8%] border-brand-gold/35 bg-black/55 text-brand-gold-light',
      },
    ],
  },
];

export function getCompositionById(id: HeroCompositionId): HeroCompositionConfig {
  const found = HERO_COMPOSITIONS.find((c) => c.id === id);
  if (!found) throw new Error(`Unknown composition: ${id}`);
  return found;
}
