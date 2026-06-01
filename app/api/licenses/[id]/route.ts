import { requireAdminSession, jsonOk, jsonError } from '@/lib/api/server-auth';
import { verifyLicenseAdminGate } from '@/lib/services/license-admin-gate';
import { deleteLicenseById, updateLicenseExpiration } from '@/lib/services/licenses';

/** PATCH — Vencimiento finito o licencia sin vencimiento */
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;

  const { id } = await context.params;
  let body: { neverExpires?: boolean; expiresAt?: string | null };
  try {
    body = await request.json();
  } catch {
    return jsonError('JSON inválido');
  }

  if (typeof body.neverExpires !== 'boolean') {
    return jsonError('Indique neverExpires (true o false)', 400);
  }

  try {
    const license = await updateLicenseExpiration(id, {
      neverExpires: body.neverExpires,
      expiresAt: body.expiresAt,
    });
    return jsonOk(license);
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error al actualizar', 500);
  }
}

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
    const text = await request.text();
    if (!text.trim()) return jsonError('Clave de administración requerida', 400);
    body = JSON.parse(text) as typeof body;
  } catch {
    return jsonError('JSON inválido');
  }

  if (!body.password?.trim()) return jsonError('Clave de administración requerida', 400);
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
