import { requireAdminSession, jsonOk, jsonError } from '@/lib/api/server-auth';
import { createCourse, listCourses } from '@/lib/services/academy-content';

export async function GET() {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;
  try {
    return jsonOk(await listCourses(false));
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
  if (!body.title?.trim()) return jsonError('Título requerido');

  try {
    const course = await createCourse({
      title: body.title.trim(),
      description: body.description?.trim(),
      category: body.category?.trim(),
      thumbnailUrl: body.thumbnailUrl?.trim(),
      contentUrl: body.contentUrl?.trim(),
      duration: body.duration?.trim(),
      isPublished: body.isPublished ?? false,
    });
    return jsonOk(course, 201);
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
