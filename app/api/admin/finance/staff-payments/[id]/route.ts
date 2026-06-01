import { requireAdminSession, jsonOk, jsonError } from '@/lib/api/server-auth';
import { deleteStaffPayment, markStaffPaymentPaid } from '@/lib/services/saas-finance';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(_request: Request, ctx: Ctx) {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;
  const { id } = await ctx.params;
  try {
    return jsonOk(await markStaffPaymentPaid(id));
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;
  const { id } = await ctx.params;
  try {
    await deleteStaffPayment(id);
    return jsonOk({ deleted: true });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
