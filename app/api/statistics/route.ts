import { requireAdminSession, jsonOk, jsonError } from '@/lib/api/server-auth';
import { getFinancialStats } from '@/lib/services/statistics';

export async function GET() {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;
  try {
    return jsonOk(await getFinancialStats());
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
