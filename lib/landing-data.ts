import {
  LayoutDashboard,
  Banknote,
  ChefHat,
  Wine,
  Warehouse,
  Package,
  ClipboardList,
  BarChart3,
  Wallet,
  Brain,
  BellRing,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface LandingMetric {
  id: string;
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
}

export interface ModuleTab {
  id: string;
  label: string;
  icon: LucideIcon;
  title: string;
  description: string;
  bullets: string[];
  kpis: { label: string; value: string; trend?: string }[];
  chartBars: number[];
  orders: { name: string; status: string }[];
  /** Distribución por canal (panel derecho del dashboard) */
  channels?: { name: string; percent?: number; value?: string; badge: string }[];
  /** Ventas relativas por hora (10h–22h) para gráfico de línea inferior */
  salesByHour?: { hour: string; sales: number }[];
  /** Alertas de inventario (fila inferior del dashboard) */
  stockAlerts?: { product: string; detail: string; level: 'urgent' | 'warning' }[];
  /** Ranking de productos más vendidos */
  productRanking?: { name: string; share: number }[];
  accent: 'cyan' | 'gold';
}

export interface AIFeature {
  title: string;
  description: string;
  metric: string;
}

export interface TestimonialPremium {
  name: string;
  restaurant: string;
  role: string;
  comment: string;
  result: string;
  rating: number;
  initials: string;
}

export const LANDING_METRICS: LandingMetric[] = [
  { id: 'restaurants', label: 'Restaurantes gestionados', value: 180, suffix: '+' },
  { id: 'orders', label: 'Pedidos procesados', value: 2.4, suffix: 'M', prefix: '' },
  { id: 'time', label: 'Tiempo operativo ahorrado', value: 35, suffix: '%' },
  { id: 'efficiency', label: 'Incremento de eficiencia', value: 42, suffix: '%' },
  { id: 'automation', label: 'Automatización operativa', value: 90, suffix: '%' },
];

export const MODULE_TABS: ModuleTab[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    title: 'Dashboard en tiempo real',
    description: '',
    bullets: [
      'Ventas en tiempo real',
      'Picos 1pm y 6pm',
      'Caja · Cocina · Bar',
      'IA predictiva',
      'Alertas de stock crítico',
    ],
    kpis: [
      { label: 'Ventas hoy', value: 'S/ 12,480', trend: '+18%' },
      { label: 'Pedidos activos', value: '34', trend: 'En vivo' },
      { label: 'Eficiencia', value: '92%', trend: 'Operación' },
    ],
    chartBars: [45, 62, 58, 78, 65, 88, 72, 90, 68, 95, 80, 92],
    orders: [],
    channels: [
      { name: 'Salón', percent: 68, badge: 'Mayor ventas' },
      { name: 'Inversión', value: 'S/ 5,000', percent: 42, badge: 'Inversión del día' },
      { name: 'Ganancias', percent: 60, badge: 'Margen neto' },
    ],
    salesByHour: [
      { hour: '9', sales: 18 },
      { hour: '10', sales: 28 },
      { hour: '11', sales: 42 },
      { hour: '12', sales: 68 },
      { hour: '13', sales: 88 },
      { hour: '14', sales: 72 },
      { hour: '15', sales: 38 },
      { hour: '16', sales: 40 },
      { hour: '17', sales: 55 },
      { hour: '18', sales: 100 },
      { hour: '19', sales: 75 },
      { hour: '20', sales: 58 },
      { hour: '21', sales: 42 },
      { hour: '22', sales: 25 },
    ],
    stockAlerts: [
      { product: 'Pollo fresco', detail: '2 kg · mín. 8 kg', level: 'urgent' },
      { product: 'Aceite vegetal', detail: '1 L · mín. 5 L', level: 'urgent' },
      { product: 'Arroz superior', detail: '5 kg · mín. 15 kg', level: 'warning' },
    ],
    productRanking: [
      { name: 'Lomo saltado', share: 100 },
      { name: 'Ceviche mixto', share: 78 },
      { name: 'Ají de gallina', share: 62 },
      { name: 'Chicha morada', share: 48 },
    ],
    accent: 'cyan',
  },
  {
    id: 'caja',
    label: 'Caja',
    icon: Banknote,
    title: 'Caja y control de turnos',
    description:
      'Apertura, arqueo, cobros y cierres sin fricción. Cuadre exacto por turno y cajero.',
    bullets: ['Apertura / cierre', 'Arqueo automático', 'Múltiples métodos de pago'],
    kpis: [
      { label: 'Caja actual', value: 'S/ 3,240', trend: 'Turno 2' },
      { label: 'Diferencia', value: 'S/ 0', trend: 'Cuadrado' },
      { label: 'Cierres hoy', value: '3', trend: 'OK' },
    ],
    chartBars: [50, 55, 60, 58, 72, 68, 75, 80, 78, 85, 82, 88],
    orders: [
      { name: 'Efectivo', status: '58%' },
      { name: 'Tarjeta', status: '35%' },
      { name: 'Yape / Plin', status: '7%' },
    ],
    accent: 'gold',
  },
  {
    id: 'cocina',
    label: 'Cocina',
    icon: ChefHat,
    title: 'Pantalla de cocina (KDS)',
    description:
      'Comandas digitales en tiempo real. Prioridad, tiempos y menos errores entre salón y cocina.',
    bullets: ['KDS por estación', 'Tiempos de preparación', 'Prioridad de pedidos'],
    kpis: [
      { label: 'Comandas activas', value: '19', trend: 'En vivo' },
      { label: 'Tiempo medio', value: '14 min', trend: '-2 min' },
      { label: 'Errores', value: '-67%', trend: 'vs manual' },
    ],
    chartBars: [55, 70, 48, 82, 60, 88, 52, 78, 66, 84, 58, 91],
    orders: [
      { name: 'Parrilla — Mesa 8', status: 'Urgente' },
      { name: 'Fritos — Mesa 3', status: 'En cocina' },
      { name: 'Postres', status: 'Listo' },
    ],
    accent: 'cyan',
  },
  {
    id: 'bar',
    label: 'Bar',
    icon: Wine,
    title: 'Barra y bebidas al instante',
    description:
      'Comandas de bar separadas, tiempos de preparación y control de coctelería e inventario de bar.',
    bullets: ['Comandas de bar', 'Recetas y porciones', 'Stock de barra'],
    kpis: [
      { label: 'Pedidos bar', value: '42', trend: 'Turno' },
      { label: 'Tiempo medio', value: '6 min', trend: 'Rápido' },
      { label: 'Top venta', value: 'Pisco sour', trend: '+24%' },
    ],
    chartBars: [40, 52, 65, 58, 72, 68, 80, 75, 88, 82, 90, 85],
    orders: [
      { name: 'Cerveza x4', status: 'Listo' },
      { name: 'Chilcano x2', status: 'Preparando' },
      { name: 'Ron — reposición', status: 'Stock' },
    ],
    accent: 'gold',
  },
  {
    id: 'almacenes',
    label: 'Almacenes',
    icon: Warehouse,
    title: 'Almacenes y bodegas',
    description:
      'Gestiona bodega principal, cocina y bar con traslados entre almacenes y ubicaciones.',
    bullets: ['Multi-almacén', 'Traslados', 'Ubicaciones'],
    kpis: [
      { label: 'Almacenes', value: '4', trend: 'Activos' },
      { label: 'Traslados hoy', value: '18', trend: 'Registrados' },
      { label: 'Valor total', value: 'S/ 48K', trend: 'Stock' },
    ],
    chartBars: [60, 58, 55, 62, 58, 65, 60, 68, 64, 70, 66, 72],
    orders: [
      { name: 'Bodega → Cocina', status: 'En tránsito' },
      { name: 'Bar ← Bodega', status: 'Completado' },
      { name: 'Seco — revisión', status: 'Pendiente' },
    ],
    accent: 'cyan',
  },
  {
    id: 'inventario',
    label: 'Inventario',
    icon: Package,
    title: 'Inventario y stock',
    description:
      'Control de insumos, alertas de stock crítico y reposición para no parar la operación.',
    bullets: ['Alertas automáticas', 'Mermas y ajustes', 'Stock mínimo'],
    kpis: [
      { label: 'SKUs activos', value: '248', trend: 'OK' },
      { label: 'Stock crítico', value: '3', trend: 'Alerta' },
      { label: 'Rotación', value: '+22%', trend: 'Mes' },
    ],
    chartBars: [70, 62, 58, 45, 40, 55, 60, 68, 72, 65, 58, 50],
    orders: [
      { name: 'Pollo — 12 kg', status: 'Reposición' },
      { name: 'Aceite — 5 L', status: 'OK' },
      { name: 'Limón — bajo', status: 'Crítico' },
    ],
    accent: 'gold',
  },
  {
    id: 'kardex',
    label: 'Kardex',
    icon: ClipboardList,
    title: 'Kardex y trazabilidad',
    description:
      'Historial de entradas, salidas y costos por producto. Auditoría completa de movimientos.',
    bullets: ['Trazabilidad', 'Costo unitario', 'Auditoría'],
    kpis: [
      { label: 'Movimientos hoy', value: '156', trend: '+8%' },
      { label: 'Valor stock', value: 'S/ 48K', trend: 'Actualizado' },
      { label: 'Ajustes', value: '2', trend: 'Revisión' },
    ],
    chartBars: [45, 52, 48, 60, 55, 58, 62, 59, 65, 61, 68, 64],
    orders: [],
    accent: 'cyan',
  },
  {
    id: 'reportes',
    label: 'Reportes',
    icon: BarChart3,
    title: 'Reportes y análisis',
    description:
      'Ventas, productos, canales y cierres exportables. Decisiones con datos reales del negocio.',
    bullets: ['KPIs operativos', 'Exportación', 'Históricos'],
    kpis: [
      { label: 'Reportes hoy', value: '24', trend: 'Auto' },
      { label: 'Top plato', value: 'Lomo', trend: '+32%' },
      { label: 'Canal top', value: 'Salón', trend: '58%' },
    ],
    chartBars: [55, 60, 65, 70, 68, 75, 80, 78, 85, 88, 90, 94],
    orders: [],
    accent: 'gold',
  },
  {
    id: 'finanzas',
    label: 'Finanzas',
    icon: Wallet,
    title: 'Finanzas y flujo de caja',
    description:
      'Ingresos, egresos, márgenes y reportes financieros integrados con tu operación diaria.',
    bullets: ['Flujo de caja', 'Ingresos / egresos', 'SUNAT'],
    kpis: [
      { label: 'Ingresos hoy', value: 'S/ 14,200', trend: '+15%' },
      { label: 'Margen', value: '38%', trend: '+2pp' },
      { label: 'Egresos', value: 'S/ 4,1K', trend: 'Controlado' },
    ],
    chartBars: [50, 62, 58, 75, 68, 82, 78, 88, 72, 85, 80, 92],
    orders: [],
    accent: 'cyan',
  },
  {
    id: 'ia-predictiva',
    label: 'IA Predictiva',
    icon: Brain,
    title: 'Inteligencia predictiva',
    description:
      'Anticipa ventas, demanda de insumos y horarios pico con modelos entrenados en tu operación.',
    bullets: ['Forecast de ventas', 'Horarios pico', 'Productos rentables'],
    kpis: [
      { label: 'Precisión', value: '94%', trend: 'IA' },
      { label: 'Ahorro insumos', value: '12%', trend: 'Mes' },
      { label: 'Pico estimado', value: '20:30', trend: 'Hoy' },
    ],
    chartBars: [40, 55, 70, 85, 78, 92, 88, 95, 82, 90, 86, 98],
    orders: [],
    accent: 'gold',
  },
  {
    id: 'alertas-ia',
    label: 'Alertas de IA',
    icon: BellRing,
    title: 'Alertas inteligentes automáticas',
    description:
      'Notificaciones proactivas: stock bajo, mermas, desvíos de caja y picos de demanda antes de que ocurran.',
    bullets: ['Stock crítico', 'Anomalías', 'Recomendaciones'],
    kpis: [
      { label: 'Alertas hoy', value: '5', trend: 'Activas' },
      { label: 'Resueltas', value: '3', trend: 'Auto' },
      { label: 'Pendientes', value: '2', trend: 'Revisar' },
    ],
    chartBars: [30, 45, 55, 70, 65, 80, 75, 88, 82, 90, 85, 95],
    orders: [
      { name: 'Stock pollo bajo', status: 'Urgente' },
      { name: 'Pico en 45 min', status: 'IA' },
      { name: 'Merma atípica', status: 'Revisión' },
    ],
    accent: 'cyan',
  },
  {
    id: 'configuracion',
    label: 'Configuración',
    icon: Settings,
    title: 'Configuración del restaurante',
    description:
      'Datos del local, usuarios, áreas, mesas, impresoras, comprobantes SUNAT y permisos en un solo lugar.',
    bullets: ['Datos del local', 'Usuarios y roles', 'SUNAT e impresoras'],
    kpis: [
      { label: 'Usuarios', value: '12', trend: 'Activos' },
      { label: 'Áreas', value: '4', trend: 'Salón + bar' },
      { label: 'SUNAT', value: 'OK', trend: 'Conectado' },
    ],
    chartBars: [55, 58, 60, 62, 65, 68, 70, 72, 74, 76, 78, 80],
    orders: [
      { name: 'Mesas y salones', status: 'OK' },
      { name: 'Impresoras', status: '3' },
      { name: 'Permisos', status: 'Listo' },
    ],
    accent: 'cyan',
  },
];

