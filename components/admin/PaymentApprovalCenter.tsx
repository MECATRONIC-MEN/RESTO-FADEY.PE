'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import {
  Check,
  X,
  Eye,
  RefreshCw,
  Search,
  History,
  Clock,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { useAdminApi, decidePayment, retryPosSync } from '@/hooks/useAdminApi';
import type { FinancialStats, PaymentRecord } from '@/lib/domain/types';
import { VoucherPreview } from './VoucherPreview';
import { AdminPageHeader } from './AdminPageHeader';
import { StatusBadge } from './StatusBadge';
import { KpiCard } from './KpiCard';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { cn } from '@/lib/utils';
import { IntegrationDiagnostics } from './IntegrationDiagnostics';

type FilterTab = 'pending' | 'all' | 'approved' | 'rejected';

function buildApiPath(filter: FilterTab, search: string) {
  const params = new URLSearchParams();
  if (filter !== 'all') params.set('status', filter);
  if (search.trim()) params.set('q', search.trim());
  const qs = params.toString();
  return qs ? `/api/payments?${qs}` : '/api/payments';
}

export function PaymentApprovalCenter() {
  const [filter, setFilter] = useState<FilterTab>('pending');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selected, setSelected] = useState<PaymentRecord | null>(null);
  const [acting, setActing] = useState(false);
  const [rejectNotes, setRejectNotes] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const apiPath = buildApiPath(filter, debouncedSearch);
  const { data: payments, loading, error, refetch } = useAdminApi<PaymentRecord[]>(apiPath);
  const { data: stats, refetch: refetchStats } = useAdminApi<FinancialStats>('/api/statistics');

  const refetchAll = useCallback(() => {
    refetch();
    refetchStats();
  }, [refetch, refetchStats]);

  useEffect(() => {
    const interval = setInterval(refetchAll, 15000);
    return () => clearInterval(interval);
  }, [refetchAll]);

  const list = payments ?? [];

  const pendingCount = useMemo(
    () => (filter === 'pending' ? list.length : list.filter((p) => p.status === 'pending').length),
    [list, filter]
  );

  async function handleApprove() {
    if (!selected) return;
    setActing(true);
    setSyncMsg(null);
    try {
      const result = await decidePayment(selected.id, 'approved');
      setSyncMsg(
        result.posNotified
          ? 'Pago aprobado y POS notificado correctamente.'
          : `Pago aprobado. POS no notificado: ${result.posNotifyError ?? 'sin URL'}`
      );
      setSelected(null);
      refetchAll();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error');
    } finally {
      setActing(false);
    }
  }

  async function handleReject() {
    if (!selected) return;
    setActing(true);
    setSyncMsg(null);
    try {
      const result = await decidePayment(selected.id, 'rejected', rejectNotes || undefined);
      setSyncMsg(
        result.posNotified
          ? 'Pago rechazado y POS notificado.'
          : `Pago rechazado. ${result.posNotifyError ?? ''}`
      );
      setShowRejectForm(false);
      setRejectNotes('');
      setSelected(null);
      refetchAll();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error');
    } finally {
      setActing(false);
    }
  }

  async function handleRetrySync() {
    if (!selected) return;
    setActing(true);
    try {
      const data = await retryPosSync(selected.id);
      setSyncMsg(data.posNotified ? 'Sincronización reenviada al POS.' : data.posNotifyError);
      refetch();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error');
    } finally {
      setActing(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <AdminPageHeader
        title="Centro de aprobación de pagos"
        description="Control financiero central: vouchers del POS, aprobación, historial auditado y sincronización automática."
        actions={
          <button
            type="button"
            onClick={refetchAll}
            className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard
          label="Pendientes"
          value={String(stats?.pendingPayments ?? pendingCount)}
          premium
          change="Requieren revisión"
        />
        <KpiCard
          label="Ingresos del mes"
          value={stats ? `S/ ${stats.monthlyRevenue.toLocaleString('es-PE')}` : '—'}
          trend="up"
        />
        <KpiCard label="Aprobados (mes)" value={String(stats?.approvedPaymentsThisMonth ?? 0)} />
        <KpiCard label="Clientes activos" value={String(stats?.activeClients ?? 0)} />
        <KpiCard
          label="Renovaciones"
          value={stats ? `${stats.renewalRate}%` : '—'}
          premium
          change="Tasa aprobación"
        />
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: 'pending' as const, label: 'Pendientes', icon: Clock },
              { id: 'all' as const, label: 'Historial completo', icon: History },
              { id: 'approved' as const, label: 'Aprobados', icon: Check },
              { id: 'rejected' as const, label: 'Rechazados', icon: X },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                filter === id
                  ? 'border border-brand-cyan/30 bg-brand-cyan/20 text-brand-cyan'
                  : 'text-brand-mist hover:bg-white/5'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-slate" />
          <input
            type="search"
            placeholder="Buscar restaurante, referencia, ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-brand-cyan/20 bg-white/10 py-2.5 pl-10 pr-4 text-sm text-brand-soft placeholder:text-brand-slate focus:border-brand-cyan/50 focus:outline-none"
          />
        </div>
      </div>

      {syncMsg && (
        <p className="rounded-lg border border-brand-cyan/30 bg-brand-cyan/10 px-4 py-3 text-sm text-brand-cyan">
          {syncMsg}
        </p>
      )}

      {error && (
        <p className="rounded-lg bg-red-500/15 px-4 py-3 text-sm text-red-200">{error}</p>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <DashboardCard className="lg:col-span-2 overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-xs uppercase text-brand-slate">
                  <th className="px-4 py-3">Restaurante</th>
                  <th className="px-4 py-3">Monto</th>
                  <th className="px-4 py-3">Método</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Enviado</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-brand-mist">
                      Cargando…
                    </td>
                  </tr>
                ) : list.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-brand-mist">
                      {filter === 'pending'
                        ? 'No hay pagos pendientes. Los comprobantes del POS aparecerán aquí.'
                        : 'Sin registros en este filtro.'}
                    </td>
                  </tr>
                ) : (
                  list.map((p) => (
                    <tr
                      key={p.id}
                      className={cn(
                        'border-b border-white/5 transition-colors hover:bg-white/5',
                        selected?.id === p.id && 'bg-brand-cyan/10'
                      )}
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-brand-soft">
                          {p.restaurantName || p.clientName}
                        </p>
                        {p.planName && (
                          <p className="text-xs text-brand-gold">{p.planName}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 kpi-gold text-base">S/ {p.amount}</td>
                      <td className="px-4 py-3 capitalize text-brand-mist">{p.method}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-4 py-3 text-brand-slate">
                        {new Date(p.createdAt).toLocaleString('es-PE', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => {
                            setSelected(p);
                            setShowRejectForm(false);
                            setSyncMsg(null);
                          }}
                          className="rounded-lg p-2 text-brand-cyan hover:bg-brand-cyan/10"
                          aria-label="Ver detalle"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </DashboardCard>

        <DashboardCard title="Revisión y auditoría" premium={!!selected}>
          {selected ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-brand-slate">Restaurante</p>
                <p className="font-medium text-brand-soft">
                  {selected.restaurantName || selected.clientName}
                </p>
                <p className="mt-1 font-mono text-[10px] text-brand-slate">{selected.clientId}</p>
              </div>
              <div>
                <p className="text-xs text-brand-slate">Monto · {selected.period}</p>
                <p className="kpi-gold text-2xl">S/ {selected.amount}</p>
              </div>
              {selected.reference && (
                <p className="text-sm text-brand-mist">Referencia: {selected.reference}</p>
              )}
              {selected.voucherUrl ? (
                <VoucherPreview url={selected.voucherUrl} />
              ) : (
                <p className="text-sm text-brand-slate">Sin comprobante adjunto</p>
              )}
              <StatusBadge status={selected.status} />
              {selected.approvedAt && (
                <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-brand-mist">
                  <p className="flex items-center gap-1 text-brand-soft">
                    <ShieldCheck className="h-3.5 w-3.5 text-brand-gold" />
                    Auditoría
                  </p>
                  <p className="mt-1">
                    {selected.status === 'approved' ? 'Aprobado' : 'Rechazado'} el{' '}
                    {new Date(selected.approvedAt).toLocaleString('es-PE')}
                  </p>
                  {selected.approvedBy && <p>Por: {selected.approvedBy}</p>}
                  {selected.notes && <p className="mt-1 text-amber-200/90">Nota: {selected.notes}</p>}
                  {selected.posNotifiedAt && (
                    <p className="mt-1 text-brand-cyan">POS sincronizado</p>
                  )}
                </div>
              )}
              {selected.status === 'pending' && !showRejectForm && (
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="button"
                    disabled={acting}
                    onClick={handleApprove}
                    className="btn-primary flex items-center justify-center gap-2 py-2.5 text-sm"
                  >
                    <Check className="h-4 w-4" />
                    Aprobar y activar licencia
                  </button>
                  <button
                    type="button"
                    disabled={acting}
                    onClick={() => setShowRejectForm(true)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-red-400/40 bg-red-400/10 py-2.5 text-sm text-red-200"
                  >
                    <X className="h-4 w-4" />
                    Rechazar
                  </button>
                </div>
              )}
              {selected.status === 'pending' && showRejectForm && (
                <div className="space-y-2">
                  <textarea
                    value={rejectNotes}
                    onChange={(e) => setRejectNotes(e.target.value)}
                    placeholder="Motivo del rechazo (opcional, queda en auditoría)…"
                    rows={3}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-brand-soft placeholder:text-brand-slate focus:border-brand-cyan/40 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={acting}
                      onClick={handleReject}
                      className="flex-1 rounded-xl bg-red-500/20 py-2 text-sm text-red-200"
                    >
                      Confirmar rechazo
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRejectForm(false)}
                      className="rounded-xl border border-white/10 px-3 py-2 text-sm text-brand-mist"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
              {selected.status !== 'pending' && (
                <button
                  type="button"
                  disabled={acting}
                  onClick={handleRetrySync}
                  className="btn-secondary flex w-full items-center justify-center gap-2 py-2 text-sm"
                >
                  <Send className="h-4 w-4" />
                  Reenviar al POS
                </button>
              )}
            </div>
          ) : (
            <p className="text-sm text-brand-mist">
              Selecciona un pago. El historial completo se conserva aunque el POS oculte el
              comprobante.
            </p>
          )}
        </DashboardCard>
      </div>

      <DashboardCard title="Flujo de sincronización">
        <p className="text-sm text-brand-mist">
          POS → <code className="text-brand-cyan">POST /api/payments</code> → pendiente → admin
          aprueba → licencia activa →{' '}
          <code className="text-brand-cyan">POST {'{POS}'}/api/payments/confirm</code>. El POS
          también puede consultar con{' '}
          <code className="text-brand-cyan">GET /api/payments/confirm?paymentId=</code>.
        </p>
      </DashboardCard>

      <IntegrationDiagnostics />
    </div>
  );
}
