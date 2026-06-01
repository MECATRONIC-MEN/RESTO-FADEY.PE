'use client';

import { Copy } from 'lucide-react';
import { SITE_URL } from '@/lib/constants';
import type { License, SaasClient, SaasPlan } from '@/lib/domain/types';
import { buildPosRenderEnvTemplate } from '@/lib/utils/pos-render-env';
import { resolvePlanLabel } from '@/lib/utils/plan-display';
import { DashboardCard } from '@/components/dashboard/DashboardCard';

interface PosRenderLinkPanelProps {
  licenses: License[];
  clients: SaasClient[];
  plans: SaasPlan[];
}

export function PosRenderLinkPanel({ licenses, clients, plans }: PosRenderLinkPanelProps) {
  const clientById = new Map(clients.map((c) => [c.id, c]));
  const planById = new Map(plans.map((p) => [p.id, p]));

  function copy(text: string, label: string) {
    void navigator.clipboard.writeText(text);
    alert(`${label} copiado`);
  }

  if (licenses.length === 0) return null;

  return (
    <DashboardCard title="Llaves para vincular POS en Render">
      <p className="mb-4 text-sm text-brand-mist">
        Copie el CLIENT_ID y las variables de entorno para configurar el POS en Render.
      </p>
      <div className="space-y-3">
        {licenses.map((lic) => {
          const client = clientById.get(lic.clientId);
          const planLabel = resolvePlanLabel(lic.planId, planById);
          const restaurantName = client?.businessName ?? lic.clientId;
          const envTemplate = buildPosRenderEnvTemplate({
            clientId: lic.clientId,
            licenseKey: lic.licenseKey,
            restaurantName,
            planName: planLabel,
            centralApiUrl: SITE_URL,
            expirationDate: new Date(lic.expiresAt).toISOString().split('T')[0],
          });

          return (
            <div
              key={lic.id}
              className="rounded-xl border border-white/10 bg-white/[0.04] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-brand-soft">{restaurantName}</p>
                  <p className="mt-1 font-mono text-xs text-brand-cyan">{lic.licenseKey}</p>
                </div>
                <button
                  type="button"
                  onClick={() => copy(envTemplate, 'Variables Render')}
                  className="flex items-center gap-1.5 rounded-lg border border-brand-cyan/25 bg-brand-cyan/10 px-3 py-1.5 text-xs font-medium text-brand-cyan hover:bg-brand-cyan/15"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copiar variables Render
                </button>
              </div>
              <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                <div>
                  <dt className="text-brand-slate">CLIENT_ID</dt>
                  <dd className="mt-0.5 flex items-center gap-2 font-mono text-brand-mist">
                    <span className="truncate">{lic.clientId}</span>
                    <button
                      type="button"
                      onClick={() => copy(lic.clientId, 'CLIENT_ID')}
                      className="shrink-0 rounded p-1 hover:bg-white/10"
                      aria-label="Copiar CLIENT_ID"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </dd>
                </div>
                <div>
                  <dt className="text-brand-slate">CENTRAL_API_URL</dt>
                  <dd className="mt-0.5 font-mono text-brand-mist">{SITE_URL}</dd>
                </div>
              </dl>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
}
