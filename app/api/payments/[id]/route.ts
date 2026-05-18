import { requireAdminSession, jsonOk, jsonError } from '@/lib/api/server-auth';
import { getPaymentById, updatePaymentStatus } from '@/lib/services/payments';
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

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return jsonError('status inválido');
  }

  try {
    const updated = await updatePaymentStatus(
      id,
      status,
      admin.session.user.email ?? 'admin',
      body.notes
    );
    if (!updated) return jsonError('Pago no encontrado', 404);
    return jsonOk(updated);
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
