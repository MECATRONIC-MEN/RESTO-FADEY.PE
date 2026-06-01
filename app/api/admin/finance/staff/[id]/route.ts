import { requireAdminSession, jsonOk, jsonError } from '@/lib/api/server-auth';
import { deleteStaff, updateStaff } from '@/lib/services/saas-finance';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;
  const { id } = await ctx.params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonError('JSON inválido');
  }

  try {
    const member = await updateStaff(id, {
      name: body.name as string | undefined,
      role: body.role as string | undefined,
      phone: body.phone as string | undefined,
      email: body.email as string | undefined,
      payAmount: body.payAmount != null ? Number(body.payAmount) : undefined,
      payDayOfMonth:
        body.payDayOfMonth === null ? null : body.payDayOfMonth != null ? Number(body.payDayOfMonth) : undefined,
      notes: body.notes as string | undefined,
      isActive: body.isActive as boolean | undefined,
    });
    return jsonOk(member);
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;
  const { id } = await ctx.params;
  try {
    await deleteStaff(id);
    return jsonOk({ deleted: true });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
