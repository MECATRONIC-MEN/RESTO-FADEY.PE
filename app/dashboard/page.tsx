import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import {
  BookOpen,
  Gift,
  PlayCircle,
  Tag,
  Newspaper,
  ArrowRight,
} from 'lucide-react';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import {
  RECENT_COURSES,
  FEATURED_VIDEOS,
  ACTIVE_PROMOTIONS,
  SYSTEM_NEWS,
  QUICK_LINKS,
} from '@/lib/dashboard-data';

const ICONS = {
  gift: Gift,
  tag: Tag,
  book: BookOpen,
  play: PlayCircle,
  graduation: BookOpen,
  folder: BookOpen,
} as const;

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const firstName = session.user.name?.split(' ')[0] ?? 'Cliente';

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Hola, {firstName} 👋
        </h1>
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
          <p className="kpi-gold mt-2 text-2xl">
            {session.user.plan ?? 'Sin plan asignado'}
          </p>
          <p className="mt-2 text-sm text-brand-mist">
            Licencia activa · Soporte incluido
          </p>
        </DashboardCard>
        <DashboardCard title="Accesos rápidos" className="sm:col-span-2">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {QUICK_LINKS.map((link) => {
              const Icon = ICONS[link.icon] ?? BookOpen;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 rounded-lg border border-brand-cyan/10 bg-white/5 px-3 py-2.5 text-sm text-brand-mist transition-all hover:border-brand-cyan/30 hover:text-brand-soft hover:shadow-glow-cyan"
                >
                  <Icon className="h-4 w-4 shrink-0 text-brand-cyan" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </DashboardCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard
          title="Cursos recientes"
          action={
            <Link href="/dashboard/cursos" className="text-xs text-brand-cyan hover:underline">
              Ver todos
            </Link>
          }
        >
          <ul className="space-y-4">
            {RECENT_COURSES.map((course) => (
              <li key={course.id}>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-white">{course.title}</p>
                    <p className="text-xs text-gray-500">{course.duration}</p>
                  </div>
                  <span className="text-xs font-medium text-brand-mist">{course.progress}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-cyan to-brand-gold transition-all"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </DashboardCard>

        <DashboardCard
          title="Videos destacados"
          action={
            <Link href="/dashboard/videos" className="text-xs text-brand-cyan hover:underline">
              Biblioteca
            </Link>
          }
        >
          <ul className="space-y-3">
            {FEATURED_VIDEOS.map((video) => (
              <li
                key={video.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-white/5 px-3 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <PlayCircle className="h-5 w-5 shrink-0 text-brand-cyan/80" />
                  <span className="text-sm text-gray-200">{video.title}</span>
                </div>
                {video.tag && (
                  <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] uppercase text-brand-mist">
                    {video.tag}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </DashboardCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard title="Promociones activas">
          <ul className="space-y-3">
            {ACTIVE_PROMOTIONS.map((promo) => (
              <li
                key={promo.id}
                className="flex items-center justify-between gap-2 rounded-lg bg-brand-gold/5 px-3 py-3"
              >
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-brand-gold-light" />
                  <span className="text-sm font-medium">{promo.title}</span>
                </div>
                <span className="text-xs text-gray-500">Hasta {promo.endsAt}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard/promociones"
            className="mt-4 inline-flex items-center gap-1 text-sm text-brand-cyan hover:underline"
          >
            Ver promociones <ArrowRight className="h-4 w-4" />
          </Link>
        </DashboardCard>

        <DashboardCard title="Noticias del sistema">
          <ul className="space-y-3">
            {SYSTEM_NEWS.map((news) => (
              <li key={news.id} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                <p className="text-sm text-gray-200">{news.title}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                  <Newspaper className="h-3 w-3" />
                  {news.date}
                </p>
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard/noticias"
            className="mt-4 inline-flex items-center gap-1 text-sm text-brand-cyan hover:underline"
          >
            Más noticias <ArrowRight className="h-4 w-4" />
          </Link>
        </DashboardCard>
      </div>
    </div>
  );
}
