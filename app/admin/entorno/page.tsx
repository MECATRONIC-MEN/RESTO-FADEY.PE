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
            <li>GET /api/users</li>
            <li>GET /api/licenses</li>
            <li>GET /api/plans</li>
            <li>GET /api/statistics</li>
            <li>POST /api/leads</li>
          </ul>
        </DashboardCard>
        <DashboardCard title="Variables">
          <p className="text-sm text-brand-mist">
            Producción: Vercel → restofadey.pe. POS en Render: integración futura (API_SECRET_KEY).
          </p>
        </DashboardCard>
      </div>
    </ModuleShell>
  );
}
