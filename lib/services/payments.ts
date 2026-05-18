import {
  createPaymentFromPos as mockCreate,
  getPayments as mockGet,
  getPaymentById as mockGetById,
  updatePaymentStatus as mockUpdate,
} from '@/lib/domain/mock-store';
import { DEMO_CLIENT_ID } from '@/lib/demo';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { PaymentRecord, PaymentStatus, PosPaymentPayload } from '@/lib/domain/types';

async function resolveClientIdForPayment(requestedId: string): Promise<string> {
  const db = getSupabaseAdmin()!;
  const { data: match } = await db.from('clients').select('id').eq('id', requestedId).maybeSingle();
  if (match?.id) return match.id as string;

  const { data: demo } = await db.from('clients').select('id').eq('id', DEMO_CLIENT_ID).maybeSingle();
  if (demo?.id) return DEMO_CLIENT_ID;

  throw new Error(
    `clientId no registrado (${requestedId}). Use ${DEMO_CLIENT_ID} para el cliente demo.`
  );
}

function mapPayment(row: Record<string, unknown>): PaymentRecord {
  const submittedAt = row.submitted_at as string;
  const approvedAt = (row.reviewed_at as string) ?? undefined;
  const approvedBy = (row.reviewed_by as string) ?? undefined;

  return {
    id: row.id as string,
    clientId: row.client_id as string,
    clientName: row.client_name as string,
    restaurantName: (row.restaurant_name as string) ?? (row.client_name as string),
    amount: Number(row.amount),
    currency: 'PEN',
    method: row.method as PaymentRecord['method'],
    status: row.status as PaymentStatus,
    voucherUrl: (row.voucher_url as string) ?? undefined,
    reference: (row.reference as string) ?? undefined,
    period: (row.period as string) ?? '',
    planName: (row.plan_name as string) ?? undefined,
    createdAt: submittedAt,
    submittedAt,
    approvedAt,
    approvedBy,
    reviewedAt: approvedAt,
    reviewedBy: approvedBy,
    notes: (row.notes as string) ?? undefined,
    source: (row.source as PaymentRecord['source']) ?? 'pos',
    posNotifiedAt: (row.pos_notified_at as string) ?? undefined,
  };
}

export type PaymentFilters = {
  status?: PaymentStatus;
  clientId?: string;
  q?: string;
};

export async function getPayments(filters?: PaymentFilters): Promise<PaymentRecord[]> {
  if (!isSupabaseConfigured()) {
    return mockGet(filters);
  }

  const db = getSupabaseAdmin()!;
  let query = db.from('payments').select('*').order('submitted_at', { ascending: false });

  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.clientId) query = query.eq('client_id', filters.clientId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  let list = (data ?? []).map(mapPayment);

  if (filters?.q?.trim()) {
    const q = filters.q.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.clientName.toLowerCase().includes(q) ||
        p.restaurantName.toLowerCase().includes(q) ||
        p.reference?.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.clientId.toLowerCase().includes(q)
    );
  }

  return list;
}

export async function getPaymentById(id: string): Promise<PaymentRecord | null> {
  if (!isSupabaseConfigured()) {
    return mockGetById(id) ?? null;
  }
  const db = getSupabaseAdmin()!;
  const { data } = await db.from('payments').select('*').eq('id', id).maybeSingle();
  return data ? mapPayment(data) : null;
}

export async function createPaymentFromPos(payload: PosPaymentPayload): Promise<PaymentRecord> {
  const restaurantName = payload.restaurantName ?? payload.businessName;
  const status = payload.paymentStatus ?? 'pending';
  const submittedAt = payload.submittedAt ?? payload.createdAt ?? new Date().toISOString();

  if (!isSupabaseConfigured()) {
    return mockCreate({ ...payload, submittedAt });
  }

  const db = getSupabaseAdmin()!;
  const clientId = await resolveClientIdForPayment(payload.clientId);

  let clientName = restaurantName ?? 'Cliente';
  const { data: client } = await db
    .from('clients')
    .select('business_name')
    .eq('id', clientId)
    .maybeSingle();
  if (client?.business_name) clientName = client.business_name;

  const { data, error } = await db
    .from('payments')
    .insert({
      client_id: clientId,
      client_name: clientName,
      restaurant_name: restaurantName ?? clientName,
      amount: payload.amount,
      method: payload.method,
      status,
      voucher_url: payload.voucherUrl ?? null,
      reference: payload.reference ?? null,
      period: payload.period ?? new Date().toLocaleString('es-PE', { month: 'long', year: 'numeric' }),
      plan_name: payload.plan ?? null,
      source: 'pos',
      submitted_at: submittedAt,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapPayment(data);
}

/** Actualiza estado — licencia y POS se gestionan en payment-approval.ts */
export async function updatePaymentStatus(
  id: string,
  status: PaymentStatus,
  reviewedBy: string,
  notes?: string
): Promise<PaymentRecord | null> {
  if (!isSupabaseConfigured()) {
    return mockUpdate(id, status, reviewedBy, notes);
  }

  const db = getSupabaseAdmin()!;
  const reviewedAt = new Date().toISOString();
  const { data, error } = await db
    .from('payments')
    .update({
      status,
      reviewed_at: reviewedAt,
      reviewed_by: reviewedBy,
      notes: notes ?? null,
    })
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return null;
  return mapPayment(data);
}
