import type { Metadata } from 'next';
import Link from 'next/link';
import { DemoRequestForm } from '@/components/demo/DemoRequestForm';
import { getWhatsAppUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Solicitar Demo',
  description: 'Solicita una demostración gratuita de Resto Fadey para tu restaurante.',
};

export default function DemoPage() {
  return (
    <section className="section-padding min-h-screen overflow-x-hidden pt-28 pb-20 sm:pt-32">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <span className="mb-4 inline-block rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-4 py-1.5 text-sm font-medium text-brand-cyan">
          Demo gratuita
        </span>
        <h1 className="font-display text-4xl font-bold sm:text-5xl">
          Solicita tu <span className="gradient-text">demostración</span>
        </h1>
        <p className="mt-6 text-lg text-brand-mist">
          Descubre cómo Resto Fadey puede transformar la operación de tu restaurante.
        </p>
        <DemoRequestForm />
        <p className="mt-6 text-sm text-brand-slate">
          O por{' '}
          <a
            href={getWhatsAppUrl()}
            className="text-brand-green hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        </p>
        <Link href="/" className="mt-8 inline-block text-sm text-brand-mist hover:text-white">
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
