import { MOCK_CLIENTS, MOCK_LICENSES, MOCK_PLANS } from '@/lib/domain/mock-store';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { ClientLicenseStatusResponse, LicenseStatus, PaymentStatus } from '@/lib/domain/types';

export async function getClientLicenseStatus(
  clientId: string
): Promise<ClientLicenseStatusResponse | null> {
  if (!isSupabaseConfigured()) {
    const client = MOCK_CLIENTS.find((c) => c.id === clientId);
    if (!client) return null;
    const lic = MOCK_LICENSES.find((l) => l.clientId === clientId);
    const planName = MOCK_PLANS.find((p) => p.id === client.planId)?.name ?? null;
    return {
      clientId: client.id,
      restaurantName: client.businessName,
      adminName: client.contactName,
      adminEmail: client.email,
      plan: planName,
      licenseStatus: client.licenseStatus,
      paymentStatus: null,
      expirationDate: lic?.expiresAt ?? null,
      renderUrl: null,
    };
  }

  const db = getSupabaseAdmin()!;

  const { data: client } = await db
    .from('clients')
    .select('id, business_name, contact_name, email, payment_status, render_url, plan_id')
    .eq('id', clientId)
    .maybeSingle();

  if (!client) return null;

  let planName: string | null = null;
  if (client.plan_id) {
    const { data: planRow } = await db
      .from('plans')
      .select('name')
      .eq('id', client.plan_id as string)
      .maybeSingle();
    planName = (planRow?.name as string) ?? null;
  }

  const { data: license } = await db
    .from('licenses')
    .select('status, expires_at')
    .eq('client_id', clientId)
    .maybeSingle();

  const { data: lastPayment } = await db
    .from('payments')
    .select('status')
    .eq('client_id', clientId)
    .order('submitted_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    clientId: client.id as string,
    restaurantName: client.business_name as string,
    adminName: client.contact_name as string,
    adminEmail: client.email as string,
    plan: planName,
    licenseStatus: (license?.status as LicenseStatus) ?? 'prueba',
    paymentStatus: (lastPayment?.status as PaymentStatus) ?? (client.payment_status as PaymentStatus) ?? null,
    expirationDate: (license?.expires_at as string) ?? null,
    renderUrl: (client.render_url as string) ?? null,
  };
}

export async function getClientPosUrl(clientId: string): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;

  const db = getSupabaseAdmin()!;
  const { data } = await db.from('clients').select('render_url').eq('id', clientId).maybeSingle();
  const url = (data?.render_url as string) ?? null;
  return url ? url.replace(/\/$/, '') : null;
}
