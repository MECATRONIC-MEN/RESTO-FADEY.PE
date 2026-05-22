'use client';

import { motion } from 'framer-motion';
import { Play, MessageCircle, Mail, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SectionBackdrop } from '@/components/landing/SectionBackdrop';
import { CONTACT } from '@/lib/constants';
import { getWhatsAppUrl } from '@/lib/utils';

const PARTICLES = [
  { left: '8%', top: '18%', delay: 0 },
  { left: '22%', top: '72%', delay: 0.4 },
  { left: '45%', top: '12%', delay: 0.8 },
  { left: '68%', top: '65%', delay: 0.2 },
  { left: '85%', top: '28%', delay: 0.6 },
  { left: '92%', top: '78%', delay: 1 },
  { left: '55%', top: '88%', delay: 0.3 },
  { left: '12%', top: '42%', delay: 0.9 },
];

export function CTA() {
  return (
    <section id="cta-final" className="section-padding relative scroll-mt-24 overflow-hidden">
      <SectionBackdrop variant="contract" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="contract-cta-card section-shell-content relative mx-auto max-w-5xl overflow-hidden rounded-3xl border"
      >
        <div className="contract-cta-card__grid pointer-events-none absolute inset-0" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(59,201,244,0.18),transparent_50%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(212,175,55,0.06),transparent_45%)]"
          aria-hidden
        />

        {PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute h-1 w-1 rounded-full bg-brand-cyan/60 shadow-[0_0_8px_rgba(59,201,244,0.8)]"
            style={{ left: p.left, top: p.top }}
            animate={{ opacity: [0.3, 0.9, 0.3], scale: [1, 1.4, 1] }}
            transition={{ duration: 3 + i * 0.3, repeat: Infinity, delay: p.delay }}
          />
        ))}

        <div className="relative px-6 py-14 text-center sm:px-14 sm:py-16">
          <h2 className="font-display text-2xl font-bold leading-tight text-brand-soft sm:text-3xl lg:text-4xl">
            Transforma tu restaurante con tecnología inteligente.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-brand-mist sm:text-base">
            Automatiza operaciones, optimiza tu gestión y controla todo tu restaurante desde una
            sola plataforma inteligente.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Button href="/demo" variant="premium" size="lg">
              <Play size={20} />
              Agendar Demo
            </Button>
            <Button href={getWhatsAppUrl()} variant="green" size="lg" external>
              <MessageCircle size={20} />
              WhatsApp
            </Button>
            <Button href={`mailto:${CONTACT.email}`} variant="secondary" size="lg" external>
              <Mail size={20} />
              Correo
            </Button>
            <Button href={CONTACT.facebookUrl} variant="secondary" size="lg" external>
              <Facebook size={20} />
              Facebook
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
