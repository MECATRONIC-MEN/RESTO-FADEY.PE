/**
 * EJEMPLO — Implementar en el repositorio del POS (Vercel/Render).
 * Recibe la decisión del administrador central.
 */
import type { NextRequest } from 'next/server';

export type PlatformPaymentConfirm = {
  paymentId: string;
  clientId: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt: string | null;
  planStatus: 'activo' | 'suspendido' | 'vencido' | 'prueba';
  planName?: string;
  amount: number;
  restaurantName: string;
};

export async function handlePlatformPaymentConfirm(body: PlatformPaymentConfirm) {
  // 1. Actualizar estado del pago en BD local del POS
  // 2. Si approved → activar plan del restaurante, extender licencia
  // 3. Opcional: ocultar voucher en UI del cliente (el historial queda en plataforma central)
  console.log('[POS] Confirmación plataforma:', body);
}

/** Ruta Next.js App Router en el POS: app/api/payments/confirm/route.ts */
export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (auth !== process.env.API_SECRET_KEY) {
    return Response.json({ success: false, error: 'No autorizado' }, { status: 401 });
  }
  const body = (await req.json()) as PlatformPaymentConfirm;
  await handlePlatformPaymentConfirm(body);
  return Response.json({ success: true });
}
