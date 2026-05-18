'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ContactInfo } from '@/components/ContactInfo';
import { Button } from '@/components/ui/Button';
import { CONTACT } from '@/lib/constants';
import { getWhatsAppUrl } from '@/lib/utils';
import Link from 'next/link';

export function Contact() {
  return (
    <section id="contacto" className="section-padding relative">
      <div className="relative mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10 xl:px-14">
        <SectionHeader
          badge="Contacto"
          title="Hablemos de tu restaurante"
          highlightLast="tu restaurante"
          subtitle="Escríbenos por correo, teléfono, WhatsApp o Messenger. Te respondemos a la brevedad."
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 lg:p-10"
          >
            <ContactInfo />
            <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-8 text-gray-400">
              <MapPin className="h-5 w-5 shrink-0 text-brand-blue" />
              <span className="text-sm">Atendemos restaurantes en {CONTACT.location}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <h3 className="font-display text-2xl font-bold text-white">
              ¿Listo para una demo gratuita?
            </h3>
            <p className="mt-4 text-gray-400">
              Cuéntanos sobre tu negocio y te mostramos cómo Resto-FADEY puede ayudarte a vender
              más y operar mejor.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href={getWhatsAppUrl()} variant="green" external>
                WhatsApp
              </Button>
              <Button href={`mailto:${CONTACT.email}`} variant="secondary" external>
                Enviar correo
              </Button>
              <Button href="/demo" variant="primary">
                Solicitar demo
              </Button>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              También puedes ver el{' '}
              <Link href="/contacto" className="text-brand-blue hover:underline">
                formulario de contacto
              </Link>
              .
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
