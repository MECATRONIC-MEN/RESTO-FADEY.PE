import { ModuleVideoGrid } from '@/components/dashboard/ModuleVideoGrid';
import { safeListModuleVideos } from '@/lib/services/academy-content';

export default async function VideosPage() {
  const modules = await safeListModuleVideos(false);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-brand-soft">Videos</h1>
        <p className="mt-2 text-brand-mist">
          Tutoriales por módulo del sistema (9 módulos). El contenido lo publica el equipo desde
          administración.
        </p>
      </div>
      <ModuleVideoGrid modules={modules} />
    </div>
  );
}
