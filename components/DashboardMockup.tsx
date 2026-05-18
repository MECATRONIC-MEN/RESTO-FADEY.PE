'use client';

import { motion } from 'framer-motion';

const STATS = [
  { label: 'Ventas hoy', value: 'S/ 4,280' },
  { label: 'Pedidos', value: '127' },
  { label: 'Mesas activas', value: '18/24' },
];

const ORDERS = ['Lomo saltado x2', 'Ceviche mixto', 'Chicha morada'];

export function DashboardMockup() {
  return (
    <motion.div
      animate={{ y: [0, -15, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className="relative"
    >
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-brand-cyan/25 via-brand-blue/20 to-brand-gold/15 blur-2xl" />
      <motion.div className="glass relative overflow-hidden rounded-2xl border border-white/20 shadow-2xl">
        <motion.div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
          <motion.div className="h-3 w-3 rounded-full bg-red-500/80" />
          <motion.div className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <motion.div className="h-3 w-3 rounded-full bg-green-500/80" />
          <span className="ml-4 text-xs text-gray-500">Resto Fadey — Dashboard</span>
        </motion.div>
        <motion.div className="p-6">
          <motion.div className="grid grid-cols-3 gap-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="rounded-xl p-4"
                style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15), transparent)' }}
              >
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className="mt-1 font-display text-xl font-bold">{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>
          <motion.div className="mt-6 space-y-3">
            {ORDERS.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3"
              >
                <span className="text-sm">{item}</span>
                <span className="rounded-full bg-brand-green/20 px-2 py-0.5 text-xs text-brand-green">
                  En cocina
                </span>
              </motion.div>
            ))}
          </motion.div>
          <motion.div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '75%' }}
              transition={{ delay: 1.2, duration: 1 }}
              className="h-full rounded-full bg-gradient-to-r from-brand-cyan to-brand-blue"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
