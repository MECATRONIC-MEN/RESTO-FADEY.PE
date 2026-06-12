'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { trackTikTokSubmitForm } from '@/lib/analytics/tiktok-client';
import { getWhatsAppUrl } from '@/lib/utils';

export function DemoRequestForm() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: '',
    businessName: '',
    phone: '',
    email: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/demos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          businessName: form.businessName,
          phone: form.phone,
          email: form.email,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      const id = json.data?.id as string | undefined;
      if (id) {
        trackTikTokSubmitForm({
          eventId: `demo_${id}`,
          contentName: 'solicitud_demo',
          email: form.email,
          phone: form.phone,
        });
      }

      setDone(true);
    } catch {
      alert('No pudimos enviar tu solicitud. Escríbenos por WhatsApp.');
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan/40';

  if (done) {
    return (
      <div className="mt-10 rounded-2xl border border-brand-cyan/25 bg-brand-cyan/10 p-8 text-center">
        <h2 className="font-display text-xl font-bold text-white">¡Solicitud enviada!</h2>
        <p className="mt-3 text-brand-mist">
          Un asesor de Resto Fadey te contactará pronto para agendar tu demostración.
        </p>
        <Button
          href={getWhatsAppUrl()}
          variant="green"
          external
          className="mt-6"
        >
          Escribir por WhatsApp
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-4 text-left">
      <div>
        <label htmlFor="nombre" className="mb-2 block text-sm font-medium text-brand-mist">
          Nombre completo
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          className={inputClass}
          placeholder="Tu nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="restaurante" className="mb-2 block text-sm font-medium text-brand-mist">
          Restaurante
        </label>
        <input
          id="restaurante"
          name="restaurante"
          type="text"
          required
          className={inputClass}
          placeholder="Mi Restaurante"
          value={form.businessName}
          onChange={(e) => setForm({ ...form, businessName: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="telefono" className="mb-2 block text-sm font-medium text-brand-mist">
          Teléfono
        </label>
        <input
          id="telefono"
          name="telefono"
          type="tel"
          required
          className={inputClass}
          placeholder="+51 935 968 198"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-brand-mist">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={inputClass}
          placeholder="correo@restaurante.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <button type="submit" disabled={loading} className="btn-primary mt-6 w-full disabled:opacity-60">
        {loading ? 'Enviando…' : 'Enviar solicitud'}
      </button>
    </form>
  );
}
