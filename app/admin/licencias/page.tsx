'use client';

import { useAdminApi } from '@/hooks/useAdminApi';
import type { License, SaasClient, SaasPlan } from '@/lib/domain/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { resolvePlanLabel } from '@/lib/utils/plan-display';

export default function AdminLicenciasPage() {
  const { data: licenses, loading } = useAdminApi<License[]>('/api/licenses');
  const { data: clients } = useAdminApi<SaasClient[]>('/api/users');
  const { data: plans } = useAdminApi<SaasPlan[]>('/api/plans');

  const clientById = new Map((clients ?? []).map((c) => [c.id, c]));
  const planById = new Map((plans ?? []).map((p) => [p.id, p]));

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
            ) : (licenses ?? []).length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-brand-mist">
                  Sin licencias. Vincula el cliente demo en Supabase o aprueba un pago.
                </td>
              </tr>
            ) : (
              (licenses ?? []).map((lic) => {
                const client = clientById.get(lic.clientId);
                const plan = planById.get(lic.planId);
                const planLabel = resolvePlanLabel(lic.planId, planById);
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
                        {planLabel}
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
