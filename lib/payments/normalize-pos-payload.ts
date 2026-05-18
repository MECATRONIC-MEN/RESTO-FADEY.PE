import type { PaymentMethod, PaymentStatus, PosPaymentPayload } from '@/lib/domain/types';

const METHODS: PaymentMethod[] = [
  'transferencia',
  'yape',
  'plin',
  'efectivo',
  'tarjeta',
  'otro',
];

function pickString(obj: Record<string, unknown>, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return undefined;
}

function normalizeMethod(raw: string | undefined): PaymentMethod | undefined {
  if (!raw) return undefined;
  const m = raw.toLowerCase().trim() as PaymentMethod;
  return METHODS.includes(m) ? m : 'otro';
}

/**
 * Acepta variantes de payload que envía el POS real.
 */
export function normalizePosPaymentPayload(body: Record<string, unknown>): PosPaymentPayload {
  const clientId =
    pickString(body, ['clientId', 'client_id', 'clienteId', 'restaurantId']) ?? '';

  const method = normalizeMethod(
    pickString(body, ['method', 'paymentMethod', 'payment_method', 'metodo'])
  );

  const amountRaw = body.amount ?? body.monto;
  const amount =
    typeof amountRaw === 'number'
      ? amountRaw
      : typeof amountRaw === 'string'
        ? parseFloat(amountRaw)
        : NaN;

  const voucherUrl = pickString(body, [
    'voucherUrl',
    'voucher_url',
    'voucher',
    'imageUrl',
    'image_url',
    'comprobanteUrl',
    'comprobante',
    'receiptUrl',
    'url',
  ]);

  const statusRaw = pickString(body, ['paymentStatus', 'status', 'estado']);
  let paymentStatus: PaymentStatus | undefined;
  if (statusRaw === 'pendiente' || statusRaw === 'pending') paymentStatus = 'pending';
  if (statusRaw === 'aprobado' || statusRaw === 'approved') paymentStatus = 'approved';
  if (statusRaw === 'rechazado' || statusRaw === 'rejected') paymentStatus = 'rejected';

  return {
    clientId,
    restaurantName:
      pickString(body, ['restaurantName', 'restaurant_name', 'businessName', 'business_name']) ??
      undefined,
    businessName: pickString(body, ['businessName', 'business_name']) ?? undefined,
    amount,
    method: method ?? 'otro',
    voucherUrl,
    reference: pickString(body, ['reference', 'referencia', 'ref']),
    period: pickString(body, ['period', 'periodo']),
    plan: pickString(body, ['plan', 'planName', 'plan_name']),
    submittedAt: pickString(body, ['submittedAt', 'submitted_at', 'createdAt', 'created_at']),
    createdAt: pickString(body, ['createdAt', 'created_at']),
    paymentStatus: paymentStatus ?? 'pending',
  };
}

export function validatePosPaymentPayload(payload: PosPaymentPayload): string | null {
  if (!payload.clientId) return 'clientId es requerido';
  if (!Number.isFinite(payload.amount) || payload.amount <= 0) {
    return 'amount debe ser un número mayor a 0';
  }
  if (!payload.method) return 'method / paymentMethod es requerido';
  return null;
}
