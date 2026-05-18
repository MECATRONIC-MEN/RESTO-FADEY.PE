import { requireAdminSession, jsonOk, jsonError } from '@/lib/api/server-auth';
import { getPaymentById } from '@/lib/services/payments';
import { processPaymentDecision } from '@/lib/services/payment-approval';
import type { PaymentStatus } from '@/lib/domain/types';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;
  const { id } = await params;
  try {
    const payment = await getPaymentById(id);
    if (!payment) return jsonError('Pago no encontrado', 404);
    return jsonOk(payment);
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;
  const { id } = await params;
  const body = await request.json();
  const status = body.status as PaymentStatus;

  if (status !== 'approved' && status !== 'rejected') {
    return jsonError('Solo se permite aprobar o rechazar pagos pendientes');
  }

  try {
    const result = await processPaymentDecision(
      id,
      status,
      admin.session.user.email ?? 'admin',
      body.notes
    );
    return jsonOk(result);
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
