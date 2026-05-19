'use client';

import { AdminNotificationBell } from '@/components/admin/AdminNotificationBell';

/** Altura compartida con el bloque del logo en AdminSidebar */
export const ADMIN_TOP_BAR_HEIGHT = 'h-[4.25rem]';

interface AdminTopBarProps {
  userEmail?: string | null;
}

export function AdminTopBar({ userEmail }: AdminTopBarProps) {
  return (
    <header
      className={`sticky top-0 z-30 flex ${ADMIN_TOP_BAR_HEIGHT} shrink-0 items-center border-b border-brand-gold/20 bg-brand-navy/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8`}
    >
      <div className="flex w-full items-center justify-between gap-4 pl-12 lg:pl-0">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="flex items-baseline gap-1.5 font-display leading-none">
            <span className="text-lg font-semibold tracking-tight text-brand-soft sm:text-xl">
              Panel
            </span>
            <span className="text-lg font-semibold tracking-tight text-brand-gold sm:text-xl">
              administrativo
            </span>
          </div>
          <span
            className="hidden h-5 w-px shrink-0 bg-brand-gold/25 sm:block"
            aria-hidden
          />
          <span className="hidden text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-gold-light sm:inline">
            Administración
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-gold-light sm:hidden">
            Administración
          </span>
          <AdminNotificationBell />
          {userEmail && (
            <p className="hidden max-w-[180px] truncate text-sm text-brand-mist md:block">
              {userEmail}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
