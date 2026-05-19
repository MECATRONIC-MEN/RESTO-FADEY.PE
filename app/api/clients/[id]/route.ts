import { requireAdminSession, jsonOk, jsonError } from '@/lib/api/server-auth';
import {
  checkRestaurantConnection,
  deactivateClientInPanel,
  setClientLicenseStatus,
} from '@/lib/services/restaurant-connect';
import { getClientById } from '@/lib/services/clients';
import type { LicenseStatus } from '@/lib/domain/types';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;

  const { id } = await context.params;
  try {
    const client = await getClientById(id);
    if (!client) return jsonError('Cliente no encontrado', 404);
    return jsonOk(client);
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;

  const { id } = await context.params;
  let body: { action?: string; licenseStatus?: LicenseStatus };
  try {
    body = await request.json();
  } catch {
    return jsonError('JSON inválido');
  }

  try {
    if (body.action === 'suspend') {
      await setClientLicenseStatus(id, 'suspendido');
    } else if (body.action === 'reactivate') {
      await setClientLicenseStatus(id, 'activo');
    } else if (body.licenseStatus) {
      await setClientLicenseStatus(id, body.licenseStatus);
    } else {
      return jsonError('Acción no válida');
    }

    const client = await getClientById(id);
    return jsonOk({ client, message: 'Licencia actualizada' });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;

  const { id } = await context.params;
  try {
    await deactivateClientInPanel(id);
    return jsonOk({ message: 'Cliente eliminado del panel SaaS (POS y Render no se modifican)' });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
