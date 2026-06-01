import type { License } from '@/lib/domain/types';

/** Días que se suman al vencimiento al aprobar un pago */
export const LICENSE_RENEWAL_DAYS = 30;

export function formatLicenseExpiry(lic: Pick<License, 'neverExpires' | 'expiresAt'>): string {
  if (lic.neverExpires) return 'Sin vencimiento';
  if (!lic.expiresAt) return '—';
  return new Date(lic.expiresAt).toLocaleDateString('es-PE');
}

export function toDateInputValue(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
}
