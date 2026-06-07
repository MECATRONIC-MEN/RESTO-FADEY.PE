import { jsonOk, jsonError, requireAdminSession } from '@/lib/api/server-auth';
import { createDemoRequest, listDemoRequests } from '@/lib/services/demo-requests';
import { trackTikTokServerEventAsync } from '@/lib/analytics/tiktok-events-api';
import { getClientRequestContext } from '@/lib/analytics/request-context';
import type { DemoRequest } from '@/lib/domain/types';

/** GET — solicitudes de demo (solo admin) */
export async function GET() {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  try {
    const data = await listDemoRequests();
    return jsonOk(data);
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}

/** POST — formulario /demo */
export async function POST(request: Request) {
  let body: DemoRequest;
  try {
    body = await request.json();
  } catch {
    return jsonError('JSON inválido');
  }

  if (!body.name?.trim() || !body.email?.trim() || !body.businessName?.trim()) {
    return jsonError('name, email y businessName son requeridos');
  }

  try {
    const result = await createDemoRequest({
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone?.trim(),
      businessName: body.businessName.trim(),
    });

    const ctx = getClientRequestContext(request);
    trackTikTokServerEventAsync({
      event: 'SubmitForm',
      eventId: `demo_${result.id}`,
      email: body.email.trim(),
      phone: body.phone?.trim(),
      ...ctx,
      properties: { content_name: 'solicitud_demo', content_type: 'lead' },
    });

    return jsonOk(result, 201);
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
