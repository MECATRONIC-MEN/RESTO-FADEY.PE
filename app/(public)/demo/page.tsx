import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { getWhatsAppUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Solicitar Demo',
  description: 'Solicita una demostración gratuita de Resto Fadey para tu restaurante.',
};

export default function DemoPage() {
  return (
    <section className="section-padding min-h-screen pt-32 pb-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="mb-4 inline-block rounded-full border border-brand-blue/30 bg-brand-blue/10 px-4 py-1.5 text-sm font-medium text-brand-blue">
          Demo gratuita
        </span>
        <h1 className="font-display text-4xl font-bold sm:text-5xl">
          Solicita tu <span className="gradient-text">demostración</span>
        </h1>
        <p className="mt-6 text-lg text-gray-400">
          Descubre cómo Resto Fadey puede transformar la operación de tu restaurante.
        </p>
        <form className="mt-10 space-y-4 text-left">
          <div>
            <label htmlFor="nombre" className="mb-2 block text-sm font-medium text-gray-300">
              Nombre completo
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-brand-blue focus:outline-none"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label htmlFor="restaurante" className="mb-2 block text-sm font-medium text-gray-300">
              Restaurante
            </label>
            <input
              id="restaurante"
              name="restaurante"
              type="text"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-brand-blue focus:outline-none"
              placeholder="Mi Restaurante"
            />
          </div>
          <div>
            <label htmlFor="telefono" className="mb-2 block text-sm font-medium text-gray-300">
              Teléfono
            </label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-brand-blue focus:outline-none"
              placeholder="+51 935 968 198"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-brand-blue focus:outline-none"
              placeholder="correo@restaurante.com"
            />
          </div>
          <Button type="submit" variant="primary" className="mt-6 w-full">
            Enviar solicitud
          </Button>
        </form>
        <p className="mt-6 text-sm text-gray-500">
          O por{' '}
          <a href={getWhatsAppUrl()} className="text-brand-green hover:underline" target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        </p>
        <Link href="/" className="mt-8 inline-block text-sm text-gray-400 hover:text-white">
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
