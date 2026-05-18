import {
  ShoppingCart,
  ChefHat,
  Truck,
  BarChart3,
  Package,
  Printer,
  Users,
  LayoutGrid,
  Cloud,
  Zap,
  ShieldCheck,
  Smartphone,
  Monitor,
  Warehouse,
  ClipboardList,
  FileBarChart,
  ShoppingBag,
  TrendingUp,
  Wallet,
  FileCheck,
  Boxes,
  Target,
  Sparkles,
  Brain,
  type LucideIcon,
} from 'lucide-react';

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  highlights: string[];
  accent?: 'cyan' | 'gold';
}

export interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image: string;
  gradient: string;
}

export interface HeroSlide {
  src: string;
  alt: string;
  caption: string;
}

export interface Plan {
  name: string;
  price: string;
  period: string;
  /** Beneficio principal del plan (una línea) */
  tagline: string;
  description: string;
  /** Plan anterior cuyos módulos ya están incluidos */
  includesFrom?: 'Básico' | 'Pro';
  /** Módulos incluidos en este plan (o añadidos si hay includesFrom) */
  modules: string[];
  /** Ventajas adicionales: soporte, límites, servicios */
  benefits: string[];
  highlighted?: boolean;
  badge?: string;
  /** Precio alternativo (ej. facturación semestral) */
  semestralNote?: string;
}

