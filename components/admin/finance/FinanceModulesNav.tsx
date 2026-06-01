'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SAAS_BACKOFFICE_FINANCE } from '@/lib/saas-backoffice-finance';
import { formatFinancePen } from '@/components/admin/finance/finance-ui';
import type { SaasFinanceSummary } from '@/lib/domain/types';
import { DashboardCard } from '@/components/dashboard/DashboardCard';

function metricFor(id: string, finance: SaasFinanceSummary | null): string {
  if (!finance) return '—';
  switch (id) {
    case 'impuestos_planes':
      return formatFinancePen(finance.taxesPaidThisMonth);
    case 'ganancia_total':
      return formatFinancePen(finance.netProfitThisMonth);
    case 'pago_personal':
      return formatFinancePen(finance.payrollPaidThisMonth);
    default:
      return '—';
  }
}

export function FinanceModulesNav({
  finance,
  financeError,
}: {
  finance?: SaasFinanceSummary | null;
  financeError?: string | null;
}) {
  return (
    <DashboardCard title="Finanzas del negocio">
      {financeError && (
        <div className="mb-4 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          No se pudo cargar finanzas: {financeError}. Ejecuta{' '}
          <code className="text-red-100">EJECUTAR_013_FINANZAS_SAAS.sql</code> en Supabase y recarga.
        </div>
      )}
      <p className="mb-4 text-sm text-brand-mist">
        Registra impuestos, planilla y consulta ganancia. Haz clic en <strong className="text-brand-soft">Gestionar</strong>{' '}
        para agregar pagos.
      </p>
      <div className="space-y-2">
        {SAAS_BACKOFFICE_FINANCE.map((area) => {
          const Icon = area.icon;
          return (
            <div
              key={area.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="rounded-lg border border-brand-gold/25 bg-brand-gold/10 p-2">
                  <Icon className="h-5 w-5 text-brand-gold-light" />
                </div>
                <div>
                  <p className="font-medium text-brand-soft">{area.title}</p>
                  <p className="text-xs text-brand-mist">{area.description}</p>
                  <p className="kpi-gold mt-1 text-sm font-semibold">{metricFor(area.id, finance ?? null)}</p>
                </div>
              </div>
              <Link
                href={area.href}
                className="btn-primary inline-flex shrink-0 items-center gap-2 px-4 py-2 text-sm"
              >
                Gestionar
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
}
