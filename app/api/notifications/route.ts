import { jsonOk, jsonError, requireAdminSession } from '@/lib/api/server-auth';
import {
  listAdminNotifications,
  markAllNotificationsRead,
  backfillNotificationsFromSources,
} from '@/lib/services/notifications';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { listLeads } from '@/lib/services/leads';
import { listDemoRequests } from '@/lib/services/demo-requests';
import { mergeNotificationsWithFallback } from '@/lib/services/notification-fallback';

/** GET — listar notificaciones admin (incluye solicitudes sin fila en admin_notifications) */
export async function GET(request: Request) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const unreadOnly = searchParams.get('unreadOnly') === 'true';
  const limit = Math.min(Number(searchParams.get('limit') ?? 50), 100);

  try {
    const leads = await listLeads(limit);
    let demos: Awaited<ReturnType<typeof listDemoRequests>> = [];
    try {
      demos = await listDemoRequests(limit);
    } catch {
      /* demo_requests puede no existir aún */
    }

    if (isSupabaseConfigured() && (leads.length > 0 || demos.length > 0)) {
      try {
        await backfillNotificationsFromSources();
      } catch (backfillErr) {
        console.error('[notifications] Backfill falló (¿tabla admin_notifications?):', backfillErr);
      }
    }

    let fromDb: Awaited<ReturnType<typeof listAdminNotifications>> = [];
    try {
      fromDb = await listAdminNotifications({ unreadOnly, limit: limit * 2 });
    } catch (dbErr) {
      console.error('[notifications] Error leyendo admin_notifications:', dbErr);
    }
    let merged = mergeNotificationsWithFallback(fromDb, leads, demos);

    if (unreadOnly) {
      merged = merged.filter((n) => !n.readAt);
    }

    return jsonOk(merged.slice(0, limit));
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}

/** PATCH — marcar todas como leídas */
export async function PATCH(request: Request) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const url = new URL(request.url);
  const backfill = url.searchParams.get('backfill') === 'true';

  try {
    if (backfill) {
      const created = await backfillNotificationsFromSources();
      return jsonOk({ ok: true, created });
    }
    await markAllNotificationsRead();
    return jsonOk({ ok: true });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
