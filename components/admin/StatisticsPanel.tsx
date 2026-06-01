'use client';

import { useEffect } from 'react';
import { useAdminApi } from '@/hooks/useAdminApi';
import type { FinancialStats, SaasFinanceSummary } from '@/lib/domain/types';
import { FinanceModulesNav } from '@/components/admin/finance/FinanceModulesNav';
import { UpcomingPaymentsAlert, formatFinancePen } from '@/components/admin/finance/finance-ui';
import { AdminPageHeader } from './AdminPageHeader';
import { KpiCard } from './KpiCard';
import { BarChart } from './BarChart';
import { DashboardCard } from '@/components/dashboard/DashboardCard';

const REFRESH_MS = 30_000;

function formatPen(amount: number) {
  return `S/ ${amount.toLocaleString('es-PE')}`;
}

export function StatisticsPanel() {
  const { data: stats, loading, error, refetch } = useAdminApi<FinancialStats>('/api/statistics');
  const {
    data: finance,
    error: financeError,
    refetch: refetchFinance,
  } = useAdminApi<SaasFinanceSummary>('/api/admin/finance/summary');

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
        description="KPIs de venta de planes y acceso a finanzas del negocio Resto Fadey."
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
        <KpiCard label="Pagos pendientes" value={String(stats.pendingPayments)} change="Revisar ahora" />
        <KpiCard label="Morosos / vencidos" value={String(stats.overdueClients)} change="Seguimiento" />
        <KpiCard label="Nuevos este mes" value={String(stats.newClientsThisMonth)} trend="up" />
        <KpiCard label="Tasa renovación" value={`${stats.renewalRate}%`} premium />
      </div>

      <FinanceModulesNav finance={finance} financeError={financeError} />

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
