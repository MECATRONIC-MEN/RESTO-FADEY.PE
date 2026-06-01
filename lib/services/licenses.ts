import { MOCK_LICENSES, MOCK_CLIENTS } from '@/lib/domain/mock-store';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { License, LicenseStatus } from '@/lib/domain/types';
import { LICENSE_RENEWAL_DAYS } from '@/lib/utils/license-expiry';

export { LICENSE_RENEWAL_DAYS };

function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function parseExpiresAtInput(dateStr: string): string {
  const trimmed = dateStr.trim();
  if (!trimmed) throw new Error('Indique la fecha de vencimiento');
  const d = new Date(`${trimmed}T23:59:59`);
  if (Number.isNaN(d.getTime())) throw new Error('Fecha de vencimiento inválida');
  return d.toISOString();
}

export type UpdateLicenseExpirationInput = {
  neverExpires: boolean;
  /** YYYY-MM-DD — requerido si neverExpires es false */
  expiresAt?: string | null;
};

/** Activa o renueva licencia tras aprobación de pago (+30 días si tiene vencimiento) */
export async function activateLicenseForPayment(
  clientId: string
): Promise<LicenseStatus> {
  if (!isSupabaseConfigured()) {
    const client = MOCK_CLIENTS.find((c) => c.id === clientId);
    const lic = MOCK_LICENSES.find((l) => l.clientId === clientId);
    if (lic) {
      lic.status = 'activo';
      if (!lic.neverExpires) {
        const base =
          lic.expiresAt && new Date(lic.expiresAt) > new Date()
            ? lic.expiresAt
            : new Date().toISOString();
        lic.expiresAt = addDays(base, LICENSE_RENEWAL_DAYS);
      }
    }
    if (client) {
      client.licenseStatus = 'activo';
      if (lic && !lic.neverExpires) client.licenseExpiresAt = lic.expiresAt ?? undefined;
    }
    return 'activo';
  }

  const db = getSupabaseAdmin()!;
  const { data: lic } = await db
    .from('licenses')
    .select('id, expires_at, never_expires, status')
    .eq('client_id', clientId)
    .maybeSingle();

  const now = new Date().toISOString();
  const neverExpires = Boolean(lic?.never_expires);

  if (lic?.id) {
    const patch: Record<string, unknown> = { status: 'activo' };
    if (!neverExpires) {
      const newExpires = lic.expires_at
        ? addDays(
            new Date(lic.expires_at as string) > new Date() ? (lic.expires_at as string) : now,
            LICENSE_RENEWAL_DAYS
          )
        : addDays(now, LICENSE_RENEWAL_DAYS);
      patch.expires_at = newExpires;
    }
    await db.from('licenses').update(patch).eq('id', lic.id);
  }

  await db
    .from('clients')
    .update({ last_activity_at: now, payment_status: 'approved' })
    .eq('id', clientId);

  return 'activo';
}

export async function updateLicenseExpiration(
  licenseId: string,
  input: UpdateLicenseExpirationInput
): Promise<License> {
  const neverExpires = Boolean(input.neverExpires);
  let expiresAt: string | null = null;

  if (!neverExpires) {
    expiresAt = parseExpiresAtInput(input.expiresAt ?? '');
  }

  if (!isSupabaseConfigured()) {
    const lic = MOCK_LICENSES.find((l) => l.id === licenseId);
    if (!lic) throw new Error('Licencia no encontrada');
    lic.neverExpires = neverExpires;
    lic.expiresAt = expiresAt;
    const client = MOCK_CLIENTS.find((c) => c.id === lic.clientId);
    if (client) client.licenseExpiresAt = neverExpires ? undefined : (expiresAt ?? undefined);
    return { ...lic };
  }

  const db = getSupabaseAdmin()!;
  const { data, error } = await db
    .from('licenses')
    .update({
      never_expires: neverExpires,
      expires_at: neverExpires ? null : expiresAt,
    })
    .eq('id', licenseId)
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Licencia no encontrada');

  return mapLicenseRow(data);
}

function mapLicenseRow(l: Record<string, unknown>): License {
  return {
    id: l.id as string,
    clientId: l.client_id as string,
    planId: l.plan_id as string,
    status: l.status as LicenseStatus,
    licenseKey: l.license_key as string,
    expiresAt: (l.expires_at as string) ?? null,
    neverExpires: Boolean(l.never_expires),
    modulesEnabled: (l.modules_enabled as string[]) ?? [],
    createdAt: l.created_at as string,
  };
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

export async function deleteLicenseById(licenseId: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const idx = MOCK_LICENSES.findIndex((l) => l.id === licenseId);
    if (idx === -1) throw new Error('Licencia no encontrada');
    const lic = MOCK_LICENSES[idx];
    MOCK_LICENSES.splice(idx, 1);
    const client = MOCK_CLIENTS.find((c) => c.id === lic.clientId);
    if (client) {
      client.licenseId = '';
      client.licenseStatus = 'prueba';
    }
    return;
  }

  const db = getSupabaseAdmin()!;
  const { data: lic, error: fetchErr } = await db
    .from('licenses')
    .select('id, client_id')
    .eq('id', licenseId)
    .maybeSingle();

  if (fetchErr) throw new Error(fetchErr.message);
  if (!lic) throw new Error('Licencia no encontrada');

  const { error: delErr } = await db.from('licenses').delete().eq('id', licenseId);
  if (delErr) throw new Error(delErr.message);

  await db
    .from('clients')
    .update({ license_id: null })
    .eq('id', lic.client_id as string);
}
