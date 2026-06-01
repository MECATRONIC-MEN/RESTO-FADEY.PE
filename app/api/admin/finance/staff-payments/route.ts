import { requireAdminSession, jsonOk, jsonError } from '@/lib/api/server-auth';
import {
  createStaffPayment,
  listStaffPayments,
  scheduleStaffPaymentFromMember,
} from '@/lib/services/saas-finance';

export async function GET() {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;
  try {
    return jsonOk(await listStaffPayments());
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}

export async function POST(request: Request) {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;

  let body: {
    staffId?: string;
    amount?: number;
    dueDate?: string;
    notes?: string;
    scheduleFromMember?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return jsonError('JSON inválido');
  }

  try {
    if (body.scheduleFromMember && body.staffId) {
      const payment = await scheduleStaffPaymentFromMember(body.staffId);
      return jsonOk(payment, 201);
    }
    const payment = await createStaffPayment({
      staffId: body.staffId ?? '',
      amount: Number(body.amount ?? 0),
      dueDate: body.dueDate ?? '',
      notes: body.notes,
    });
    return jsonOk(payment, 201);
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
