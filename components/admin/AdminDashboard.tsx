'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import {
  Wallet,
  Users,
  BarChart3,
  ArrowRight,
  Bell,
  BookOpen,
  PlayCircle,
  FolderOpen,
  Tag,
  ExternalLink,
  ImageIcon,
  Settings,
  Landmark,
  TrendingUp,
  UsersRound,
} from 'lucide-react';
import { useAdminApi } from '@/hooks/useAdminApi';
import type { FinancialStats, PaymentRecord, SaasFinanceSummary } from '@/lib/domain/types';
import { FinanceModulesNav } from '@/components/admin/finance/FinanceModulesNav';
import { AdminPageHeader } from './AdminPageHeader';
import { KpiCard } from './KpiCard';
import { StatusBadge } from './StatusBadge';
import { DashboardCard } from '@/components/dashboard/DashboardCard';

const REFRESH_MS = 30_000;

function formatMethod(method: string) {
  return method.charAt(0).toUpperCase() + method.slice(1);
}

export function AdminDashboard() {
  const { data: stats, refetch: refetchStats } = useAdminApi<FinancialStats>('/api/statistics');
  const { data: finance, error: financeError } =
    useAdminApi<SaasFinanceSummary>('/api/admin/finance/summary');
  const { data: payments, loading: loadingPayments, refetch: refetchPayments } =
    useAdminApi<PaymentRecord[]>('/api/payments?limit=5');

  const recent = payments ?? [];

  useEffect(() => {
    const interval = setInterval(() => {
      refetchStats();
      refetchPayments();
    }, REFRESH_MS);
    return () => clearInterval(interval);
  }, [refetchStats, refetchPayments]);

  const monthLabel = new Date().toLocaleString('es-PE', { month: 'long', year: 'numeric' });

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <AdminPageHeader
        title="Centro administrativo"
        description="Backoffice SaaS de Resto Fadey — clientes, pagos, licencias, contenido y métricas del POS."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Ingresos mensuales"
          value={stats ? `S/ ${stats.monthlyRevenue.toLocaleString('es-PE')}` : '—'}
          premium
          trend="up"
          change={monthLabel}
        />
        <KpiCard label="Clientes activos" value={stats ? String(stats.activeClients) : '—'} />
        <KpiCard
          label="Pagos pendientes"
          value={stats ? String(stats.pendingPayments) : '—'}
          change="Revisar ahora"
        />
        <KpiCard
          label="Renovación"
          value={stats ? `${stats.renewalRate}%` : '—'}
          premium
          trend="up"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <DashboardCard title="Pagos recientes" className="lg:col-span-2">
          {loadingPayments ? (
            <p className="text-sm text-brand-mist">Cargando pagos…</p>
          ) : recent.length === 0 ? (
            <p className="text-sm text-brand-mist">No hay pagos registrados.</p>
          ) : (
            <ul className="max-h-80 space-y-3 overflow-y-auto pr-1">
              {recent.map((p) => (
                <li
                  key={p.id}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-brand-soft">
                        {p.restaurantName || p.clientName}
                      </p>
                      <p className="mt-0.5 text-xs text-brand-slate">
                        {formatMethod(p.method)} ·{' '}
                        {new Date(p.submittedAt).toLocaleString('es-PE', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="kpi-gold text-sm font-semibold">
                        S/ {p.amount.toLocaleString('es-PE')}
                      </span>
                      <StatusBadge status={p.status} />
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 border-t border-white/5 pt-2">
                    {p.voucherUrl ? (
                      <a
                        href={p.voucherUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-brand-cyan hover:underline"
                      >
                        <ImageIcon className="h-3.5 w-3.5" />
                        Ver voucher
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-brand-slate">Sin voucher</span>
                    )}
                    {p.reference && (
                      <span className="text-xs text-brand-slate">Ref. {p.reference}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/admin/payments"
            className="mt-4 inline-flex items-center gap-1 text-sm text-brand-cyan hover:underline"
          >
            Ver todos los pagos <ArrowRight className="h-4 w-4" />
          </Link>
        </DashboardCard>

        <DashboardCard title="Accesos rápidos">
          <div className="space-y-2">
            {[
              { href: '/admin/estadisticas', label: 'Estadísticas', icon: BarChart3 },
              { href: '/admin/finanzas/ganancia', label: 'Ganancia', icon: TrendingUp },
              { href: '/admin/finanzas/impuestos', label: 'Impuestos', icon: Landmark },
              { href: '/admin/finanzas/personal', label: 'Personal', icon: UsersRound },
              { href: '/admin/payments', label: 'Pagos y vouchers', icon: Wallet },
              { href: '/admin/users', label: 'Clientes', icon: Users },
              { href: '/admin/cursos', label: 'Cursos', icon: BookOpen },
              { href: '/admin/videos', label: 'Videos', icon: PlayCircle },
              { href: '/admin/recursos', label: 'Recursos', icon: FolderOpen },
              { href: '/admin/promociones', label: 'Promociones', icon: Tag },
              { href: '/admin/notificaciones', label: 'Notificaciones', icon: Bell },
              { href: '/admin/entorno', label: 'Entorno e integraciones', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg border border-white/10 px-3 py-2.5 text-sm transition-colors hover:border-brand-gold/30 hover:bg-brand-gold/5"
                >
                  <Icon className="h-4 w-4 text-brand-gold" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </DashboardCard>
      </div>

      <FinanceModulesNav finance={finance} financeError={financeError} />

    </div>
  );
}
