import { requireAdminSession, jsonOk, jsonError } from '@/lib/api/server-auth';
import { getLicenses } from '@/lib/services/clients';

export async function GET() {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;
  try {
    return jsonOk(await getLicenses());
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
