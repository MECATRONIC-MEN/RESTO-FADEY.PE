'use client';

import { useState } from 'react';
import { Check, Loader2, Plus, Trash2, CalendarPlus, ChevronDown } from 'lucide-react';
import { useAdminApi } from '@/hooks/useAdminApi';
import type { SaasFinanceSummary, SaasStaffMember, SaasStaffPayment } from '@/lib/domain/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import {
  FINANCE_INPUT_CLASS,
  formatFinancePen,
  UpcomingPaymentsAlert,
} from '@/components/admin/finance/finance-ui';

export function StaffPayrollPanel() {
  const today = new Date().toISOString().split('T')[0];
  const { data: staff, loading: loadingStaff, error: staffError, refetch: refetchStaff } =
    useAdminApi<SaasStaffMember[]>('/api/admin/finance/staff');
  const { data: payments, loading: loadingPay, error: payError, refetch: refetchPay } =
    useAdminApi<SaasStaffPayment[]>('/api/admin/finance/staff-payments');
  const { data: summary, refetch: refetchSummary } =
    useAdminApi<SaasFinanceSummary>('/api/admin/finance/summary');

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [payDay, setPayDay] = useState('');
  const [savingStaff, setSavingStaff] = useState(false);

  const [payStaffId, setPayStaffId] = useState('');
  const [payAmountNew, setPayAmountNew] = useState('');
  const [payDueDate, setPayDueDate] = useState(today);
  const [payNotes, setPayNotes] = useState('');
  const [savingPay, setSavingPay] = useState(false);
  const [openSection, setOpenSection] = useState<'add' | 'pay' | 'history'>('add');

  const staffList = staff ?? [];
  const activeStaffList = staffList.filter((s) => s.isActive);
  const paymentList = payments ?? [];
  const upcoming = (summary?.upcomingPayments ?? []).filter((p) => p.kind === 'staff');
  const selectedStaff = staffList.find((s) => s.id === payStaffId);

  function refetchAll() {
    refetchStaff();
    refetchPay();
    refetchSummary();
  }

  async function handleAddStaff(e: React.FormEvent) {
    e.preventDefault();
    setSavingStaff(true);
    try {
      const res = await fetch('/api/admin/finance/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          role,
          phone,
          payAmount: Number(payAmount) || 0,
          payDayOfMonth: payDay ? Number(payDay) : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Error');
      setName('');
      setRole('');
      setPhone('');
      setPayAmount('');
      setPayDay('');
      refetchAll();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error');
    } finally {
      setSavingStaff(false);
    }
  }

  async function handleAddPayment(e: React.FormEvent) {
    e.preventDefault();
    setSavingPay(true);
    try {
      const res = await fetch('/api/admin/finance/staff-payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId: payStaffId,
          amount: Number(payAmountNew) || 0,
          dueDate: payDueDate,
          notes: payNotes || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Error');
      setPayStaffId('');
      setPayAmountNew('');
      setPayDueDate(today);
      setPayNotes('');
      refetchAll();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error');
    } finally {
      setSavingPay(false);
    }
  }

  async function scheduleMonth(staffId: string) {
    const res = await fetch('/api/admin/finance/staff-payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffId, scheduleFromMember: true }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      alert(json.error ?? 'Error');
      return;
    }
    refetchAll();
  }

  async function markPaid(id: string) {
    const res = await fetch(`/api/admin/finance/staff-payments/${id}`, { method: 'PATCH' });
    const json = await res.json();
    if (!res.ok || !json.success) {
      alert(json.error ?? 'Error');
      return;
    }
    refetchAll();
  }

  async function removeStaff(id: string) {
    if (!confirm('¿Eliminar colaborador y sus pagos registrados?')) return;
    const res = await fetch(`/api/admin/finance/staff/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok || !json.success) {
      alert(json.error ?? 'Error');
      return;
    }
    refetchAll();
  }

  async function removePayment(id: string) {
    if (!confirm('¿Eliminar este registro de pago?')) return;
    const res = await fetch(`/api/admin/finance/staff-payments/${id}`, { method: 'DELETE' });
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
        title="Pago del personal"
        description="Tu equipo interno Resto Fadey: datos, fechas, montos, avisos y registro de pagos. Se descuenta de la ganancia."
      />

      {(staffError || payError) && (
        <div className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {staffError ?? payError}. Si usas Supabase, ejecuta{' '}
          <code className="text-red-100">EJECUTAR_013_FINANZAS_SAAS.sql</code> y recarga la página.
        </div>
      )}

      <UpcomingPaymentsAlert items={upcoming} />

      <div className="grid gap-4 sm:grid-cols-3">
        <DashboardCard>
          <p className="text-xs text-brand-slate">Pagado este mes</p>
          <p className="kpi-gold mt-1 text-xl font-bold">
            {formatFinancePen(summary?.payrollPaidThisMonth ?? 0)}
          </p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs text-brand-slate">Pendiente por pagar</p>
          <p className="mt-1 text-xl font-bold text-amber-200">
            {formatFinancePen(summary?.payrollPendingAmount ?? 0)}
          </p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs text-brand-slate">Colaboradores activos</p>
          <p className="mt-1 text-xl font-bold text-brand-soft">
            {activeStaffList.length}
          </p>
        </DashboardCard>
      </div>

      <DashboardCard title="Activos hoy">
        {loadingStaff ? (
          <p className="text-sm text-brand-mist">Cargando…</p>
        ) : activeStaffList.length === 0 ? (
          <p className="text-sm text-brand-mist">Sin colaboradores activos.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {activeStaffList.map((s) => (
              <span
                key={s.id}
                className="rounded-full border border-brand-cyan/25 bg-brand-cyan/10 px-3 py-1 text-xs text-brand-soft"
              >
                {s.name}
              </span>
            ))}
          </div>
        )}
      </DashboardCard>

      <div className="grid gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => setOpenSection('add')}
          className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
            openSection === 'add'
              ? 'border-brand-cyan/45 bg-brand-cyan/15 text-brand-soft'
              : 'border-white/10 bg-white/5 text-brand-mist hover:border-brand-cyan/25'
          }`}
        >
          <span className="flex items-center justify-between">
            Agregar colaborador
            <ChevronDown className={`h-4 w-4 transition-transform ${openSection === 'add' ? 'rotate-180' : ''}`} />
          </span>
        </button>
        <button
          type="button"
          onClick={() => setOpenSection('pay')}
          className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
            openSection === 'pay'
              ? 'border-brand-cyan/45 bg-brand-cyan/15 text-brand-soft'
              : 'border-white/10 bg-white/5 text-brand-mist hover:border-brand-cyan/25'
          }`}
        >
          <span className="flex items-center justify-between">
            Hacer pagos
            <ChevronDown className={`h-4 w-4 transition-transform ${openSection === 'pay' ? 'rotate-180' : ''}`} />
          </span>
        </button>
        <button
          type="button"
          onClick={() => setOpenSection('history')}
          className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
            openSection === 'history'
              ? 'border-brand-cyan/45 bg-brand-cyan/15 text-brand-soft'
              : 'border-white/10 bg-white/5 text-brand-mist hover:border-brand-cyan/25'
          }`}
        >
          <span className="flex items-center justify-between">
            Historial
            <ChevronDown
              className={`h-4 w-4 transition-transform ${openSection === 'history' ? 'rotate-180' : ''}`}
            />
          </span>
        </button>
      </div>

      {openSection === 'add' && (
        <DashboardCard title="Agregar colaborador">
        <form onSubmit={handleAddStaff} className="grid gap-3 sm:grid-cols-2">
          <input
            required
            placeholder="Nombre *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={FINANCE_INPUT_CLASS}
          />
          <input
            placeholder="Cargo (ej. Soporte)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={FINANCE_INPUT_CLASS}
          />
          <input
            placeholder="Teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={FINANCE_INPUT_CLASS}
          />
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Monto habitual (S/)"
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
            className={FINANCE_INPUT_CLASS}
          />
          <input
            type="number"
            min="1"
            max="28"
            placeholder="Día de pago del mes (1–28)"
            value={payDay}
            onChange={(e) => setPayDay(e.target.value)}
            className={FINANCE_INPUT_CLASS}
          />
          <button type="submit" disabled={savingStaff} className="btn-primary flex items-center justify-center gap-2 py-2 text-sm sm:col-span-2">
            {savingStaff ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Guardar colaborador
          </button>
        </form>
        </DashboardCard>
      )}

      {openSection === 'history' && (
        <DashboardCard title="Colaboradores">
        {loadingStaff ? (
          <p className="text-sm text-brand-mist">Cargando…</p>
        ) : staffList.length === 0 ? (
          <p className="text-sm text-brand-mist">Sin personal registrado.</p>
        ) : (
          <ul className="divide-y divide-white/10">
            {staffList.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-medium text-brand-soft">{s.name}</p>
                  <p className="text-xs text-brand-slate">
                    {s.role ?? 'Sin cargo'} · {formatFinancePen(s.payAmount)}
                    {s.payDayOfMonth ? ` · día ${s.payDayOfMonth}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => scheduleMonth(s.id)}
                    className="flex items-center gap-1 rounded-lg border border-brand-cyan/25 px-2.5 py-1.5 text-xs text-brand-cyan hover:bg-brand-cyan/10"
                    title="Crear pago pendiente de este mes"
                  >
                    <CalendarPlus className="h-3.5 w-3.5" />
                    Programar mes
                  </button>
                  <button
                    type="button"
                    onClick={() => removeStaff(s.id)}
                    className="rounded-lg p-2 text-red-300 hover:bg-red-400/10"
                    aria-label={`Eliminar ${s.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        </DashboardCard>
      )}

      {openSection === 'pay' && (
        <DashboardCard title="Registrar pago">
        <form onSubmit={handleAddPayment} className="grid gap-3 sm:grid-cols-2">
          <select
            required
            value={payStaffId}
            onChange={(e) => {
              const id = e.target.value;
              setPayStaffId(id);
              const staffMember = staffList.find((s) => s.id === id);
              if (staffMember) {
                setPayAmountNew(staffMember.payAmount ? String(staffMember.payAmount) : '');
              }
            }}
            className={FINANCE_INPUT_CLASS}
          >
            <option value="">Colaborador *</option>
            {staffList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            placeholder="Monto (S/) *"
            value={payAmountNew}
            onChange={(e) => setPayAmountNew(e.target.value)}
            className={FINANCE_INPUT_CLASS}
          />
          <input
            type="date"
            required
            value={payDueDate}
            onChange={(e) => setPayDueDate(e.target.value)}
            className={FINANCE_INPUT_CLASS}
          />
          <input
            placeholder="Notas"
            value={payNotes}
            onChange={(e) => setPayNotes(e.target.value)}
            className={FINANCE_INPUT_CLASS}
          />
          <button type="submit" disabled={savingPay} className="btn-primary flex items-center justify-center gap-2 py-2 text-sm sm:col-span-2">
            {savingPay ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Agregar pago programado
          </button>
        </form>
        {selectedStaff && (
          <p className="mt-3 text-xs text-brand-mist">
            Seleccionado: <span className="text-brand-soft">{selectedStaff.name}</span>
            {selectedStaff.role ? ` · ${selectedStaff.role}` : ''} · monto sugerido:{' '}
            <span className="kpi-gold">{formatFinancePen(selectedStaff.payAmount)}</span>
          </p>
        )}
        </DashboardCard>
      )}

      {openSection === 'history' && (
        <DashboardCard title="Historial de pagos" className="overflow-hidden p-0">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-xs uppercase text-brand-slate">
              <th className="px-4 py-3">Colaborador</th>
              <th className="px-4 py-3">Monto</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 w-24" />
            </tr>
          </thead>
          <tbody>
            {loadingPay ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-brand-mist">
                  Cargando…
                </td>
              </tr>
            ) : paymentList.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-brand-mist">
                  Sin pagos registrados.
                </td>
              </tr>
            ) : (
              paymentList.map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 font-medium text-brand-soft">{p.staffName ?? p.staffId}</td>
                  <td className="px-4 py-3">{formatFinancePen(p.amount)}</td>
                  <td className="px-4 py-3 text-brand-slate">
                    {new Date(p.dueDate).toLocaleDateString('es-PE')}
                    {p.paidAt && (
                      <span className="mt-0.5 block text-xs text-emerald-300">
                        Pagado {new Date(p.paidAt).toLocaleDateString('es-PE')}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.paidAt ? 'approved' : 'pending'} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {!p.paidAt && (
                        <button
                          type="button"
                          onClick={() => markPaid(p.id)}
                          className="rounded-lg p-2 text-emerald-300 hover:bg-emerald-400/10"
                          title="Marcar como pagado"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removePayment(p.id)}
                        className="rounded-lg p-2 text-red-300 hover:bg-red-400/10"
                        title="Eliminar"
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
      )}
    </div>
  );
}