export const AI_FEATURES: AIFeature[] = [
  {
    title: 'Predicción de ventas',
    description: 'Anticipa demanda por día, turno y canal.',
    metric: '94% precisión',
  },
  {
    title: 'Productos rentables',
    description: 'Identifica platos estrella y los de baja rotación.',
    metric: '+18% margen',
  },
  {
    title: 'Horarios pico',
    description: 'Optimiza personal e inventario antes del rush.',
    metric: '-22% espera',
  },
  {
    title: 'Alertas inteligentes',
    description: 'Stock crítico, mermas y desvíos en tiempo real.',
    metric: '5 alertas/día',
  },
  {
    title: 'Recomendaciones IA',
    description: 'Sugerencias accionables para el gerente.',
    metric: 'Auto-pilot',
  },
  {
    title: 'Compras predictivas',
    description: 'Sugiere pedidos a proveedores según ventas y stock.',
    metric: '-12% merma',
  },
];

export const TESTIMONIALS_PREMIUM: TestimonialPremium[] = [
  {
    name: 'Carlos Mendoza',
    restaurant: 'La Casona Criolla',
    role: 'Dueño',
    comment:
      'Desde que usamos Resto Fadey, nuestras ventas aumentaron un 30%. La cocina recibe los pedidos al instante.',
    result: '+30% ventas',
    rating: 5,
    initials: 'CM',
  },
  {
    name: 'María Elena Ríos',
    restaurant: 'Sushi Bar Nikkei',
    role: 'Gerente',
    comment:
      'El sistema es increíblemente fácil de usar. Mi equipo lo aprendió en un día. SUNAT funciona perfecto.',
    result: 'SUNAT 100%',
    rating: 5,
    initials: 'MR',
  },
  {
    name: 'Roberto Vargas',
    restaurant: 'Pizza Express Lima',
    role: 'Operaciones',
    comment:
      'El módulo de delivery cambió nuestro negocio. Gestionamos 200+ pedidos diarios sin errores.',
    result: '200+ pedidos/día',
    rating: 5,
    initials: 'RV',
  },
  {
    name: 'Zoila Bardales',
    restaurant: 'Zoilas Suite E',
    role: 'Administración',
    comment:
      'Los reportes me permiten tomar decisiones inteligentes. Sé qué platos venden más y cuándo reponer.',
    result: 'Control total',
    rating: 5,
    initials: 'ZB',
  },
];

/** Nombres comerciales para la landing (planes internos siguen en lib/data) */
export const PLAN_DISPLAY_NAMES: Record<string, string> = {
  Básico: 'Básico',
  Pro: 'Profesional',
  Premium: 'Empresarial',
};
