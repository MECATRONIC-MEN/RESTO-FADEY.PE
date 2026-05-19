import { auth } from '@/auth';
import { jsonOk, jsonError } from '@/lib/api/server-auth';
import { listActivePromotions } from '@/lib/services/academy-content';

export async function GET() {
  const session = await auth();
  if (!session?.user) return jsonError('No autorizado', 401);

  try {
    return jsonOk(await listActivePromotions());
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
