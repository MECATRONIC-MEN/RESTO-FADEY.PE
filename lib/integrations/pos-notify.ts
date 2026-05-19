import type { PaymentConfirmPayload, PaymentRecord } from '@/lib/domain/types';
import { isValidApiSecret } from '@/lib/jwt';

/**
 * Notifica al POS la decisión del administrador central.
 * El POS debe exponer: POST {NEXT_PUBLIC_POS_URL}/api/payments/confirm
 */
export async function notifyPosPaymentConfirm(
  payload: PaymentConfirmPayload,
  posBaseUrl?: string | null
): Promise<{ ok: boolean; error?: string }> {
  const posBase =
    posBaseUrl?.replace(/\/$/, '') ?? process.env.NEXT_PUBLIC_POS_URL?.replace(/\/$/, '');
  if (!posBase) {
    return {
      ok: false,
      error: 'URL del POS no configurada (render_url del cliente o NEXT_PUBLIC_POS_URL)',
    };
  }

  const secret = process.env.API_SECRET_KEY ?? process.env.POS_API_KEY;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (secret) headers.Authorization = `Bearer ${secret}`;

  try {
    const res = await fetch(`${posBase}/api/payments/confirm`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return { ok: false, error: `POS respondió ${res.status}: ${text.slice(0, 200)}` };
    }
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'Error al contactar POS',
    };
  }
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
