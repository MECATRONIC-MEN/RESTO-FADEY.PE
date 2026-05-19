import { Tag } from 'lucide-react';
import { listActivePromotions } from '@/lib/services/academy-content';

export default async function PromocionesPage() {
  const promotions = await listActivePromotions();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-brand-soft">Promociones</h1>
        <p className="mt-2 text-brand-mist">
          Ofertas y beneficios activos para clientes Resto Fadey.
        </p>
      </div>

      {promotions.length === 0 ? (
        <p className="rounded-lg border border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-brand-mist">
          No hay promociones activas en este momento.
        </p>
      ) : (
        <ul className="space-y-3">
          {promotions.map((promo) => (
            <li
              key={promo.id}
              className="rounded-xl border border-brand-gold/20 bg-brand-gold/5 p-4"
            >
              <div className="flex items-start gap-3">
                <Tag className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold-light" />
                <div>
                  <p className="font-medium text-brand-soft">{promo.title}</p>
                  {promo.description && (
                    <p className="mt-1 text-sm text-brand-mist">{promo.description}</p>
                  )}
                  {promo.discountPercent != null && (
                    <p className="mt-2 text-xs text-brand-gold-light">
                      {promo.discountPercent}% de descuento
                    </p>
                  )}
                  {promo.endsAt && (
                    <p className="mt-1 text-xs text-brand-slate">
                      Válido hasta{' '}
                      {new Date(promo.endsAt).toLocaleDateString('es-PE', { dateStyle: 'medium' })}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
