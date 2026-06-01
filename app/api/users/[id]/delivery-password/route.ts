import { requireAdminSession, jsonOk, jsonError } from '@/lib/api/server-auth';
import { storePortalDeliveryPassword } from '@/lib/services/client-portal-user';

/** POST — Registrar contraseña actual para entrega (sin cambiar el login) */
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;

  const { id } = await context.params;
  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError('JSON inválido');
  }

  if (!body.password?.trim()) return jsonError('Contraseña requerida');

  try {
    const result = await storePortalDeliveryPassword({
      userId: id,
      password: body.password.trim(),
    });
    return jsonOk({
      ...result,
      message: 'Contraseña registrada para entrega al cliente',
    });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 400);
  }
}
