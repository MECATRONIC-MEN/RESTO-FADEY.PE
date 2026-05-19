import { ModuleShell } from '@/components/admin/ModuleShell';
import { DashboardCard } from '@/components/dashboard/DashboardCard';

export default function AdminEntornoPage() {
  return (
    <ModuleShell
      title="Entorno e integraciones"
      description="Branding, API keys, WhatsApp, SMTP, SUNAT y seguridad."
      features={[
        'Branding y colores',
        'SEO y dominio',
        'API keys (POS, Stripe)',
        'WhatsApp Business',
        'Correo SMTP',
        'Seguridad y JWT',
      ]}
      actions={['Guardar', 'Probar conexión', 'Rotar keys']}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard title="API REST">
          <ul className="space-y-2 font-mono text-xs text-brand-cyan">
            <li>POST /api/auth/login</li>
            <li>POST /api/payments</li>
            <li>PATCH /api/payments/[id]</li>
            <li>GET/POST /api/payments/confirm</li>
            <li>GET /api/license-status/[clientId]</li>
            <li>GET /api/users</li>
            <li>GET /api/licenses</li>
            <li>GET /api/plans</li>
            <li>GET /api/statistics</li>
            <li>POST /api/leads · GET (admin)</li>
            <li>POST /api/demos · GET (admin)</li>
            <li>GET /api/notifications · PATCH</li>
            <li>POST /api/notifications/pwa</li>
          </ul>
        </DashboardCard>
        <DashboardCard title="Variables">
          <p className="text-sm text-brand-mist">
            POS Render: CLIENT_ID + CENTRAL_API_URL + API_SECRET_KEY + header X-Client-Id.
            Cada cliente puede tener render_url en Supabase para notificar aprobaciones.
          </p>
        </DashboardCard>
      </div>
    </ModuleShell>
  );
}
