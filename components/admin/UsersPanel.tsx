'use client';

import { useState } from 'react';
import { Search, Plus, MoreHorizontal } from 'lucide-react';
import { useAdminApi } from '@/hooks/useAdminApi';
import type { SaasClient } from '@/lib/domain/types';
import { MOCK_PLANS } from '@/lib/domain/mock-store';
import { AdminPageHeader } from './AdminPageHeader';
import { StatusBadge } from './StatusBadge';
import { DashboardCard } from '@/components/dashboard/DashboardCard';

export function UsersPanel() {
  const { data: clients, loading } = useAdminApi<SaasClient[]>('/api/users');
  const [search, setSearch] = useState('');

  const filtered = (clients ?? []).filter(
    (c) =>
      c.businessName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <AdminPageHeader
        title="Clientes y usuarios"
        description="Crear, editar, suspender, asignar planes y licencias. Sincronizado con el POS."
        actions={
          <button type="button" className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
            <Plus className="h-4 w-4" />
            Nuevo cliente
          </button>
        }
      />

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
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-brand-mist">
                    Cargando…
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const plan = MOCK_PLANS.find((p) => p.id === c.planId);
                  return (
                    <tr key={c.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-4 py-3">
                        <p className="font-medium text-brand-soft">{c.businessName}</p>
                        {c.ruc && <p className="text-xs text-brand-slate">RUC {c.ruc}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-brand-mist">{c.contactName}</p>
                        <p className="text-xs text-brand-slate">{c.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={plan?.highlighted ? 'badge-premium' : 'badge-tech'}>
                          {plan?.name ?? '—'}
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

      <p className="text-xs text-brand-slate">
        Próximo: editar usuario, cambiar plan, asignar licencia, ver pagos e historial de actividad
        vía API.
      </p>
    </div>
  );
}
