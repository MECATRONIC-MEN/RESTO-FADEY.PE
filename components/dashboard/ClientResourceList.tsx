import { Download, ExternalLink, FileText } from 'lucide-react';
import type { AcademyResource } from '@/lib/domain/types';

const TYPE_LABELS: Record<string, string> = {
  manual: 'Manual',
  plantilla: 'Plantilla',
  documento: 'Documento',
  enlace: 'Enlace',
};

interface ClientResourceListProps {
  resources: AcademyResource[];
}

export function ClientResourceList({ resources }: ClientResourceListProps) {
  if (resources.length === 0) {
    return (
      <p className="rounded-lg border border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-brand-mist">
        Aún no hay recursos publicados. Manuales y plantillas aparecerán aquí cuando el equipo los
        comparta.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {resources.map((resource) => (
        <li
          key={resource.id}
          className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-brand-cyan/20"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-gold/15">
            <FileText className="h-6 w-6 text-brand-gold-light" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-brand-soft">{resource.title}</p>
            <p className="mt-1 text-xs text-brand-slate">
              {[TYPE_LABELS[resource.resourceType] ?? resource.resourceType, resource.category]
                .filter(Boolean)
                .join(' · ')}
            </p>
            {resource.description && (
              <p className="mt-2 text-sm text-brand-mist">{resource.description}</p>
            )}
            <a
              href={resource.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-brand-cyan hover:underline"
            >
              {resource.resourceType === 'enlace' ? (
                <>
                  <ExternalLink className="h-4 w-4" />
                  Abrir recurso
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Descargar / ver
                </>
              )}
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}
