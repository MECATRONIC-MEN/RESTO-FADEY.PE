'use client';

import { useState } from 'react';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { DashboardCard } from '@/components/dashboard/DashboardCard';

const CONFIRM_PHRASE = 'REINICIAR';

export function EntornoDataReset() {
  const [confirm, setConfirm] = useState('');
  const [includeLeads, setIncludeLeads] = useState(true);
  const [removeClients, setRemoveClients] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleReset() {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch('/api/admin/reset-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confirm,
          includeLeadsAndNotifications: includeLeads,
          removeTestClients: removeClients,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error ?? 'No se pudo reiniciar');
      }
      setMessage(json.data?.message ?? 'Datos reiniciados');
      setConfirm('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = confirm.trim().toUpperCase() === CONFIRM_PHRASE && !loading;

  return (
    <DashboardCard title="Reiniciar datos de prueba">
      <div className="flex items-start gap-3 rounded-lg border border-amber-400/25 bg-amber-400/10 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
        <div className="text-sm text-brand-mist">
          <p className="font-medium text-brand-soft">Solo para entorno de pruebas</p>
          <p className="mt-1">
            Elimina pagos y métricas asociadas. No modifica login, planes, APIs POS ni la lógica del
            sistema. Los restaurantes conectados se mantienen salvo que marque la opción inferior.
          </p>
        </div>
      </div>

      <ul className="mt-4 space-y-1 text-sm text-brand-slate">
        <li>· Todos los pagos / vouchers</li>
        <li>· KPIs y estadísticas (se recalculan vacías)</li>
        {includeLeads && <li>· Leads, solicitudes demo y notificaciones admin</li>}
        {removeClients && <li>· Clientes conectados excepto el demo del seed</li>}
      </ul>

      <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-brand-mist">
        <input
          type="checkbox"
          checked={includeLeads}
          onChange={(e) => setIncludeLeads(e.target.checked)}
          className="rounded border-brand-cyan/30"
        />
        Incluir leads, demos y notificaciones
      </label>

      <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-brand-mist">
        <input
          type="checkbox"
          checked={removeClients}
          onChange={(e) => setRemoveClients(e.target.checked)}
          className="rounded border-brand-cyan/30"
        />
        Eliminar restaurantes conectados (dejar solo cliente demo)
      </label>

      <div className="mt-4">
        <label className="mb-1 block text-xs font-medium text-brand-mist">
          Escriba <span className="font-mono text-brand-gold">{CONFIRM_PHRASE}</span> para confirmar
        </label>
        <input
          type="text"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder={CONFIRM_PHRASE}
          className="w-full max-w-xs rounded-lg border border-brand-cyan/20 bg-white/10 px-3 py-2 text-sm text-brand-soft placeholder:text-brand-slate focus:border-brand-cyan/50 focus:outline-none"
          autoComplete="off"
        />
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}
      {message && (
        <p className="mt-3 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">
          {message}
        </p>
      )}

      <button
        type="button"
        disabled={!canSubmit}
        onClick={handleReset}
        className="mt-4 flex items-center gap-2 rounded-lg border border-red-400/40 bg-red-400/15 px-4 py-2.5 text-sm font-medium text-red-200 transition-colors hover:bg-red-400/25 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        {loading ? 'Reiniciando…' : 'Reiniciar datos de prueba'}
      </button>
    </DashboardCard>
  );
}
