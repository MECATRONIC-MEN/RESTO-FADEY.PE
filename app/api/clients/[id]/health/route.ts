import { requireAdminSession, jsonOk, jsonError } from '@/lib/api/server-auth';
import { checkRestaurantConnection } from '@/lib/services/restaurant-connect';

/** POST — Verificar conexión con el POS (GET /api/system/health) */
export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;

  const { id } = await context.params;
  try {
    const result = await checkRestaurantConnection(id);
    return jsonOk({
      ...result,
      label: result.online ? 'POS conectado' : 'Sin conexión',
    });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
