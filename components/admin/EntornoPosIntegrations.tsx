'use client';

import Link from 'next/link';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { IntegrationDiagnostics } from '@/components/admin/IntegrationDiagnostics';
import { DashboardCard } from '@/components/dashboard/DashboardCard';

export function EntornoPosIntegrations() {
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

      <Link
        href="/admin/licencias"
        className="inline-flex items-center gap-2 text-sm font-medium text-brand-cyan hover:underline"
      >
        Licencias y llaves Render
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
