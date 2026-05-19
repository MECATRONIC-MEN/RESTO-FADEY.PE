import { AcademyVideosPanel } from '@/components/admin/AcademyVideosPanel';
import { safeListModuleVideos } from '@/lib/services/academy-content';
import { buildDefaultModuleVideos } from '@/lib/academy/default-modules';

export default async function AdminVideosPage() {
  let initialModules = buildDefaultModuleVideos();
  try {
    const loaded = await safeListModuleVideos(false);
    if (loaded.length > 0) initialModules = loaded;
  } catch {
    /* usa defaults */
  }

  return <AcademyVideosPanel initialModules={initialModules} />;
}
