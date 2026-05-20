'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Bell, TrendingUp, Zap } from 'lucide-react';

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
  const bars = [40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map(
    (h, i) => h + ((tick + i) % 3) * 4
  );

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-gradient-to-r from-brand-cyan/30 via-brand-blue/20 to-brand-gold/20 blur-3xl" />
      <motion.div
        animate={reduced ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="relative overflow-hidden rounded-2xl border border-white/20 bg-brand-navy/60 shadow-2xl backdrop-blur-xl"
      >
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

          <div className="mt-4 grid gap-4 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="flex h-28 items-end gap-1.5 rounded-xl border border-white/10 bg-white/5 p-3 sm:h-32">
                {bars.map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: `${Math.min(h, 100)}%` }}
                    transition={{ duration: 0.5 }}
                    className="flex-1 rounded-t bg-gradient-to-t from-brand-cyan/80 to-brand-blue/40"
                  />
                ))}
              </div>
              <p className="mt-2 flex items-center gap-1 text-[10px] text-brand-cyan">
                <TrendingUp className="h-3 w-3" />
                Tendencia de ventas — últimas 12 h
              </p>
            </div>
            <div className="space-y-2 lg:col-span-2">
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
                <Bell className="h-3.5 w-3.5" />
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
      </motion.div>

      {!reduced && (
        <>
          <motion.div
            animate={{ y: [0, -6, 0], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -left-2 top-1/4 hidden rounded-lg border border-brand-cyan/30 bg-brand-deep/90 px-3 py-2 text-[10px] text-brand-cyan shadow-glow-cyan sm:block"
          >
            +18% vs ayer
          </motion.div>
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
            className="absolute -right-2 bottom-1/4 hidden rounded-lg border border-brand-gold/30 bg-brand-gold/10 px-3 py-2 text-[10px] text-brand-gold-light shadow-glow-gold sm:block"
          >
            IA activa
          </motion.div>
        </>
      )}
    </div>
  );
}
