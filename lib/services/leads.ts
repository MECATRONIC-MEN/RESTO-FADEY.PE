import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { CommercialLead } from '@/lib/domain/types';

const memoryLeads: (CommercialLead & { id: string; createdAt: string })[] = [];

export async function createLead(lead: CommercialLead): Promise<{ id: string }> {
  if (!isSupabaseConfigured()) {
    const id = `lead_${Date.now()}`;
    memoryLeads.unshift({ ...lead, id, createdAt: new Date().toISOString() });
    return { id };
  }

  const db = getSupabaseAdmin()!;
  const { data, error } = await db
    .from('leads')
    .insert({
      name: lead.name,
      email: lead.email,
      phone: lead.phone ?? null,
      business_name: lead.businessName ?? null,
      plan_interest: lead.planInterest ?? null,
      message: lead.message ?? null,
      survey: lead.survey ?? {},
    })
    .select('id')
    .single();

  if (error) throw new Error(error.message);
  return { id: data.id as string };
}
