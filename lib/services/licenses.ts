import { MOCK_LICENSES, MOCK_CLIENTS } from '@/lib/domain/mock-store';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { LicenseStatus } from '@/lib/domain/types';

const RENEWAL_DAYS = 30;

function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

/** Activa o renueva licencia tras aprobación de pago */
export async function activateLicenseForPayment(
  clientId: string
): Promise<LicenseStatus> {
  if (!isSupabaseConfigured()) {
    const client = MOCK_CLIENTS.find((c) => c.id === clientId);
    const lic = MOCK_LICENSES.find((l) => l.clientId === clientId);
    if (lic) {
      lic.status = 'activo';
      const base = new Date(lic.expiresAt) > new Date() ? lic.expiresAt : new Date().toISOString();
      lic.expiresAt = addDays(base, RENEWAL_DAYS);
    }
    if (client) client.licenseStatus = 'activo';
    return 'activo';
  }

  const db = getSupabaseAdmin()!;
  const { data: lic } = await db
    .from('licenses')
    .select('id, expires_at, status')
    .eq('client_id', clientId)
    .maybeSingle();

  const now = new Date().toISOString();
  const newExpires = lic?.expires_at
    ? addDays(new Date(lic.expires_at) > new Date() ? (lic.expires_at as string) : now, RENEWAL_DAYS)
    : addDays(now, RENEWAL_DAYS);

  if (lic?.id) {
    await db
      .from('licenses')
      .update({ status: 'activo', expires_at: newExpires })
      .eq('id', lic.id);
  }

  await db
    .from('clients')
    .update({ last_activity_at: now })
    .eq('id', clientId);

  return 'activo';
}

export async function getLicenseStatusForClient(clientId: string): Promise<LicenseStatus> {
  if (!isSupabaseConfigured()) {
    const client = MOCK_CLIENTS.find((c) => c.id === clientId);
    return client?.licenseStatus ?? 'prueba';
  }

  const db = getSupabaseAdmin()!;
  const { data } = await db
    .from('licenses')
    .select('status')
    .eq('client_id', clientId)
    .maybeSingle();

  return (data?.status as LicenseStatus) ?? 'prueba';
}
