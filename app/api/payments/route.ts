import { jsonOk, jsonError, requireAdminSession } from '@/lib/api/server-auth';
import { requirePlatformAuth } from '@/lib/api/auth-middleware';
import { createPaymentFromPos, getPayments } from '@/lib/services/payments';
import {
  normalizePosPaymentPayload,
  validatePosPaymentPayload,
} from '@/lib/payments/normalize-pos-payload';
import { getSupabaseConfigDiagnostics, isSupabaseConfigured } from '@/lib/supabase/config';

export async function GET(request: Request) {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') as 'pending' | 'approved' | 'rejected' | null;
  const clientId = searchParams.get('clientId');
  const q = searchParams.get('q');

  try {
    const data = await getPayments({
      status: status ?? undefined,
      clientId: clientId ?? undefined,
      q: q ?? undefined,
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

  let raw: Record<string, unknown>;
  try {
    raw = await request.json();
  } catch {
    return jsonError('JSON inválido');
  }

  const body = normalizePosPaymentPayload(raw);
  const validationError = validatePosPaymentPayload(body);
  if (validationError) {
    return jsonError(validationError);
  }

  const diag = getSupabaseConfigDiagnostics();
  if (diag.warning) {
    console.warn('[payments] POST:', diag.warning);
  }

  try {
    const payment = await createPaymentFromPos(body);
    return jsonOk(
      {
        ...payment,
        _meta: {
          persisted: isSupabaseConfigured(),
          hasVoucher: Boolean(payment.voucherUrl),
          hint: !payment.voucherUrl
            ? 'Pago guardado sin voucherUrl — el POS debe enviar voucherUrl con la URL pública de la imagen.'
            : undefined,
        },
      },
      201
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error al registrar pago';
    console.error('[payments] POST failed:', msg, raw);
    return jsonError(msg, 500);
  }
}
