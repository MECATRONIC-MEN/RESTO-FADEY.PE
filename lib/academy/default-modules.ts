import { ACADEMY_SYSTEM_MODULES } from '@/lib/academy/system-modules';
import type { AcademyModuleVideo } from '@/lib/domain/types';

export function buildDefaultModuleVideos(): AcademyModuleVideo[] {
  return ACADEMY_SYSTEM_MODULES.map((mod) => ({
    slug: mod.slug,
    title: mod.title,
    description: mod.description,
    isPublished: false,
    hasVideo: false,
    isCustom: false,
  }));
}
