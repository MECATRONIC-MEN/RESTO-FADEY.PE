'use client';

import { useState } from 'react';
import { VoucherPreview } from './VoucherPreview';
import { Check, X, Eye, RefreshCw } from 'lucide-react';
import { useAdminApi, patchPayment } from '@/hooks/useAdminApi';
import type { PaymentRecord } from '@/lib/domain/types';
import { AdminPageHeader } from './AdminPageHeader';
import { StatusBadge } from './StatusBadge';
import { KpiCard } from './KpiCard';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { cn } from '@/lib/utils';

export function PaymentsPanel() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const path =
    filter === 'all' ? '/api/payments' : `/api/payments?status=${filter}`;
  const { data: payments, loading, error, refetch } = useAdminApi<PaymentRecord[]>(path);

  const [selected, setSelected] = useState<PaymentRecord | null>(null);
  const [acting, setActing] = useState(false);

  const list = payments ?? [];
  const pending = list.filter((p) => p.status === 'pending').length;
  const approvedSum = list
    .filter((p) => p.status === 'approved')
    .reduce((s, p) => s + p.amount, 0);

  async function handleAction(status: 'approved' | 'rejected') {
    if (!selected) return;
    setActing(true);
    try {
      await patchPayment(selected.id, status);
      setSelected(null);
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
        title="Pagos y finanzas"
        description="Vouchers desde el POS, aprobaciones, historial e ingresos. Sincronización vía API REST."
        actions={
          <button
            type="button"
            onClick={refetch}
            className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Pendientes" value={String(pending)} premium />
        <KpiCard label="Aprobados (lista)" value={`S/ ${approvedSum}`} trend="up" change="Vista actual" />
        <KpiCard label="Total registros" value={String(list.length)} />
        <KpiCard label="Fuente POS" value={String(list.filter((p) => p.source === 'pos').length)} change="Auto-sync" />
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              filter === f
                ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30'
                : 'text-brand-mist hover:bg-white/5'
            )}
          >
            {f === 'all' ? 'Todos' : f === 'pending' ? 'Pendientes' : f === 'approved' ? 'Aprobados' : 'Rechazados'}
          </button>
        ))}
      </div>

      {error && (
        <p className="rounded-lg bg-red-500/15 px-4 py-3 text-sm text-red-200">{error}</p>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <DashboardCard className="lg:col-span-2 overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-xs uppercase text-brand-slate">
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Monto</th>
                  <th className="px-4 py-3">Método</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Fecha</th>
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
                      Sin pagos
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
                      <td className="px-4 py-3 font-medium text-brand-soft">{p.clientName}</td>
                      <td className="px-4 py-3 kpi-gold text-base">S/ {p.amount}</td>
                      <td className="px-4 py-3 capitalize text-brand-mist">{p.method}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-4 py-3 text-brand-slate">
                        {new Date(p.submittedAt).toLocaleDateString('es-PE')}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setSelected(p)}
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

        <DashboardCard title="Detalle del pago" premium={!!selected}>
          {selected ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-brand-slate">Cliente</p>
                <p className="font-medium text-brand-soft">{selected.clientName}</p>
              </div>
              <div>
                <p className="text-xs text-brand-slate">Monto</p>
                <p className="kpi-gold text-2xl">S/ {selected.amount}</p>
                <p className="text-xs text-brand-mist">{selected.period}</p>
              </div>
              {selected.reference && (
                <p className="text-sm text-brand-mist">Ref: {selected.reference}</p>
              )}
              {selected.voucherUrl ? (
                <VoucherPreview url={selected.voucherUrl} />
              ) : (
                <p className="text-sm text-brand-slate">Sin comprobante adjunto</p>
              )}
              <StatusBadge status={selected.status} />
              {selected.status === 'pending' && (
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    disabled={acting}
                    onClick={() => handleAction('approved')}
                    className="btn-primary flex flex-1 items-center justify-center gap-2 py-2 text-sm"
                  >
                    <Check className="h-4 w-4" />
                    Aprobar
                  </button>
                  <button
                    type="button"
                    disabled={acting}
                    onClick={() => handleAction('rejected')}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-400/40 bg-red-400/10 py-2 text-sm text-red-200"
                  >
                    <X className="h-4 w-4" />
                    Rechazar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-brand-mist">Selecciona un pago para ver voucher y acciones.</p>
          )}
        </DashboardCard>
      </div>
    </div>
  );
}
