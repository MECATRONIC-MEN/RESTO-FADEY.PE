import { cn } from '@/lib/utils';

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
  premium?: boolean;
}

export function DashboardCard({
  children,
  className,
  title,
  action,
  premium,
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        'card-dashboard',
        premium && 'border-brand-gold/30 bg-premium-gradient shadow-glow-gold',
        className
      )}
    >
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-2">
          {title && (
            <h3
              className={cn(
                'font-display text-sm font-semibold',
                premium ? 'text-brand-gold-light' : 'text-brand-soft'
              )}
            >
              {title}
            </h3>
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
