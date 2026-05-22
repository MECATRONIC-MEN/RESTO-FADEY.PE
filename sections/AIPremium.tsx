'use client';

import { motion } from 'framer-motion';
import { LayoutDashboard, Sparkles } from 'lucide-react';
import { ADMIN_INTELLIGENCE_HUB, AI_FEATURES } from '@/lib/landing-data';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { cn } from '@/lib/utils';

const TONE_GRADIENT: Record<NonNullable<(typeof AI_FEATURES)[0]['tone']>, string> = {
  cyan: 'from-brand-cyan/[0.12] via-brand-panel/50 to-brand-deep/90',
  blue: 'from-brand-blue/[0.14] via-brand-navy/55 to-brand-deep/92',
  slate: 'from-white/[0.08] via-brand-panel/45 to-brand-deep/88',
  gold: 'from-brand-gold/[0.14] via-brand-panel/48 to-brand-deep/90',
  teal: 'from-emerald-500/[0.1] via-brand-panel/50 to-brand-deep/90',
  indigo: 'from-indigo-400/[0.1] via-brand-navy/52 to-brand-deep/92',
};

const TONE_METRIC: Record<NonNullable<(typeof AI_FEATURES)[0]['tone']>, string> = {
  cyan: 'text-brand-sky',
  blue: 'text-brand-cyan',
  slate: 'text-brand-mist',
  gold: 'text-brand-gold-light',
  teal: 'text-emerald-300/90',
  indigo: 'text-indigo-300/90',
};

const PARTICLES = [
  { left: '8%', top: '18%', size: 3, delay: 0 },
  { left: '22%', top: '72%', size: 2, delay: 2 },
  { left: '78%', top: '24%', size: 4, delay: 1 },
  { left: '88%', top: '65%', size: 2, delay: 3 },
  { left: '52%', top: '12%', size: 2, delay: 4 },
];

function ActivityBars({ values, className }: { values: number[]; className?: string }) {
  return (
    <div className={cn('flex items-end gap-1', className)} aria-hidden>
      {values.map((h, i) => (
        <span
          key={i}
          className="ia-activity-bar w-1.5 rounded-full bg-brand-cyan/50"
          style={{
            height: `${Math.max(28, h * 0.32)}px`,
            animationDelay: `${i * 0.22}s`,
          }}
        />
      ))}
    </div>
  );
}

function AdminHubPanel() {
  const hub = ADMIN_INTELLIGENCE_HUB;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="ia-hub-panel relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-brand-deep/95 via-[#081c36] to-brand-navy/90 p-6 sm:p-8"
    >
      <div
        className="ia-hub-glow pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-brand-cyan/[0.07] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 rounded-full bg-brand-blue/[0.06] blur-3xl"
        aria-hidden
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-brand-cyan/25 bg-brand-cyan/10 shadow-[0_0_24px_rgba(59,201,244,0.12)]">
          <LayoutDashboard className="h-7 w-7 text-brand-sky" aria-hidden />
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2.5 py-1">
          <span className="ia-live-dot h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300/90">
            En línea
          </span>
        </div>
      </div>

      <h3 className="relative mt-6 font-display text-2xl font-bold tracking-tight text-brand-soft sm:text-[1.65rem]">
        {hub.title}
      </h3>
      <p className="relative mt-3 max-w-md text-sm leading-relaxed text-brand-mist">
        {hub.description}
      </p>

      <div className="relative mt-6 rounded-xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-slate">
            Actividad del sistema
          </span>
          <ActivityBars values={[55, 72, 48, 80, 62, 70]} />
        </div>
        <div className="space-y-2.5">
          {hub.statuses.map((s, i) => (
            <div key={s.label} className="flex items-center gap-3">
              <span
                className="ia-live-dot h-1.5 w-1.5 shrink-0 rounded-full bg-brand-cyan"
                style={{ animationDelay: `${i * 0.35}s` }}
              />
              <span className="min-w-0 flex-1 text-xs text-brand-mist">{s.label}</span>
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-brand-cyan/80 to-brand-sky/60"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.2 + i * 0.1 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-auto flex flex-col gap-2.5 pt-6">
        {hub.highlights.map((item) => (
          <div
            key={item}
            className="flex items-center gap-2.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-brand-soft transition-colors hover:border-brand-cyan/20 hover:bg-white/[0.06]"
          >
            <Sparkles className="h-4 w-4 shrink-0 text-brand-sky/90" aria-hidden />
            {item}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function IntelligenceFeatureCard({
  feature,
  index,
}: {
  feature: (typeof AI_FEATURES)[0];
  index: number;
}) {
  const tone = feature.tone ?? 'cyan';
  const activity = feature.activity ?? [40, 60, 50, 70, 45];

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'ia-feature-card group relative flex h-full min-h-[7.5rem] flex-col overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br p-5 backdrop-blur-md',
        TONE_GRADIENT[tone]
      )}
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/[0.03] blur-2xl transition-opacity group-hover:opacity-80"
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-2">
        <p
          className={cn(
            'text-[10px] font-semibold uppercase tracking-wider',
            TONE_METRIC[tone]
          )}
        >
          {feature.metric}
        </p>
        <ActivityBars values={activity} className="opacity-70" />
      </div>
      <h4 className="relative mt-2 font-display text-lg font-semibold text-brand-soft">
        {feature.title}
      </h4>
      <p className="relative mt-1.5 flex-1 text-sm leading-relaxed text-brand-mist/95">
        {feature.description}
      </p>
      <div className="relative mt-3 flex gap-1" aria-hidden>
        {[0, 1, 2].map((d) => (
          <span
            key={d}
            className="ia-live-dot h-1 w-1 rounded-full bg-brand-cyan/60"
            style={{ animationDelay: `${index * 0.2 + d * 0.4}s` }}
          />
        ))}
      </div>
    </motion.article>
  );
}

export function AIPremium() {
  return (
    <section
      id="ia"
      className="ia-intelligence section-padding relative scroll-mt-24 overflow-hidden"
    >
      <div className="ia-intelligence-grid pointer-events-none absolute inset-0 z-0 opacity-80" aria-hidden />
      <div className="ia-intelligence-neural pointer-events-none absolute inset-0 z-0" aria-hidden />
      <div className="ia-intelligence-waves pointer-events-none absolute inset-0 z-0" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_30%_20%,rgba(27,140,255,0.07),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_85%_70%,rgba(59,201,244,0.05),transparent_55%)]"
        aria-hidden
      />

      {PARTICLES.map((p) => (
        <span
          key={`${p.left}-${p.top}`}
          className="ia-particle pointer-events-none absolute hidden rounded-full bg-brand-cyan/30 md:block"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
          }}
          aria-hidden
        />
      ))}

      <div className="section-shell-content relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            badge="Asistencia Para Tu Adminnistracion"
            title="Administración inteligente para restaurantes modernos-"
            highlightLast="IA"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mx-auto mt-4 max-w-3xl text-center text-sm leading-relaxed text-brand-mist sm:text-base"
        >
          El sistema analiza continuamente tu operación para ayudarte a administrar mejor ventas,
          inventario, requerimientos, personal y rendimiento del restaurante.
        </motion.p>

        <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:items-stretch">
          <AdminHubPanel />
          <div className="grid h-full auto-rows-fr gap-4 sm:grid-cols-2">
            {AI_FEATURES.map((feature, i) => (
              <IntelligenceFeatureCard key={feature.title} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
