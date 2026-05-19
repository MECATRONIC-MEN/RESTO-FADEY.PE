import { PlayCircle, Clock } from 'lucide-react';
import type { AcademyModuleVideo } from '@/lib/domain/types';

interface ModuleVideoGridProps {
  modules: AcademyModuleVideo[];
}

export function ModuleVideoGrid({ modules }: ModuleVideoGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {modules.map((mod) => (
        <article
          key={mod.slug}
          className="flex flex-col rounded-xl border border-brand-cyan/15 bg-white/5 p-4 transition-colors hover:border-brand-cyan/30"
        >
          <div className="mb-3 flex aspect-video items-center justify-center rounded-lg bg-brand-navy/80">
            {mod.hasVideo && mod.isPublished ? (
              <PlayCircle className="h-10 w-10 text-brand-cyan" />
            ) : (
              <span className="px-2 text-center text-xs text-brand-slate">
                {mod.isPublished && !mod.hasVideo ? 'Video pendiente' : 'Próximamente'}
              </span>
            )}
          </div>
          <h3 className="font-medium text-brand-soft">{mod.title}</h3>
          <p className="mt-1 flex-1 text-xs text-brand-mist">{mod.description}</p>
          {mod.hasVideo && mod.videoUrl && mod.isPublished && (
            <a
              href={mod.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs text-brand-cyan hover:underline"
            >
              <PlayCircle className="h-3.5 w-3.5" />
              Ver tutorial
            </a>
          )}
          {!mod.isPublished && (
            <p className="mt-2 flex items-center gap-1 text-[10px] uppercase text-brand-slate">
              <Clock className="h-3 w-3" />
              En preparación
            </p>
          )}
        </article>
      ))}
    </div>
  );
}
