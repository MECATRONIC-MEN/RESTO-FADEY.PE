'use client';

import { useState } from 'react';
import { Check, Loader2, Plus, Trash2 } from 'lucide-react';
import { useAdminApi } from '@/hooks/useAdminApi';
import type { SaasFinanceSummary, SaasTaxPayment } from '@/lib/domain/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import {
  FINANCE_INPUT_CLASS,
  formatFinancePen,
  UpcomingPaymentsAlert,
} from '@/components/admin/finance/finance-ui';

const TAX_TYPES = ['IGV', 'Renta', 'Detracciones', 'PDT 621', 'Otro'];

export function TaxPaymentsPanel() {
  const { data: taxes, loading, error, refetch } = useAdminApi<SaasTaxPayment[]>('/api/admin/finance/taxes');
  const { data: summary, refetch: refetchSummary } =
    useAdminApi<SaasFinanceSummary>('/api/admin/finance/summary');

  const now = new Date();
  const [taxType, setTaxType] = useState('IGV');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [periodYear, setPeriodYear] = useState(String(now.getFullYear()));
  const [periodMonth, setPeriodMonth] = useState(String(now.getMonth() + 1));
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const list = taxes ?? [];
  const upcoming = (summary?.upcomingPayments ?? []).filter((p) => p.kind === 'tax');

  function refetchAll() {
    refetch();
    refetchSummary();
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/finance/taxes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taxType,
          amount: Number(amount) || 0,
          dueDate,
          periodYear: Number(periodYear),
          periodMonth: Number(periodMonth),
          reference: reference || undefined,
          notes: notes || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Error');
      setAmount('');
      setDueDate('');
      setReference('');
      setNotes('');
      refetchAll();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error');
    } finally {
      setSaving(false);
    }
  }

  async function markPaid(id: string) {
    const res = await fetch(`/api/admin/finance/taxes/${id}`, { method: 'PATCH' });
    const json = await res.json();
    if (!res.ok || !json.success) {
      alert(json.error ?? 'Error');
      return;
    }
    refetchAll();
  }

  async function remove(id: string) {
    if (!confirm('¿Eliminar este registro de impuesto?')) return;
    const res = await fetch(`/api/admin/finance/taxes/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok || !json.success) {
      alert(json.error ?? 'Error');
      return;
    }
    refetchAll();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <AdminPageHeader
        title="Pagos de impuestos"
        description="Impuestos sobre los ingresos por venta de planes SaaS. Registra vencimientos, recibe avisos y marca cuando pagaste."
      />

      {error && (
        <div className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {error}. Si usas Supabase, ejecuta{' '}
          <code className="text-red-100">EJECUTAR_013_FINANZAS_SAAS.sql</code> y recarga la página.
        </div>
      )}

      <UpcomingPaymentsAlert items={upcoming} />

      <div className="grid gap-4 sm:grid-cols-3">
        <DashboardCard>
          <p className="text-xs text-brand-slate">Pagado este mes</p>
          <p className="kpi-gold mt-1 text-xl font-bold">
            {formatFinancePen(summary?.taxesPaidThisMonth ?? 0)}
          </p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs text-brand-slate">Pendiente por pagar</p>
          <p className="mt-1 text-xl font-bold text-amber-200">
            {formatFinancePen(summary?.taxesPendingAmount ?? 0)}
          </p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs text-brand-slate">Base ingresos del mes</p>
          <p className="mt-1 text-xl font-bold text-brand-soft">
            {formatFinancePen(summary?.revenueThisMonth ?? 0)}
          </p>
        </DashboardCard>
      </div>

      <DashboardCard title="Registrar obligación tributaria">
        <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-2">
          <select value={taxType} onChange={(e) => setTaxType(e.target.value)} className={FINANCE_INPUT_CLASS}>
            {TAX_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            placeholder="Monto (S/) *"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={FINANCE_INPUT_CLASS}
          />
          <input
            type="date"
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={FINANCE_INPUT_CLASS}
          />
          <input
            placeholder="Referencia / N° operación"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className={FINANCE_INPUT_CLASS}
          />
          <input
            type="number"
            placeholder="Año periodo"
            value={periodYear}
            onChange={(e) => setPeriodYear(e.target.value)}
            className={FINANCE_INPUT_CLASS}
          />
          <input
            type="number"
            min="1"
            max="12"
            placeholder="Mes periodo (1–12)"
            value={periodMonth}
            onChange={(e) => setPeriodMonth(e.target.value)}
            className={FINANCE_INPUT_CLASS}
          />
          <textarea
            placeholder="Notas"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className={`${FINANCE_INPUT_CLASS} sm:col-span-2`}
          />
          <button type="submit" disabled={saving} className="btn-primary flex items-center justify-center gap-2 py-2 text-sm sm:col-span-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Registrar impuesto
          </button>
        </form>
      </DashboardCard>

      <DashboardCard title="Historial" className="overflow-hidden p-0">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-xs uppercase text-brand-slate">
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Periodo</th>
              <th className="px-4 py-3">Monto</th>
              <th className="px-4 py-3">Vence</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 w-24" />
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
                  Sin impuestos registrados.
                </td>
              </tr>
            ) : (
              list.map((t) => (
                <tr key={t.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 font-medium text-brand-soft">{t.taxType}</td>
                  <td className="px-4 py-3 text-brand-slate">
                    {t.periodMonth}/{t.periodYear}
                  </td>
                  <td className="px-4 py-3">{formatFinancePen(t.amount)}</td>
                  <td className="px-4 py-3 text-brand-slate">
                    {new Date(t.dueDate).toLocaleDateString('es-PE')}
                    {t.paidAt && (
                      <span className="mt-0.5 block text-xs text-emerald-300">
                        Pagado {new Date(t.paidAt).toLocaleDateString('es-PE')}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={t.paidAt ? 'approved' : 'pending'} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {!t.paidAt && (
                        <button
                          type="button"
                          onClick={() => markPaid(t.id)}
                          className="rounded-lg p-2 text-emerald-300 hover:bg-emerald-400/10"
                          title="Marcar como pagado"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => remove(t.id)}
                        className="rounded-lg p-2 text-red-300 hover:bg-red-400/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </DashboardCard>
    </div>
  );
}
