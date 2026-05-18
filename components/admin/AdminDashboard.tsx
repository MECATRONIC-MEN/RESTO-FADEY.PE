'use client';

import Link from 'next/link';
import {
  Wallet,
  Users,
  BarChart3,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Tag,
} from 'lucide-react';
import { useAdminApi } from '@/hooks/useAdminApi';
import type { FinancialStats, PaymentRecord } from '@/lib/domain/types';
import { AdminPageHeader } from './AdminPageHeader';
import { KpiCard } from './KpiCard';
import { StatusBadge } from './StatusBadge';
import { DashboardCard } from '@/components/dashboard/DashboardCard';

export function AdminDashboard() {
  const { data: stats } = useAdminApi<FinancialStats>('/api/statistics');
  const { data: payments } = useAdminApi<PaymentRecord[]>('/api/payments?status=pending');

  const recent = (payments ?? []).slice(0, 5);

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
          change="Dashboard financiero"
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
        <DashboardCard title="Pagos recientes (pendientes)" className="lg:col-span-2">
          {recent.length === 0 ? (
            <p className="text-sm text-brand-mist">No hay pagos pendientes.</p>
          ) : (
            <ul className="space-y-3">
              {recent.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-brand-soft">{p.clientName}</p>
                    <p className="text-xs text-brand-slate">
                      {p.method} · {new Date(p.submittedAt).toLocaleDateString('es-PE')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="kpi-gold text-sm font-semibold">S/ {p.amount}</span>
                    <StatusBadge status={p.status} />
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
              { href: '/admin/payments', label: 'Pagos y vouchers', icon: Wallet },
              { href: '/admin/users', label: 'Clientes', icon: Users },
              { href: '/admin/estadisticas', label: 'Estadísticas', icon: BarChart3 },
              { href: '/admin/cursos', label: 'Academia', icon: BookOpen },
              { href: '/admin/promociones', label: 'Promociones', icon: Tag },
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

      <DashboardCard title="Integración POS → Backoffice">
        <div className="flex items-start gap-3 rounded-lg border border-brand-cyan/20 bg-brand-cyan/5 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-brand-cyan" />
          <div className="text-sm text-brand-mist">
            <p className="font-medium text-brand-soft">API REST activa</p>
            <p className="mt-1">
              El POS envía pagos a <code className="text-brand-cyan">POST /api/payments</code>. Al
              aprobar, la plataforma notifica al POS vía{' '}
              <code className="text-brand-cyan">POST /api/payments/confirm</code> y activa la
              licencia del cliente.
            </p>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}
