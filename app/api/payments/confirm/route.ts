import { jsonOk, jsonError, requireAdminSession } from '@/lib/api/server-auth';
import { isPosConfirmAuth, buildConfirmPayload } from '@/lib/integrations/pos-notify';
import { getPaymentById } from '@/lib/services/payments';
import { getLicenseStatusForClient } from '@/lib/services/licenses';
import { retryPosNotification } from '@/lib/services/payment-approval';

/**
 * GET — POS consulta estado de un pago (polling).
 * Header: Authorization: Bearer API_SECRET_KEY
 */
export async function GET(request: Request) {
  if (!isPosConfirmAuth(request)) {
    return jsonError('No autorizado', 401);
  }

  const paymentId = new URL(request.url).searchParams.get('paymentId');
  if (!paymentId) return jsonError('paymentId requerido');

  try {
    const payment = await getPaymentById(paymentId);
    if (!payment) return jsonError('Pago no encontrado', 404);

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
  const isPos = isPosConfirmAuth(request);

  if ('error' in adminResult && !isPos) return adminResult.error;

  let body: { paymentId?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError('JSON inválido');
  }

  if (!body.paymentId) return jsonError('paymentId requerido');

  try {
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
