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
