import { requireAdminSession, jsonOk, jsonError } from '@/lib/api/server-auth';
import { resetOperationalData } from '@/lib/services/data-reset';

/** POST — Reiniciar datos de prueba (solo master_admin) */
export async function POST(request: Request) {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;

  let body: {
    confirm?: string;
    includeLeadsAndNotifications?: boolean;
    removeTestClients?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return jsonError('JSON inválido');
  }

  if (!body.confirm?.trim()) {
    return jsonError('Confirmación requerida');
  }

  try {
    const result = await resetOperationalData({
      confirm: body.confirm,
      includeLeadsAndNotifications: body.includeLeadsAndNotifications,
      removeTestClients: body.removeTestClients,
    });
    return jsonOk(result);
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error al reiniciar', 500);
  }
}
