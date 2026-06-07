import { jsonOk, jsonError, requireAdminSession } from '@/lib/api/server-auth';
import { createLead, listLeads } from '@/lib/services/leads';
import { trackTikTokServerEventAsync } from '@/lib/analytics/tiktok-events-api';
import { getClientRequestContext } from '@/lib/analytics/request-context';
import type { CommercialLead } from '@/lib/domain/types';

/** GET — solicitudes comerciales (solo admin) */
export async function GET() {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  try {
    const data = await listLeads();
    return jsonOk(data);
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}

/** POST — lead comercial desde /register (sin crear cuenta) */
export async function POST(request: Request) {
  let body: CommercialLead;
  try {
    body = await request.json();
  } catch {
    return jsonError('JSON inválido');
  }

  if (!body.name || !body.email) {
    return jsonError('name y email son requeridos');
  }

  try {
    const result = await createLead(body);

    const ctx = getClientRequestContext(request);
    trackTikTokServerEventAsync({
      event: 'SubmitForm',
      eventId: `lead_${result.id}`,
      email: body.email,
      phone: body.phone,
      ...ctx,
      properties: { content_name: 'registro_interes', content_type: 'lead' },
    });

    return jsonOk(result, 201);
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
