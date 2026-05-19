import { ContactInfo } from '@/components/ContactInfo';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { getWhatsAppUrl } from '@/lib/utils';
import { MessageCircle } from 'lucide-react';

export default function SoportePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-soft sm:text-3xl">Soporte</h1>
        <p className="mt-2 text-sm text-brand-mist">
          Estamos disponibles para ayudarte con tu POS, licencia y capacitación.
        </p>
      </div>

      <DashboardCard title="Canales de contacto">
        <ContactInfo />
      </DashboardCard>

      <DashboardCard title="WhatsApp rápido">
        <p className="mb-4 text-sm text-brand-mist">
          Escríbenos y un asesor te responderá a la brevedad.
        </p>
        <a
          href={getWhatsAppUrl('Hola, necesito soporte con mi panel Resto Fadey.')}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          Abrir WhatsApp
        </a>
      </DashboardCard>
    </div>
  );
}
