'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Wifi,
  ShieldCheck,
  Layers,
  UtensilsCrossed,
  GraduationCap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { FAQS } from '@/lib/data';
import { SectionBackdrop } from '@/components/landing/SectionBackdrop';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { cn } from '@/lib/utils';

const FAQ_ICONS: LucideIcon[] = [Wifi, ShieldCheck, Layers, UtensilsCrossed, GraduationCap];

function FAQAccordionItem({
  question,
  answer,
  icon: Icon,
  isOpen,
  onToggle,
  index,
}: {
  question: string;
  answer: string;
  icon: LucideIcon;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border backdrop-blur-md transition-all duration-300',
        isOpen
          ? 'border-brand-cyan/40 bg-white/[0.1] shadow-glow-cyan'
          : 'border-white/10 bg-white/[0.04] hover:border-brand-cyan/25 hover:bg-white/[0.07] hover:shadow-[0_0_32px_rgba(59,201,244,0.12)]'
      )}
    >
      <motion.div
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand-cyan/20 blur-3xl"
        animate={{ opacity: isOpen ? 0.7 : 0 }}
        transition={{ duration: 0.35 }}
        aria-hidden
      />

      <button
        type="button"
        onClick={onToggle}
        className="relative flex w-full items-start gap-4 p-5 text-left sm:gap-5 sm:p-6"
        aria-expanded={isOpen}
      >
        <span
          className={cn(
            'mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300',
            isOpen
              ? 'border-brand-cyan/45 bg-brand-cyan/15 text-brand-cyan'
              : 'border-white/10 bg-white/5 text-brand-cyan/80 group-hover:border-brand-cyan/30 group-hover:bg-brand-cyan/10'
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </span>

        <span className="min-w-0 flex-1 pt-1">
          <span
            className={cn(
              'block font-display text-base font-semibold leading-snug sm:text-lg',
              isOpen ? 'text-white' : 'text-brand-soft'
            )}
          >
            {question}
          </span>
        </span>

        <motion.span
          className={cn(
            'mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors',
            isOpen
              ? 'border-brand-cyan/35 bg-brand-cyan/15 text-brand-cyan'
              : 'border-white/10 bg-white/5 text-brand-mist group-hover:text-brand-cyan'
          )}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="relative border-t border-brand-cyan/15 px-5 pb-5 sm:px-6 sm:pb-6">
              <p className="text-sm leading-relaxed text-brand-mist sm:text-base">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-padding relative scroll-mt-24 overflow-hidden">
      <SectionBackdrop variant="faq" />

      <div className="section-shell-content mx-auto max-w-3xl">
        <SectionHeader
          badge="Preguntas frecuentes"
          title="Todo lo que necesitas saber antes de empezar"
          highlightLast="empezar"
          subtitle="Respuestas claras sobre conectividad, cumplimiento tributario, operación integral y acompañamiento. Tecnología confiable para hacer crecer tu restaurante."
        />

        <div className="mt-14 space-y-3 sm:space-y-4">
          {FAQS.map((faq, index) => (
            <FAQAccordionItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              icon={FAQ_ICONS[index] ?? Wifi}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              index={index}
            />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 text-center text-sm text-brand-mist"
        >
          ¿Más preguntas?{' '}
          <a href="/#cta-final" className="font-medium text-brand-cyan hover:underline">
            Agenda tu demo al final de la página
          </a>
        </motion.p>
      </div>
    </section>
  );
}
