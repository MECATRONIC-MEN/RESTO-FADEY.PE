'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { MODULE_TABS, type ModuleTab } from '@/lib/landing-data';
import { SalesByHourLineChart } from '@/components/landing/SalesByHourLineChart';
import { DashboardBottomWidgets } from '@/components/landing/DashboardBottomWidgets';
import { cn } from '@/lib/utils';

function ModulePreview({ tab }: { tab: ModuleTab }) {
  const isGold = tab.accent === 'gold';
  const showSalesChart = Boolean(tab.salesByHour?.length);
  const showBottomWidgets =
    Boolean(tab.stockAlerts?.length) && Boolean(tab.productRanking?.length);

  return (
    <motion.div
      key={tab.id}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.35 }}
      className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-brand-navy/50 p-3 sm:p-4"
    >
      <div
        className={cn(
          'pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl',
          isGold ? 'bg-brand-gold/15' : 'bg-brand-cyan/15'
        )}
      />
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-bold leading-tight text-brand-soft">
            {tab.title}
          </h3>
          <tab.icon
            className={cn('h-7 w-7 shrink-0', isGold ? 'text-brand-gold-light' : 'text-brand-cyan')}
            aria-hidden
          />
        </div>

        <ul className="mt-2 flex flex-wrap gap-1.5">
          {tab.bullets.map((b, i) => (
            <li
              key={b}
              className={cn(
                'rounded-full border px-2 py-0.5 text-[10px] font-semibold',
                isGold
                  ? 'border-brand-gold/40 bg-brand-gold/10 text-brand-gold-light'
                  : i === 0
                    ? 'border-brand-cyan/50 bg-brand-cyan/15 text-brand-cyan'
                    : i % 2 === 0
                      ? 'border-brand-blue/40 bg-brand-blue/10 text-brand-soft'
                      : 'border-white/20 bg-white/10 text-brand-mist'
              )}
            >
              {b}
            </li>
          ))}
        </ul>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {tab.kpis.map((kpi) => (
            <div
              key={kpi.label}
              className={cn(
                'rounded-lg border p-2',
                isGold
                  ? 'border-brand-gold/25 bg-brand-gold/5'
                  : 'border-brand-cyan/25 bg-brand-cyan/5'
              )}
            >
              <p className="text-[9px] uppercase text-brand-slate">{kpi.label}</p>
              <p className="mt-0.5 font-display text-base font-bold leading-none text-brand-soft">
                {kpi.value}
              </p>
              {kpi.trend && (
                <p
                  className={cn(
                    'mt-0.5 text-[9px]',
                    isGold ? 'text-brand-gold-light' : 'text-brand-cyan'
                  )}
                >
                  {kpi.trend}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="flex h-24 items-end gap-1 rounded-lg border border-white/10 bg-white/5 p-2.5">
              {tab.chartBars.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.03, duration: 0.4 }}
                  className={cn(
                    'flex-1 rounded-t',
                    isGold
                      ? 'bg-gradient-to-t from-brand-gold/70 to-brand-gold/20'
                      : 'bg-gradient-to-t from-brand-cyan/80 to-brand-cyan/20'
                  )}
                />
              ))}
            </div>
          </div>
          <div className="flex h-24 flex-col justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] p-2 lg:col-span-2">
            {tab.channels && tab.channels.length > 0 ? (
              tab.channels.map((ch) => (
                <div key={ch.name} className="min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="truncate text-[11px] font-medium text-brand-soft">{ch.name}</span>
                    <span className="shrink-0 text-[11px] font-bold tabular-nums text-brand-cyan">
                      {ch.value ?? `${ch.percent ?? 0}%`}
                    </span>
                  </div>
                  {ch.percent != null && ch.percent > 0 && (
                    <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          isGold
                            ? 'bg-gradient-to-r from-brand-gold/80 to-brand-gold/30'
                            : 'bg-gradient-to-r from-brand-cyan to-brand-blue/50'
                        )}
                        style={{ width: `${Math.min(ch.percent, 100)}%` }}
                      />
                    </div>
                  )}
                  <span className="mt-0.5 block truncate text-[8px] text-brand-green">{ch.badge}</span>
                </div>
              ))
            ) : tab.orders.length > 0 ? (
              tab.orders.map((order) => (
                <div
                  key={order.name}
                  className="flex items-center justify-between gap-2 rounded-md border border-white/10 bg-white/5 px-2 py-1.5"
                >
                  <span className="min-w-0 truncate text-[11px] text-brand-soft">{order.name}</span>
                  <span className="shrink-0 rounded-full bg-brand-green/15 px-1.5 py-0.5 text-[8px] text-brand-green">
                    {order.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-white/15 py-3 text-[11px] text-brand-slate">
                Panel analítico
              </div>
            )}
          </div>
        </div>

        {showSalesChart && (
          <div className="mt-2 flex min-h-0 flex-1 flex-col gap-2">
            <SalesByHourLineChart
              key={tab.id}
              compact
              className="shrink-0"
              data={tab.salesByHour}
              accent={tab.accent}
            />
            {showBottomWidgets && (
              <div className="min-h-[5.5rem] flex-1">
                <DashboardBottomWidgets
                  stockAlerts={tab.stockAlerts!}
                  productRanking={tab.productRanking!}
                  accent={tab.accent}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function ModuleExplorer() {
  const [activeId, setActiveId] = useState(MODULE_TABS[0].id);
  const active = MODULE_TABS.find((t) => t.id === activeId) ?? MODULE_TABS[0];

  return (
    <div className="overflow-hidden rounded-2xl border border-white bg-brand-navy/40 shadow-2xl backdrop-blur-sm">
      <div className="grid gap-4 p-3 sm:p-4 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] lg:items-stretch lg:gap-0 lg:p-0">
        <div className="flex flex-col gap-1 lg:border-r lg:border-white lg:p-4">
          <div className="border-b border-white/15 pb-2">
            <p className="font-display text-sm font-bold leading-none">
              <span className="text-brand-soft">Resto</span>
              <span className="text-brand-gold">-FADEY</span>
              <span className="ml-1.5 text-xs font-semibold text-brand-mist">— Módulos</span>
            </p>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {MODULE_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === activeId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveId(tab.id)}
                  className={cn(
                    'group flex min-w-[180px] shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-left transition-all duration-300 lg:min-w-0 lg:w-full',
                    isActive
                      ? 'border-brand-cyan/40 bg-brand-cyan/15 shadow-glow-cyan'
                      : 'border-white/10 bg-white/5 hover:border-brand-cyan/25 hover:bg-white/10'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4 shrink-0',
                      isActive ? 'text-brand-cyan' : 'text-brand-mist group-hover:text-brand-cyan'
                    )}
                  />
                  <span
                    className={cn(
                      'text-xs font-medium',
                      isActive ? 'text-brand-soft' : 'text-brand-mist'
                    )}
                  >
                    {tab.label}
                  </span>
                  {isActive && <ChevronRight className="ml-auto h-3.5 w-3.5 text-brand-cyan" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex min-h-0 min-w-0 flex-col lg:p-4">
          <AnimatePresence mode="wait">
            <ModulePreview key={active.id} tab={active} />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
