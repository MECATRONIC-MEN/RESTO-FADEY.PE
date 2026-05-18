'use client';

import { useState } from 'react';
import { Search, Plus, MoreHorizontal } from 'lucide-react';
import { useAdminApi } from '@/hooks/useAdminApi';
import type { PlatformUser, SaasClient, SaasPlan } from '@/lib/domain/types';
import { DEMO_CLIENT_EMAIL } from '@/lib/demo';
import { AdminPageHeader } from './AdminPageHeader';
import { StatusBadge } from './StatusBadge';
import { DashboardCard } from '@/components/dashboard/DashboardCard';

export function UsersPanel() {
  const [tab, setTab] = useState<'clients' | 'accounts'>('clients');
  const { data: clients, loading: loadingClients } = useAdminApi<SaasClient[]>('/api/users');
  const { data: accounts, loading: loadingAccounts } = useAdminApi<PlatformUser[]>(
    '/api/users?view=accounts'
  );
  const { data: plans } = useAdminApi<SaasPlan[]>('/api/plans');
  const [search, setSearch] = useState('');

  const planById = new Map((plans ?? []).map((p) => [p.id, p]));

  const filteredClients = (clients ?? []).filter(
    (c) =>
      c.businessName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAccounts = (accounts ?? []).filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <AdminPageHeader
        title="Clientes y usuarios"
        description="Un cliente demo vinculado a cliente@restofadey.pe. El resto se crea manualmente."
        actions={
          <button type="button" className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
            <Plus className="h-4 w-4" />
            Nuevo cliente
          </button>
        }
      />

      <div className="flex flex-wrap gap-2">
        {(['clients', 'accounts'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              tab === t
                ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30'
                : 'text-brand-mist hover:bg-white/5'
            }`}
          >
            {t === 'clients' ? 'Restaurantes' : 'Cuentas de acceso'}
          </button>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-slate" />
        <input
          type="search"
          placeholder="Buscar por nombre o email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-brand-cyan/20 bg-white/10 py-2.5 pl-10 pr-4 text-sm text-brand-soft placeholder:text-brand-slate focus:border-brand-cyan/50 focus:outline-none"
        />
      </div>

      {tab === 'clients' ? (
        <DashboardCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-xs uppercase text-brand-slate">
                  <th className="px-4 py-3">Restaurante</th>
                  <th className="px-4 py-3">Contacto</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Licencia</th>
                  <th className="px-4 py-3">Última actividad</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {loadingClients ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-brand-mist">
                      Cargando…
                    </td>
                  </tr>
                ) : filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-brand-mist">
                      No hay clientes registrados. Ejecuta el seed de Supabase o espera la
                      vinculación desde el POS.
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((c) => {
                    const plan = planById.get(c.planId);
                    const planLabel =
                      plan?.name ??
                      (c.planId.includes('premium')
                        ? 'Premium'
                        : c.planId.includes('pro')
                          ? 'Pro'
                          : c.planId.includes('basico')
                            ? 'Básico'
                            : '—');
                    return (
                      <tr key={c.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-4 py-3">
                          <p className="font-medium text-brand-soft">{c.businessName}</p>
                          {c.ruc && <p className="text-xs text-brand-slate">RUC {c.ruc}</p>}
                          <p className="mt-1 font-mono text-[10px] text-brand-slate">{c.id}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-brand-mist">{c.contactName}</p>
                          <p className="text-xs text-brand-slate">{c.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={plan?.highlighted ? 'badge-premium' : 'badge-tech'}>
                            {planLabel}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={c.licenseStatus} />
                        </td>
                        <td className="px-4 py-3 text-brand-slate">
                          {new Date(c.lastActivityAt).toLocaleDateString('es-PE')}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            className="rounded-lg p-2 text-brand-mist hover:bg-white/10"
                            aria-label="Acciones"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      ) : (
        <DashboardCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-xs uppercase text-brand-slate">
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Rol</th>
                  <th className="px-4 py-3">Cliente vinculado</th>
                </tr>
              </thead>
              <tbody>
                {loadingAccounts ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-brand-mist">
                      Cargando…
                    </td>
                  </tr>
                ) : (
                  filteredAccounts.map((a) => (
                    <tr key={a.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-4 py-3 font-medium text-brand-soft">{a.name}</td>
                      <td className="px-4 py-3 text-brand-mist">{a.email}</td>
                      <td className="px-4 py-3 capitalize text-brand-slate">{a.role}</td>
                      <td className="px-4 py-3 text-xs text-brand-mist">
                        {a.clientId
                          ? (a.restaurant ?? a.clientId)
                          : a.email === DEMO_CLIENT_EMAIL
                            ? 'Sin vincular — revisar Supabase seed'
                            : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      )}
    </div>
  );
}
