import { getClientById } from '@/lib/services/clients';
import {
  listCourses,
  listModuleVideos,
  listResources,
  listActivePromotions,
} from '@/lib/services/academy-content';
import type { ClientDashboardSummary } from '@/lib/domain/types';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export async function getClientDashboardSummary(
  clientId: string | null | undefined
): Promise<ClientDashboardSummary> {
  const [courses, videos, resources, promotions] = await Promise.all([
    listCourses(true),
    listModuleVideos(true),
    listResources(true),
    listActivePromotions(),
  ]);

  let planName: string | null = null;
  let licenseStatus: string | null = null;
  let licenseExpiresAt: string | null = null;

  if (clientId) {
    const client = await getClientById(clientId);
    if (client) {
      licenseStatus = client.licenseStatus;
      licenseExpiresAt = client.licenseExpiresAt ?? null;
      if (client.planId && isSupabaseConfigured()) {
        const db = getSupabaseAdmin()!;
        const { data: plan } = await db.from('plans').select('name').eq('id', client.planId).maybeSingle();
        planName = (plan?.name as string) ?? null;
      }
      if (!planName && client.planId) {
        if (client.planId.includes('premium')) planName = 'Premium';
        else if (client.planId.includes('pro')) planName = 'Pro';
        else if (client.planId.includes('basico')) planName = 'Básico';
      }
    }
  }

  return {
    planName,
    licenseStatus,
    licenseExpiresAt,
    publishedCoursesCount: courses.length,
    publishedVideosCount: videos.filter((v) => v.hasVideo && v.isPublished).length,
    publishedResourcesCount: resources.length,
    activePromotionsCount: promotions.length,
  };
}
