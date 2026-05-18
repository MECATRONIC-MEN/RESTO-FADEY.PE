import { ModuleShell } from '@/components/admin/ModuleShell';

export default function AdminPromocionesPage() {
  return (
    <ModuleShell
      title="Promociones"
      description="Banners, descuentos y campañas visibles en el panel cliente y POS."
      features={[
        'Crear promociones',
        'Banners internos',
        'Descuentos por plan',
        'Duración y fechas',
        'Activar / desactivar',
        'Asignar a segmentos',
      ]}
    />
  );
}
