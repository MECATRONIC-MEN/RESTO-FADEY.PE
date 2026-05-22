'use client';

import type { ReactNode } from 'react';
import { Check, Layers, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { PLANS, type Plan } from '@/lib/data';
import { PLAN_DISPLAY_NAMES } from '@/lib/landing-data';
import { AnimatedBorderCard } from '@/components/landing/AnimatedBorderCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

type PlanTier = 'basic' | 'pro' | 'premium';

function getPlanTier(plan: Plan): PlanTier {
  if (plan.highlighted) return 'premium';
  if (plan.name === 'Pro') return 'pro';
  return 'basic';
}

const INCLUDES_FROM_LABEL: Record<string, string> = {
  Básico: 'Básico',
  Pro: 'Intermedio',
};

function PlanCardBadge({ plan, tier }: { plan: Plan; tier: PlanTier }) {
  if (!plan.badge) return null;

  return (
    <span
      className={cn(
        'absolute left-1/2 top-0 z-20 -translate-x-1/2 whitespace-nowrap',
        tier === 'premium' && 'badge-premium shadow-none',
        tier === 'pro' && 'badge-tech-bright',
        tier === 'basic' && 'badge-basic'
      )}
    >
      {plan.badge}
    </span>
  );
}

function PlanCardContent({ plan }: { plan: Plan }) {
  const tier = getPlanTier(plan);

  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-2xl font-bold text-brand-soft">
          {PLAN_DISPLAY_NAMES[plan.name] ?? plan.name}
        </h3>
        {tier === 'premium' && (
          <Sparkles className="h-5 w-5 shrink-0 text-brand-gold-light" aria-hidden />
        )}
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap items-baseline gap-1">
          <span
            className={cn(
              'font-display text-4xl font-bold',
              tier === 'premium' && 'kpi-gold',
              tier === 'pro' && 'gradient-text',
              tier === 'basic' && 'text-brand-soft'
            )}
          >
            {plan.price}
          </span>
          <span className="text-brand-mist">{plan.period}</span>
        </div>
        {plan.semestralNote && (
          <p
            className={cn(
              'mt-2 inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium',
              tier === 'premium'
                ? 'border-brand-gold/35 bg-brand-gold/10 text-brand-gold-light'
                : 'border-white/15 bg-white/5 text-brand-mist'
            )}
          >
            {plan.semestralNote}
          </p>
        )}
      </div>

      <p
        className={cn(
          'mt-3 text-sm font-medium',
          tier === 'premium' && 'text-brand-gold-light',
          tier === 'pro' && 'text-brand-sky',
          tier === 'basic' && 'text-brand-mist'
        )}
      >
        {plan.tagline}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-brand-mist">{plan.description}</p>

      {plan.includesFrom && (
        <div
          className={cn(
            'mt-6 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium',
            tier === 'premium'
              ? 'border-brand-gold/25 bg-brand-gold/10 text-brand-gold-light'
              : 'border-brand-sky/35 bg-brand-sky/15 text-brand-sky'
          )}
        >
          <Layers className="h-4 w-4 shrink-0" />
          Incluye todo el Plan {INCLUDES_FROM_LABEL[plan.includesFrom!] ?? plan.includesFrom}, más:
        </div>
      )}

      <div className="mt-6 flex-1">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-slate">
          {plan.includesFrom ? 'Módulos adicionales' : 'Módulos incluidos'}
        </p>
        <ul className="space-y-3">
          {plan.modules.map((module) => (
            <li key={module} className="flex items-start gap-3 text-sm">
              <Check
                className={cn(
                  'mt-0.5 h-5 w-5 shrink-0',
                  tier === 'premium'
                    ? 'text-brand-gold-light'
                    : tier === 'pro'
                      ? 'text-brand-sky'
                      : 'text-brand-slate'
                )}
              />
              <span className="leading-snug text-brand-soft/95">{module}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 border-t border-white/10 pt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-slate">
          También incluye
        </p>
        <ul className="space-y-2">
          {plan.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2 text-xs text-brand-mist">
              <span
                className={cn(
                  'mt-1.5 h-1 w-1 shrink-0 rounded-full',
                  tier === 'premium' ? 'bg-brand-gold' : tier === 'pro' ? 'bg-brand-sky' : 'bg-brand-slate'
                )}
              />
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <Button
        href="/demo"
        variant={tier === 'premium' ? 'premium' : tier === 'pro' ? 'primary' : 'secondary'}
        className="mt-8 w-full"
      >
        Empezar ahora
      </Button>
    </>
  );
}

const PRICING_PARTICLES = [
  { left: '12%', top: '22%', size: 3, delay: 0 },
  { left: '78%', top: '18%', size: 2, delay: 1.2 },
  { left: '45%', top: '72%', size: 2, delay: 0.6 },
  { left: '88%', top: '55%', size: 3, delay: 2 },
  { left: '22%', top: '68%', size: 2, delay: 1.8 },
  { left: '62%', top: '38%', size: 2, delay: 0.3 },
];

export function Pricing() {
  return (
    <section
      id="planes"
      className="pricing-section section-padding relative scroll-mt-24 overflow-x-hidden"
    >
      <div className="pricing-bg-base pointer-events-none absolute inset-0" aria-hidden />
      <div className="pricing-bg-grid pointer-events-none absolute inset-0" aria-hidden />
      <div className="pricing-bg-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="pricing-bg-particles pointer-events-none absolute inset-0 z-0" aria-hidden>
        {PRICING_PARTICLES.map((p, i) => (
          <span
            key={i}
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#061528] to-transparent"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionHeader
          badge="Planes"
          title="Inversión clara, valor premium"
          subtitle="Comparativa moderna para escalar: empieza con lo esencial y crece hasta la suite empresarial con IA."
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-6 w-full max-w-7xl overflow-x-auto text-center text-[11px] whitespace-nowrap text-brand-mist sm:text-xs md:text-sm [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <span className="text-brand-cyan">Básico</span> → operación diaria ·{' '}
          <span className="text-brand-cyan">Intermedio</span> → inventario y facturación ·{' '}
          <span className="text-brand-gold">Empresarial</span> → inventario inteligente,
          requerimientos y asistencia administrativa total
        </motion.p>

        <div className="mt-16 grid items-stretch gap-8 pt-2 lg:grid-cols-3 lg:gap-10 lg:pt-4">
          {PLANS.map((plan, index) => {
            const tier = getPlanTier(plan);
            const hasBadge = Boolean(plan.badge);
            const motionProps = {
              initial: { opacity: 0, y: 30 } as const,
              whileInView: { opacity: 1, y: 0 } as const,
              viewport: { once: true } as const,
              transition: { delay: index * 0.1 },
              whileHover: {
                y: tier === 'premium' ? -8 : tier === 'pro' ? -6 : -4,
              } as const,
            };

            const wrap = (card: ReactNode) => (
              <div
                key={plan.name}
                className={cn('relative flex min-h-0 flex-col', hasBadge && 'pt-8')}
              >
                <PlanCardBadge plan={plan} tier={tier} />
                {card}
              </div>
            );

            if (tier === 'premium') {
              return wrap(
                <AnimatedBorderCard
                  variant="premium"
                  className="relative z-10 flex min-h-full flex-1 flex-col lg:scale-[1.04]"
                  innerClassName="relative flex flex-1 flex-col p-8"
                  {...motionProps}
                >
                  <PlanCardContent plan={plan} />
                </AnimatedBorderCard>
              );
            }

            if (tier === 'pro') {
              return wrap(
                <motion.article
                  {...motionProps}
                  className="relative flex min-h-full flex-1 flex-col rounded-2xl border border-brand-sky/35 bg-gradient-to-br from-white/[0.1] via-brand-panel/55 to-brand-navy/65 p-8 backdrop-blur-md transition-all duration-300 hover:border-brand-sky/50 hover:from-white/[0.12] hover:via-brand-panel/60 hover:to-brand-navy/70 hover:shadow-[0_0_22px_rgba(91,200,255,0.08)]"
                >
                  <PlanCardContent plan={plan} />
                </motion.article>
              );
            }

            return wrap(
              <motion.article
                {...motionProps}
                className="relative flex min-h-full flex-1 flex-col rounded-2xl border border-white/10 bg-white/[0.06] p-8 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]"
              >
                <PlanCardContent plan={plan} />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
