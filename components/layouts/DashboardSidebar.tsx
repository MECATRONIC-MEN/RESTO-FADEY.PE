'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Gift,
  Tag,
  GraduationCap,
  PlayCircle,
  BookOpen,
  FolderOpen,
  Newspaper,
  LifeBuoy,
  LogOut,
  Menu,
  X,
  Eye,
} from 'lucide-react';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';
import { isReadOnly } from '@/lib/auth/permissions';
import type { UserRole } from '@/lib/auth/types';

const NAV = [
  { href: '/dashboard', label: 'Inicio', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/beneficios', label: 'Beneficios', icon: Gift },
  { href: '/dashboard/promociones', label: 'Promociones', icon: Tag },
  { href: '/dashboard/academia', label: 'Academia', icon: GraduationCap },
  { href: '/dashboard/videos', label: 'Videos', icon: PlayCircle },
  { href: '/dashboard/cursos', label: 'Cursos', icon: BookOpen },
  { href: '/dashboard/recursos', label: 'Recursos', icon: FolderOpen },
  { href: '/dashboard/noticias', label: 'Noticias', icon: Newspaper },
  { href: '/dashboard/soporte', label: 'Soporte', icon: LifeBuoy, soon: true },
] as const;

function SidebarContent({
  pathname,
  role,
  readOnly,
  onNavigate,
}: {
  pathname: string;
  role: UserRole;
  readOnly: boolean;
  onNavigate?: () => void;
}) {
  return (
    <>
      <div className="border-b border-brand-cyan/15 p-5">
        <Logo size="sm" href="/dashboard" />
        {readOnly && (
          <p className="mt-3 flex items-center gap-1.5 rounded-lg border border-brand-gold/25 bg-brand-gold/10 px-2.5 py-1.5 text-xs text-brand-gold-light">
            <Eye className="h-3.5 w-3.5 shrink-0" />
            Solo lectura — sin permisos de edición
          </p>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {NAV.map((item) => {
          const active =
            'exact' in item && item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                active
                  ? 'border border-brand-cyan/25 bg-brand-cyan/15 text-brand-cyan shadow-glow-cyan'
                  : 'text-brand-mist hover:border-brand-cyan/15 hover:bg-white/5 hover:text-brand-soft',
                'soon' in item && item.soon && 'opacity-60'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
              {'soon' in item && item.soon && (
                <span className="ml-auto rounded bg-white/10 px-1.5 py-0.5 text-[10px] uppercase text-brand-slate">
                  Pronto
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-brand-cyan/15 p-3">
        {role === 'master_admin' && (
          <Link
            href="/admin"
            onClick={onNavigate}
            className="btn-premium mb-2 flex w-full items-center justify-center py-2 text-xs"
          >
            Panel administrativo
          </Link>
        )}
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-brand-mist transition-colors hover:bg-white/5 hover:text-brand-soft"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const role = (session?.user?.role ?? 'observador') as UserRole;
  const readOnly = isReadOnly(role);

  const sidebar = (
    <aside className="flex h-full w-64 flex-col border-r border-brand-cyan/15 bg-sidebar-gradient backdrop-blur-xl">
      <SidebarContent
        pathname={pathname}
        role={role}
        readOnly={readOnly}
        onNavigate={() => setMobileOpen(false)}
      />
    </aside>
  );

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-50 rounded-lg border border-brand-cyan/25 bg-brand-navy/90 p-2 text-brand-soft shadow-card lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menú"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:block">{sidebar}</div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-brand-deep/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar"
          />
          <div className="absolute left-0 top-0 h-full shadow-2xl">
            <button
              type="button"
              className="absolute right-3 top-3 z-10 rounded-lg p-2 text-brand-soft"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </div>
        </div>
      )}
    </>
  );
}
