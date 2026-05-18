import { getClients as mockClients, getLicenses as mockLicenses, MOCK_PLANS } from '@/lib/domain/mock-store';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { License, LicenseStatus, PlanTier, SaasClient } from '@/lib/domain/types';

export async function getClients(): Promise<SaasClient[]> {
  if (!isSupabaseConfigured()) return mockClients();

  const db = getSupabaseAdmin()!;
  const { data: clients } = await db.from('clients').select('*').order('created_at', { ascending: false });
  const { data: licenses } = await db.from('licenses').select('id, client_id, status');

  const licByClient = new Map(
    (licenses ?? []).map((l) => [l.client_id as string, l as { id: string; status: LicenseStatus }])
  );

  return (clients ?? []).map((c) => {
    const lic = licByClient.get(c.id as string);
    return {
      id: c.id as string,
      businessName: c.business_name as string,
      ruc: (c.ruc as string) ?? undefined,
      contactName: c.contact_name as string,
      email: c.email as string,
      phone: (c.phone as string) ?? '',
      planId: (c.plan_id as string) ?? '',
      licenseId: lic?.id ?? '',
      licenseStatus: lic?.status ?? 'prueba',
      createdAt: c.created_at as string,
      lastActivityAt: c.last_activity_at as string,
      posDeviceId: (c.pos_device_id as string) ?? undefined,
    };
  });
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
    expiresAt: l.expires_at as string,
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
