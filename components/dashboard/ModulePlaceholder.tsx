import Link from 'next/link';
import { DashboardCard } from './DashboardCard';
import { ArrowLeft } from 'lucide-react';

interface ModulePlaceholderProps {
  title: string;
  description: string;
  backHref?: string;
}

export function ModulePlaceholder({
  title,
  description,
  backHref = '/dashboard',
}: ModulePlaceholderProps) {
  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href={backHref}
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al panel
      </Link>
      <h1 className="font-display text-3xl font-bold">{title}</h1>
      <p className="mt-2 text-gray-400">{description}</p>
      <DashboardCard className="mt-8" title="Próximamente">
        <p className="text-sm text-gray-500">
          Este módulo se conectará a la base de datos y API de contenido. Por ahora puedes
          explorar la estructura del panel en modo solo lectura.
        </p>
      </DashboardCard>
    </div>
  );
}
