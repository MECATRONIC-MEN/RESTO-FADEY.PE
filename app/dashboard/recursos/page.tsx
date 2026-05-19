import { ClientResourceList } from '@/components/dashboard/ClientResourceList';
import { listResources } from '@/lib/services/academy-content';

export default async function RecursosPage() {
  const resources = await listResources(true);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-brand-soft">Recursos</h1>
        <p className="mt-2 text-brand-mist">
          Manuales, plantillas y documentos para tu operación. El contenido se publica desde
          administración.
        </p>
      </div>
      <ClientResourceList resources={resources} />
    </div>
  );
}
