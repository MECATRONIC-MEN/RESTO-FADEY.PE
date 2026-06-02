import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createAdminNotification } from '@/lib/services/notifications';
import type {
  VisitorRatingInput,
  VisitorRatingRecord,
  VisitorRatingStatus,
} from '@/lib/domain/types';
import type { TestimonialPremium } from '@/lib/landing-data';

const memoryRatings: VisitorRatingRecord[] = [];

export function ratingInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function visitorRatingToTestimonial(r: VisitorRatingRecord): TestimonialPremium {
  return {
    name: r.name,
    restaurant: r.restaurant,
    role: r.role,
    comment: r.comment,
    result: r.result?.trim() || 'Cliente verificado',
    rating: r.rating,
    initials: ratingInitials(r.name) || 'RF',
  };
}

function rowToRecord(row: Record<string, unknown>): VisitorRatingRecord {
  return {
    id: row.id as string,
    name: row.name as string,
    restaurant: row.restaurant as string,
    role: row.role as string,
    comment: row.comment as string,
    result: (row.result as string) ?? undefined,
    rating: Number(row.rating),
    status: row.status as VisitorRatingStatus,
    createdAt: row.created_at as string,
  };
}

async function notifyNewRating(record: VisitorRatingRecord) {
  try {
    await createAdminNotification({
      type: 'visitor_rating',
      title: `Nueva calificación: ${record.restaurant}`,
      body: `${record.name} · ${record.rating}★ — ${record.comment.slice(0, 80)}${record.comment.length > 80 ? '…' : ''}`,
      payload: { ratingId: record.id, status: record.status },
    });
  } catch (err) {
    console.error('[ratings] Notificación admin:', err instanceof Error ? err.message : err);
  }
}

export async function createVisitorRating(
  input: VisitorRatingInput
): Promise<VisitorRatingRecord> {
  const payload = {
    name: input.name.trim(),
    restaurant: input.restaurant.trim(),
    role: input.role.trim(),
    comment: input.comment.trim(),
    result: input.result?.trim() || null,
    rating: input.rating,
    status: 'pending' as const,
  };

  if (!isSupabaseConfigured()) {
    const record: VisitorRatingRecord = {
      ...input,
      id: `rating_${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    memoryRatings.unshift(record);
    await notifyNewRating(record);
    return record;
  }

  const db = getSupabaseAdmin()!;
  const { data, error } = await db.from('visitor_ratings').insert(payload).select('*').single();

  if (error) throw new Error(error.message);

  const record = rowToRecord(data as Record<string, unknown>);
  await notifyNewRating(record);
  return record;
}

export async function listApprovedVisitorRatings(limit = 50): Promise<VisitorRatingRecord[]> {
  if (!isSupabaseConfigured()) {
    return memoryRatings.filter((r) => r.status === 'approved').slice(0, limit);
  }

  const db = getSupabaseAdmin()!;
  const { data, error } = await db
    .from('visitor_ratings')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => rowToRecord(row as Record<string, unknown>));
}
