import { requireAdminSession, jsonOk, jsonError } from '@/lib/api/server-auth';
import { generatePosRenderLink } from '@/lib/services/pos-link-provision';

/** POST — Generar CLIENT_ID, clave de licencia y variables para el POS en Render */
export async function POST(request: Request) {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;

  let body: {
    restaurantName?: string;
    planId?: string;
    ruc?: string;
    contactEmail?: string;
    neverExpires?: boolean;
  };

  try {
    body = await request.json();
  } catch {
    return jsonError('JSON inválido');
  }

  if (!body.restaurantName?.trim()) return jsonError('Nombre del restaurante es requerido');
  if (!body.planId?.trim()) return jsonError('Plan es requerido');

  try {
    const result = await generatePosRenderLink({
      restaurantName: body.restaurantName.trim(),
      planId: body.planId.trim(),
      ruc: body.ruc?.trim(),
      contactEmail: body.contactEmail?.trim(),
      neverExpires: body.neverExpires === true,
    });
    return jsonOk(result, 201);
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error al generar llaves', 500);
  }
}
