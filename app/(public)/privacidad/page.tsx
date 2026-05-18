import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad y protección de datos de Resto Fadey.',
};

export default function PrivacidadPage() {
  return (
    <section className="section-padding min-h-screen pt-32 pb-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-bold">Política de Privacidad</h1>
        <p className="mt-6 text-gray-400">
          En Resto Fadey respetamos tu privacidad y protegemos tus datos personales conforme a la
          legislación peruana.
        </p>
        <div className="mt-8 space-y-6 text-gray-400">
          <div>
            <h2 className="text-xl font-semibold text-white">Datos que recopilamos</h2>
            <p className="mt-2">
              Recopilamos información de contacto, datos del restaurante y datos operativos necesarios
              para el funcionamiento del sistema POS.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Uso de la información</h2>
            <p className="mt-2">
              Utilizamos tus datos exclusivamente para prestar el servicio, mejorar la plataforma y
              brindar soporte técnico.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Seguridad</h2>
            <p className="mt-2">
              Implementamos cifrado, backups automáticos y controles de acceso para proteger tu
              información.
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
