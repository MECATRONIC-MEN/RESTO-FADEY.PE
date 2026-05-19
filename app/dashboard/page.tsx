import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { ArrowRight, BookOpen, PlayCircle, Tag, LifeBuoy, FolderOpen } from 'lucide-react';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { getClientDashboardSummary } from '@/lib/services/client-dashboard';
import {
  listCourses,
  listModuleVideos,
  listResources,
  listActivePromotions,
} from '@/lib/services/academy-content';
import { QUICK_LINKS } from '@/lib/dashboard-data';

const ICONS = {
  tag: Tag,
  book: BookOpen,
  play: PlayCircle,
  folder: FolderOpen,
  support: LifeBuoy,
} as const;

function formatLicenseStatus(status: string | null) {
  if (!status) return 'Sin información';
  const map: Record<string, string> = {
    activo: 'Activa',
    suspendido: 'Suspendida',
    vencido: 'Vencida',
    prueba: 'Prueba',
  };
  return map[status] ?? status;
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const clientId = session.user.clientId ?? null;
  const [summary, courses, videoData, resources, promotions] = await Promise.all([
    getClientDashboardSummary(clientId),
    listCourses(true),
    listModuleVideos(true),
    listResources(true),
    listActivePromotions(),
  ]);

  const publishedVideos = videoData.filter((v) => v.isPublished);
  const firstName = session.user.name?.split(' ')[0] ?? 'Cliente';
  const planLabel =
    summary.planName ?? session.user.plan ?? (clientId ? 'Consulte con soporte' : null);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Hola, {firstName} 👋</h1>
        <p className="mt-2 text-brand-mist">
          Bienvenido a tu espacio Resto Fadey
          {session.user.restaurant ? ` · ${session.user.restaurant}` : ''}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard premium className="sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-medium uppercase tracking-wider text-brand-cyan-light/80">
            Estado del plan
          </p>
          <p className="kpi-gold mt-2 text-2xl">{planLabel ?? '—'}</p>
          <p className="mt-2 text-sm text-brand-mist">
            Licencia {formatLicenseStatus(summary.licenseStatus)}
            {summary.licenseExpiresAt && (
              <>
                {' '}
                · vence{' '}
                {new Date(summary.licenseExpiresAt).toLocaleDateString('es-PE', {
                  dateStyle: 'medium',
                })}
              </>
            )}
          </p>
        </DashboardCard>

        <DashboardCard title="Accesos rápidos" className="sm:col-span-2">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {QUICK_LINKS.map((link) => {
              const Icon = ICONS[link.icon] ?? BookOpen;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 rounded-lg border border-brand-cyan/10 bg-white/5 px-3 py-2.5 text-sm text-brand-mist transition-all hover:border-brand-cyan/30 hover:text-brand-soft"
                >
                  <Icon className="h-4 w-4 shrink-0 text-brand-cyan" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </DashboardCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <DashboardCard
          title="Academia — cursos"
          action={
            <Link href="/dashboard/cursos" className="text-xs text-brand-cyan hover:underline">
              Ver todos
            </Link>
          }
        >
          {courses.length === 0 ? (
            <p className="text-sm text-brand-mist">No hay cursos publicados aún.</p>
          ) : (
            <ul className="space-y-3">
              {courses.slice(0, 3).map((course) => (
                <li key={course.id} className="rounded-lg border border-white/5 px-3 py-2">
                  <p className="text-sm font-medium text-brand-soft">{course.title}</p>
                  {course.duration && (
                    <p className="text-xs text-brand-slate">{course.duration}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>

        <DashboardCard
          title="Academia — videos"
          action={
            <Link href="/dashboard/videos" className="text-xs text-brand-cyan hover:underline">
              Ver módulos
            </Link>
          }
        >
          {publishedVideos.length === 0 ? (
            <p className="text-sm text-brand-mist">
              Los tutoriales por módulo se publicarán desde administración.
            </p>
          ) : (
            <p className="text-sm text-brand-mist">
              {publishedVideos.filter((v) => v.hasVideo).length} de {publishedVideos.length}{' '}
              módulos con video disponible.
            </p>
          )}
        </DashboardCard>

        <DashboardCard
          title="Academia — recursos"
          action={
            <Link href="/dashboard/recursos" className="text-xs text-brand-cyan hover:underline">
              Ver todos
            </Link>
          }
        >
          {resources.length === 0 ? (
            <p className="text-sm text-brand-mist">No hay manuales ni plantillas publicados aún.</p>
          ) : (
            <ul className="space-y-3">
              {resources.slice(0, 3).map((resource) => (
                <li key={resource.id} className="rounded-lg border border-white/5 px-3 py-2">
                  <p className="text-sm font-medium text-brand-soft">{resource.title}</p>
                  {resource.category && (
                    <p className="text-xs text-brand-slate">{resource.category}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard title="Promociones activas">
          {promotions.length === 0 ? (
            <p className="text-sm text-brand-mist">No hay promociones activas en este momento.</p>
          ) : (
            <ul className="space-y-3">
              {promotions.slice(0, 4).map((promo) => (
                <li
                  key={promo.id}
                  className="flex items-center justify-between gap-2 rounded-lg bg-brand-gold/5 px-3 py-3"
                >
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-brand-gold-light" />
                    <span className="text-sm font-medium">{promo.title}</span>
                  </div>
                  {promo.endsAt && (
                    <span className="text-xs text-brand-slate">
                      Hasta {new Date(promo.endsAt).toLocaleDateString('es-PE')}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/dashboard/promociones"
            className="mt-4 inline-flex items-center gap-1 text-sm text-brand-cyan hover:underline"
          >
            Ver promociones <ArrowRight className="h-4 w-4" />
          </Link>
        </DashboardCard>

        <DashboardCard title="Soporte">
          <p className="text-sm text-brand-mist">
            ¿Necesitas ayuda con tu licencia, POS o capacitación? Contáctanos por WhatsApp o correo.
          </p>
          <Link
            href="/dashboard/soporte"
            className="mt-4 inline-flex items-center gap-1 text-sm text-brand-cyan hover:underline"
          >
            Ir a soporte <ArrowRight className="h-4 w-4" />
          </Link>
        </DashboardCard>
      </div>
    </div>
  );
}
