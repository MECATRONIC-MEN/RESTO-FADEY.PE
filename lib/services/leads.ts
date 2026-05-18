import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createAdminNotification } from '@/lib/services/notifications';
import type { CommercialLead, CommercialLeadRecord } from '@/lib/domain/types';

const memoryLeads: CommercialLeadRecord[] = [];

function formatLeadBody(lead: CommercialLead): string {
  const parts = [
    lead.email,
    lead.phone ? `Tel: ${lead.phone}` : null,
    lead.planInterest ? `Plan: ${lead.planInterest}` : null,
    lead.businessName ? `Local: ${lead.businessName}` : null,
  ].filter(Boolean);
  return parts.join(' · ');
}

async function notifyLead(lead: CommercialLeadRecord) {
  try {
    await createAdminNotification({
      type: 'lead',
      title: `Nueva solicitud: ${lead.businessName || lead.name}`,
      body: formatLeadBody(lead),
      payload: {
        leadId: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        businessName: lead.businessName,
        planInterest: lead.planInterest,
        message: lead.message,
        survey: lead.survey,
      },
    });
  } catch (err) {
    console.error(
      '[leads] No se pudo crear notificación admin (¿ejecutaste 005_admin_notifications.sql?):',
      err instanceof Error ? err.message : err
    );
  }
}

export async function createLead(lead: CommercialLead): Promise<{ id: string }> {
  if (!isSupabaseConfigured()) {
    const id = `lead_${Date.now()}`;
    const record: CommercialLeadRecord = {
      ...lead,
      id,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    memoryLeads.unshift(record);
    await notifyLead(record);
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
    .select('*')
    .single();

  if (error) throw new Error(error.message);

  const record: CommercialLeadRecord = {
    id: data.id as string,
    name: data.name as string,
    email: data.email as string,
    phone: (data.phone as string) ?? undefined,
    businessName: (data.business_name as string) ?? undefined,
    planInterest: (data.plan_interest as string) ?? undefined,
    message: (data.message as string) ?? undefined,
    survey: (data.survey as Record<string, string | boolean>) ?? {},
    status: data.status as string,
    createdAt: data.created_at as string,
  };

  await notifyLead(record);
  return { id: record.id };
}

export async function deleteLead(id: string): Promise<void> {
  const { deleteNotificationsForLead } = await import('@/lib/services/notifications');
  await deleteNotificationsForLead(id);

  if (!isSupabaseConfigured()) {
    const idx = memoryLeads.findIndex((l) => l.id === id);
    if (idx >= 0) memoryLeads.splice(idx, 1);
    return;
  }

  const db = getSupabaseAdmin()!;
  const { error } = await db.from('leads').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function listLeads(limit = 100): Promise<CommercialLeadRecord[]> {
  if (!isSupabaseConfigured()) {
    return memoryLeads.slice(0, limit);
  }

  const db = getSupabaseAdmin()!;
  const { data, error } = await db
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    phone: (row.phone as string) ?? undefined,
    businessName: (row.business_name as string) ?? undefined,
    planInterest: (row.plan_interest as string) ?? undefined,
    message: (row.message as string) ?? undefined,
    survey: (row.survey as Record<string, string | boolean>) ?? {},
    status: row.status as string,
    createdAt: row.created_at as string,
  }));
}
