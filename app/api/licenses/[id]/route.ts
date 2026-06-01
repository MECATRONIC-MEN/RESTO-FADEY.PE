import { requireAdminSession, jsonOk, jsonError } from '@/lib/api/server-auth';
import { verifyLicenseAdminGate } from '@/lib/services/license-admin-gate';
import { deleteLicenseById } from '@/lib/services/licenses';

/** DELETE — Eliminar licencia (requiere clave de administración) */
export async function DELETE(
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

  if (!body.password?.trim()) return jsonError('Clave requerida', 400);
  if (!verifyLicenseAdminGate(body.password)) {
    return jsonError('Clave incorrecta', 403);
  }

  try {
    await deleteLicenseById(id);
    return jsonOk({ message: 'Licencia eliminada' });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error al eliminar', 500);
  }
}
