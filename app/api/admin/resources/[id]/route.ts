import { requireAdminSession, jsonOk, jsonError } from '@/lib/api/server-auth';
import { deleteResource, updateResource } from '@/lib/services/academy-content';
import type { AcademyResourceType } from '@/lib/domain/types';

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
    resourceType?: AcademyResourceType;
    fileUrl?: string;
    thumbnailUrl?: string;
    isPublished?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return jsonError('JSON inválido');
  }

  try {
    return jsonOk(
      await updateResource(id, {
        title: body.title,
        description: body.description,
        category: body.category,
        resourceType: body.resourceType,
        fileUrl: body.fileUrl,
        thumbnailUrl: body.thumbnailUrl,
        isPublished: body.isPublished,
      })
    );
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
    await deleteResource(id);
    return jsonOk({ message: 'Recurso eliminado' });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
