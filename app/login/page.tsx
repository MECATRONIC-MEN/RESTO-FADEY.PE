import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { Logo } from '@/components/Logo';

export const metadata: Metadata = {
  title: 'Iniciar sesión',
  description: 'Accede a tu panel Resto Fadey.',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-app px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-brand-cyan/20 blur-3xl" />
        <div className="absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-brand-gold/12 blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" href="/" />
        </div>
        <div className="glass-card border-brand-cyan/20 p-8 shadow-glow-cyan">
          <h1 className="font-display text-2xl font-bold text-brand-soft">Iniciar sesión</h1>
          <p className="mt-2 text-sm text-brand-mist">
            Ingresa con las credenciales que te asignó el equipo Resto Fadey.
          </p>
          <div className="mt-8">
            <Suspense fallback={<p className="text-sm text-brand-slate">Cargando…</p>}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-brand-slate">
          ¿Aún no tienes acceso?{' '}
          <Link href="/register" className="font-medium text-brand-gold-light hover:underline">
            Solicitar acceso
          </Link>
        </p>
      </div>
    </div>
  );
}
