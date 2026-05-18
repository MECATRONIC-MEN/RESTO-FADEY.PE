'use client';

import { useCallback, useState } from 'react';
import { Bell, CheckCheck, PlayCircle, Smartphone, Trash2, UserPlus } from 'lucide-react';
import { useAdminApi } from '@/hooks/useAdminApi';
import type { AdminNotification, CommercialLeadRecord, DemoRequestRecord } from '@/lib/domain/types';
import {
  deleteDemoById,
  deleteLeadById,
  deleteNotification,
} from '@/lib/admin/notification-actions';
import { AdminPageHeader } from './AdminPageHeader';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { cn } from '@/lib/utils';

function TypeBadge({ type }: { type: AdminNotification['type'] }) {
  if (type === 'pwa_install') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-2 py-0.5 text-[10px] font-medium uppercase text-brand-cyan">
        <Smartphone className="h-3 w-3" />
        App instalada
      </span>
    );
  }
  if (type === 'demo_request') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-2 py-0.5 text-[10px] font-medium uppercase text-brand-cyan">
        <PlayCircle className="h-3 w-3" />
        Demo
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-2 py-0.5 text-[10px] font-medium uppercase text-brand-gold-light">
      <UserPlus className="h-3 w-3" />
      Acceso
    </span>
  );
}

