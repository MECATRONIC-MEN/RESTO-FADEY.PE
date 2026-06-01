'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useAdminApi } from '@/hooks/useAdminApi';
import type { SaasFinanceSummary } from '@/lib/domain/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { KpiCard } from '@/components/admin/KpiCard';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { formatFinancePen, UpcomingPaymentsAlert } from '@/components/admin/finance/finance-ui';

const monthLabel = new Date().toLocaleString('es-PE', { month: 'long', year: 'numeric' });

export function SaasProfitPanel() {
  const { data: summary, loading, error, refetch } =
    useAdminApi<SaasFinanceSummary>('/api/admin/finance/summary');

  if (loading) return <p className="text-brand-mist">Cargando ganancia…</p>;
  if (error || !summary) return <p className="text-red-300">{error ?? 'Sin datos'}</p>;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <AdminPageHeader
        title="Ganancia total"
        description="Utilidad del negocio Resto Fadey: ingresos por planes − impuestos pagados − planilla pagada."
        actions={
          <button type="button" onClick={() => refetch()} className="btn-secondary px-4 py-2 text-sm">
            Actualizar
          </button>
        }
      />

      <UpcomingPaymentsAlert items={summary.upcomingPayments} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Ingresos del mes" value={formatFinancePen(summary.revenueThisMonth)} change={monthLabel} premium />
        <KpiCard
          label="Ganancia neta del mes"
          value={formatFinancePen(summary.netProfitThisMonth)}
          change="Después de impuestos y planilla"
          premium
        />
        <KpiCard label="Impuestos pagados (mes)" value={formatFinancePen(summary.taxesPaidThisMonth)} />
        <KpiCard label="Planilla pagada (mes)" value={formatFinancePen(summary.payrollPaidThisMonth)} />
      </div>

      <DashboardCard title="Cálculo del mes">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-white/10 pb-2">
            <dt className="text-brand-mist">Ingresos por venta de planes</dt>
            <dd className="font-medium text-brand-soft">{formatFinancePen(summary.revenueThisMonth)}</dd>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-2">
            <dt className="text-brand-mist">− Impuestos pagados</dt>
            <dd className="text-red-200">{formatFinancePen(summary.taxesPaidThisMonth)}</dd>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-2">
            <dt className="text-brand-mist">− Planilla pagada</dt>
            <dd className="text-red-200">{formatFinancePen(summary.payrollPaidThisMonth)}</dd>
          </div>
          <div className="flex justify-between pt-1">
            <dt className="font-medium text-brand-soft">= Ganancia neta</dt>
            <dd className="kpi-gold text-lg font-bold">{formatFinancePen(summary.netProfitThisMonth)}</dd>
          </div>
        </dl>
        {(summary.taxesPendingAmount > 0 || summary.payrollPendingAmount > 0) && (
          <p className="mt-4 text-xs text-amber-200/90">
            Pendiente por pagar (aún no descontado): impuestos {formatFinancePen(summary.taxesPendingAmount)} ·
            planilla {formatFinancePen(summary.payrollPendingAmount)}
          </p>
        )}
      </DashboardCard>

      <DashboardCard title="Acumulado histórico">
        <dl className="grid gap-4 sm:grid-cols-3 text-sm">
          <div>
            <dt className="text-xs text-brand-slate">Ingresos totales</dt>
            <dd className="mt-1 text-lg font-bold text-brand-soft">{formatFinancePen(summary.revenueTotal)}</dd>
          </div>
          <div>
            <dt className="text-xs text-brand-slate">Egresos registrados (imp. + planilla)</dt>
            <dd className="mt-1 text-lg font-bold text-red-200">
              {formatFinancePen(summary.taxesPaidTotal + summary.payrollPaidTotal)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-brand-slate">Ganancia neta acumulada</dt>
            <dd className="kpi-gold mt-1 text-lg font-bold">{formatFinancePen(summary.netProfitTotal)}</dd>
          </div>
        </dl>
      </DashboardCard>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/finanzas/impuestos"
          className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm hover:border-brand-gold/30"
        >
          Gestionar impuestos
          <ArrowRight className="h-4 w-4 text-brand-cyan" />
        </Link>
        <Link
          href="/admin/finanzas/personal"
          className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm hover:border-brand-gold/30"
        >
          Gestionar planilla
          <ArrowRight className="h-4 w-4 text-brand-cyan" />
        </Link>
      </div>
    </div>
  );
}
