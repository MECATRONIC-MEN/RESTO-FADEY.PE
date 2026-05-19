import { getPaymentById, updatePaymentStatus } from './payments';
import { activateLicenseForPayment, getLicenseStatusForClient } from './licenses';
import { buildConfirmPayload, notifyPosPaymentConfirm } from '@/lib/integrations/pos-notify';
import { getClientPosUrl } from '@/lib/services/client-license';
import type { PaymentApprovalResult, PaymentStatus } from '@/lib/domain/types';

export async function processPaymentDecision(
  paymentId: string,
  status: Extract<PaymentStatus, 'approved' | 'rejected'>,
  approvedBy: string,
  notes?: string
): Promise<PaymentApprovalResult> {
  const existing = await getPaymentById(paymentId);
  if (!existing) throw new Error('Pago no encontrado');
  if (existing.status !== 'pending') {
    throw new Error(`El pago ya fue ${existing.status === 'approved' ? 'aprobado' : 'rechazado'}`);
  }

  let planStatus = await getLicenseStatusForClient(existing.clientId);

  if (status === 'approved') {
    planStatus = await activateLicenseForPayment(existing.clientId);
  } else if (status === 'rejected') {
    planStatus = await getLicenseStatusForClient(existing.clientId);
    await setClientPaymentStatus(existing.clientId, 'rejected');
  }

  const payment = await updatePaymentStatus(paymentId, status, approvedBy, notes);
  if (!payment) throw new Error('No se pudo actualizar el pago');

  const confirmPayload = buildConfirmPayload(payment, planStatus);
  const posUrl = await getClientPosUrl(payment.clientId);
  const notify = await notifyPosPaymentConfirm(confirmPayload, posUrl);

  if (notify.ok) {
    await markPosNotified(paymentId);
  }

  return {
    payment: { ...payment, posNotifiedAt: notify.ok ? new Date().toISOString() : payment.posNotifiedAt },
    planStatus,
    posNotified: notify.ok,
    posNotifyError: notify.error,
  };
}

async function setClientPaymentStatus(
  clientId: string,
  paymentStatus: 'approved' | 'rejected' | 'pending'
): Promise<void> {
  const { isSupabaseConfigured } = await import('@/lib/supabase/config');
  if (!isSupabaseConfigured()) return;
  const { getSupabaseAdmin } = await import('@/lib/supabase/admin');
  await getSupabaseAdmin()!
    .from('clients')
    .update({ payment_status: paymentStatus })
    .eq('id', clientId);
}

async function markPosNotified(paymentId: string): Promise<void> {
  const { isSupabaseConfigured } = await import('@/lib/supabase/config');
  if (!isSupabaseConfigured()) return;

  const { getSupabaseAdmin } = await import('@/lib/supabase/admin');
  const db = getSupabaseAdmin()!;
  await db
    .from('payments')
    .update({ pos_notified_at: new Date().toISOString() })
    .eq('id', paymentId);
}

export async function retryPosNotification(paymentId: string): Promise<PaymentApprovalResult> {
  const payment = await getPaymentById(paymentId);
  if (!payment) throw new Error('Pago no encontrado');
  if (payment.status === 'pending') throw new Error('El pago aún está pendiente');

  const planStatus = await getLicenseStatusForClient(payment.clientId);
  const posUrl = await getClientPosUrl(payment.clientId);
  const notify = await notifyPosPaymentConfirm(buildConfirmPayload(payment, planStatus), posUrl);

  if (notify.ok) await markPosNotified(paymentId);

  return {
    payment,
    planStatus,
    posNotified: notify.ok,
    posNotifyError: notify.error,
  };
}
