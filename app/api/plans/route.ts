import { requireAdminSession, jsonOk, jsonError } from '@/lib/api/server-auth';
import { getPlans } from '@/lib/services/clients';

export async function GET() {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;
  try {
    return jsonOk(await getPlans());
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
