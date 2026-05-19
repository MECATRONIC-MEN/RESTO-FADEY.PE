import { auth } from '@/auth';
import { jsonOk, jsonError } from '@/lib/api/server-auth';
import { listModuleVideos } from '@/lib/services/academy-content';

export async function GET() {
  const session = await auth();
  if (!session?.user) return jsonError('No autorizado', 401);

  try {
    const all = await listModuleVideos(false);
    const published = all.filter((v) => v.isPublished);
    return jsonOk({ modules: all, published });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
