import { jsonOk, jsonError } from '@/lib/api/server-auth';
import { requirePlatformAuth } from '@/lib/api/auth-middleware';
import { assertPosClientAccess } from '@/lib/api/pos-access';
import { getClientLicenseStatus } from '@/lib/services/client-license';

/**
 * GET /api/license-status/:clientId
 * Consulta estado de licencia y último pago (solo POS / admin).
 * Con API_SECRET_KEY enviar header X-Client-Id igual al clientId de la URL.
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ clientId: string }> }
) {
  const authResult = await requirePlatformAuth(request);
  if (authResult.type === 'error') return authResult.response;

  const { clientId } = await context.params;
  if (!clientId) return jsonError('clientId requerido');

  const denied = assertPosClientAccess(authResult, clientId, request);
  if (denied) return denied;

  try {
    const status = await getClientLicenseStatus(clientId);
    if (!status) return jsonError('Cliente no encontrado', 404);
    return jsonOk(status);
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
