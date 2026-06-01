import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatFinancePen } from '@/components/admin/finance/finance-ui';
import { profitGrowthProgress } from '@/lib/profit-growth';

interface ProfitGrowthKpiCardProps {
  amount: number;
  className?: string;
}

export function ProfitGrowthKpiCard({ amount, className }: ProfitGrowthKpiCardProps) {
  const progress = profitGrowthProgress(amount);
  const progressRounded = Math.round(progress);

  return (
    <div
      className={cn(
        'card-dashboard border-brand-gold/30 bg-premium-gradient shadow-glow-gold',
        className
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-brand-gold-light/90">
        Ganancia acumulada
      </p>
      <p className="mt-2 font-display text-2xl font-bold sm:text-3xl kpi-gold">
        {formatFinancePen(amount)}
      </p>
      <p className="mt-2 flex items-center gap-1 text-xs text-brand-mist">
        <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
        Desde el inicio hasta hoy
      </p>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs text-brand-mist">
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