export interface Testimonial {
  name: string;
  restaurant: string;
  comment: string;
  rating: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const FEATURES: Feature[] = [
  {
    icon: ShoppingCart,
    title: 'Ventas',
    description: 'Punto de venta ultrarrápido con flujo optimizado para alto volumen.',
    highlights: ['Pedidos en segundos', 'Caja integrada', 'Venta rápida y mesas'],
    accent: 'gold',
  },
  {
    icon: FileCheck,
    title: 'Facturación electrónica',
    description:
      'Boletas, facturas y comprobantes legales con emisión tributaria e historial en un solo módulo.',
    highlights: ['Boletas y facturas', 'Emisión electrónica', 'Historial tributario'],
    accent: 'gold',
  },
  {
    icon: ChefHat,
    title: 'Cocina',
    description: 'Comandas digitales en tiempo real entre salón, barra y cocina.',
    highlights: ['Pedidos en vivo', 'Tiempos de preparación', 'Menos errores'],
  },
  {
    icon: Truck,
    title: 'Delivery',
    description: 'Gestión completa de repartos, pedidos y seguimiento de entregas.',
    highlights: ['Repartidores', 'Pedidos a domicilio', 'Estado en tiempo real'],
  },
  {
    icon: BarChart3,
    title: 'Reportes',
    description: 'Visión clara del negocio con métricas actualizadas al minuto.',
    highlights: ['Ventas del día', 'Productos top', 'Rendimiento general'],
  },
  {
    icon: Package,
    title: 'Inventario',
    description: 'Control de stock, movimientos y alertas operativas esenciales.',
    highlights: ['Stock en tiempo real', 'Alertas de mínimo', 'Movimientos'],
  },
  {
    icon: Brain,
    title: 'Inventario inteligente',
    description: 'Automatización avanzada con alertas y análisis predictivo de stock.',
    highlights: ['Control automático', 'Alertas inteligentes', 'Análisis de inventario'],
    accent: 'gold',
  },
  {
    icon: Warehouse,
    title: 'Almacenes e inventario',
    description: 'Múltiples almacenes con entradas, salidas y gestión centralizada.',
    highlights: ['Múltiples almacenes', 'Entradas y salidas', 'Gestión centralizada'],
  },
  {
    icon: ClipboardList,
    title: 'Requerimientos y recepción',
    description: 'Órdenes internas, recepción de productos y validación de compras.',
    highlights: ['Órdenes internas', 'Recepción de productos', 'Validación de compras'],
  },
  {
    icon: FileBarChart,
    title: 'Informes detallados',
    description: 'Reportes avanzados con análisis completo para decisiones estratégicas.',
    highlights: ['Reportes avanzados', 'Análisis completo', 'Estadísticas inteligentes'],
    accent: 'gold',
  },
  {
    icon: ShoppingBag,
    title: 'Informe de compras',
    description: 'Compras mensuales, proveedores y costos operativos bajo control.',
    highlights: ['Compras mensuales', 'Proveedores', 'Costos operativos'],
  },
  {
    icon: TrendingUp,
    title: 'Informe de productos',
    description: 'Productos más vendidos, rendimiento y rotación del menú.',
    highlights: ['Más vendidos', 'Rendimiento por plato', 'Rotación de productos'],
  },
  {
    icon: Wallet,
    title: 'Finanzas',
    description: 'Ingresos, egresos y análisis financiero integrado al POS.',
    highlights: ['Ingresos y egresos', 'Análisis financiero', 'Flujo de caja'],
    accent: 'gold',
  },
  {
    icon: Boxes,
    title: 'Informes de inventario',
    description: 'Movimientos, stock crítico y pérdidas visibles en un panel.',
    highlights: ['Movimientos', 'Stock crítico', 'Control de pérdidas'],
  },
  {
    icon: Target,
    title: 'Indicadores estratégicos',
    description: 'KPIs y métricas clave para la dirección del restaurante.',
    highlights: ['KPIs del negocio', 'Métricas clave', 'Análisis empresarial'],
    accent: 'gold',
  },
  {
    icon: Sparkles,
    title: 'Indicadores inteligentes',
    description: 'Tendencias automáticas, visualización avanzada e insights accionables.',
    highlights: ['Tendencias automáticas', 'Análisis visual', 'Insights inteligentes'],
    accent: 'gold',
  },
  {
    icon: Printer,
    title: 'Impresión automática',
    description: 'Tickets y comandas en impresoras térmicas sin intervención manual.',
    highlights: ['Impresión térmica', 'Comandas automáticas', 'Multi impresora'],
  },
  {
    icon: Users,
    title: 'Multiusuario',
    description: 'Roles y permisos para cada área: caja, meseros y administración.',
    highlights: ['Roles personalizados', 'Permisos por módulo', 'Auditoría de accesos'],
  },
  {
    icon: LayoutGrid,
    title: 'Control de mesas',
    description: 'Mapa visual de mesas, tiempos y estados de atención en vivo.',
    highlights: ['Mapa de mesas', 'Estados en vivo', 'Tiempos de atención'],
  },
  {
    icon: Cloud,
    title: 'Acceso en la nube',
    description: 'Opera desde cualquier lugar con datos seguros y siempre sincronizados.',
    highlights: ['Acceso remoto', 'Backups automáticos', 'Alta disponibilidad'],
  },
];

export const BENEFITS: Benefit[] = [
  {
    icon: Zap,
    title: 'Atención más rápida',
    description: 'Reduce tiempos de espera y atiende más clientes por turno.',
  },
  {
    icon: ShieldCheck,
    title: 'Menos errores',
    description: 'Elimina errores manuales con pedidos digitales y automatizados.',
  },
  {
    icon: Monitor,
    title: 'Fácil de usar',
    description: 'Interfaz intuitiva que tu equipo aprende en minutos, no en días.',
  },
  {
    icon: Smartphone,
    title: 'Multiplataforma',
    description: 'Funciona en PC, tablet y celular con la misma experiencia fluida.',
  },
  {
    icon: Cloud,
    title: 'Seguridad y backups',
    description: 'Tus datos protegidos con respaldos automáticos en la nube.',
  },
  {
    icon: BarChart3,
    title: 'Control total',
    description: 'Supervisa ventas, inventario y operaciones desde un solo panel.',
  },
];

export const GALLERY: GalleryItem[] = [
  {
    id: 'panel',
    title: 'Panel en vivo',
    description: 'Monitorea ventas, mesas, delivery, cocina e inventario en tiempo real.',
    image: '/images/dashboard-panel.png',
    gradient: 'from-blue-500/20 to-purple-500/20',
  },
  {
    id: 'ventas',
    title: 'Ventas y reportes',
    description: 'Gráficos, caja, Yape/Plin y métricas financieras del día.',
    image: '/images/dashboard-ventas.png',
    gradient: 'from-brand-gold/20 to-blue-500/20',
  },
  {
    id: 'mesas',
    title: 'Mapa de mesas',
    description: 'Control visual de mesas, venta rápida y cierre de caja integrado.',
    image: '/images/mapa-mesas.png',
    gradient: 'from-green-500/20 to-blue-500/20',
  },
  {
    id: 'indicadores',
    title: 'Indicadores e IA analítica',
    description: 'KPIs, alertas de stock, productividad y análisis inteligente.',
    image: '/images/indicadores.png',
    gradient: 'from-purple-500/20 to-brand-gold/20',
  },
];

export const HERO_SLIDES: HeroSlide[] = GALLERY.map((item) => ({
  src: item.image,
  alt: `${item.title} — Resto Fadey`,
  caption: `Resto-FADEY — ${item.title}`,
}));

export const PLANS: Plan[] = [
  {
    name: 'Básico',
    price: 'S/ 150',
    period: '/mes',
    tagline: 'Opera tu local con lo esencial, sin complicaciones.',
    description:
      'Pensado para restaurantes que empiezan a digitalizar ventas, mesas y caja con un control claro del día a día.',
    modules: [
      'Módulo de ventas — registro rápido de pedidos y comandas',
      'Módulo de mesas — mapa visual, estados y tiempos de atención',
      'Caja — apertura, cierre, arqueo y control del turno',
      'Informe básico de ventas — resumen diario y cierre operativo',
    ],
    benefits: [
      'Interfaz simple para cajeros y meseros',
      'Acceso en la nube desde PC o tablet',
      'Soporte por email en horario laboral',
    ],
  },
  {
    name: 'Pro',
    price: 'S/ 200',
    period: '/mes',
    tagline: 'Control operativo completo: stock, pedidos, reservas y facturación.',
    description:
      'El plan intermedio ideal para restaurantes en crecimiento que necesitan inventario, más reportes y cumplimiento tributario.',
    includesFrom: 'Básico',
    modules: [
      'Inventario — stock, alertas y movimientos de almacén',
      'Pedidos — salón, delivery y seguimiento en tiempo real',
      'Reservas — agenda, confirmaciones y control de aforo',
      'Reportes de ventas detallados — análisis por periodo y canal',
      'Informe de productos — más vendidos, rotación y rendimiento',
      'Facturación electrónica — emisión SUNAT y comprobantes legales',
    ],
    benefits: [
      'Multiusuario con roles (hasta 10 usuarios)',
      'Cocina y bar integrados al flujo de pedidos',
      'Soporte prioritario por WhatsApp y email',
    ],
  },
  {
    name: 'Premium',
    price: 'S/ 299',
    period: '/mes',
    tagline: 'Inteligencia de negocio, personal y decisiones estratégicas.',
    description:
      'La solución más completa para restaurantes de alto volumen que exigen indicadores avanzados, finanzas y gestión de equipo.',
    includesFrom: 'Pro',
    modules: [
      'Indicadores inteligentes — tendencias automáticas e insights visuales',
      'Asistente de negocio — recomendaciones para mejorar resultados',
      'Gestión de personal — horarios, turnos y control de pagos',
      'Informes avanzados de finanzas — ingresos, egresos y flujo de caja',
      'Informes avanzados de inventario — movimientos, mermas y stock crítico',
      'Indicadores estratégicos — KPIs, métricas clave y análisis empresarial',
    ],
    benefits: [
      'Todos los módulos operativos del ecosistema Resto Fadey',
      'API e integraciones con sistemas externos',
      'Gerente de cuenta y capacitación personalizada',
      'Soporte prioritario 24/7',
    ],
    highlighted: true,
    badge: 'Más solicitado',
    semestralNote: 'S/ 1.500 semestral',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Carlos Mendoza',
    restaurant: 'La Casona Criolla',
    comment:
      'Desde que usamos Resto Fadey, nuestras ventas aumentaron un 30%. La cocina recibe los pedidos al instante y ya no perdemos comandas.',
    rating: 5,
  },
  {
    name: 'María Elena Ríos',
    restaurant: 'Sushi Bar Nikkei',
    comment:
      'El sistema es increíblemente fácil de usar. Mi equipo lo aprendió en un día. Las boletas electrónicas con SUNAT funcionan perfecto.',
    rating: 5,
  },
  {
    name: 'Roberto Vargas',
    restaurant: 'Pizza Express Lima',
    comment:
      'El módulo de delivery cambió nuestro negocio. Gestionamos 200+ pedidos diarios sin errores. El soporte es excelente.',
    rating: 5,
  },
  {
    name: 'Ana Lucía Torres',
    restaurant: 'Café del Parque',
    comment:
      'Los reportes me permiten tomar decisiones inteligentes. Sé exactamente qué platos venden más y cuándo reponer inventario.',
    rating: 5,
  },
];

export const FAQS: FAQItem[] = [
  {
    question: '¿Funciona con SUNAT?',
    answer:
      'Sí, Resto Fadey está preparado para la emisión de comprobantes electrónicos compatibles con SUNAT. Emitimos boletas y facturas electrónicas cumpliendo con la normativa vigente en Perú.',
  },
  {
    question: '¿Se puede usar en celular?',
    answer:
      'Absolutamente. Resto Fadey funciona en PC, tablet y celular. Puedes tomar pedidos desde cualquier dispositivo con conexión a internet.',
  },
  {
    question: '¿Tiene soporte?',
    answer:
      'Ofrecemos soporte técnico por WhatsApp, email y teléfono. Los planes Pro y Premium incluyen soporte prioritario 24/7.',
  },
  {
    question: '¿Necesito internet?',
    answer:
      'Sí, se requiere conexión a internet para sincronizar datos en la nube. Estamos desarrollando modo offline para operaciones sin conexión.',
  },
  {
    question: '¿Qué impresoras son compatibles?',
    answer:
      'Compatible con impresoras térmicas de 58mm y 80mm de marcas como Epson, Star, Bixolon, Zebra y otras con conexión USB, red o Bluetooth.',
  },
];
