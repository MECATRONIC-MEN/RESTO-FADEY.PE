import { ModuleShell } from '@/components/admin/ModuleShell';

export default function AdminAnunciosPage() {
  return (
    <ModuleShell
      title="Anuncios del sistema"
      description="Novedades, mantenimiento y alertas globales para clientes."
      features={[
        'Anuncios globales',
        'Modo mantenimiento',
        'Novedades del producto',
        'Alertas internas',
        'Banners en dashboard cliente',
        'Programación de publicación',
      ]}
    />
  );
}
