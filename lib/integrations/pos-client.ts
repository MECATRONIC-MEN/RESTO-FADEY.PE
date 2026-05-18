/**
 * Cliente HTTP para integrar en el POS (Vercel / Render).
 * Copiar este archivo al repositorio del POS o importar como paquete interno.
 *
 * Flujo recomendado tras subir voucher:
 * 1. Subir imagen a storage del POS (opcional)
 * 2. syncPaymentToPlatform() → aparece en /admin/payments (pendiente)
 * 3. Tras aprobación central, el POS recibe POST /api/payments/confirm
 */

export interface PosPaymentSyncInput {
  clientId: string;
  restaurantName: string;
  amount: number;
  paymentMethod: 'transferencia' | 'yape' | 'plin' | 'efectivo' | 'tarjeta' | 'otro';
  voucherUrl?: string;
  plan?: string;
  reference?: string;
  period?: string;
  createdAt?: string;
}

export interface PosLoginInput {
  email: string;
  password: string;
}

export class RestoFadeyPlatformClient {
  constructor(
    private readonly baseUrl: string,
    private readonly apiSecret?: string
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  private headers(token?: string): HeadersInit {
    const h: Record<string, string> = { 'Content-Type': 'application/json' };
    const bearer = token ?? this.apiSecret;
    if (bearer) h.Authorization = `Bearer ${bearer}`;
    return h;
  }

  /** Mismo login que la web — usuarios compartidos */
  async login(input: PosLoginInput) {
    const res = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error ?? 'Login fallido');
    }
    return json.data as { token: string; user: Record<string, unknown> };
  }

  /**
   * Sincroniza pago/voucher con el backoffice.
   * Usar API_SECRET_KEY en producción o JWT de login().
   */
  async syncPayment(input: PosPaymentSyncInput, token?: string) {
    const res = await fetch(`${this.baseUrl}/api/payments`, {
      method: 'POST',
      headers: this.headers(token),
      body: JSON.stringify({
        clientId: input.clientId,
        restaurantName: input.restaurantName,
        amount: input.amount,
        method: input.paymentMethod,
        voucherUrl: input.voucherUrl,
        plan: input.plan,
        reference: input.reference,
        period: input.period,
        createdAt: input.createdAt ?? new Date().toISOString(),
        paymentStatus: 'pending',
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error ?? 'Error al sincronizar pago');
    }
    return json.data;
  }

  /** Consultar decisión del admin (polling desde POS) */
  async pollPaymentConfirm(paymentId: string) {
    const res = await fetch(
      `${this.baseUrl}/api/payments/confirm?paymentId=${encodeURIComponent(paymentId)}`,
      { headers: this.headers() }
    );
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error ?? 'Error al consultar confirmación');
    }
    return json.data;
  }
}

/** Helper — llamar después de guardar voucher en el POS */
export async function syncPaymentToPlatform(
  platformUrl: string,
  apiSecret: string,
  input: PosPaymentSyncInput
) {
  const client = new RestoFadeyPlatformClient(platformUrl, apiSecret);
  return client.syncPayment(input);
}
