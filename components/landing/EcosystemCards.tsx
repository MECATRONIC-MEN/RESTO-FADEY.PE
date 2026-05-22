'use client';

import { ECOSYSTEM_CARDS } from '@/lib/landing-data';
import { AnimatedBorderCard } from '@/components/landing/AnimatedBorderCard';
import { cn } from '@/lib/utils';

export function EcosystemCards() {
  return (
    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
      {ECOSYSTEM_CARDS.map((card, index) => {
        const Icon = card.icon;
        const isGold = card.accent === 'gold';

        return (
          <AnimatedBorderCard
            key={card.title}
            variant="tech"
            borderWeight="ecosystem"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            whileHover={{ y: -6 }}
            innerClassName="group p-5"
          >
            <div
              className={cn(
                'relative mb-3 inline-flex rounded-xl border p-2.5 transition-transform duration-300 group-hover:scale-110',
                isGold
                  ? 'border-brand-gold/30 bg-brand-gold/10'
                  : 'border-brand-cyan/30 bg-brand-cyan/10'
              )}
            >
              <Icon
                className={cn('h-6 w-6', isGold ? 'text-brand-gold-light' : 'text-brand-cyan')}
                aria-hidden
              />
            </div>
            <h3 className="relative font-display text-lg font-semibold text-brand-soft">
              {card.title}
            </h3>
            <p className="relative mt-1.5 text-sm leading-relaxed text-brand-mist">
              {card.description}
            </p>
          </AnimatedBorderCard>
        );
      })}
    </div>
  );
}
