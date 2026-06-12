'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { trackTikTokSubmitForm } from '@/lib/analytics/tiktok-client';
import { getWhatsAppUrl } from '@/lib/utils';

const PLANS = ['Básico', 'Pro', 'Premium'] as const;

export function LeadSurveyForm() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    planInterest: 'Pro',
    employees: '1-5',
    hasPos: 'no',
    message: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          businessName: form.businessName,
          planInterest: form.planInterest,
          message: form.message,
          survey: {
            employees: form.employees,
            hasPos: form.hasPos,
          },
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      const id = json.data?.id as string | undefined;
      if (id) {
        trackTikTokSubmitForm({
          eventId: `lead_${id}`,
          contentName: 'registro_interes',
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

  if (done) {
    return (
      <div className="glass-card mx-auto max-w-xl border-brand-gold/30 p-8 text-center">
        <h3 className="font-display text-xl font-bold text-brand-soft">¡Solicitud recibida!</h3>
        <p className="mt-3 text-brand-mist">
          Un asesor de Resto Fadey te contactará para activar tu acceso. No creamos cuentas
          automáticas.
        </p>
        <Button href={getWhatsAppUrl()} variant="primary" external className="mt-6">
          Escribir por WhatsApp
        </Button>
      </div>
    );
  }

  const inputClass =
    'w-full rounded-lg border border-brand-cyan/20 bg-white/10 px-4 py-2.5 text-sm text-brand-soft placeholder:text-brand-slate focus:border-brand-cyan/50 focus:outline-none';

  return (
    <form onSubmit={handleSubmit} className="glass-card mx-auto max-w-xl space-y-4 border-brand-cyan/20 p-6 sm:p-8">
      <h3 className="font-display text-xl font-bold text-brand-soft">Solicita acceso</h3>
      <p className="text-sm text-brand-mist">Encuesta comercial — sin registro automático.</p>

      <input className={inputClass} placeholder="Tu nombre *" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input className={inputClass} type="email" placeholder="Email *" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input className={inputClass} placeholder="WhatsApp / teléfono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <input className={inputClass} placeholder="Nombre del restaurante *" required value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />

      <label className="block text-sm text-brand-mist">
        Plan de interés
        <select
          className={`${inputClass} mt-1`}
          value={form.planInterest}
          onChange={(e) => setForm({ ...form, planInterest: e.target.value })}
        >
          {PLANS.map((p) => (
            <option key={p} value={p} className="bg-brand-navy">
              {p}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm text-brand-mist">
        ¿Cuántos empleados?
        <select className={`${inputClass} mt-1`} value={form.employees} onChange={(e) => setForm({ ...form, employees: e.target.value })}>
          <option value="1-5" className="bg-brand-navy">1-5</option>
          <option value="6-15" className="bg-brand-navy">6-15</option>
          <option value="16+" className="bg-brand-navy">16+</option>
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm text-brand-mist">
        <input type="checkbox" checked={form.hasPos === 'si'} onChange={(e) => setForm({ ...form, hasPos: e.target.checked ? 'si' : 'no' })} />
        Ya uso otro sistema POS
      </label>

      <textarea className={`${inputClass} min-h-[80px]`} placeholder="Mensaje opcional" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />

      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
        {loading ? 'Enviando…' : 'Enviar solicitud'}
      </button>
    </form>
  );
}
