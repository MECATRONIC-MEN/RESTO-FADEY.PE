'use client';

interface BarChartProps {
  data: { label: string; value: number }[];
  maxValue?: number;
  highlightLast?: boolean;
}

export function BarChart({ data, maxValue, highlightLast }: BarChartProps) {
  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex h-48 items-end justify-between gap-2 sm:gap-3">
      {data.map((item, i) => {
        const height = `${(item.value / max) * 100}%`;
        const isLast = highlightLast && i === data.length - 1;
        return (
          <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-40 w-full items-end justify-center">
              <div
                className={`w-full max-w-[48px] rounded-t-lg transition-all ${
                  isLast
                    ? 'bg-gradient-to-t from-brand-gold to-brand-gold-light shadow-glow-gold'
                    : 'bg-gradient-to-t from-brand-blue to-brand-cyan'
                }`}
                style={{ height }}
                title={`S/ ${item.value}`}
              />
            </div>
            <span className="text-[10px] text-brand-slate sm:text-xs">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
