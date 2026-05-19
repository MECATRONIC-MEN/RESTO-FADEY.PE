import { requireAdminSession, jsonOk, jsonError } from '@/lib/api/server-auth';
import { provisionClientPortalUser } from '@/lib/services/client-portal-user';
import { getClientById } from '@/lib/services/clients';

/** POST — Regenerar contraseña del panel cliente */
export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;

  const { id } = await context.params;
  try {
    const client = await getClientById(id);
    if (!client) return jsonError('Cliente no encontrado', 404);

    const portal = await provisionClientPortalUser({
      clientId: id,
      restaurantName: client.businessName,
      regeneratePassword: true,
    });

    if (!portal.password) {
      return jsonError('No se pudo generar contraseña');
    }

    return jsonOk({
      username: portal.username,
      password: portal.password,
      email: portal.email,
      message: 'Nueva contraseña generada',
    });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
