'use client';

import { useAdminApi } from '@/hooks/useAdminApi';
import type { FinancialStats } from '@/lib/domain/types';
import { AdminPageHeader } from './AdminPageHeader';
import { KpiCard } from './KpiCard';
import { BarChart } from './BarChart';
import { DashboardCard } from '@/components/dashboard/DashboardCard';

function formatPen(amount: number) {
  return `S/ ${amount.toLocaleString('es-PE')}`;
}

export function StatisticsPanel() {
  const { data: stats, loading, error } = useAdminApi<FinancialStats>('/api/statistics');

  if (loading) {
    return <p className="text-brand-mist">Cargando estadísticas…</p>;
  }

  if (error || !stats) {
    return <p className="text-red-300">{error ?? 'Sin datos'}</p>;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <AdminPageHeader
        title="Estadísticas financieras"
        description="KPIs SaaS, ingresos, clientes y métricas de crecimiento. Conectado a API /api/v1/statistics."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Ingresos totales" value={formatPen(stats.totalRevenue)} premium trend="up" change="+12.4% vs año anterior" />
        <KpiCard label="Ingresos mensuales" value={formatPen(stats.monthlyRevenue)} trend="up" change="Mayo 2026" />
        <KpiCard label="Clientes activos" value={String(stats.activeClients)} />
        <KpiCard label="Clientes Premium" value={String(stats.premiumClients)} premium />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Pagos pendientes" value={String(stats.pendingPayments)} change="Requieren revisión" />
        <KpiCard label="Morosos / vencidos" value={String(stats.overdueClients)} trend="down" change="Seguimiento" />
        <KpiCard label="Nuevos este mes" value={String(stats.newClientsThisMonth)} trend="up" />
        <KpiCard label="Tasa renovación" value={`${stats.renewalRate}%`} premium trend="up" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard title="Ingresos mensuales">
          <BarChart
            data={stats.revenueByMonth.map((m) => ({ label: m.month, value: m.amount }))}
            highlightLast
          />
        </DashboardCard>
        <DashboardCard title="Distribución por plan">
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
                    style={{ width: `${(p.count / 17) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </DashboardCard>
      </div>

      <DashboardCard title="Métricas adicionales">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-brand-slate">Ingresos anuales</p>
            <p className="kpi-gold text-xl">{formatPen(stats.yearlyRevenue)}</p>
          </div>
          <div>
            <p className="text-xs text-brand-slate">Usuarios activos POS</p>
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
