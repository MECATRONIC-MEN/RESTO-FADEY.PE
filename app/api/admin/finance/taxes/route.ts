import { requireAdminSession, jsonOk, jsonError } from '@/lib/api/server-auth';
import { createTaxPayment, listTaxPayments } from '@/lib/services/saas-finance';

export async function GET() {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;
  try {
    return jsonOk(await listTaxPayments());
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}

export async function POST(request: Request) {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;

  let body: {
    taxType?: string;
    amount?: number;
    dueDate?: string;
    periodYear?: number;
    periodMonth?: number;
    reference?: string;
    notes?: string;
  };
  try {
    body = await request.json();
  } catch {
    return jsonError('JSON inválido');
  }

  const now = new Date();
  try {
    const payment = await createTaxPayment({
      taxType: body.taxType ?? '',
      amount: Number(body.amount ?? 0),
      dueDate: body.dueDate ?? '',
      periodYear: body.periodYear ?? now.getFullYear(),
      periodMonth: body.periodMonth ?? now.getMonth() + 1,
      reference: body.reference,
      notes: body.notes,
    });
    return jsonOk(payment, 201);
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
