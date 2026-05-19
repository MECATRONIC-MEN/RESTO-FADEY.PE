import { requireAdminSession, jsonOk, jsonError } from '@/lib/api/server-auth';
import { listModuleVideos, upsertModuleVideo } from '@/lib/services/academy-content';

export async function GET() {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;
  try {
    return jsonOk(await listModuleVideos(false));
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}

export async function POST(request: Request) {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;

  let body: {
    moduleSlug?: string;
    title?: string;
    description?: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    isPublished?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return jsonError('JSON inválido');
  }
  if (!body.moduleSlug?.trim()) return jsonError('moduleSlug requerido');
  if (!body.title?.trim()) return jsonError('Título requerido');

  try {
    return jsonOk(
      await upsertModuleVideo(body.moduleSlug.trim(), {
        title: body.title.trim(),
        description: body.description?.trim(),
        videoUrl: body.videoUrl?.trim(),
        thumbnailUrl: body.thumbnailUrl?.trim(),
        isPublished: body.isPublished ?? false,
      })
    );
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
