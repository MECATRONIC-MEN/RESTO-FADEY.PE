import { requireAdminSession, jsonOk, jsonError } from '@/lib/api/server-auth';
import { deleteCourse, updateCourse } from '@/lib/services/academy-content';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;

  const { id } = await context.params;
  let body: {
    title?: string;
    description?: string;
    category?: string;
    thumbnailUrl?: string;
    contentUrl?: string;
    duration?: string;
    isPublished?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return jsonError('JSON inválido');
  }

  try {
    return jsonOk(await updateCourse(id, body));
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
    await deleteCourse(id);
    return jsonOk({ message: 'Curso eliminado' });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
