import { getFinancialStats as mockStats } from '@/lib/domain/mock-store';
import {
  buildPlanMapFromRows,
  buildPlanMapFromSaasPlans,
  computeFinancialStats,
} from '@/lib/analytics/financial-metrics';
import { getPayments } from './payments';
import { getClients, getPlans } from './clients';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { FinancialStats } from '@/lib/domain/types';

async function loadPlanMap() {
  if (!isSupabaseConfigured()) {
    return buildPlanMapFromSaasPlans(await getPlans());
  }

  const db = getSupabaseAdmin()!;
  const { data, error } = await db.from('plans').select('id, slug, name');
  if (error) throw new Error(error.message);
  return buildPlanMapFromRows(
    (data ?? []).map((p) => ({
      id: p.id as string,
      slug: p.slug as string,
      name: p.name as string,
    }))
  );
}

export async function getFinancialStats(): Promise<FinancialStats> {
  if (!isSupabaseConfigured()) return mockStats();

  const [payments, clients, planById] = await Promise.all([
    getPayments(),
    getClients(),
    loadPlanMap(),
  ]);

  return computeFinancialStats(payments, clients, planById);
}
