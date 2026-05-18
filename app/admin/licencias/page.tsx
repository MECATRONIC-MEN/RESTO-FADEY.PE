'use client';

import { useAdminApi } from '@/hooks/useAdminApi';
import type { License } from '@/lib/domain/types';
import { MOCK_CLIENTS, MOCK_PLANS } from '@/lib/domain/mock-store';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { DashboardCard } from '@/components/dashboard/DashboardCard';

export default function AdminLicenciasPage() {
  const { data: licenses, loading } = useAdminApi<License[]>('/api/licenses');

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <AdminPageHeader
        title="Licencias"
        description="Estado, vencimiento, módulos habilitados y claves por cliente."
      />

      <DashboardCard className="overflow-hidden p-0">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-xs uppercase text-brand-slate">
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Clave</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Vence</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-brand-mist">
                  Cargando…
                </td>
              </tr>
            ) : (
              (licenses ?? []).map((lic) => {
                const client = MOCK_CLIENTS.find((c) => c.id === lic.clientId);
                const plan = MOCK_PLANS.find((p) => p.id === lic.planId);
                return (
                  <tr key={lic.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 font-medium text-brand-soft">
                      {client?.businessName ?? lic.clientId}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-brand-cyan">
                      {lic.licenseKey}
                    </td>
                    <td className="px-4 py-3">
                      <span className={plan?.highlighted ? 'badge-premium' : 'badge-tech'}>
                        {plan?.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={lic.status} />
                    </td>
                    <td className="px-4 py-3 text-brand-slate">
                      {new Date(lic.expiresAt).toLocaleDateString('es-PE')}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </DashboardCard>
    </div>
  );
}
