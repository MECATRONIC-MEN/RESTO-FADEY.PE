import { VideoSlotCard } from '@/components/academy/VideoSlotCard';
import type { AcademyModuleVideo } from '@/lib/domain/types';

interface ModuleVideoGridProps {
  modules: AcademyModuleVideo[];
  /** Si true, oculta reproductor en no publicados (panel cliente) */
  clientView?: boolean;
}

export function ModuleVideoGrid({ modules, clientView = true }: ModuleVideoGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {modules.map((mod) => (
        <VideoSlotCard key={mod.slug} module={mod} clientView={clientView} />
      ))}
    </div>
  );
}
