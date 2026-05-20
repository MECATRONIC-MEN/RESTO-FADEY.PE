'use client';

import { AlertTriangle, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

type StockAlert = { product: string; detail: string; level: 'urgent' | 'warning' };
type RankItem = { name: string; share: number };

interface DashboardBottomWidgetsProps {
  stockAlerts: StockAlert[];
  productRanking: RankItem[];
  accent?: 'cyan' | 'gold';
}

export function DashboardBottomWidgets({
  stockAlerts,
  productRanking,
  accent = 'cyan',
}: DashboardBottomWidgetsProps) {
  const barAccent = accent === 'gold' ? 'from-brand-gold/80 to-brand-gold/30' : 'from-brand-cyan to-brand-blue/50';

  return (
    <div className="grid h-full min-h-0 grid-cols-2 gap-2">
      <div className="flex min-h-0 flex-col rounded-lg border border-white/10 bg-white/5 p-2">
        <div className="mb-1.5 flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-400" aria-hidden />
          <p className="text-[9px] font-semibold uppercase tracking-wide text-brand-slate">
            Alertas stock bajo
          </p>
        </div>
        <ul className="flex min-h-0 flex-1 flex-col justify-center gap-1">
          {stockAlerts.map((a) => (
            <li key={a.product} className="flex items-start gap-1.5">
              <span
                className={cn(
                  'mt-1 h-1.5 w-1.5 shrink-0 rounded-full',
                  a.level === 'urgent' ? 'bg-red-400' : 'bg-amber-400'
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] font-medium text-brand-soft">{a.product}</p>
                <p className="truncate text-[8px] text-brand-mist">{a.detail}</p>
              </div>
              <span
                className={cn(
                  'shrink-0 text-[8px] font-semibold uppercase',
                  a.level === 'urgent' ? 'text-red-300' : 'text-amber-300'
                )}
              >
                {a.level === 'urgent' ? 'Urgente' : 'Bajo'}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex min-h-0 flex-col rounded-lg border border-white/10 bg-white/5 p-2">
        <div className="mb-1.5 flex items-center gap-1.5">
          <Trophy className={cn('h-3.5 w-3.5', accent === 'gold' ? 'text-brand-gold-light' : 'text-brand-cyan')} aria-hidden />
          <p className="text-[9px] font-semibold uppercase tracking-wide text-brand-slate">
            Ranking productos
          </p>
        </div>
        <ul className="flex min-h-0 flex-1 flex-col justify-center gap-1">
          {productRanking.map((item, i) => (
            <li key={item.name}>
              <div className="flex items-center justify-between gap-1">
                <span className="flex min-w-0 items-center gap-1">
                  <span className="w-3 shrink-0 text-[9px] font-bold text-brand-cyan">{i + 1}</span>
                  <span className="truncate text-[10px] text-brand-soft">{item.name}</span>
                </span>
                <span className="shrink-0 text-[9px] tabular-nums text-brand-mist">{item.share}%</span>
              </div>
              <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className={cn('h-full rounded-full bg-gradient-to-r', barAccent)}
                  style={{ width: `${item.share}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
