import { AdminPageHeader } from './AdminPageHeader';
import { DashboardCard } from '@/components/dashboard/DashboardCard';

interface ModuleShellProps {
  title: string;
  description: string;
  features: string[];
  actions?: string[];
  children?: React.ReactNode;
}

export function ModuleShell({
  title,
  description,
  features,
  actions = ['Crear', 'Editar', 'Publicar', 'Archivar'],
  children,
}: ModuleShellProps) {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <AdminPageHeader
        title={title}
        description={description}
        actions={
          <button type="button" className="btn-primary px-4 py-2 text-sm">
            + Nuevo
          </button>
        }
      />

      {children}

      <div className="grid gap-4 sm:grid-cols-2">
        <DashboardCard title="Funciones del módulo">
          <ul className="space-y-2 text-sm text-brand-mist">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan" />
                {f}
              </li>
            ))}
          </ul>
        </DashboardCard>
        <DashboardCard title="Acciones disponibles">
          <div className="flex flex-wrap gap-2">
            {actions.map((a) => (
              <button
                key={a}
                type="button"
                className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-brand-mist hover:border-brand-cyan/30 hover:text-brand-soft"
              >
                {a}
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-brand-slate">
            UI lista — conectar Supabase / PostgreSQL y almacenamiento de archivos.
          </p>
        </DashboardCard>
      </div>
    </div>
  );
}
