import { HERO_COMPOSITIONS, type HeroCompositionId } from '@/lib/hero-compositions';
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
  compositionId: HeroCompositionId;
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

export const GALLERY: GalleryItem[] = HERO_COMPOSITIONS.map((c) => ({
  id: c.id,
  title: c.title,
  description: c.description,
  image: c.id,
  gradient: c.gradient,
}));

export const HERO_SLIDES: HeroSlide[] = HERO_COMPOSITIONS.map((c) => ({
  compositionId: c.id,
  alt: c.alt,
  caption: c.caption,
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
      'Almacen — stock y movimientos de almacén',
      'Inventario — alertas y análisis de stock',
      'Informe — de ventas, resumen diario y cierre operativo',
    ],
    benefits: [
      'Capacitacion para administrador, cajeros y meseros',
      'Acceso multiplataforma',
      'Soporte en horario laboral',
    ],
    badge: 'Para Iniciar Tu Negocio',
  },
  {
    name: 'Pro',
    price: 'S/ 249',
    period: '/mes',
    tagline: 'Control operativo: Gestion de Ventas, Inventario, Almacenes, Reportes y Facturación Electrónica.',
    description:
      'El plan intermedio ideal para restaurantes en crecimiento que necesitan Automatización y Control de su Negocio.',
    includesFrom: 'Básico',
    modules: [
      'Inventario Inteligente — Control de stock, requerimientos y análisis de ventas',
      'Funcionamiento en vivo — salón, cocina, bar,  y seguimiento en tiempo real',
      'Reservas — agenda, confirmaciones y control de aforo',
      'Reportes de ventas detallados — análisis por periodo y canal',
      'Informe de productos — más vendidos, rotación y rendimiento',
      'Indicadores inteligentes — tendencias automáticas e insights visuales',
      'Asistente de negocio — recomendaciones para mejorar resultados',
      'Gestión de personal — horarios, turnos y control de pagos',
      'Informes avanzados de inventario — movimientos y stock crítico',
      'Indicadores estratégicos — KPIs, métricas clave y análisis empresarial',
      'Facturación electrónica — emisión SUNAT y comprobantes legales',
    ],
    benefits: [
      'Multiusuario, roles y permisos para cada área: caja, meseros, etc.',
      'Control en tiempo real de todo tu negocio',
      'Soporte prioritario por WhatsApp y email',
    ],
    badge: 'Para Restaurantes Ya Establecidos',
    semestralNote: 'S/ 1.200 semestral',
  },
  {
    name: 'Premium',
    price: 'S/ 299',
    period: '/mes',
    tagline: 'Inteligencia de negocio, personal y decisiones estratégicas.',
    description:
      'La solución más completa y control total para restaurantes de alto volumen que exigen indicadores avanzados, finanzas y gestión de equipo. Y lo más importante . Para aquellos que quieren escalar y ser un negocio top',
    includesFrom: 'Pro',
    modules: [
      'Indicadores inteligentes — tendencias automáticas e insights visuales',
      'Asistente de negocio — recomendaciones para mejorar resultados',
      'Gestión de personal — horarios, turnos y control de pagos',
      'Informes avanzados de finanzas — ingresos, egresos y flujo de caja',
      'Módulo de pagos de impuestos — obligaciones tributarias, vencimientos y registro de pagos',
      'Ganancia total — utilidad neta, margen y resultado consolidado del negocio',
      'Pago del personal — nómina, adelantos, liquidaciones y control de planilla',
      'Informes avanzados de inventario — movimientos, mermas y stock crítico',
      'Indicadores estratégicos — KPIs, métricas clave y análisis empresarial',
      'IA — Asistente de negocio, recomendaciones para mejorar resultados',
      'Alertas inteligentes — stock crítico, mermas, desvíos de caja y picos de demanda antes de que afecten.',
      'Automatización operativa — sin tareas repetitivas, cierras y automaticamente tienes los reportes sin intervención manual constante.',
      'Control operativo — visión unificada de caja, pedidos, cocina y cumplimiento del turno.',
      'Análisis de datos — KPIs, tendencias y comparativos para entender el rendimiento del local.',
      'Asistencia administrativa — apoyo inteligente para decisiones de personal, costos y rentabilidad.',
    ],
    benefits: [
      'Todos los módulos operativos del ecosistema Resto Fadey',
      'Capacitación personalizada para tu equipo',
      'Control total de tu negocio, desde un solo panel',
      'Acceso a recursos para crecer tu negocio',
      'Soporte priorizado por WhatsApp, email y atencion al cliente',
    ],
    highlighted: true,
    badge: 'Para Restaurantes Que Quieren Ser Top',
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
    restaurant: 'Pizza Express',
    comment:
      'Los modulos en general, y el monitoreo en vivo, cambió nuestro negocio. Gestionamos 200+ pedidos diarios sin errores. El soporte es excelente.',
    rating: 5,
  },
  {
    name: 'Zoila Bardales',
    restaurant: 'Zoilas Suite E',
    comment:
      'Los reportes me permiten tomar decisiones inteligentes. Sé exactamente qué platos venden más y cuándo reponer inventario.',
    rating: 5,
  },
];

export const FAQS: FAQItem[] = [
  {
    question: '¿Necesito internet para usar el sistema?',
    answer:
      'Sí. Actualmente Resto Fadey funciona mediante conexión a internet, permitiendo sincronización en tiempo real, acceso en la nube, emisión electrónica, reportes y administración centralizada desde cualquier lugar.',
  },
  {
    question: '¿Resto Fadey es compatible con SUNAT?',
    answer:
      'Sí. El sistema permite emisión de boletas y facturas electrónicas compatibles con SUNAT, facilitando la gestión tributaria de tu restaurante.',
  },
  {
    question: '¿Puedo controlar varias áreas de mi restaurante desde un solo sistema?',
    answer:
      'Sí. Resto Fadey integra ventas, cocina, delivery, inventario, almacenes, reportes y control de mesas en una sola plataforma.',
  },
  {
    question: '¿Qué tipo de restaurantes pueden usar Resto Fadey?',
    answer:
      'El sistema está diseñado para pollerías, restaurantes, cafeterías, cevicherías, fast food y negocios gastronómicos de distintos tamaños.',
  },
  {
    question: '¿El sistema incluye soporte y capacitación?',
    answer:
      'Sí. Los clientes tienen acceso a soporte, academia virtual, tutoriales y futuras actualizaciones del sistema.',
  },
];
