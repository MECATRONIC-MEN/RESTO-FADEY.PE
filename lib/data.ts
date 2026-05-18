import {
  ShoppingCart,
  FileText,
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
  type LucideIcon,
} from 'lucide-react';

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
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
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
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
    description: 'Registra pedidos en segundos con una interfaz intuitiva y rápida.',
  },
  {
    icon: FileText,
    title: 'Boletas electrónicas',
    description: 'Emite comprobantes electrónicos compatibles con SUNAT al instante.',
  },
  {
    icon: ChefHat,
    title: 'Cocina',
    description: 'Envía pedidos a cocina en tiempo real y reduce tiempos de espera.',
  },
  {
    icon: Truck,
    title: 'Delivery',
    description: 'Gestiona entregas, repartidores y pedidos a domicilio sin complicaciones.',
  },
  {
    icon: BarChart3,
    title: 'Reportes',
    description: 'Analiza ventas, productos más vendidos y rendimiento de tu negocio.',
  },
  {
    icon: Package,
    title: 'Inventario',
    description: 'Controla stock, alertas de productos bajos y movimientos de almacén.',
  },
  {
    icon: Printer,
    title: 'Impresión automática',
    description: 'Imprime tickets y comandas automáticamente en impresoras térmicas.',
  },
  {
    icon: Users,
    title: 'Multiusuario',
    description: 'Asigna roles y permisos para cajeros, meseros y administradores.',
  },
  {
    icon: LayoutGrid,
    title: 'Control de mesas',
    description: 'Visualiza mesas ocupadas, libres y tiempos de atención en un mapa.',
  },
  {
    icon: Cloud,
    title: 'Acceso en la nube',
    description: 'Accede desde cualquier lugar con datos seguros en la nube.',
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
    icon: Printer,
    title: 'Impresoras térmicas',
    description: 'Compatible con las principales marcas de impresoras del mercado.',
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
    description: 'Ideal para restaurantes pequeños que inician su digitalización.',
    features: [
      'Ventas, mesas y caja',
      'Boletas electrónicas SUNAT',
      'Control de mesas',
      'Reportes básicos',
      'Soporte por email',
    ],
  },
  {
    name: 'Pro',
    price: 'S/ 200',
    period: '/mes',
    description: 'Para restaurantes en crecimiento que necesitan más módulos y usuarios.',
    features: [
      'Cocina, bar y delivery',
      'Inventario completo',
      'Reservas y pedido por QR',
      'Multiusuario (hasta 10)',
      'Reportes avanzados',
      'Soporte prioritario 24/7',
    ],
  },
  {
    name: 'Premium',
    price: 'S/ 299',
    period: '/mes',
    description: 'El plan más solicitado. Solución completa para restaurantes de alto volumen.',
    features: [
      'Todos los módulos incluidos',
      'Todas las funciones Pro',
      'API e integraciones',
      'Indicadores e IA analítica',
      'Gerente de cuenta dedicado',
      'Capacitación personalizada',
    ],
    highlighted: true,
    badge: 'Más solicitado',
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
