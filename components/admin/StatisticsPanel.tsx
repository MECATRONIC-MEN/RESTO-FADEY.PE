'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { X, ExternalLink } from 'lucide-react';
import { useAdminApi } from '@/hooks/useAdminApi';
import type { FinancialStats, SaasFinanceSummary } from '@/lib/domain/types';
import { UpcomingPaymentsAlert, formatFinancePen } from '@/components/admin/finance/finance-ui';
import { AdminPageHeader } from './AdminPageHeader';
import { KpiCard } from './KpiCard';
import { ProfitGrowthKpiCard } from './ProfitGrowthKpiCard';
import { BarChart } from './BarChart';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { SAAS_BACKOFFICE_FINANCE, type SaasBackofficeFinanceId } from '@/lib/saas-backoffice-finance';

const REFRESH_MS = 30_000;

function formatPen(amount: number) {
  return `S/ ${amount.toLocaleString('es-PE')}`;
}

function financeMetric(id: SaasBackofficeFinanceId, finance: SaasFinanceSummary | null): string {
  if (!finance) return '—';
  switch (id) {
    case 'impuestos_planes':
      return formatFinancePen(finance.taxesPaidThisMonth);
    case 'ganancia_total':
      return formatFinancePen(finance.netProfitThisMonth);
    case 'pago_personal':
      return formatFinancePen(finance.payrollPaidThisMonth);
    case 'pendiente_pagar':
      return formatFinancePen(finance.taxesPendingAmount + finance.payrollPendingAmount);
    default:
      return '—';
  }
}

export function StatisticsPanel() {
  const { data: stats, loading, error, refetch } = useAdminApi<FinancialStats>('/api/statistics');
  const {
    data: finance,
    error: financeError,
    refetch: refetchFinance,
  } = useAdminApi<SaasFinanceSummary>('/api/admin/finance/summary');
  const [activeFinance, setActiveFinance] = useState<SaasBackofficeFinanceId | null>(null);

  const selectedFinance = useMemo(
    () => SAAS_BACKOFFICE_FINANCE.find((item) => item.id === activeFinance) ?? null,
    [activeFinance]
  );

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
        <KpiCard
          label="Ganancia total"
          value={finance ? formatFinancePen(finance.netProfitTotal) : '—'}
          premium
        />
        <KpiCard label="Ingresos mensuales" value={formatPen(stats.monthlyRevenue)} change={monthLabel} />
        <KpiCard label="Clientes activos" value={String(stats.activeClients)} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          label="Ganancia neta (mes)"
          value={finance ? formatFinancePen(finance.netProfitThisMonth) : '—'}
          premium
        />
        <ProfitGrowthKpiCard amount={finance?.netProfitTotal ?? 0} />
        <KpiCard label="Pagos pendientes" value={String(stats.pendingPayments)} change="Revisar ahora" />
        <KpiCard label="Morosos / vencidos" value={String(stats.overdueClients)} change="Seguimiento" />
        <KpiCard label="Nuevos este mes" value={String(stats.newClientsThisMonth)} trend="up" />
        <KpiCard label="Tasa renovación" value={`${stats.renewalRate}%`} premium />
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-slate">
          Funciones financieras
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {SAAS_BACKOFFICE_FINANCE.map((item) => (
            <KpiCard
              key={item.id}
              label={item.title}
              value={financeMetric(item.id, finance ?? null)}
              change="Clic para gestionar"
              premium
              onClick={() => setActiveFinance(item.id)}
            />
          ))}
        </div>
        {financeError && (
          <p className="text-xs text-red-300">
            {financeError}. Ejecuta <code>EJECUTAR_013_FINANZAS_SAAS.sql</code> en Supabase.
          </p>
        )}
      </div>

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

      {selectedFinance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-deep/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-brand-gold/30 bg-brand-panel p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-brand-slate">Módulo financiero</p>
                <h3 className="font-display text-2xl font-bold text-brand-soft">{selectedFinance.title}</h3>
                <p className="mt-1 text-sm text-brand-mist">{selectedFinance.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveFinance(null)}
                className="rounded-lg p-2 text-brand-mist hover:bg-white/10"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <DashboardCard title="Opciones">
                <ul className="space-y-2 text-sm text-brand-mist">
                  {selectedFinance.id === 'impuestos_planes' && (
                    <>
                      <li>• Registrar nuevo impuesto</li>
                      <li>• Definir fecha de vencimiento</li>
                      <li>• Marcar impuesto como pagado</li>
                    </>
                  )}
                  {selectedFinance.id === 'ganancia_total' && (
                    <>
                      <li>• Ver ganancia neta del mes</li>
                      <li>• Revisar ingresos vs egresos</li>
                      <li>• Ver pendientes por pagar</li>
                    </>
                  )}
                  {selectedFinance.id === 'pago_personal' && (
                    <>
                      <li>• Registrar colaborador</li>
                      <li>• Programar pagos por fecha</li>
                      <li>• Marcar pago del personal</li>
                    </>
                  )}
                  {selectedFinance.id === 'pendiente_pagar' && (
                    <>
                      <li>• Ver impuestos pendientes</li>
                      <li>• Ver planilla pendiente</li>
                      <li>• Revisar cálculo de ganancia</li>
                    </>
                  )}
                </ul>
              </DashboardCard>
              <DashboardCard title="Acción rápida">
                <p className="text-sm text-brand-mist">
                  Abre la ventana completa para registrar y gestionar este módulo.
                </p>
                <Link
                  href={selectedFinance.href}
                  className="btn-primary mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm"
                >
                  Abrir {selectedFinance.title}
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </DashboardCard>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
