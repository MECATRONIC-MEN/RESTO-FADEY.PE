'use client';

import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { useAdminApi } from '@/hooks/useAdminApi';
import type { License, SaasClient, SaasPlan } from '@/lib/domain/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { GeneratePosLinkModal } from '@/components/admin/GeneratePosLinkModal';
import {
  LicenseDeleteButton,
  LicenseRenderKeysAccessButton,
  useLicenseAdminGate,
} from '@/components/admin/LicenseAdminGate';
import { LicenseExpirationModal } from '@/components/admin/LicenseExpirationModal';
import { LicenseExpiryEditButton } from '@/components/admin/LicenseExpiryEditButton';
import { PosRenderLinkPanel } from '@/components/admin/PosRenderLinkPanel';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { resolvePlanLabel } from '@/lib/utils/plan-display';
import { formatLicenseExpiry } from '@/lib/utils/license-expiry';

export function LicenciasPanel() {
  const [generateOpen, setGenerateOpen] = useState(false);
  const { data: licenses, loading, refetch: refetchLicenses } = useAdminApi<License[]>('/api/licenses');
  const { data: clients, refetch: refetchClients } = useAdminApi<SaasClient[]>('/api/users');
  const { data: plans } = useAdminApi<SaasPlan[]>('/api/plans');
  const { renderKeysUnlocked, promptAndUnlockRenderKeys, promptForDelete } = useLicenseAdminGate();
  const [editingLicense, setEditingLicense] = useState<License | null>(null);
  const [editingLabel, setEditingLabel] = useState('');

  const clientById = new Map((clients ?? []).map((c) => [c.id, c]));
  const planById = new Map((plans ?? []).map((p) => [p.id, p]));

  async function handleDeleteLicense(licenseId: string, password: string) {
    const res = await fetch(`/api/licenses/${licenseId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error ?? 'No se pudo eliminar');
    }
    refetchLicenses();
    refetchClients();
  }

  function refetchAll() {
    refetchLicenses();
    refetchClients();
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <AdminPageHeader
        title="Licencias"
        description="Llaves Render, vencimiento y gestión de licencias por cliente."
      />

      <DashboardCard title="Llaves POS (Render)">
        <p className="mb-4 text-sm text-brand-mist">
          Genera CLIENT_ID y variables de entorno para el POS. Requiere clave de administración.
          La licencia nueva es <strong className="text-brand-soft">permanente</strong> por defecto.
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
          onSuccess={refetchAll}
        />

        {renderKeysUnlocked && (
          <div className="mt-6">
            <PosRenderLinkPanel
              licenses={licenses ?? []}
              clients={clients ?? []}
              plans={plans ?? []}
            />
          </div>
        )}
      </DashboardCard>

      <DashboardCard title="Licencias registradas" className="overflow-hidden p-0">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-xs uppercase text-brand-slate">
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Clave</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Vence</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && !(licenses ?? []).length ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-brand-mist">
                  Cargando…
                </td>
              </tr>
            ) : (licenses ?? []).length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-brand-mist">
                  Sin licencias. Genera llaves Render o aprueba un pago.
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
                    <td className="px-4 py-3 text-brand-slate">{formatLicenseExpiry(lic)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <LicenseExpiryEditButton
                          label={label}
                          onClick={() => {
                            setEditingLicense(lic);
                            setEditingLabel(label);
                          }}
                        />
                        <LicenseDeleteButton
                          label={label}
                          showLabel
                          requireGate
                          promptForDelete={promptForDelete}
                          onDelete={(password) => handleDeleteLicense(lic.id, password!)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </DashboardCard>

      <LicenseExpirationModal
        license={editingLicense}
        clientLabel={editingLabel}
        onClose={() => setEditingLicense(null)}
        onSaved={refetchAll}
      />
    </div>
  );
}
