import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  premium?: boolean;
  dense?: boolean;
  className?: string;
  onClick?: () => void;
}

export function KpiCard({
  label,
  value,
  change,
  trend = 'neutral',
  premium,
  dense,
  className,
  onClick,
}: KpiCardProps) {
  const cardClass = cn(
    'card-dashboard min-h-[7.5rem]',
    dense && 'min-h-[7.5rem] p-4',
    onClick && 'text-left transition-colors hover:border-brand-gold/35 hover:bg-brand-gold/5',
    premium && 'border-brand-gold/30 bg-premium-gradient shadow-glow-gold',
    className
  );

  const content = (
    <>
      <p
        className={cn(
          'font-medium uppercase tracking-wider',
          dense ? 'text-[10px] leading-tight' : 'text-xs',
          premium ? 'text-brand-gold-light/90' : 'text-brand-slate'
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          'mt-1.5 font-display font-bold',
          dense ? 'text-lg leading-tight' : 'mt-2 text-2xl sm:text-3xl',
          premium ? 'kpi-gold' : 'text-brand-soft'
        )}
      >
        {value}
      </p>
      {change && (
        <p
          className={cn(
            'mt-1.5 flex items-center gap-1 text-brand-mist',
            dense ? 'text-[10px] leading-tight' : 'mt-2 text-xs'
          )}
        >
          {trend === 'up' && <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />}
          {trend === 'down' && <TrendingDown className="h-3.5 w-3.5 text-red-400" />}
          {change}
        </p>
      )}
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cardClass}>
        {content}
      </button>
    );
  }

  return (
    <div className={cardClass}>
      {content}
    </div>
  );
}
