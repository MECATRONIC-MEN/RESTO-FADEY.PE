import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createAdminNotification } from '@/lib/services/notifications';
import type { DemoRequest, DemoRequestRecord } from '@/lib/domain/types';

const memoryDemos: DemoRequestRecord[] = [];

async function notifyDemoRequest(demo: DemoRequestRecord) {
  try {
    await createAdminNotification({
      type: 'demo_request',
      title: `Nueva demo: ${demo.businessName}`,
      body: [demo.name, demo.email, demo.phone ? `Tel: ${demo.phone}` : null]
        .filter(Boolean)
        .join(' · '),
      payload: {
        demoId: demo.id,
        name: demo.name,
        email: demo.email,
        phone: demo.phone,
        businessName: demo.businessName,
      },
    });
  } catch (err) {
    console.error(
      '[demos] No se pudo crear notificación admin (¿ejecutaste 005_admin_notifications.sql?):',
      err instanceof Error ? err.message : err
    );
  }
}

export async function createDemoRequest(input: DemoRequest): Promise<{ id: string }> {
  if (!isSupabaseConfigured()) {
    const id = `demo_${Date.now()}`;
    const record: DemoRequestRecord = {
      ...input,
      id,
      createdAt: new Date().toISOString(),
    };
    memoryDemos.unshift(record);
    await notifyDemoRequest(record);
    return { id };
  }

  const db = getSupabaseAdmin()!;
  const { data, error } = await db
    .from('demo_requests')
    .insert({
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      business_name: input.businessName,
    })
    .select('*')
    .single();

  if (error) throw new Error(error.message);

  const record: DemoRequestRecord = {
    id: data.id as string,
    name: data.name as string,
    email: data.email as string,
    phone: (data.phone as string) ?? undefined,
    businessName: data.business_name as string,
    createdAt: data.created_at as string,
  };

  await notifyDemoRequest(record);
  return { id: record.id };
}

export async function deleteDemoRequest(id: string): Promise<void> {
  const { deleteNotificationsForDemo } = await import('@/lib/services/notifications');
  await deleteNotificationsForDemo(id);

  if (!isSupabaseConfigured()) {
    const idx = memoryDemos.findIndex((d) => d.id === id);
    if (idx >= 0) memoryDemos.splice(idx, 1);
    return;
  }

  const db = getSupabaseAdmin()!;
  const { error } = await db.from('demo_requests').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function listDemoRequests(limit = 100): Promise<DemoRequestRecord[]> {
  if (!isSupabaseConfigured()) {
    return memoryDemos.slice(0, limit);
  }

  const db = getSupabaseAdmin()!;
  const { data, error } = await db
    .from('demo_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    phone: (row.phone as string) ?? undefined,
    businessName: row.business_name as string,
    createdAt: row.created_at as string,
  }));
}
