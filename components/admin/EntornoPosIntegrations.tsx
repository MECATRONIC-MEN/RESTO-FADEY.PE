'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, KeyRound } from 'lucide-react';
import { useAdminApi } from '@/hooks/useAdminApi';
import type { License, SaasClient, SaasPlan } from '@/lib/domain/types';
import { GeneratePosLinkModal } from '@/components/admin/GeneratePosLinkModal';
import {
  LicenseDeleteButton,
  LicenseRenderKeysAccessButton,
  useLicenseAdminGate,
} from '@/components/admin/LicenseAdminGate';
import { IntegrationDiagnostics } from '@/components/admin/IntegrationDiagnostics';
import { PosRenderLinkPanel } from '@/components/admin/PosRenderLinkPanel';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { resolvePlanLabel } from '@/lib/utils/plan-display';

export function EntornoPosIntegrations() {
  const [generateOpen, setGenerateOpen] = useState(false);
  const { data: licenses, loading, refetch: refetchLicenses } = useAdminApi<License[]>('/api/licenses');
  const { data: clients, refetch: refetchClients } = useAdminApi<SaasClient[]>('/api/users');
  const { data: plans } = useAdminApi<SaasPlan[]>('/api/plans');
  const { renderKeysUnlocked, promptAndUnlockRenderKeys } = useLicenseAdminGate();

  const clientById = new Map((clients ?? []).map((c) => [c.id, c]));
  const planById = new Map((plans ?? []).map((p) => [p.id, p]));

  async function handleDeleteLicense(licenseId: string) {
    const res = await fetch(`/api/licenses/${licenseId}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error ?? 'No se pudo eliminar');
    }
    refetchLicenses();
    refetchClients();
  }

  return (
    <div className="space-y-6">
      <DashboardCard title="Integración POS → Backoffice">
        <div className="flex items-start gap-3 rounded-lg border border-brand-cyan/20 bg-brand-cyan/5 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-brand-cyan" />
          <div className="text-sm text-brand-mist">
            <p className="font-medium text-brand-soft">API REST activa</p>
            <p className="mt-1">
              El POS envía pagos a <code className="text-brand-cyan">POST /api/payments</code>. Al
              aprobar, la plataforma notifica al POS vía{' '}
              <code className="text-brand-cyan">POST /api/license/confirm</code> y activa la
              licencia del cliente.
            </p>
          </div>
        </div>
      </DashboardCard>

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

      <DashboardCard title="Herramientas POS (Render)">
        <p className="mb-4 text-sm text-brand-mist">
          Generación de llaves, variables de entorno para Render y eliminación de licencias. Requiere
          clave de administración. Para consultar licencias sin acciones sensibles, use{' '}
          <Link href="/admin/licencias" className="text-brand-cyan hover:underline">
            Licencias
          </Link>
          .
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <LicenseRenderKeysAccessButton
            unlocked={renderKeysUnlocked}
            onUnlock={promptAndUnlockRenderKeys}
          />
          {renderKeysUnlocked && (
            <button
              type="button"
              onClick={() => setGenerateOpen(true)}
              className="btn-primary flex items-center gap-2 px-4 py-2 text-sm"
            >
              <KeyRound className="h-4 w-4" />
              Generar llaves POS Render
            </button>
          )}
        </div>

        <GeneratePosLinkModal
          open={generateOpen}
          plans={plans ?? []}
          onClose={() => setGenerateOpen(false)}
          onSuccess={() => {
            refetchLicenses();
            refetchClients();
          }}
        />

        {renderKeysUnlocked && (
          <div className="mt-6 space-y-6">
            <PosRenderLinkPanel
              licenses={licenses ?? []}
              clients={clients ?? []}
              plans={plans ?? []}
            />

            <div>
              <h3 className="mb-3 text-sm font-medium text-brand-soft">
                Eliminar licencias
              </h3>
              <div className="overflow-hidden rounded-xl border border-white/10">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-xs uppercase text-brand-slate">
                      <th className="px-4 py-3">Cliente</th>
                      <th className="px-4 py-3">Clave</th>
                      <th className="px-4 py-3">Plan</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3 w-12" />
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-brand-mist">
                          Cargando…
                        </td>
                      </tr>
                    ) : (licenses ?? []).length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-brand-mist">
                          Sin licencias registradas.
                        </td>
                      </tr>
                    ) : (
                      (licenses ?? []).map((lic) => {
                        const client = clientById.get(lic.clientId);
                        const plan = planById.get(lic.planId);
                        const planLabel = resolvePlanLabel(lic.planId, planById);
                        const label = client?.businessName ?? lic.clientId;
                        return (
                          <tr key={lic.id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="px-4 py-3 font-medium text-brand-soft">{label}</td>
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
                            <td className="px-4 py-3">
                              <LicenseDeleteButton
                                label={label}
                                onDelete={() => handleDeleteLicense(lic.id)}
                              />
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </DashboardCard>
    </div>
  );
}
