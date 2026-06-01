'use client';

import Link from 'next/link';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import type { SaasUpcomingPayment } from '@/lib/domain/types';

function formatPen(amount: number) {
  return `S/ ${amount.toLocaleString('es-PE')}`;
}

export function UpcomingPaymentsAlert({
  items,
  personalHref = '/admin/finanzas/personal',
  taxesHref = '/admin/finanzas/impuestos',
}: {
  items: SaasUpcomingPayment[];
  personalHref?: string;
  taxesHref?: string;
}) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
        <div className="flex-1 space-y-3">
          <p className="text-sm font-medium text-amber-100">Pagos próximos o vencidos</p>
          <ul className="space-y-2 text-sm text-amber-200/90">
            {items.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-2">
                <span>
                  {item.label} · {formatPen(item.amount)} ·{' '}
                  {item.overdue
                    ? `Vencido hace ${Math.abs(item.daysUntil)} día(s)`
                    : item.daysUntil === 0
                      ? 'Vence hoy'
                      : `Vence en ${item.daysUntil} día(s)`}
                </span>
                <Link
                  href={item.kind === 'staff' ? personalHref : taxesHref}
                  className="inline-flex items-center gap-1 text-xs text-brand-cyan hover:underline"
                >
                  Ir a pagar
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export const FINANCE_INPUT_CLASS =
  'w-full rounded-lg border border-brand-cyan/20 bg-white/10 px-3 py-2 text-sm text-brand-soft placeholder:text-brand-slate';

export function formatFinancePen(amount: number) {
  return formatPen(amount);
}
