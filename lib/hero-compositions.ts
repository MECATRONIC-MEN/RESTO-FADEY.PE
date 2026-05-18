export type HeroCompositionId =
  | 'ventas-reportes'
  | 'cocina-delivery'
  | 'inventario-almacenes'
  | 'facturacion-sunat'
  | 'dashboard-general';

export const HERO_SOURCE = '/images/hero/sources';

export interface CompositionLayer {
  src: string;
  /** clip-path polygon or tailwind clip class */
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
  delay?: number;
}

export interface HeroCompositionConfig {
  id: HeroCompositionId;
  title: string;
  caption: string;
  alt: string;
  description: string;
  gradient: string;
  ambient: string;
  layers: CompositionLayer[];
  metrics: FloatingMetric[];
  accentLine: 'cyan' | 'orange' | 'gold' | 'mixed';
}

export const HERO_COMPOSITIONS: HeroCompositionConfig[] = [
  {
    id: 'ventas-reportes',
    title: 'Ventas y reportes',
    caption: 'Resto-FADEY — Ventas y reportes',
    alt: 'Panel de ventas, caja POS, KPIs y gráficos financieros — Resto Fadey',
    description:
      'Caja POS, informes de ventas, IGV y gráficos por hora en un solo centro financiero.',
    gradient: 'from-brand-blue/25 via-brand-cyan/15 to-brand-deep/40',
    ambient: 'from-brand-blue/40 via-brand-cyan/25 to-transparent',
    accentLine: 'cyan',
    layers: [
      {
        src: `${HERO_SOURCE}/s05-informes-azul.png`,
        clip: 'polygon(0 0, 100% 0, 100% 58%, 0 100%)',
        className: 'absolute inset-0 z-[1] scale-[1.08] origin-top-left',
        objectPosition: 'top left',
        priority: true,
      },
      {
        src: `${HERO_SOURCE}/s03-indicadores-dark.png`,
        clip: 'polygon(38% 42%, 100% 28%, 100% 100%, 0 100%)',
        className: 'absolute inset-0 z-[2] scale-[1.12] origin-bottom-right',
        objectPosition: 'top right',
      },
    ],
    metrics: [
      {
        label: 'Ventas hoy',
        value: 'S/ 12,480',
        sub: '+18% vs ayer',
        className: 'left-[4%] top-[6%] border-brand-cyan/40 bg-brand-deep/80 text-brand-cyan',
        delay: 0,
      },
      {
        label: 'Pedidos',
        value: '156',
        className: 'right-[5%] top-[12%] border-white/20 bg-white/10 text-white',
        delay: 0.2,
      },
      {
        label: 'IGV',
        value: 'S/ 2,246',
        className: 'left-[8%] bottom-[14%] border-brand-gold/35 bg-brand-gold/10 text-brand-gold-light',
        delay: 0.4,
      },
    ],
  },
  {
    id: 'cocina-delivery',
    title: 'Cocina y delivery',
    caption: 'Resto-FADEY — Cocina y delivery',
    alt: 'Panel de cocina, comandas, mesas y pedidos delivery activos — Resto Fadey',
    description:
      'Comandas en tiempo real, estados de cocina y reparto conectados al salón.',
    gradient: 'from-orange-500/20 via-brand-charcoal/30 to-brand-darker/50',
    ambient: 'from-orange-500/35 via-brand-gold/15 to-transparent',
    accentLine: 'orange',
    layers: [
      {
        src: `${HERO_SOURCE}/s07-cocina.png`,
        clip: 'polygon(0 0, 72% 0, 58% 100%, 0 100%)',
        className: 'absolute inset-0 z-[1] scale-[1.1] origin-left',
        objectPosition: 'left top',
        priority: true,
      },
      {
        src: `${HERO_SOURCE}/s02-mesas-orange.png`,
        clip: 'polygon(48% 8%, 100% 0, 100% 100%, 32% 100%)',
        className: 'absolute inset-0 z-[2] scale-[1.06] origin-right',
        objectPosition: 'right top',
      },
    ],
    metrics: [
      {
        label: 'En cocina',
        value: '8',
        sub: '3 listos',
        className: 'right-[6%] top-[8%] border-orange-400/50 bg-orange-500/15 text-orange-200',
        delay: 0,
      },
      {
        label: 'Delivery',
        value: '5 activos',
        className: 'left-[5%] bottom-[18%] border-emerald-400/40 bg-emerald-500/10 text-emerald-200',
        delay: 0.25,
      },
      {
        label: 'Mesas',
        value: '12',
        sub: 'con pedido',
        className: 'right-[8%] bottom-[10%] border-white/25 bg-black/40 text-white',
        delay: 0.5,
      },
    ],
  },
  {
    id: 'inventario-almacenes',
    title: 'Inventario y almacenes',
    caption: 'Resto-FADEY — Inventario',
    alt: 'Control de stock, almacenes, alertas y valor de inventario — Resto Fadey',
    description:
      'Almacenes vinculados, kardex, stock crítico y valoración en tiempo real.',
    gradient: 'from-brand-blue/20 via-brand-gold/15 to-brand-deep/45',
    ambient: 'from-brand-gold/30 via-brand-blue/20 to-transparent',
    accentLine: 'gold',
    layers: [
      {
        src: `${HERO_SOURCE}/s04-almacenes.png`,
        clip: 'polygon(0 0, 100% 0, 100% 52%, 18% 100%, 0 78%)',
        className: 'absolute inset-0 z-[1] scale-[1.07] origin-top',
        objectPosition: 'top center',
        priority: true,
      },
      {
        src: `${HERO_SOURCE}/s01-dashboard-operativo.png`,
        clip: 'polygon(55% 45%, 100% 38%, 100% 100%, 22% 100%)',
        className: 'absolute inset-0 z-[2] scale-[1.14] origin-bottom-right',
        objectPosition: 'top left',
      },
    ],
    metrics: [
      {
        label: 'Valor inventario',
        value: 'S/ 48,200',
        className: 'right-[4%] top-[10%] border-emerald-400/45 bg-emerald-500/15 text-emerald-200',
        delay: 0,
      },
      {
        label: 'Stock bajo',
        value: '3 alertas',
        className: 'left-[6%] top-[14%] border-brand-cyan/40 bg-brand-deep/75 text-brand-cyan',
        delay: 0.2,
      },
      {
        label: 'Almacenes',
        value: '2 activos',
        className: 'left-[10%] bottom-[12%] border-brand-gold/40 bg-brand-gold/15 text-brand-gold-light',
        delay: 0.45,
      },
    ],
  },
  {
    id: 'facturacion-sunat',
    title: 'Facturación SUNAT',
    caption: 'Resto-FADEY — Facturación electrónica',
    alt: 'Facturación electrónica, comprobantes SUNAT y QR de mesa — Resto Fadey',
    description:
      'Emisión electrónica, comprobantes legales y pedidos digitales por QR.',
    gradient: 'from-brand-gold/25 via-brand-charcoal/35 to-brand-darker/55',
    ambient: 'from-brand-gold/35 via-brand-cyan/10 to-transparent',
    accentLine: 'gold',
    layers: [
      {
        src: `${HERO_SOURCE}/s03-indicadores-dark.png`,
        clip: 'polygon(0 0, 100% 0, 100% 62%, 42% 100%, 0 88%)',
        className: 'absolute inset-0 z-[1] scale-[1.1] origin-top-right',
        objectPosition: 'top right',
        priority: true,
      },
      {
        src: `${HERO_SOURCE}/s06-qr-mesa.png`,
        clip: 'polygon(58% 12%, 100% 0, 100% 88%, 70% 100%, 48% 55%)',
        className: 'absolute inset-0 z-[3] scale-[0.92] origin-center',
        objectPosition: 'center',
      },
    ],
    metrics: [
      {
        label: 'SUNAT',
        value: 'Conectado',
        sub: 'Emisión OK',
        className: 'left-[5%] top-[8%] border-emerald-400/45 bg-emerald-500/15 text-emerald-200',
        delay: 0,
      },
      {
        label: 'Comprobantes',
        value: '24 hoy',
        className: 'right-[5%] bottom-[16%] border-brand-gold/45 bg-brand-gold/15 text-brand-gold-light',
        delay: 0.3,
      },
      {
        label: 'IGV',
        value: 'S/ 2,246',
        className: 'left-[8%] bottom-[10%] border-white/20 bg-black/50 text-white',
        delay: 0.5,
      },
    ],
  },
  {
    id: 'dashboard-general',
    title: 'Control total',
    caption: 'Resto-FADEY — Panel premium',
    alt: 'Dashboard integral con KPIs, ventas, cocina, delivery e indicadores — Resto Fadey',
    description:
      'El centro de mando: ventas, operaciones, inventario y analítica en una vista.',
    gradient: 'from-brand-cyan/25 via-brand-gold/15 to-brand-blue/25',
    ambient: 'from-brand-cyan/30 via-orange-500/20 to-brand-gold/25',
    accentLine: 'mixed',
    layers: [
      {
        src: `${HERO_SOURCE}/s01-dashboard-operativo.png`,
        clip: 'polygon(0 0, 100% 0, 100% 55%, 0 72%)',
        className: 'absolute inset-0 z-[1] scale-[1.05] origin-top',
        objectPosition: 'top center',
        priority: true,
      },
      {
        src: `${HERO_SOURCE}/s03-indicadores-dark.png`,
        clip: 'polygon(52% 32%, 100% 22%, 100% 100%, 28% 100%)',
        className: 'absolute inset-0 z-[2] scale-[1.08] origin-bottom-right',
        objectPosition: 'top right',
      },
      {
        src: `${HERO_SOURCE}/s07-cocina.png`,
        clip: 'polygon(0 58%, 42% 48%, 38% 100%, 0 100%)',
        className: 'absolute inset-0 z-[3] scale-[1.15] origin-bottom-left opacity-95',
        objectPosition: 'left center',
      },
      {
        src: `${HERO_SOURCE}/s02-mesas-orange.png`,
        clip: 'polygon(68% 0, 100% 12%, 100% 48%, 78% 42%)',
        className: 'absolute inset-0 z-[4] scale-[0.88] origin-top-right',
        objectPosition: 'right top',
      },
    ],
    metrics: [
      {
        label: 'Ventas período',
        value: 'S/ 186K',
        sub: '+12%',
        className: 'left-[3%] top-[5%] border-brand-cyan/45 bg-brand-deep/85 text-brand-cyan',
        delay: 0,
      },
      {
        label: 'Pedidos activos',
        value: '23',
        className: 'right-[4%] top-[6%] border-orange-400/45 bg-orange-500/15 text-orange-100',
        delay: 0.15,
      },
      {
        label: 'Caja',
        value: 'Abierta',
        className: 'left-[6%] bottom-[8%] border-emerald-400/40 bg-emerald-500/10 text-emerald-200',
        delay: 0.3,
      },
      {
        label: 'Personal',
        value: '8 en turno',
        className: 'right-[6%] bottom-[6%] border-brand-gold/40 bg-brand-gold/15 text-brand-gold-light',
        delay: 0.45,
      },
    ],
  },
];

export function getCompositionById(id: HeroCompositionId): HeroCompositionConfig {
  const found = HERO_COMPOSITIONS.find((c) => c.id === id);
  if (!found) throw new Error(`Unknown composition: ${id}`);
  return found;
}
