import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ContactInfo } from '@/components/ContactInfo';
import { CONTACT } from '@/lib/constants';
import { getWhatsAppUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Contacto',
  description: `Contáctanos: ${CONTACT.email} | ${CONTACT.phoneDisplay} | WhatsApp y Messenger.`,
};

export default function ContactoPage() {
  return (
    <section className="section-padding min-h-screen pt-32 pb-20">
      <div className="mx-auto max-w-4xl px-4">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            <span className="gradient-text">Contáctanos</span>
          </h1>
          <p className="mt-4 text-gray-400">
            Estamos listos para ayudarte a modernizar tu restaurante.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="glass-card p-8">
            <h2 className="font-display text-xl font-semibold text-white">Información de contacto</h2>
            <ContactInfo className="mt-6" />
            <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6 text-sm text-gray-400">
              <MapPin className="h-4 w-4 text-brand-blue" />
              {CONTACT.location}
            </div>
            <Button href={getWhatsAppUrl()} variant="green" external className="mt-8 w-full">
              <MessageCircle size={18} />
              Escribir por WhatsApp
            </Button>
          </div>

          <form
            className="glass-card space-y-4 p-8"
            action={`mailto:${CONTACT.email}?subject=Consulta desde restofadey.pe`}
            method="post"
            encType="text/plain"
          >
            <h2 className="font-display text-xl font-semibold text-white">Envíanos un mensaje</h2>
            <div>
              <label htmlFor="contacto-nombre" className="mb-2 block text-sm text-gray-300">
                Nombre
              </label>
              <input
                id="contacto-nombre"
                name="nombre"
                type="text"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-brand-blue focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="contacto-email" className="mb-2 block text-sm text-gray-300">
                Tu correo
              </label>
              <input
                id="contacto-email"
                name="email"
                type="email"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-brand-blue focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="contacto-mensaje" className="mb-2 block text-sm text-gray-300">
                Mensaje
              </label>
              <textarea
                id="contacto-mensaje"
                name="mensaje"
                rows={4}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-brand-blue focus:outline-none"
              />
            </div>
            <Button type="submit" variant="primary" className="w-full">
              Enviar por correo
            </Button>
            <p className="text-center text-xs text-gray-500">
              Se abrirá tu cliente de correo con el mensaje dirigido a {CONTACT.email}
            </p>
          </form>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-white">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}

