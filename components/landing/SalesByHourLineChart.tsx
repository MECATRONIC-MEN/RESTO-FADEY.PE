'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type HourSalesPoint = { hour: string; sales: number };

/** 9:00 – 22:00 (10pm), picos almuerzo 13:00 y cena 18:00 */
export const DEFAULT_SALES_BY_HOUR: HourSalesPoint[] = [
  { hour: '9', sales: 18 },
  { hour: '10', sales: 28 },
  { hour: '11', sales: 42 },
  { hour: '12', sales: 68 },
  { hour: '13', sales: 88 },
  { hour: '14', sales: 72 },
  { hour: '15', sales: 38 },
  { hour: '16', sales: 40 },
  { hour: '17', sales: 55 },
  { hour: '18', sales: 100 },
  { hour: '19', sales: 75 },
  { hour: '20', sales: 58 },
  { hour: '21', sales: 42 },
  { hour: '22', sales: 25 },
];

const PEAK_HOURS = new Set(['13', '18']);

function formatHourLabel(hour: string): string {
  const h = parseInt(hour, 10);
  if (h === 12) return '12pm';
  if (h < 12) return `${h}am`;
  return `${h - 12}pm`;
}

interface SalesByHourLineChartProps {
  data?: HourSalesPoint[];
  accent?: 'cyan' | 'gold';
  peakLabel?: string;
  /** Versión más baja para el explorador de módulos */
  compact?: boolean;
  className?: string;
}

const W = 100;
const H = 40;
const PAD = 4;

function buildPath(points: HourSalesPoint[]): { line: string; area: string; coords: { x: number; y: number }[] } {
  const max = Math.max(...points.map((p) => p.sales), 1);
  const step = (W - PAD * 2) / (points.length - 1);
  const coords = points.map((p, i) => ({
    x: PAD + i * step,
    y: PAD + (H - PAD * 2) * (1 - p.sales / max),
  }));

  const line = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
  const area = `${line} L ${coords[coords.length - 1].x} ${H - PAD} L ${coords[0].x} ${H - PAD} Z`;

  return { line, area, coords };
}

export function SalesByHourLineChart({
  data = DEFAULT_SALES_BY_HOUR,
  accent = 'cyan',
  peakLabel,
  compact = false,
  className,
}: SalesByHourLineChartProps) {
  const points = data;
  const { line, area, coords } = useMemo(() => buildPath(points), [points]);
  const peakIndices = points
    .map((p, i) => (PEAK_HOURS.has(p.hour) || p.sales >= 100 ? i : -1))
    .filter((i) => i >= 0);
  const highlightIndices = new Set(
    peakIndices.length > 0
      ? peakIndices
      : points.map((p, i) => (p.sales === Math.max(...points.map((x) => x.sales)) ? i : -1)).filter((i) => i >= 0)
  );

  const stroke = accent === 'gold' ? '#d4af37' : '#3bc9f4';
  const fillId = `area-${accent}`;

  return (
    <div
      className={cn(
        'rounded-xl border border-white/10 bg-white/5',
        compact ? 'px-3 pb-1.5 pt-2.5' : 'px-4 pb-2 pt-5',
        className
      )}
    >
      <div
        className={cn(
          'flex flex-wrap items-center justify-between gap-1.5',
          compact ? 'mb-2' : 'mb-3.5'
        )}
      >
        <div>
          <p
            className={cn(
              'font-semibold uppercase tracking-wider text-brand-slate',
              compact ? 'text-[10px]' : 'text-xs'
            )}
          >
            Ventas por hora
          </p>
          {!compact && (
            <p className="text-[10px] text-brand-mist">9:00 am – 10:00 pm · mayor actividad</p>
          )}
        </div>
        <span
          className={cn(
            'rounded-full border font-medium',
            compact ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[10px]',
            accent === 'gold'
              ? 'border-brand-gold/35 bg-brand-gold/10 text-brand-gold-light'
              : 'border-brand-cyan/35 bg-brand-cyan/10 text-brand-cyan'
          )}
        >
          {peakLabel ?? 'Pico 6:00 pm · almuerzo 1:00 pm'}
        </span>
      </div>

      <div className={compact ? 'relative' : 'relative pt-1'}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={cn('w-full', compact ? 'h-14 sm:h-16' : 'h-24 sm:h-28')}
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
              <stop offset="100%" stopColor={stroke} stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d={area}
            fill={`url(#${fillId})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.path
            d={line}
            fill="none"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
          {coords.map((c, i) => (
            <motion.circle
              key={i}
              cx={c.x}
              cy={c.y}
              r={highlightIndices.has(i) ? 2.2 : 1.2}
              fill={highlightIndices.has(i) ? stroke : 'rgba(255,255,255,0.5)'}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 + i * 0.04 }}
            />
          ))}
        </svg>
      </div>

      <div
        className={cn(
          'flex justify-between gap-0.5 text-brand-slate',
          compact ? 'mt-1 text-[7px] sm:text-[8px]' : 'mt-1.5 pb-0.5 text-[8px] sm:text-[9px]'
        )}
      >
        {points.map((p) => (
          <span
            key={p.hour}
            className={cn(
              'tabular-nums',
              PEAK_HOURS.has(p.hour) && (accent === 'gold' ? 'text-brand-gold-light' : 'text-brand-cyan')
            )}
          >
            {formatHourLabel(p.hour)}
          </span>
        ))}
      </div>
    </div>
  );
}
