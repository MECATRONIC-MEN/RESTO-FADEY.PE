import { requireAdminSession, jsonOk, jsonError } from '@/lib/api/server-auth';
import { connectRestaurantFromPos } from '@/lib/services/restaurant-connect';

/** POST — Conectar restaurante desde URL Render + CLIENT_ID */
export async function POST(request: Request) {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;

  let body: { renderUrl?: string; clientId?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError('JSON inválido');
  }

  if (!body.renderUrl?.trim()) return jsonError('URL Render POS es requerida');
  if (!body.clientId?.trim()) return jsonError('CLIENT_ID es requerido');

  try {
    const result = await connectRestaurantFromPos({
      renderUrl: body.renderUrl.trim(),
      clientId: body.clientId.trim(),
    });
    return jsonOk(result, result.created ? 201 : 200);
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error al conectar', 500);
  }
}
