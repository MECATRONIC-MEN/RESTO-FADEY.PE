import { jsonOk } from '@/lib/api/server-auth';
import { getSupabaseConfigDiagnostics, isSupabaseConfigured } from '@/lib/supabase/config';
import { getPayments } from '@/lib/services/payments';
import { DEMO_CLIENT_ID } from '@/lib/demo';

/** Diagnóstico de integración POS → plataforma (sin secretos) */
export async function GET() {
  const config = getSupabaseConfigDiagnostics();
  let paymentCount = 0;
  let lastPayment: { id: string; status: string; hasVoucher: boolean } | null = null;

  try {
    const payments = await getPayments();
    paymentCount = payments.length;
    const latest = payments[0];
    if (latest) {
      lastPayment = {
        id: latest.id,
        status: latest.status,
        hasVoucher: Boolean(latest.voucherUrl),
      };
    }
  } catch {
    /* ignore */
  }

  return jsonOk({
    ok: config.persistenceReady || !isSupabaseConfigured(),
    config,
    demoClientId: DEMO_CLIENT_ID,
    payments: { count: paymentCount, latest: lastPayment },
    checklist: [
      {
        id: 'service_role',
        ok: config.supabaseServiceRole,
        label: 'SUPABASE_SERVICE_ROLE_KEY en Vercel',
      },
      {
        id: 'api_secret',
        ok: config.apiSecret,
        label: 'API_SECRET_KEY (misma en POS y plataforma)',
      },
      {
        id: 'pos_sync',
        ok: config.posUrl,
        label: 'NEXT_PUBLIC_POS_URL (para confirmar al POS)',
      },
      {
        id: 'pos_calls_api',
        ok: paymentCount > 0,
        label: 'Al menos un pago recibido desde el POS',
      },
    ],
  });
}
