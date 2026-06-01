import { Landmark, TrendingUp, UsersRound, type LucideIcon } from 'lucide-react';

/**
 * Áreas financieras del panel admin de Resto Fadey.
 * Controlan el negocio SaaS (venta de planes/suscripciones), NO el POS del restaurante.
 */
export const SAAS_BACKOFFICE_FINANCE = [
  {
    id: 'impuestos_planes',
    title: 'Pagos de impuestos',
    description: 'Impuestos sobre ingresos por venta de planes SaaS.',
    href: '/admin/finanzas/impuestos',
    icon: Landmark,
  },
  {
    id: 'ganancia_total',
    title: 'Ganancia total',
    description: 'Ingresos por planes − impuestos pagados − planilla pagada.',
    href: '/admin/finanzas/ganancia',
    icon: TrendingUp,
  },
  {
    id: 'pago_personal',
    title: 'Pago del personal',
    description: 'Tu equipo interno: datos, fechas, montos y registro de pagos.',
    href: '/admin/finanzas/personal',
    icon: UsersRound,
  },
] as const satisfies ReadonlyArray<{
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}>;

export type SaasBackofficeFinanceId = (typeof SAAS_BACKOFFICE_FINANCE)[number]['id'];
