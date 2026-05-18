import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { AdminNotification, AdminNotificationType } from '@/lib/domain/types';

type CreateInput = {
  type: AdminNotificationType;
  title: string;
  body: string;
  payload?: Record<string, unknown>;
};

const memoryNotifications: AdminNotification[] = [];

function rowToNotification(row: Record<string, unknown>): AdminNotification {
  return {
    id: String(row.id),
    type: row.type as AdminNotificationType,
    title: String(row.title),
    body: String(row.body),
    payload: (row.payload as Record<string, unknown>) ?? {},
    readAt: row.read_at ? String(row.read_at) : null,
    createdAt: String(row.created_at),
  };
}

export async function createAdminNotification(input: CreateInput): Promise<AdminNotification> {
  const record: AdminNotification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type: input.type,
    title: input.title,
    body: input.body,
    payload: input.payload ?? {},
    readAt: null,
    createdAt: new Date().toISOString(),
  };

  if (!isSupabaseConfigured()) {
    memoryNotifications.unshift(record);
    return record;
  }

  const db = getSupabaseAdmin()!;
  const { data, error } = await db
    .from('admin_notifications')
    .insert({
      type: input.type,
      title: input.title,
      body: input.body,
      payload: input.payload ?? {},
    })
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return rowToNotification(data as Record<string, unknown>);
}

export async function listAdminNotifications(options?: {
  unreadOnly?: boolean;
  limit?: number;
}): Promise<AdminNotification[]> {
  const limit = options?.limit ?? 50;

  if (!isSupabaseConfigured()) {
    let list = [...memoryNotifications];
    if (options?.unreadOnly) list = list.filter((n) => !n.readAt);
    return list.slice(0, limit);
  }

  const db = getSupabaseAdmin()!;
  let query = db.from('admin_notifications').select('*').order('created_at', { ascending: false }).limit(limit);

  if (options?.unreadOnly) {
    query = query.is('read_at', null);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => rowToNotification(row as Record<string, unknown>));
}

export async function markNotificationRead(id: string): Promise<void> {
  const readAt = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    const item = memoryNotifications.find((n) => n.id === id);
    if (item) item.readAt = readAt;
    return;
  }

  const db = getSupabaseAdmin()!;
  const { error } = await db.from('admin_notifications').update({ read_at: readAt }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function markAllNotificationsRead(): Promise<void> {
  const readAt = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    memoryNotifications.forEach((n) => {
      n.readAt = readAt;
    });
    return;
  }

  const db = getSupabaseAdmin()!;
  const { error } = await db
    .from('admin_notifications')
    .update({ read_at: readAt })
    .is('read_at', null);
  if (error) throw new Error(error.message);
}

export async function countUnreadNotifications(): Promise<number> {
  const list = await listAdminNotifications({ unreadOnly: true, limit: 200 });
  return list.length;
}

function parseNotificationTargetId(id: string): {
  notificationId?: string;
  leadId?: string;
  demoId?: string;
} {
  if (id.startsWith('lead_fb_')) return { leadId: id.slice('lead_fb_'.length) };
  if (id.startsWith('demo_fb_')) return { demoId: id.slice('demo_fb_'.length) };
  return { notificationId: id };
}

export async function deleteNotificationsForLead(leadId: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    for (let j = memoryNotifications.length - 1; j >= 0; j--) {
      if (memoryNotifications[j]?.payload.leadId === leadId) {
        memoryNotifications.splice(j, 1);
      }
    }
    return;
  }

  const db = getSupabaseAdmin()!;
  const { error } = await db
    .from('admin_notifications')
    .delete()
    .contains('payload', { leadId });
  if (error) throw new Error(error.message);
}

export async function deleteNotificationsForDemo(demoId: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    for (let j = memoryNotifications.length - 1; j >= 0; j--) {
      if (memoryNotifications[j]?.payload.demoId === demoId) {
        memoryNotifications.splice(j, 1);
      }
    }
    return;
  }

  const db = getSupabaseAdmin()!;
  const { error } = await db
    .from('admin_notifications')
    .delete()
    .contains('payload', { demoId });
  if (error) throw new Error(error.message);
}

/** Elimina notificación y, si aplica, la solicitud (lead/demo) vinculada */
export async function deleteAdminNotification(id: string): Promise<void> {
  const target = parseNotificationTargetId(id);

  if (target.leadId) {
    const { deleteLead } = await import('@/lib/services/leads');
    await deleteLead(target.leadId);
    return;
  }

  if (target.demoId) {
    const { deleteDemoRequest } = await import('@/lib/services/demo-requests');
    await deleteDemoRequest(target.demoId);
    return;
  }

  if (!isSupabaseConfigured()) {
    const idx = memoryNotifications.findIndex((n) => n.id === id);
    if (idx >= 0) memoryNotifications.splice(idx, 1);
    return;
  }

  const db = getSupabaseAdmin()!;
  const { data: row } = await db
    .from('admin_notifications')
    .select('payload')
    .eq('id', target.notificationId!)
    .maybeSingle();

  const payload = (row?.payload as Record<string, unknown>) ?? {};
  const leadId = typeof payload.leadId === 'string' ? payload.leadId : undefined;
  const demoId = typeof payload.demoId === 'string' ? payload.demoId : undefined;

  if (leadId) {
    const { deleteLead } = await import('@/lib/services/leads');
    await deleteLead(leadId);
    return;
  }

  if (demoId) {
    const { deleteDemoRequest } = await import('@/lib/services/demo-requests');
    await deleteDemoRequest(demoId);
    return;
  }

  const { error } = await db.from('admin_notifications').delete().eq('id', target.notificationId!);
  if (error) throw new Error(error.message);
}

/** Crea filas en admin_notifications para leads/demos que aún no tienen notificación */
export async function backfillNotificationsFromSources(): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const { listLeads } = await import('@/lib/services/leads');
  const { listDemoRequests } = await import('@/lib/services/demo-requests');
  const { leadToNotification, demoToNotification } = await import(
    '@/lib/services/notification-fallback'
  );

  const db = getSupabaseAdmin()!;
  const { data: existing, error: readErr } = await db.from('admin_notifications').select('payload');
  if (readErr) throw new Error(readErr.message);
  const leadIds = new Set(
    (existing ?? [])
      .map((r) => (r.payload as Record<string, unknown>)?.leadId)
      .filter((id): id is string => typeof id === 'string')
  );
  const demoIds = new Set(
    (existing ?? [])
      .map((r) => (r.payload as Record<string, unknown>)?.demoId)
      .filter((id): id is string => typeof id === 'string')
  );

  let created = 0;
  const leads = await listLeads(100);
  for (const lead of leads) {
    if (leadIds.has(lead.id)) continue;
    const n = leadToNotification(lead);
    const { error } = await db.from('admin_notifications').insert({
      type: n.type,
      title: n.title,
      body: n.body,
      payload: n.payload,
    });
    if (!error) created += 1;
  }

  const demos = await listDemoRequests(100);
  for (const demo of demos) {
    if (demoIds.has(demo.id)) continue;
    const n = demoToNotification(demo);
    const { error } = await db.from('admin_notifications').insert({
      type: n.type,
      title: n.title,
      body: n.body,
      payload: n.payload,
    });
    if (!error) created += 1;
  }

  return created;
}
