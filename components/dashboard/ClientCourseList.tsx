import { BookOpen, ExternalLink } from 'lucide-react';
import type { AcademyCourse } from '@/lib/domain/types';

interface ClientCourseListProps {
  courses: AcademyCourse[];
}

export function ClientCourseList({ courses }: ClientCourseListProps) {
  if (courses.length === 0) {
    return (
      <p className="rounded-lg border border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-brand-mist">
        Aún no hay cursos publicados. El equipo Resto Fadey los irá añadiendo aquí.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {courses.map((course) => (
        <li
          key={course.id}
          className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-brand-cyan/20"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-cyan/15">
            <BookOpen className="h-6 w-6 text-brand-cyan" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-brand-soft">{course.title}</p>
            {course.description && (
              <p className="mt-1 text-sm text-brand-mist">{course.description}</p>
            )}
            <p className="mt-2 text-xs text-brand-slate">
              {[course.category, course.duration].filter(Boolean).join(' · ') || 'Curso'}
            </p>
            {course.contentUrl && (
              <a
                href={course.contentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs text-brand-cyan hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Acceder al curso
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
