import { ClientCourseList } from '@/components/dashboard/ClientCourseList';
import { safeListCourses } from '@/lib/services/academy-content';

export default async function CursosPage() {
  const courses = await safeListCourses(true);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-brand-soft">Cursos</h1>
        <p className="mt-2 text-brand-mist">
          Rutas de aprendizaje publicadas para tu restaurante. Los nuevos cursos aparecen aquí al
          publicarlos en administración.
        </p>
      </div>
      <ClientCourseList courses={courses} />
    </div>
  );
}
