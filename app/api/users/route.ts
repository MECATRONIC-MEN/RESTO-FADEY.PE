import { requireAdminSession, jsonOk, jsonError } from '@/lib/api/server-auth';
import { getClients } from '@/lib/services/clients';
import { listUsers } from '@/lib/services/users';

export async function GET(request: Request) {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;

  const { searchParams } = new URL(request.url);
  const view = searchParams.get('view');

  try {
    if (view === 'accounts') {
      const users = await listUsers();
      return jsonOk(
        users.map((u) => ({
          id: u.id,
          email: u.email,
          name: u.name,
          role: u.role,
          clientId: u.clientId,
          restaurant: u.restaurant,
          plan: u.plan,
          isActive: u.isActive,
          portalDeliveryPassword: u.portalDeliveryPassword ?? null,
        }))
      );
    }
    return jsonOk(await getClients());
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