export function NotificationsPanel() {
  const { data: notifications, loading, refetch: refetchNotifications } =
    useAdminApi<AdminNotification[]>('/api/notifications?limit=100');
  const { data: leads, loading: leadsLoading, refetch: refetchLeads } =
    useAdminApi<CommercialLeadRecord[]>('/api/leads');
  const { data: demos, loading: demosLoading, refetch: refetchDemos } =
    useAdminApi<DemoRequestRecord[]>('/api/demos');

  const refetchAll = useCallback(() => {
    refetchNotifications();
    refetchLeads();
    refetchDemos();
  }, [refetchNotifications, refetchLeads, refetchDemos]);
  const [marking, setMarking] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const unread = (notifications ?? []).filter((n) => !n.readAt).length;

  const markAllRead = useCallback(async () => {
    setMarking(true);
    try {
      await fetch('/api/notifications', { method: 'PATCH' });
      refetchAll();
    } finally {
      setMarking(false);
    }
  }, [refetchAll]);

  async function markOne(id: string) {
    await fetch(`/api/notifications/${encodeURIComponent(id)}`, { method: 'PATCH' });
    refetchAll();
  }

  async function removeNotification(id: string) {
    if (!confirm('¿Eliminar esta notificación y la solicitud vinculada (si existe)?')) return;
    setDeleting(id);
    try {
      await deleteNotification(id);
      refetchAll();
    } catch {
      alert('No se pudo eliminar.');
    } finally {
      setDeleting(null);
    }
  }

  async function removeLead(id: string) {
    if (!confirm('¿Eliminar esta solicitud de acceso y su notificación?')) return;
    setDeleting(`lead-${id}`);
    try {
      await deleteLeadById(id);
      refetchAll();
    } catch {
      alert('No se pudo eliminar.');
    } finally {
      setDeleting(null);
    }
  }

  async function removeDemo(id: string) {
    if (!confirm('¿Eliminar esta solicitud de demo y su notificación?')) return;
    setDeleting(`demo-${id}`);
    try {
      await deleteDemoById(id);
      refetchAll();
    } catch {
      alert('No se pudo eliminar.');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <AdminPageHeader
        title="Notificaciones y solicitudes"
        description="Leads del formulario de acceso, demos y avisos internos (p. ej. si instalas el panel admin como app)."
        actions={
          unread > 0 ? (
            <button
              type="button"
              onClick={markAllRead}
              disabled={marking}
              className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm disabled:opacity-60"
            >
              <CheckCheck className="h-4 w-4" />
              Marcar todas leídas
            </button>
          ) : null
        }
      />

      <DashboardCard title={`Notificaciones${unread ? ` (${unread} sin leer)` : ''}`}>
        {loading ? (
          <p className="text-sm text-brand-mist">Cargando…</p>
        ) : !notifications?.length ? (
          <p className="flex items-center gap-2 text-sm text-brand-mist">
            <Bell className="h-4 w-4" />
            Aún no hay notificaciones.
          </p>
        ) : (
          <ul className="space-y-3">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={cn(
                  'rounded-lg border px-4 py-3',
                  n.readAt
                    ? 'border-white/10 bg-white/[0.03]'
                    : 'border-brand-cyan/25 bg-brand-cyan/5'
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <TypeBadge type={n.type} />
                      <span className="text-[10px] text-brand-slate">
                        {new Date(n.createdAt).toLocaleString('es-PE')}
                      </span>
                    </div>
                    <p className="font-medium text-brand-soft">{n.title}</p>
                    <p className="mt-1 text-sm text-brand-mist">{n.body}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-3">
                    {!n.readAt && (
                      <button
                        type="button"
                        onClick={() => markOne(n.id)}
                        className="text-xs text-brand-cyan hover:underline"
                      >
                        Marcar leída
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeNotification(n.id)}
                      disabled={deleting === n.id}
                      className="inline-flex items-center gap-1 text-xs text-red-400/90 hover:text-red-300 disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </DashboardCard>

      <DashboardCard title="Solicitudes de demo (/demo)">
        {demosLoading ? (
          <p className="text-sm text-brand-mist">Cargando…</p>
        ) : !demos?.length ? (
          <p className="text-sm text-brand-mist">No hay solicitudes de demo.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase text-brand-slate">
                  <th className="pb-3 pr-4">Fecha</th>
                  <th className="pb-3 pr-4">Nombre</th>
                  <th className="pb-3 pr-4">Restaurante</th>
                  <th className="pb-3 pr-4">Contacto</th>
                  <th className="pb-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {demos.map((demo) => (
                  <tr key={demo.id} className="border-b border-white/5">
                    <td className="py-3 pr-4 text-brand-slate">
                      {new Date(demo.createdAt).toLocaleDateString('es-PE')}
                    </td>
                    <td className="py-3 pr-4 font-medium text-brand-soft">{demo.name}</td>
                    <td className="py-3 pr-4 text-brand-mist">{demo.businessName}</td>
                    <td className="py-3 pr-4 text-brand-mist">
                      <div>{demo.email}</div>
                      {demo.phone && <div className="text-xs">{demo.phone}</div>}
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => removeDemo(demo.id)}
                        disabled={deleting === `demo-${demo.id}`}
                        className="inline-flex items-center gap-1 text-xs text-red-400/90 hover:text-red-300 disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardCard>

      <DashboardCard title="Solicitudes de acceso (formulario)">
        {leadsLoading ? (
          <p className="text-sm text-brand-mist">Cargando…</p>
        ) : !leads?.length ? (
          <p className="text-sm text-brand-mist">No hay solicitudes registradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase text-brand-slate">
                  <th className="pb-3 pr-4">Fecha</th>
                  <th className="pb-3 pr-4">Nombre</th>
                  <th className="pb-3 pr-4">Restaurante</th>
                  <th className="pb-3 pr-4">Contacto</th>
                  <th className="pb-3 pr-4">Plan</th>
                  <th className="pb-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-white/5">
                    <td className="py-3 pr-4 text-brand-slate">
                      {new Date(lead.createdAt).toLocaleDateString('es-PE')}
                    </td>
                    <td className="py-3 pr-4 font-medium text-brand-soft">{lead.name}</td>
                    <td className="py-3 pr-4 text-brand-mist">{lead.businessName ?? '—'}</td>
                    <td className="py-3 pr-4 text-brand-mist">
                      <div>{lead.email}</div>
                      {lead.phone && <div className="text-xs">{lead.phone}</div>}
                    </td>
                    <td className="py-3 pr-4 text-brand-cyan">{lead.planInterest ?? '—'}</td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => removeLead(lead.id)}
                        disabled={deleting === `lead-${lead.id}`}
                        className="inline-flex items-center gap-1 text-xs text-red-400/90 hover:text-red-300 disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardCard>
    </div>
  );
}
