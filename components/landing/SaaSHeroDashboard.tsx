'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AlertTriangle, Bell, Info, Package, TrendingUp, Zap, Wallet } from 'lucide-react';
import { SalesByHourLineChart } from '@/components/landing/SalesByHourLineChart';
import { cn } from '@/lib/utils';

const KPI_POOL = [
  { label: 'Ventas hoy', values: ['S/ 4,280', 'S/ 4,512', 'S/ 4,890', 'S/ 5,102'] },
  { label: 'Pedidos', values: ['127', '134', '141', '156'] },
  { label: 'Mesas activas', values: ['18/24', '19/24', '21/24', '22/24'] },
];

const ORDER_POOL = [
  ['Lomo saltado x2', 'Ceviche mixto', 'Chicha morada'],
  ['Arroz con pollo', 'Tallarín verde', 'Inca Kola'],
  ['Pizza familiar', 'Lasagna', 'Tiramisú'],
];

type AlertLevel = 'urgent' | 'warning' | 'info';

const SYSTEM_ALERTS_POOL: { level: AlertLevel; title: string; detail: string }[][] = [
  [
    { level: 'urgent', title: 'Stock crítico', detail: 'Pollo — 2 kg restantes' },
    { level: 'warning', title: 'Merma atípica', detail: 'Cocina · +8% vs promedio' },
    { level: 'info', title: 'Reserva confirmada', detail: 'Mesa 12 · 8 personas · 20:00' },
  ],
  [
    { level: 'warning', title: 'Caja desviada', detail: 'Turno tarde · revisar arqueo' },
    { level: 'urgent', title: 'Insumo bajo', detail: 'Aceite — pedir antes del rush' },
    { level: 'info', title: 'Meta del día', detail: '82% del objetivo de ventas' },
  ],
  [
    { level: 'info', title: 'Pico estimado', detail: 'IA · alta demanda en 45 min' },
    { level: 'urgent', title: 'Stock crítico', detail: 'Lomo · reposición sugerida' },
    { level: 'warning', title: 'Pedido demorado', detail: 'Delivery #284 · +12 min' },
  ],
];

const ALERT_LEVEL_STYLES: Record<
  AlertLevel,
  { row: string; dot: string; icon: typeof AlertTriangle }
> = {
  urgent: {
    row: 'border-red-400/25 bg-red-500/[0.08]',
    dot: 'bg-red-400',
    icon: AlertTriangle,
  },
  warning: {
    row: 'border-amber-400/25 bg-amber-500/[0.08]',
    dot: 'bg-amber-400',
    icon: Package,
  },
  info: {
    row: 'border-brand-cyan/20 bg-brand-cyan/[0.06]',
    dot: 'bg-brand-cyan',
    icon: Info,
  },
};

export function SaaSHeroDashboard() {
  const reduced = useReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setTick((t) => t + 1), 3200);
    return () => clearInterval(id);
  }, [reduced]);

  const kpiSet = tick % KPI_POOL[0].values.length;
  const orders = ORDER_POOL[tick % ORDER_POOL.length];
  const systemAlerts = SYSTEM_ALERTS_POOL[tick % SYSTEM_ALERTS_POOL.length];
  const activeAlerts = systemAlerts.filter((a) => a.level === 'urgent' || a.level === 'warning').length;

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-gradient-to-r from-brand-cyan/30 via-brand-blue/20 to-brand-gold/20 blur-3xl" />
      <motion.div
        animate={reduced ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="relative rounded-2xl bg-white/90 p-px shadow-glow-cyan"
      >
        <div className="rounded-[calc(1rem-1px)] bg-gradient-to-br from-brand-cyan/55 via-brand-blue/35 to-brand-gold/45 p-[2px]">
          <div className="relative overflow-hidden rounded-[calc(1rem-3px)] border border-brand-cyan/25 bg-brand-navy/75 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
          <span className="ml-2 text-xs text-brand-mist">Resto Fadey — Command Center</span>
          <span className="ml-auto flex items-center gap-1 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-2 py-0.5 text-[10px] text-brand-cyan">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-cyan" />
            En vivo
          </span>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid grid-cols-3 gap-3">
            {KPI_POOL.map((kpi) => (
              <motion.div
                key={kpi.label}
                layout
                className="rounded-xl border border-white/10 bg-gradient-to-br from-brand-cyan/10 to-transparent p-3"
              >
                <p className="text-[10px] uppercase tracking-wider text-brand-slate">{kpi.label}</p>
                <p className="mt-1 font-display text-lg font-bold text-brand-soft sm:text-xl">
                  {kpi.values[kpiSet]}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 text-[10px] text-brand-mist">
              <TrendingUp className="h-3 w-3 text-brand-cyan" />
              Análisis operativo en tiempo real
            </p>
            <span className="flex items-center gap-1 rounded-full border border-brand-green/25 bg-brand-green/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300/90">
              <Wallet className="h-3 w-3" />
              Margen neto +12%
            </span>
          </div>

          <div className="mt-2">
            <SalesByHourLineChart
              compact
              className="[&_svg]:h-[4.5rem] sm:[&_svg]:h-20"
              peakLabel="Pico 6:00 pm · almuerzo 1:00 pm"
            />
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-slate">
                  Alertas del sistema
                </p>
                <span className="rounded-full border border-brand-cyan/25 bg-brand-cyan/10 px-2 py-0.5 text-[9px] font-medium text-brand-cyan">
                  {activeAlerts} activas
                </span>
              </div>
              <ul className="mt-2.5 space-y-2">
                {systemAlerts.map((alert, i) => {
                  const style = ALERT_LEVEL_STYLES[alert.level];
                  const Icon = style.icon;
                  return (
                    <motion.li
                      key={`${alert.title}-${tick}`}
                      initial={reduced ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className={cn(
                        'flex gap-2 rounded-lg border px-2.5 py-2',
                        style.row
                      )}
                    >
                      <span
                        className={cn('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', style.dot)}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-1.5">
                          <Icon className="mt-0.5 h-3 w-3 shrink-0 opacity-80" aria-hidden />
                          <p className="text-[11px] font-medium leading-tight text-brand-soft">
                            {alert.title}
                          </p>
                        </div>
                        <p className="mt-0.5 pl-[1.125rem] text-[10px] leading-snug text-brand-mist">
                          {alert.detail}
                        </p>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-slate">
                Pedidos entrantes
              </p>
              {orders.map((item, i) => (
                <motion.div
                  key={`${item}-${tick}`}
                  initial={reduced ? false : { opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                >
                  <span className="truncate text-xs text-brand-soft">{item}</span>
                  <span className="shrink-0 rounded-full bg-brand-green/20 px-2 py-0.5 text-[10px] text-brand-green">
                    Nuevo
                  </span>
                </motion.div>
              ))}
              <div className="flex items-center gap-2 rounded-lg border border-brand-gold/25 bg-brand-gold/10 px-3 py-2 text-[10px] text-brand-gold-light">
                <Bell className="h-3.5 w-3.5 shrink-0" />
                Alerta IA: pico en 45 min
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-brand-gold-light" />
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
              <motion.div
                animate={{ width: ['45%', '78%', '62%', '88%'] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="h-full rounded-full bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-gold"
              />
            </div>
            <span className="text-[10px] text-brand-mist">Automatización 90%</span>
          </div>
        </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
