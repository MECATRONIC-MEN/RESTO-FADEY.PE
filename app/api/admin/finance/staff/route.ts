import { requireAdminSession, jsonOk, jsonError } from '@/lib/api/server-auth';
import { createStaff, listStaff } from '@/lib/services/saas-finance';

export async function GET() {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;
  try {
    return jsonOk(await listStaff());
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}

export async function POST(request: Request) {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;

  let body: {
    name?: string;
    role?: string;
    phone?: string;
    email?: string;
    payAmount?: number;
    payDayOfMonth?: number;
    notes?: string;
  };
  try {
    body = await request.json();
  } catch {
    return jsonError('JSON inválido');
  }

  try {
    const member = await createStaff({
      name: body.name ?? '',
      role: body.role,
      phone: body.phone,
      email: body.email,
      payAmount: Number(body.payAmount ?? 0),
      payDayOfMonth: body.payDayOfMonth,
      notes: body.notes,
    });
    return jsonOk(member, 201);
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
