import { ModuleShell } from '@/components/admin/ModuleShell';

export default function AdminCursosPage() {
  return (
    <ModuleShell
      title="Cursos y academia"
      description="Rutas de aprendizaje, lecciones, videos y progreso de clientes."
      features={[
        'Crear y editar cursos',
        'Subir videos y miniaturas',
        'Categorías y lecciones',
        'Progreso por restaurante',
        'Publicar / ocultar contenido',
        'Editor visual (futuro)',
      ]}
    />
  );
}
