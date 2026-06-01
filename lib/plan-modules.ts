/** Slugs de módulos SaaS → etiqueta legible (admin, licencias, planes) */

export const PLAN_MODULE_LABELS: Record<string, string> = {
  ventas: 'Ventas y mesas',
  mesas: 'Gestión de mesas',
  cocina: 'Cocina (KDS)',
  delivery: 'Delivery',
  inventario: 'Inventario',
  sunat: 'Facturación SUNAT',
  reportes: 'Reportes',
  finanzas: 'Finanzas y flujo de caja',
  personal: 'Gestión de personal',
  pagos_impuestos: 'Pagos de impuestos',
  ganancia_total: 'Ganancia total',
  pago_personal: 'Pago del personal',
  ia_predictiva: 'IA predictiva',
  alertas_ia: 'Alertas de IA',
  all: 'Suite completa',
};

/** Módulos exclusivos del plan Premium / Empresarial */
export const PREMIUM_FINANCE_MODULES = [
  'pagos_impuestos',
  'ganancia_total',
  'pago_personal',
] as const;

export type PremiumFinanceModuleId = (typeof PREMIUM_FINANCE_MODULES)[number];

export function formatPlanModule(slug: string): string {
  return PLAN_MODULE_LABELS[slug] ?? slug.replace(/_/g, ' ');
}

/** Lista de módulos del plan Premium en producción / mock */
export const PREMIUM_PLAN_MODULES: string[] = [
  'ventas',
  'cocina',
  'delivery',
  'inventario',
  'sunat',
  'reportes',
  'finanzas',
  'personal',
  ...PREMIUM_FINANCE_MODULES,
  'ia_predictiva',
  'alertas_ia',
];
