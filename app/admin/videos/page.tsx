import { ModuleShell } from '@/components/admin/ModuleShell';

export default function AdminVideosPage() {
  return (
    <ModuleShell
      title="Videos"
      description="Biblioteca de tutoriales y capacitaciones con streaming futuro."
      features={[
        'Subir videos',
        'Organizar por categorías',
        'Thumbnails personalizados',
        'Reproductor premium',
        'Streaming CDN (futuro)',
        'Vincular a cursos',
      ]}
    />
  );
}
