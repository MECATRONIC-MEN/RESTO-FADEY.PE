import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { DashboardSidebar } from '@/components/layouts/DashboardSidebar';
import { DASHBOARD_TOP_BAR_HEIGHT } from '@/components/layouts/dashboard-layout-constants';
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'Mi panel',
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  return (
    <div className="min-h-screen bg-app text-brand-soft">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-cyan/15 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-brand-blue/10 blur-3xl" />
      </div>
      <DashboardSidebar />
      <div className="relative lg:pl-64">
        <header
          className={cn(
            'sticky top-0 z-30 flex items-center border-b border-brand-cyan/15 bg-brand-navy/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8',
            DASHBOARD_TOP_BAR_HEIGHT
          )}
        >
          <div className="flex w-full items-center justify-between gap-4 pl-12 lg:pl-0">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-brand-cyan">
                Resto Fadey
              </p>
              <p className="text-sm text-brand-mist">
                {session.user.restaurant ?? 'Panel de cliente'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-brand-soft">{session.user.name}</p>
              {session.user.plan && (
                <span className="badge-premium mt-1 inline-block py-0.5 text-[10px]">
                  Plan {session.user.plan}
                </span>
              )}
            </div>
          </div>
        </header>
        <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </div>
    </div>
  );
}
