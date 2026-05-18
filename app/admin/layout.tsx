import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/layouts/AdminSidebar';
import { AdminNotificationBell } from '@/components/admin/AdminNotificationBell';
import { PwaInstallTracker } from '@/components/PwaInstallTracker';

export const metadata = {
  title: 'Administración',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (session.user.role !== 'master_admin') redirect('/dashboard');

  return (
    <div className="min-h-screen bg-app text-brand-soft">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-brand-gold/8 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-brand-cyan/12 blur-3xl" />
      </div>
      <AdminSidebar />
      <div className="relative lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-brand-gold/20 bg-brand-navy/85 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 pl-12 lg:pl-0">
            <div>
              <h1 className="font-display text-lg font-semibold text-brand-soft">
                Panel administrativo
              </h1>
              <p className="text-xs text-brand-mist">Gestión completa de Resto Fadey</p>
            </div>
            <div className="flex items-center gap-3">
              <AdminNotificationBell />
              <p className="hidden text-sm text-brand-mist sm:block">{session.user.email}</p>
            </div>
          </div>
        </header>
        <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </div>
      <PwaInstallTracker />
    </div>
  );
}
