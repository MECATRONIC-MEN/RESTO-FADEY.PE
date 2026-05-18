import { jsonOk, jsonError, requireAdminSession } from '@/lib/api/server-auth';
import {
  listAdminNotifications,
  markAllNotificationsRead,
} from '@/lib/services/notifications';

/** GET — listar notificaciones admin */
export async function GET(request: Request) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const unreadOnly = searchParams.get('unreadOnly') === 'true';
  const limit = Math.min(Number(searchParams.get('limit') ?? 50), 100);

  try {
    const data = await listAdminNotifications({ unreadOnly, limit });
    return jsonOk(data);
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}

/** PATCH — marcar todas como leídas */
export async function PATCH() {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  try {
    await markAllNotificationsRead();
    return jsonOk({ ok: true });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
