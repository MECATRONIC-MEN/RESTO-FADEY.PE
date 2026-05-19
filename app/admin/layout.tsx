import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/layouts/AdminSidebar';
import { AdminTopBar } from '@/components/layouts/AdminTopBar';
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
        <AdminTopBar userEmail={session.user.email} />
        <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </div>
      <PwaInstallTracker />
    </div>
  );
}
