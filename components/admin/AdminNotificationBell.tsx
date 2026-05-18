'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, Smartphone, UserPlus } from 'lucide-react';
import type { AdminNotification } from '@/lib/domain/types';
import { cn } from '@/lib/utils';

const POLL_MS = 25_000;

function NotificationIcon({ type }: { type: AdminNotification['type'] }) {
  if (type === 'pwa_install') return <Smartphone className="h-4 w-4 shrink-0 text-brand-cyan" />;
  return <UserPlus className="h-4 w-4 shrink-0 text-brand-gold-light" />;
}

export function AdminNotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications?limit=8');
      const json = await res.json();
      if (json.success) setItems(json.data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  }, [load]);

  const unread = items.filter((n) => !n.readAt).length;

  async function markRead(id: string) {
    await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-brand-gold/25 bg-white/5 text-brand-soft transition-colors hover:border-brand-cyan/35 hover:bg-white/10"
        aria-label={`Notificaciones${unread ? `, ${unread} sin leer` : ''}`}
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-gold px-1 text-[10px] font-bold text-brand-navy">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40"
            aria-label="Cerrar notificaciones"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-xl border border-brand-gold/25 bg-brand-navy/95 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <p className="text-sm font-semibold text-brand-soft">Notificaciones</p>
              <Link
                href="/admin/notificaciones"
                className="text-xs text-brand-cyan hover:underline"
                onClick={() => setOpen(false)}
              >
                Ver todas
              </Link>
            </div>
            <ul className="max-h-80 overflow-y-auto">
              {loading ? (
                <li className="px-4 py-6 text-center text-sm text-brand-mist">Cargando…</li>
              ) : items.length === 0 ? (
                <li className="px-4 py-6 text-center text-sm text-brand-mist">Sin notificaciones</li>
              ) : (
                items.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => {
                        if (!n.readAt) void markRead(n.id);
                        setOpen(false);
                      }}
                      className={cn(
                        'flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5',
                        !n.readAt && 'bg-brand-cyan/5'
                      )}
                    >
                      <NotificationIcon type={n.type} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-brand-soft">{n.title}</p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-brand-mist">{n.body}</p>
                        <p className="mt-1 text-[10px] text-brand-slate">
                          {new Date(n.createdAt).toLocaleString('es-PE')}
                        </p>
                      </div>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
