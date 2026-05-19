'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Wallet,
  KeyRound,
  BookOpen,
  Tag,
  PlayCircle,
  CreditCard,
  Megaphone,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  GraduationCap,
  ChevronDown,
  FolderOpen,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { Logo } from '@/components/Logo';
import { ADMIN_TOP_BAR_HEIGHT } from '@/components/layouts/AdminTopBar';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

type NavLink = {
  type: 'link';
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

type NavGroup = {
  type: 'group';
  label: string;
  icon: LucideIcon;
  children: { href: string; label: string; icon: LucideIcon }[];
};

type NavEntry = NavLink | NavGroup;

const NAV: NavEntry[] = [
  { type: 'link', href: '/admin', label: 'Panel', icon: LayoutDashboard, exact: true },
  { type: 'link', href: '/admin/estadisticas', label: 'Estadísticas', icon: BarChart3 },
  { type: 'link', href: '/admin/users', label: 'Clientes', icon: Users },
  { type: 'link', href: '/admin/payments', label: 'Pagos', icon: Wallet },
  { type: 'link', href: '/admin/licencias', label: 'Licencias', icon: KeyRound },
  { type: 'link', href: '/admin/planes', label: 'Planes', icon: CreditCard },
  { type: 'link', href: '/admin/promociones', label: 'Promociones', icon: Tag },
  { type: 'link', href: '/admin/anuncios', label: 'Anuncios', icon: Megaphone },
  {
    type: 'group',
    label: 'Academia',
    icon: GraduationCap,
    children: [
      { href: '/admin/cursos', label: 'Cursos', icon: BookOpen },
      { href: '/admin/videos', label: 'Videos', icon: PlayCircle },
      { href: '/admin/recursos', label: 'Recursos', icon: FolderOpen },
    ],
  },
  { type: 'link', href: '/admin/entorno', label: 'Entorno', icon: Settings },
];

function linkActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname.startsWith(href);
}

function SidebarInner({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  const academiaOpenDefault =
    pathname.startsWith('/admin/cursos') ||
    pathname.startsWith('/admin/videos') ||
    pathname.startsWith('/admin/recursos');
  const [academiaOpen, setAcademiaOpen] = useState(academiaOpenDefault);

  useEffect(() => {
    if (academiaOpenDefault) setAcademiaOpen(true);
  }, [academiaOpenDefault]);

  return (
    <>
      <div
        className={cn(
          'flex items-center border-b border-brand-gold/20 px-5',
          ADMIN_TOP_BAR_HEIGHT
        )}
      >
        <Logo size="sm" href="/admin" />
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {NAV.map((item) => {
          if (item.type === 'link') {
            const active = linkActive(pathname, item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  active
                    ? 'border border-brand-gold/35 bg-brand-gold/15 text-brand-gold-light shadow-glow-gold'
                    : 'text-brand-mist hover:border-brand-cyan/15 hover:bg-white/5 hover:text-brand-soft'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          }

          const groupActive = item.children.some((c) => pathname.startsWith(c.href));
          const GroupIcon = item.icon;

          return (
            <div key={item.label} className="space-y-0.5">
              <button
                type="button"
                onClick={() => setAcademiaOpen((v) => !v)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  groupActive
                    ? 'border border-brand-gold/35 bg-brand-gold/15 text-brand-gold-light shadow-glow-gold'
                    : 'text-brand-mist hover:border-brand-cyan/15 hover:bg-white/5 hover:text-brand-soft'
                )}
              >
                <GroupIcon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 shrink-0 transition-transform duration-200',
                    academiaOpen && 'rotate-180'
                  )}
                />
              </button>
              {academiaOpen && (
                <div className="ml-3 space-y-0.5 border-l border-brand-gold/15 pl-2">
                  {item.children.map((child) => {
                    const active = pathname.startsWith(child.href);
                    const ChildIcon = child.icon;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onNavigate}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                          active
                            ? 'bg-brand-gold/10 text-brand-gold-light'
                            : 'text-brand-mist hover:bg-white/5 hover:text-brand-soft'
                        )}
                      >
                        <ChildIcon className="h-3.5 w-3.5 shrink-0" />
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-brand-gold/20 p-3">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="mb-2 flex w-full items-center justify-center rounded-lg border border-brand-cyan/25 px-3 py-2 text-xs text-brand-mist transition-colors hover:border-brand-cyan/40 hover:text-brand-soft"
        >
          Vista cliente
        </Link>
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

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <aside className="flex h-full w-64 flex-col border-r border-brand-gold/20 bg-sidebar-gradient backdrop-blur-xl">
      <SidebarInner pathname={pathname} onNavigate={() => setMobileOpen(false)} />
    </aside>
  );

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-50 rounded-lg border border-brand-gold/25 bg-brand-navy/90 p-2 text-brand-soft shadow-card lg:hidden"
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
