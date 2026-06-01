import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EntornoDataReset } from '@/components/admin/EntornoDataReset';
import { EntornoPosIntegrations } from '@/components/admin/EntornoPosIntegrations';
import { DashboardCard } from '@/components/dashboard/DashboardCard';

export default function AdminEntornoPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <AdminPageHeader
        title="Entorno e integraciones"
        description="POS, API REST, variables de entorno, llaves Render y herramientas de prueba."
      />

      <EntornoDataReset />

      <EntornoPosIntegrations />

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard title="API REST">
          <ul className="space-y-2 font-mono text-xs text-brand-cyan">
            <li>POST /api/auth/login</li>
            <li>POST /api/payments</li>
            <li>PATCH /api/payments/[id]</li>
            <li>GET/POST /api/payments/confirm</li>
            <li>POST /api/license/confirm</li>
            <li>GET /api/license-status/[clientId]</li>
            <li>GET /api/users</li>
            <li>GET /api/licenses</li>
            <li>POST /api/licenses/generate-pos-link</li>
            <li>GET /api/plans</li>
            <li>GET /api/statistics</li>
            <li>POST /api/leads · GET (admin)</li>
            <li>POST /api/demos · GET (admin)</li>
            <li>GET /api/notifications · PATCH</li>
            <li>POST /api/admin/reset-data</li>
          </ul>
        </DashboardCard>
        <DashboardCard title="Variables">
          <p className="text-sm text-brand-mist">
            POS Render: CLIENT_ID + CENTRAL_API_URL + API_SECRET_KEY + header X-Client-Id.
            Cada cliente puede tener render_url en Supabase para notificar aprobaciones.
          </p>
        </DashboardCard>
      </div>
    </div>
  );
}
