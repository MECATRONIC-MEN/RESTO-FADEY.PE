import { requireAdminSession, jsonOk, jsonError } from '@/lib/api/server-auth';
import { verifyLicenseAdminGate } from '@/lib/services/license-admin-gate';

/** POST — Verificar clave de acceso a llaves Render / eliminar licencias */
export async function POST(request: Request) {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;

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

  return jsonOk({ ok: true });
}
