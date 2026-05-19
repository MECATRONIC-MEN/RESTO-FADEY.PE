import { cn } from '@/lib/utils';

const STYLES: Record<string, string> = {
  pending: 'border-amber-400/40 bg-amber-400/15 text-amber-200',
  approved: 'border-emerald-400/40 bg-emerald-400/15 text-emerald-200',
  rejected: 'border-red-400/40 bg-red-400/15 text-red-200',
  activo: 'border-emerald-400/40 bg-emerald-400/15 text-emerald-200',
  suspendido: 'border-orange-400/40 bg-orange-400/15 text-orange-200',
  vencido: 'border-red-400/40 bg-red-400/15 text-red-200',
  prueba: 'border-brand-cyan/40 bg-brand-cyan/15 text-brand-cyan',
  published: 'border-brand-cyan/40 bg-brand-cyan/15 text-brand-cyan',
  draft: 'border-white/20 bg-white/5 text-brand-mist',
  online: 'border-emerald-400/40 bg-emerald-400/15 text-emerald-200',
  offline: 'border-red-400/40 bg-red-400/15 text-red-200',
  unknown: 'border-white/20 bg-white/5 text-brand-slate',
};

const LABELS: Record<string, string> = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  activo: 'Activo',
  suspendido: 'Suspendido',
  vencido: 'Vencido',
  prueba: 'Prueba',
  published: 'Publicado',
  draft: 'Borrador',
  online: 'POS conectado',
  offline: 'Sin conexión',
  unknown: 'Sin verificar',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize',
        STYLES[status] ?? STYLES.draft
      )}
    >
      {LABELS[status] ?? status}
    </span>
  );
}
