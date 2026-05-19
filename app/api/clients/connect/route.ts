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
    const msg = e instanceof Error ? e.message : 'Error al conectar';
    if (msg.includes("api_key") && msg.includes('schema cache')) {
      return jsonError(
        'Falta la migración de base de datos. En Supabase → SQL Editor ejecute el archivo supabase/EJECUTAR_008_CONECTAR_POS.sql y vuelva a intentar.',
        500
      );
    }
    return jsonError(msg, 500);
  }
}
