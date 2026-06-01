'use client';

import { useState } from 'react';
import { Search, Link2 } from 'lucide-react';
import { useAdminApi } from '@/hooks/useAdminApi';
import type { PlatformUser, SaasClient, SaasPlan } from '@/lib/domain/types';
import { DEMO_CLIENT_EMAIL } from '@/lib/demo';
import { AdminPageHeader } from './AdminPageHeader';
import { StatusBadge } from './StatusBadge';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { ConnectRestaurantModal } from './ConnectRestaurantModal';
import { RestaurantClientActions } from './RestaurantClientActions';
import { resolvePlanLabel } from '@/lib/utils/plan-display';

function formatDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-PE');
}

export function UsersPanel() {
  const [tab, setTab] = useState<'clients' | 'accounts'>('clients');
  const [connectOpen, setConnectOpen] = useState(false);
  const {
    data: clients,
    loading: loadingClients,
    refetch: refetchClients,
  } = useAdminApi<SaasClient[]>('/api/users');
  const {
    data: accounts,
    loading: loadingAccounts,
    refetch: refetchAccounts,
  } = useAdminApi<PlatformUser[]>('/api/users?view=accounts');
  const { data: plans } = useAdminApi<SaasPlan[]>('/api/plans');
  const [search, setSearch] = useState('');

  const planById = new Map((plans ?? []).map((p) => [p.id, p]));

  const filteredClients = (clients ?? []).filter((c) => {
    const q = search.toLowerCase();
    return (
      c.businessName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.ruc ?? '').toLowerCase().includes(q) ||
      (c.renderUrl ?? '').toLowerCase().includes(q)
    );
  });

  const filteredAccounts = (accounts ?? []).filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <AdminPageHeader
        title="Clientes y usuarios"
        description="Restaurantes conectados desde el POS Render. Use «Conectar restaurante» con URL y CLIENT_ID."
        actions={
          tab === 'clients' ? (
            <button
              type="button"
              onClick={() => setConnectOpen(true)}
              className="btn-primary flex items-center gap-2 px-4 py-2 text-sm"
            >
              <Link2 className="h-4 w-4" />
              Conectar restaurante
            </button>
          ) : undefined
        }
      />

      <ConnectRestaurantModal
        open={connectOpen}
        onClose={() => setConnectOpen(false)}
        onSuccess={() => {
          refetchClients();
          refetchAccounts();
        }}
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
          placeholder={
            tab === 'clients'
              ? 'Buscar por nombre, RUC, email o URL Render…'
              : 'Buscar por nombre o email…'
          }
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
                  <th className="px-4 py-3">URL Render</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Licencia</th>
                  <th className="px-4 py-3">Vencimiento</th>
                  <th className="px-4 py-3">Última actividad</th>
                  <th className="px-4 py-3">Conexión</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {loadingClients ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-brand-mist">
                      Cargando…
                    </td>
                  </tr>
                ) : filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-brand-mist">
                      No hay restaurantes. Pulse «Conectar restaurante» e ingrese la URL Render y
                      el CLIENT_ID del POS.
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((c) => {
                    const label = resolvePlanLabel(c.planId, planById);
                    const plan = planById.get(c.planId);
                    const conn = c.posConnectionStatus ?? 'unknown';
                    return (
                      <tr key={c.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-4 py-3">
                          <p className="font-medium text-brand-soft">{c.businessName}</p>
                          {c.ruc && <p className="text-xs text-brand-slate">RUC {c.ruc}</p>}
                          <p className="mt-0.5 text-xs text-brand-mist">{c.contactName}</p>
                        </td>
                        <td className="max-w-[140px] px-4 py-3">
                          {c.renderUrl ? (
                            <a
                              href={c.renderUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="truncate font-mono text-[10px] text-brand-cyan hover:underline"
                              title={c.renderUrl}
                            >
                              {c.renderUrl.replace(/^https?:\/\//, '')}
                            </a>
                          ) : (
                            <span className="text-xs text-brand-slate">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={plan?.highlighted ? 'badge-premium' : 'badge-tech'}>
                            {label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={c.licenseStatus} />
                        </td>
                        <td className="px-4 py-3 text-brand-slate">
                          {formatDate(c.licenseExpiresAt)}
                        </td>
                        <td className="px-4 py-3 text-brand-slate">
                          {formatDate(c.lastActivityAt)}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={conn} />
                        </td>
                        <td className="px-4 py-3">
                          <RestaurantClientActions client={c} onChanged={refetchClients} />
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
                  <th className="px-4 py-3">Usuario (acceso)</th>
                  <th className="px-4 py-3">Correo de acceso</th>
                  <th className="px-4 py-3">Rol</th>
                  <th className="px-4 py-3">Restaurante vinculado</th>
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
                      <td className="px-4 py-3 font-medium text-brand-soft">
                        {a.role === 'cliente' ? a.name : a.name}
                        {a.role === 'cliente' && (
                          <p className="mt-0.5 text-[10px] text-brand-slate">
                            Ingreso: nombre del restaurante o correo @rf.pe · contraseña: nombreunido + 4 dígitos
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-brand-mist">{a.email}</td>
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
