/**
 * Cliente HTTP para integrar en el POS (Render).
 * Solo sincroniza pagos y consulta licencia — no ventas ni operaciones internas.
 *
 * Variables en el POS:
 *   CLIENT_ID=
 *   CENTRAL_API_URL=
 *   API_SECRET_KEY=
 *
 * Siempre enviar header: X-Client-Id: {CLIENT_ID}
 */

import type { ClientLicenseStatusResponse } from '@/lib/domain/types';

export interface PosPaymentSyncInput {
  clientId: string;
  restaurantName: string;
  adminName?: string;
  adminEmail?: string;
  amount: number;
  paymentMethod?: 'transferencia' | 'yape' | 'plin' | 'efectivo' | 'tarjeta' | 'otro';
  voucherUrl: string;
  plan?: string;
  operationNumber?: string;
  paymentDate?: string;
  reference?: string;
  period?: string;
  renderUrl?: string;
}

export interface PosLoginInput {
  email: string;
  password: string;
}

export class RestoFadeyPlatformClient {
  private readonly clientId?: string;

  constructor(
    private readonly baseUrl: string,
    private readonly apiSecret?: string,
    clientId?: string
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.clientId = clientId;
  }

  private headers(token?: string): HeadersInit {
    const h: Record<string, string> = { 'Content-Type': 'application/json' };
    const bearer = token ?? this.apiSecret;
    if (bearer) h.Authorization = `Bearer ${bearer}`;
    if (this.clientId) h['X-Client-Id'] = this.clientId;
    return h;
  }

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

  /** Registra comprobante en el panel SaaS */
  async syncPayment(input: PosPaymentSyncInput, token?: string) {
    const clientId = input.clientId || this.clientId;
    if (!clientId) throw new Error('clientId es requerido');

    const res = await fetch(`${this.baseUrl}/api/payments`, {
      method: 'POST',
      headers: {
        ...this.headers(token),
        'X-Client-Id': clientId,
      },
      body: JSON.stringify({
        clientId,
        restaurantName: input.restaurantName,
        adminName: input.adminName,
        adminEmail: input.adminEmail,
        amount: input.amount,
        method: input.paymentMethod ?? 'transferencia',
        voucherUrl: input.voucherUrl,
        plan: input.plan,
        operationNumber: input.operationNumber,
        paymentDate: input.paymentDate ?? new Date().toISOString(),
        reference: input.reference ?? input.operationNumber,
        period: input.period,
        renderUrl: input.renderUrl,
        paymentStatus: 'pending',
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error ?? 'Error al sincronizar pago');
    }
    return json.data;
  }

  /** Consulta licencia y estado de pago del cliente */
  async getLicenseStatus(clientId?: string): Promise<ClientLicenseStatusResponse> {
    const id = clientId ?? this.clientId;
    if (!id) throw new Error('clientId es requerido');

    const res = await fetch(`${this.baseUrl}/api/license-status/${encodeURIComponent(id)}`, {
      headers: this.headers(),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error ?? 'Error al consultar licencia');
    }
    return json.data as ClientLicenseStatusResponse;
  }

  /** Polling: decisión del admin sobre un pago */
  async pollPaymentConfirm(paymentId: string, clientId?: string) {
    const id = clientId ?? this.clientId;
    const qs = new URLSearchParams({ paymentId });
    if (id) qs.set('clientId', id);

    const res = await fetch(`${this.baseUrl}/api/payments/confirm?${qs.toString()}`, {
      headers: this.headers(),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error ?? 'Error al consultar confirmación');
    }
    return json.data;
  }
}

export async function syncPaymentToPlatform(
  platformUrl: string,
  apiSecret: string,
  input: PosPaymentSyncInput
) {
  const client = new RestoFadeyPlatformClient(platformUrl, apiSecret, input.clientId);
  return client.syncPayment(input);
}
