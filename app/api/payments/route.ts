import { jsonOk, jsonError, requireAdminSession } from '@/lib/api/server-auth';
import { requirePlatformAuth } from '@/lib/api/auth-middleware';
import { createPaymentFromPos, getPayments } from '@/lib/services/payments';
import type { PosPaymentPayload } from '@/lib/domain/types';

export async function GET(request: Request) {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') as 'pending' | 'approved' | 'rejected' | null;
  const clientId = searchParams.get('clientId');

  try {
    const data = await getPayments({
      status: status ?? undefined,
      clientId: clientId ?? undefined,
    });
    return jsonOk(data);
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}

/** POST — sincronización desde POS (voucher / pago) */
export async function POST(request: Request) {
  const authResult = await requirePlatformAuth(request);
  if (authResult.type === 'error') return authResult.response;

  let body: PosPaymentPayload;
  try {
    body = await request.json();
  } catch {
    return jsonError('JSON inválido');
  }

  if (!body.clientId || body.amount == null || !body.method) {
    return jsonError('clientId, amount y method son requeridos');
  }

  try {
    const payment = await createPaymentFromPos(body);
    return jsonOk(payment, 201);
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error al registrar pago', 500);
  }
}
