import { jsonOk, jsonError, requireAdminSession } from '@/lib/api/server-auth';
import { deleteLead } from '@/lib/services/leads';

/** DELETE — eliminar solicitud de acceso y su notificación */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { id } = await params;
  if (!id) return jsonError('id requerido');

  try {
    await deleteLead(id);
    return jsonOk({ ok: true });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
