import type { PaymentConfirmPayload, PaymentRecord } from '@/lib/domain/types';
import { isValidApiSecret } from '@/lib/jwt';
import { notifyPosLicenseConfirm } from '@/lib/integrations/pos-remote';
import { getClientLicenseStatus } from '@/lib/services/client-license';

/**
 * Notifica al POS la decisión del administrador (usa renderUrl del cliente en DB).
 */
export async function notifyPosPaymentConfirm(
  payload: PaymentConfirmPayload,
  posBaseUrl?: string | null
): Promise<{ ok: boolean; error?: string }> {
  const posBase = posBaseUrl?.replace(/\/$/, '');
  if (!posBase) {
    return {
      ok: false,
      error: 'render_url del cliente no configurada — conecte el restaurante en Clientes',
    };
  }

  const lic = await getClientLicenseStatus(payload.clientId);

  return notifyPosLicenseConfirm(posBase, {
    clientId: payload.clientId,
    paymentId: payload.paymentId,
    status: payload.status,
    planStatus: payload.planStatus,
    planName: payload.planName,
    expirationDate: lic?.expirationDate ?? null,
  });
}

export function buildConfirmPayload(
  payment: PaymentRecord,
  planStatus: PaymentConfirmPayload['planStatus']
): PaymentConfirmPayload {
  const approvedAt =
    payment.approvedAt ?? payment.reviewedAt ?? (payment.status !== 'pending' ? new Date().toISOString() : null);

  return {
    paymentId: payment.id,
    clientId: payment.clientId,
    status: payment.status,
    approvedAt,
    planStatus,
    planName: payment.planName,
    amount: payment.amount,
    restaurantName: payment.restaurantName ?? payment.clientName,
  };
}

/** Valida token en GET /api/payments/confirm (polling POS) */
export function isPosConfirmAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  const bearer = authHeader?.replace(/^Bearer\s+/i, '') ?? '';
  if (bearer && isValidApiSecret(bearer)) return true;
  const key = request.headers.get('x-api-key');
  return Boolean(key && isValidApiSecret(key));
}
