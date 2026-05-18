import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description: 'Términos y condiciones de uso de Resto Fadey.',
};

export default function TerminosPage() {
  return (
    <section className="section-padding min-h-screen pt-32 pb-20">
      <div className="mx-auto max-w-3xl prose prose-invert">
        <h1 className="font-display text-4xl font-bold">Términos y Condiciones</h1>
        <p className="mt-6 text-gray-400">
          Al utilizar Resto Fadey, aceptas los siguientes términos y condiciones de uso del servicio.
        </p>
        <div className="mt-8 space-y-6 text-gray-400">
          <div>
            <h2 className="text-xl font-semibold text-white">1. Uso del servicio</h2>
            <p className="mt-2">
              Resto Fadey es un sistema POS para restaurantes. El usuario se compromete a utilizar el
              servicio de manera legal y conforme a la normativa peruana vigente.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">2. Facturación</h2>
            <p className="mt-2">
              Los planes se facturan mensualmente. El usuario puede cancelar su suscripción en cualquier
              momento con 30 días de anticipación.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">3. Datos y privacidad</h2>
            <p className="mt-2">
              Los datos del restaurante son propiedad del cliente. Resto Fadey implementa medidas de
              seguridad para proteger la información almacenada en la nube.
            </p>
          </div>
        </div>
        <Link href="/" className="mt-12 inline-block text-sm text-gray-400 hover:text-white">
          ← Volver al inicio
        </Link>
      </div>
    </section>
  );
}
