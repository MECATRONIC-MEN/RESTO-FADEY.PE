import { jsonOk, jsonError, requireAdminSession } from '@/lib/api/server-auth';
import { requirePlatformAuth } from '@/lib/api/auth-middleware';
import { assertPosClientAccess } from '@/lib/api/pos-access';
import { buildConfirmPayload } from '@/lib/integrations/pos-notify';
import { getPaymentById } from '@/lib/services/payments';
import { getLicenseStatusForClient } from '@/lib/services/licenses';
import { retryPosNotification } from '@/lib/services/payment-approval';

/**
 * GET — POS consulta estado de un pago (polling).
 * Header: Authorization: Bearer API_SECRET_KEY
 */
export async function GET(request: Request) {
  const authResult = await requirePlatformAuth(request);
  if (authResult.type === 'error') return authResult.response;

  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get('paymentId');
  const clientIdParam = searchParams.get('clientId');
  if (!paymentId) return jsonError('paymentId requerido');

  try {
    const payment = await getPaymentById(paymentId);
    if (!payment) return jsonError('Pago no encontrado', 404);

    const clientId = clientIdParam ?? payment.clientId;
    if (clientId !== payment.clientId) {
      return jsonError('clientId no corresponde al pago', 403);
    }

    const denied = assertPosClientAccess(authResult, payment.clientId, request);
    if (denied) return denied;

    const planStatus = await getLicenseStatusForClient(payment.clientId);
    return jsonOk(buildConfirmPayload(payment, planStatus));
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}

/**
 * POST — Reenviar confirmación al POS (admin) o recibir ack del POS.
 * Admin: { paymentId } — reintenta notificación
 */
export async function POST(request: Request) {
  const adminResult = await requireAdminSession();
  const isAdmin = !('error' in adminResult);

  let posAuth: Awaited<ReturnType<typeof requirePlatformAuth>> | null = null;
  if (!isAdmin) {
    posAuth = await requirePlatformAuth(request);
    if (posAuth.type === 'error') return posAuth.response;
  }

  let body: { paymentId?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError('JSON inválido');
  }

  if (!body.paymentId) return jsonError('paymentId requerido');

  try {
    const payment = await getPaymentById(body.paymentId);
    if (!payment) return jsonError('Pago no encontrado', 404);

    if (!isAdmin && posAuth?.type === 'pos') {
      const denied = assertPosClientAccess(posAuth, payment.clientId, request);
      if (denied) return denied;
    }

    const result = await retryPosNotification(body.paymentId);
    return jsonOk({
      ...buildConfirmPayload(result.payment, result.planStatus),
      posNotified: result.posNotified,
      posNotifyError: result.posNotifyError,
    });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
