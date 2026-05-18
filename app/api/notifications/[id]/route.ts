import { jsonOk, jsonError, requireAdminSession } from '@/lib/api/server-auth';
import { deleteAdminNotification, markNotificationRead } from '@/lib/services/notifications';

/** PATCH — marcar una notificación como leída */
export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { id } = await params;
  if (!id) return jsonError('id requerido');

  if (id.startsWith('lead_fb_') || id.startsWith('demo_fb_')) {
    return jsonOk({ ok: true });
  }

  try {
    await markNotificationRead(id);
    return jsonOk({ ok: true });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}

/** DELETE — eliminar notificación y solicitud vinculada (lead/demo) */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { id } = await params;
  if (!id) return jsonError('id requerido');

  try {
    await deleteAdminNotification(id);
    return jsonOk({ ok: true });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
