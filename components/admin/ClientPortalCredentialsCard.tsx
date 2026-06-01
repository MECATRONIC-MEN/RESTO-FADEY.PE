'use client';

import { Copy } from 'lucide-react';
import type { ClientPortalCredentials } from '@/lib/domain/types';

interface ClientPortalCredentialsCardProps {
  credentials: ClientPortalCredentials;
  title?: string;
}

export function ClientPortalCredentialsCard({
  credentials,
  title = 'Acceso al panel del cliente',
}: ClientPortalCredentialsCardProps) {
  function copy(text: string, label: string) {
    void navigator.clipboard.writeText(text);
    alert(`${label} copiado`);
  }

  return (
    <div className="rounded-lg border border-brand-gold/30 bg-brand-gold/10 p-4">
      <p className="text-sm font-medium text-brand-gold-light">{title}</p>
      <p className="mt-1 text-xs text-brand-mist">
        Entregue estos datos al restaurante para ingresar en{' '}
        <span className="text-brand-cyan">/login</span> → panel cliente.
      </p>
      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex items-center justify-between gap-2">
          <dt className="text-brand-slate">Usuario</dt>
          <dd className="flex items-center gap-2 font-medium text-brand-soft">
            {credentials.username}
            <button
              type="button"
              onClick={() => copy(credentials.username, 'Usuario')}
              className="rounded p-1 text-brand-mist hover:bg-white/10"
              aria-label="Copiar usuario"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt className="text-brand-slate">Contraseña</dt>
          <dd className="flex items-center gap-2 font-mono text-brand-gold">
            {credentials.password}
            <button
              type="button"
              onClick={() => copy(credentials.password, 'Contraseña')}
              className="rounded p-1 text-brand-mist hover:bg-white/10"
              aria-label="Copiar contraseña"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt className="text-brand-slate">Correo de acceso</dt>
          <dd className="truncate font-mono text-[10px] text-brand-mist">{credentials.email}</dd>
        </div>
      </dl>
    </div>
  );
}
