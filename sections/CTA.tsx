'use client';

import { motion } from 'framer-motion';
import { Play, MessageCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getWhatsAppUrl } from '@/lib/utils';

export function CTA() {
  return (
    <section className="section-padding">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="glow-border relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/20"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan/25 via-brand-blue/20 to-brand-gold/15" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,201,244,0.2),transparent_55%)]" />
        <div className="relative px-8 py-16 text-center sm:px-16 sm:py-20">
          <p className="badge-tech mb-4">Empieza hoy</p>
          <h2 className="font-display text-3xl font-bold text-brand-soft sm:text-4xl lg:text-5xl">
            Transforma tu restaurante con{' '}
            <span className="gradient-text">tecnología inteligente</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-brand-mist">
            Agenda una demo, escríbenos por WhatsApp o solicita información. Sin compromiso.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href="/demo" variant="premium" size="lg">
              <Play size={20} />
              Agendar Demo
            </Button>
            <Button href={getWhatsAppUrl()} variant="green" size="lg" external>
              <MessageCircle size={20} />
              WhatsApp
            </Button>
            <Button href="#contacto" variant="secondary" size="lg">
              <Mail size={20} />
              Solicitar información
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
