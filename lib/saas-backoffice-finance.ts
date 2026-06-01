import { AlertCircle, Landmark, TrendingUp, UsersRound, type LucideIcon } from 'lucide-react';

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
    title: 'Ganancia del mes',
    description: 'Utilidad neta del mes: ingresos − impuestos − planilla pagados.',
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
  {
    id: 'pendiente_pagar',
    title: 'Pendiente por pagar',
    description: 'Impuestos y planilla aún no pagados este periodo.',
    href: '/admin/finanzas/ganancia',
    icon: AlertCircle,
  },
] as const satisfies ReadonlyArray<{
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}>;

export type SaasBackofficeFinanceId = (typeof SAAS_BACKOFFICE_FINANCE)[number]['id'];
