import type { Metadata } from 'next';
import Link from 'next/link';
import { Pricing } from '@/sections/Pricing';

export const metadata: Metadata = {
  title: 'Planes y Precios',
  description: 'Conoce los planes de Resto Fadey: Básico, Pro y Premium para tu restaurante.',
};

export default function PlanesPage() {
  return (
    <>
      <section className="pt-32 pb-8 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            Planes para cada <span className="gradient-text">restaurante</span>
          </h1>
          <p className="mt-4 text-gray-400">
            Elige el plan ideal y empieza a modernizar tu negocio hoy.
          </p>
        </div>
      </section>
      <Pricing />
      <div className="pb-16 text-center">
        <Link href="/" className="text-sm text-gray-400 hover:text-white">
          ← Volver al inicio
        </Link>
      </div>
    </>
  );
}
