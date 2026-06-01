import { requireAdminSession, jsonOk, jsonError } from '@/lib/api/server-auth';
import { getSaasFinanceSummary } from '@/lib/services/saas-finance';

export async function GET() {
  const admin = await requireAdminSession();
  if ('error' in admin) return admin.error;
  try {
    return jsonOk(await getSaasFinanceSummary());
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
