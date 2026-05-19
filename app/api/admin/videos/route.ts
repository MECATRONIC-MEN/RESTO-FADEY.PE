import { requireAdminSession, jsonOk, jsonError } from '@/lib/api/server-auth';
import {
  listModuleVideos,
  upsertModuleVideo,
  createCustomModuleVideo,
  deleteModuleVideo,
} from '@/lib/services/academy-content';
import { buildDefaultModuleVideos } from '@/lib/academy/default-modules';

export async function GET() {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;
  try {
    const modules = await listModuleVideos(false);
    return jsonOk(modules.length ? modules : buildDefaultModuleVideos());
  } catch (e) {
    return jsonOk(buildDefaultModuleVideos());
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

/** Crear módulo de video personalizado */
export async function PUT(request: Request) {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;

  let body: { title?: string; description?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError('JSON inválido');
  }
  if (!body.title?.trim()) return jsonError('Título requerido');

  try {
    return jsonOk(
      await createCustomModuleVideo({
        title: body.title.trim(),
        description: body.description?.trim(),
      }),
      201
    );
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}

export async function DELETE(request: Request) {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;

  const moduleSlug = new URL(request.url).searchParams.get('moduleSlug');
  if (!moduleSlug?.trim()) return jsonError('moduleSlug requerido');

  try {
    await deleteModuleVideo(moduleSlug.trim());
    return jsonOk({ message: 'Video eliminado' });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
