import { getClients as mockClients, getLicenses as mockLicenses, MOCK_PLANS } from '@/lib/domain/mock-store';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { License, LicenseStatus, PlanTier, PosConnectionStatus, SaasClient } from '@/lib/domain/types';

function mapClientRow(
  c: Record<string, unknown>,
  lic?: { id: string; status: LicenseStatus; expires_at?: string; plan_id?: string }
): SaasClient {
  const clientPlanId = (c.plan_id as string) ?? '';
  const licensePlanId = (lic?.plan_id as string) ?? '';
  return {
    id: c.id as string,
    businessName: c.business_name as string,
    ruc: (c.ruc as string) ?? undefined,
    contactName: c.contact_name as string,
    email: c.email as string,
    phone: (c.phone as string) ?? '',
    planId: clientPlanId || licensePlanId,
    licenseId: lic?.id ?? (c.license_id as string) ?? '',
    licenseStatus: lic?.status ?? 'prueba',
    createdAt: c.created_at as string,
    lastActivityAt: c.last_activity_at as string,
    posDeviceId: (c.pos_device_id as string) ?? undefined,
    renderUrl: (c.render_url as string) ?? undefined,
    apiKey: (c.api_key as string) ?? undefined,
    systemVersion: (c.system_version as string) ?? undefined,
    isActive: c.is_active !== false,
    posConnectionStatus: (c.pos_connection_status as PosConnectionStatus) ?? 'unknown',
    licenseExpiresAt: lic?.expires_at,
    paymentStatus: (c.payment_status as SaasClient['paymentStatus']) ?? null,
  };
}

export async function getClients(includeInactive = false): Promise<SaasClient[]> {
  if (!isSupabaseConfigured()) return mockClients();

  const db = getSupabaseAdmin()!;
  let query = db.from('clients').select('*').order('created_at', { ascending: false });
  if (!includeInactive) {
    query = query.eq('is_active', true);
  }
  const { data: clients } = await query;
  const { data: licenses } = await db
    .from('licenses')
    .select('id, client_id, status, expires_at, plan_id');

  const licByClient = new Map(
    (licenses ?? []).map((l) => [
      l.client_id as string,
      l as { id: string; status: LicenseStatus; expires_at?: string; plan_id?: string },
    ])
  );

  return (clients ?? []).map((c) => mapClientRow(c as Record<string, unknown>, licByClient.get(c.id as string)));
}

export async function getClientById(id: string): Promise<SaasClient | null> {
  const all = await getClients(true);
  return all.find((c) => c.id === id) ?? null;
}

export async function getLicenses(): Promise<License[]> {
  if (!isSupabaseConfigured()) return mockLicenses();

  const db = getSupabaseAdmin()!;
  const { data } = await db.from('licenses').select('*');
  return (data ?? []).map((l) => ({
    id: l.id as string,
    clientId: l.client_id as string,
    planId: l.plan_id as string,
    status: l.status as LicenseStatus,
    licenseKey: l.license_key as string,
    expiresAt: (l.expires_at as string) ?? null,
    neverExpires: Boolean(l.never_expires),
    modulesEnabled: (l.modules_enabled as string[]) ?? [],
    createdAt: l.created_at as string,
  }));
}

export async function getPlans() {
  if (!isSupabaseConfigured()) return MOCK_PLANS;

  const db = getSupabaseAdmin()!;
  const { data } = await db.from('plans').select('*').order('price_monthly');
  return (data ?? []).map((p) => ({
    id: p.id as string,
    name: p.name as PlanTier,
    priceMonthly: Number(p.price_monthly),
    currency: 'PEN' as const,
    modules: (p.modules as string[]) ?? [],
    limits: (p.limits as Record<string, number | string>) ?? {},
    highlighted: Boolean(p.highlighted),
  }));
}
