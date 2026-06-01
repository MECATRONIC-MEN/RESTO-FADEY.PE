/** Slugs de módulos del POS que incluye cada plan de restaurante (Básico / Pro / Premium) */

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
  ia_predictiva: 'IA predictiva',
  alertas_ia: 'Alertas de IA',
  all: 'Suite completa (todos los módulos POS)',
};

export function formatPlanModule(slug: string): string {
  return PLAN_MODULE_LABELS[slug] ?? slug.replace(/_/g, ' ');
}
