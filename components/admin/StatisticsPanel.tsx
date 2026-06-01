'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useAdminApi } from '@/hooks/useAdminApi';
import type { FinancialStats, SaasFinanceSummary } from '@/lib/domain/types';
import { SAAS_BACKOFFICE_FINANCE } from '@/lib/saas-backoffice-finance';
import { UpcomingPaymentsAlert, formatFinancePen } from '@/components/admin/finance/finance-ui';
import { AdminPageHeader } from './AdminPageHeader';
import { KpiCard } from './KpiCard';
import { BarChart } from './BarChart';
import { DashboardCard } from '@/components/dashboard/DashboardCard';

const REFRESH_MS = 30_000;

function formatPen(amount: number) {
  return `S/ ${amount.toLocaleString('es-PE')}`;
}

function financeMetric(id: string, finance: SaasFinanceSummary | null): { value: string; hint: string } {
  if (!finance) return { value: '—', hint: 'Cargando…' };
  switch (id) {
    case 'impuestos_planes':
      return {
        value: formatFinancePen(finance.taxesPaidThisMonth),
        hint: `Pendiente: ${formatFinancePen(finance.taxesPendingAmount)}`,
      };
    case 'ganancia_total':
      return {
        value: formatFinancePen(finance.netProfitThisMonth),
        hint: `Ingresos mes: ${formatFinancePen(finance.revenueThisMonth)}`,
      };
    case 'pago_personal':
      return {
        value: formatFinancePen(finance.payrollPaidThisMonth),
        hint: `Pendiente: ${formatFinancePen(finance.payrollPendingAmount)}`,
      };
    default:
      return { value: '—', hint: '' };
  }
}

export function StatisticsPanel() {
  const { data: stats, loading, error, refetch } = useAdminApi<FinancialStats>('/api/statistics');
  const { data: finance, refetch: refetchFinance } =
    useAdminApi<SaasFinanceSummary>('/api/admin/finance/summary');

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
      refetchFinance();
    }, REFRESH_MS);
    return () => clearInterval(interval);
  }, [refetch, refetchFinance]);

  if (loading) {
    return <p className="text-brand-mist">Cargando estadísticas…</p>;
  }

  if (error || !stats) {
    return <p className="text-red-300">{error ?? 'Sin datos'}</p>;
  }

  const monthLabel = new Date().toLocaleString('es-PE', { month: 'long', year: 'numeric' });
  const maxPlanCount = Math.max(1, ...stats.planDistribution.map((p) => p.count));

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <AdminPageHeader
        title="Estadísticas financieras"
        description="KPIs de venta de planes, clientes y control financiero del negocio Resto Fadey."
      />

      {finance && finance.upcomingPayments.length > 0 && (
        <UpcomingPaymentsAlert items={finance.upcomingPayments} />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Ingresos totales" value={formatPen(stats.totalRevenue)} premium />
        <KpiCard label="Ingresos mensuales" value={formatPen(stats.monthlyRevenue)} change={monthLabel} />
        <KpiCard
          label="Ganancia neta (mes)"
          value={finance ? formatFinancePen(finance.netProfitThisMonth) : '—'}
          premium
        />
        <KpiCard label="Clientes activos" value={String(stats.activeClients)} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Pagos pendientes" value={String(stats.pendingPayments)} change="Requieren revisión" />
        <KpiCard label="Morosos / vencidos" value={String(stats.overdueClients)} change="Seguimiento" />
        <KpiCard label="Nuevos este mes" value={String(stats.newClientsThisMonth)} trend="up" />
        <KpiCard label="Tasa renovación" value={`${stats.renewalRate}%`} premium />
      </div>

      <DashboardCard title="Finanzas del negocio SaaS">
        <p className="mb-4 text-sm text-brand-mist">
          Impuestos, planilla y ganancia sobre las ventas de suscripciones — igual que los demás módulos del
          admin, con registro y avisos de pago.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {SAAS_BACKOFFICE_FINANCE.map((area) => {
            const Icon = area.icon;
            const metric = financeMetric(area.id, finance ?? null);
            return (
              <Link
                key={area.id}
                href={area.href}
                className="group rounded-xl border border-brand-gold/20 bg-brand-gold/5 p-4 transition-colors hover:border-brand-gold/40"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-lg border border-brand-gold/25 bg-brand-gold/10 p-2">
                    <Icon className="h-5 w-5 text-brand-gold-light" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-brand-soft group-hover:text-brand-gold-light">
                      {area.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-brand-mist">{area.description}</p>
                    <p className="kpi-gold mt-3 text-lg font-semibold">{metric.value}</p>
                    <p className="mt-1 text-[11px] text-brand-slate">{metric.hint}</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs text-brand-cyan">
                      Abrir módulo
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </DashboardCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard title="Ingresos mensuales (últimos 6 meses)">
          <BarChart
            data={stats.revenueByMonth.map((m) => ({ label: m.month, value: m.amount }))}
            highlightLast
          />
        </DashboardCard>
        <DashboardCard title="Distribución por plan">
          {stats.planDistribution.length === 0 ? (
            <p className="text-sm text-brand-mist">Sin clientes con plan asignado.</p>
          ) : (
            <ul className="space-y-4">
              {stats.planDistribution.map((p) => (
                <li key={p.plan}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-brand-soft">{p.plan}</span>
                    <span className="kpi-gold">{p.count} clientes</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-cyan to-brand-gold"
                      style={{ width: `${(p.count / maxPlanCount) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>
      </div>

      <DashboardCard title="Métricas adicionales">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-brand-slate">Ingresos anuales ({new Date().getFullYear()})</p>
            <p className="kpi-gold text-xl">{formatPen(stats.yearlyRevenue)}</p>
          </div>
          <div>
            <p className="text-xs text-brand-slate">Usuarios activos (30 días)</p>
            <p className="text-xl font-bold text-brand-soft">{stats.activeUsers}</p>
          </div>
          <div>
            <p className="text-xs text-brand-slate">Tasa cancelación</p>
            <p className="text-xl font-bold text-brand-soft">{stats.churnRate}%</p>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}
