import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatFinancePen } from '@/components/admin/finance/finance-ui';
import { profitGrowthProgress } from '@/lib/profit-growth';

interface ProfitGrowthKpiCardProps {
  amount: number;
  dense?: boolean;
  className?: string;
}

export function ProfitGrowthKpiCard({ amount, dense, className }: ProfitGrowthKpiCardProps) {
  const progress = profitGrowthProgress(amount);
  const progressRounded = Math.round(progress);

  return (
    <div
      className={cn(
        'card-dashboard min-h-[7.5rem] border-brand-gold/30 bg-premium-gradient shadow-glow-gold',
        dense && 'p-4',
        className
      )}
    >
      <p
        className={cn(
          'font-medium uppercase tracking-wider text-brand-gold-light/90',
          dense ? 'text-[10px] leading-tight' : 'text-xs'
        )}
      >
        Ganancia acumulada
      </p>
      <p
        className={cn(
          'font-display font-bold kpi-gold',
          dense ? 'mt-1.5 text-lg leading-tight' : 'mt-2 text-2xl sm:text-3xl'
        )}
      >
        {formatFinancePen(amount)}
      </p>
      <p
        className={cn(
          'flex items-center gap-1 text-brand-mist',
          dense ? 'mt-1 text-[10px] leading-tight' : 'mt-2 text-xs'
        )}
      >
        <TrendingUp className={cn('text-emerald-400', dense ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
        Desde el inicio hasta hoy
      </p>

      <div className={dense ? 'mt-2' : 'mt-4'}>
        <div
          className={cn(
            'mb-1 flex items-center justify-between text-brand-mist',
            dense ? 'text-[10px]' : 'mb-1.5 text-xs'
          )}
        >
          <span>Avance</span>
          <span className="font-medium text-brand-gold-light">{progressRounded}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-cyan to-brand-gold transition-[width] duration-500"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progressRounded}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Avance de ganancia acumulada: ${progressRounded} por ciento`}
          />
        </div>
      </div>
    </div>
  );
}
