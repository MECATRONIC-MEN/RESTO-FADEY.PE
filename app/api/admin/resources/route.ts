import { requireAdminSession, jsonOk, jsonError } from '@/lib/api/server-auth';
import { createResource, listResources } from '@/lib/services/academy-content';
import type { AcademyResourceType } from '@/lib/domain/types';

export async function GET() {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;
  try {
    return jsonOk(await listResources(false));
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}

export async function POST(request: Request) {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;

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
  if (!body.title?.trim()) return jsonError('Título requerido');
  if (!body.fileUrl?.trim()) return jsonError('URL del archivo o enlace requerido');

  try {
    const resource = await createResource({
      title: body.title.trim(),
      description: body.description?.trim(),
      category: body.category?.trim(),
      resourceType: body.resourceType ?? 'documento',
      fileUrl: body.fileUrl.trim(),
      thumbnailUrl: body.thumbnailUrl?.trim(),
      isPublished: body.isPublished ?? false,
    });
    return jsonOk(resource, 201);
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
