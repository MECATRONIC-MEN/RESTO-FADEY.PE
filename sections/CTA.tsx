'use client';

import { motion } from 'framer-motion';
import { Play, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getWhatsAppUrl } from '@/lib/utils';

export function CTA() {
  return (
    <section className="section-padding">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/20"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan/30 via-brand-blue/25 to-brand-gold/15" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,201,244,0.22),transparent_50%)]" />
        <div className="relative px-8 py-16 text-center sm:px-16 sm:py-20">
          <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
            Moderniza tu restaurante <span className="gradient-text">hoy</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-brand-mist">
            Únete a cientos de restaurantes en Perú que ya confían en Resto Fadey.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href="/demo" variant="primary" size="lg">
              <Play size={20} />
              Solicitar demo
            </Button>
            <Button href={getWhatsAppUrl()} variant="green" size="lg" external>
              <MessageCircle size={20} />
              Contactar por WhatsApp
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
