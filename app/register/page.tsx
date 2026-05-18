import type { Metadata } from 'next';
import Link from 'next/link';
import { Pricing } from '@/sections/Pricing';
import { Benefits } from '@/sections/Benefits';
import { Button } from '@/components/ui/Button';
import { CONTACT } from '@/lib/constants';
import { getWhatsAppUrl } from '@/lib/utils';
import { Logo } from '@/components/Logo';
import { LeadSurveyForm } from '@/components/register/LeadSurveyForm';
import { PwaInstallTracker } from '@/components/PwaInstallTracker';

export const metadata: Metadata = {
  title: 'Obtén Resto Fadey — Solicita acceso',
  description:
    'Conoce nuestros planes, beneficios y solicita acceso a Resto Fadey. El equipo te contactará antes de activar tu cuenta.',
};

export default function RegisterPage() {
  const whatsappUrl = getWhatsAppUrl(
    'Hola, quiero solicitar acceso a Resto Fadey para mi restaurante.'
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-app">
      <PwaInstallTracker />
      <header className="glass-nav border-b border-brand-cyan/15">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <Logo href="/" />
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-brand-mist transition-colors hover:text-brand-cyan"
            >
              Iniciar sesión
            </Link>
            <Button href="/demo" variant="primary" size="sm">
              Solicitar demo
            </Button>
          </div>
        </div>
      </header>

      <section className="px-4 pb-12 pt-16 text-center sm:px-6">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-1 text-xs font-medium uppercase tracking-wider text-brand-gold">
            Solicita acceso
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold text-white sm:text-5xl">
            Obtén <span className="gradient-text">Resto Fadey</span>
          </h1>
          <p className="mt-4 text-lg text-brand-mist">
            No creamos cuentas automáticas. Conoce nuestros planes, contáctanos y te
            asignaremos acceso personalizado a tu restaurante.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href={whatsappUrl} variant="primary" external>
              Escribir por WhatsApp
            </Button>
            <Button href="/demo" variant="secondary">
              Agendar demo
            </Button>
            <Button href="/contacto" variant="ghost">
              Formulario de contacto
            </Button>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            WhatsApp: {CONTACT.phoneDisplay} · {CONTACT.email}
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6">
        <LeadSurveyForm />
      </section>

      <Benefits />
      <Pricing />

      <section className="border-t border-white/10 px-4 py-16 sm:px-6">
        <div className="glass-card mx-auto max-w-2xl border-brand-cyan/20 p-8 text-center">
          <h2 className="font-display text-2xl font-bold">¿Listo para empezar?</h2>
          <p className="mt-3 text-brand-mist">
            Un asesor revisará tu solicitud y el administrador creará tu usuario manualmente.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button href={whatsappUrl} variant="primary" external>
              Contactar ahora
            </Button>
            <Button href="/planes" variant="secondary">
              Ver planes en detalle
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-gray-500">
        <Link href="/" className="hover:text-white">
          ← Volver al inicio
        </Link>
      </footer>
    </div>
  );
}
