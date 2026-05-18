'use client';

import { useAdminApi } from '@/hooks/useAdminApi';
import type { SaasPlan } from '@/lib/domain/types';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { ModuleShell } from '@/components/admin/ModuleShell';

export default function AdminPlanesPage() {
  const { data: plans, loading } = useAdminApi<SaasPlan[]>('/api/plans');

  return (
    <ModuleShell
      title="Planes SaaS"
      description="Precios, módulos incluidos, límites y beneficios por tier."
      features={[
        'Crear y editar planes',
        'Precios en PEN',
        'Módulos incluidos',
        'Límites por plan',
        'Stripe (futuro)',
        'Promociones vinculadas',
      ]}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {loading ? (
          <p className="text-brand-mist">Cargando planes…</p>
        ) : (
          (plans ?? []).map((plan) => (
            <DashboardCard key={plan.id} premium={plan.highlighted}>
              <h3 className="font-display text-xl font-bold text-brand-soft">{plan.name}</h3>
              <p className="kpi-gold mt-2 text-2xl">
                S/ {plan.priceMonthly}
                <span className="text-sm font-normal text-brand-mist">/mes</span>
              </p>
              <ul className="mt-4 space-y-1 text-sm text-brand-mist">
                {plan.modules.map((m) => (
                  <li key={m}>• {m}</li>
                ))}
              </ul>
            </DashboardCard>
          ))
        )}
      </div>
    </ModuleShell>
  );
}
