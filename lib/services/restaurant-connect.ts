import { MOCK_CLIENTS, MOCK_LICENSES, MOCK_PLANS } from '@/lib/domain/mock-store';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import {
  fetchPosHealth,
  fetchPosRestaurantInfo,
  normalizeBaseUrl,
} from '@/lib/integrations/pos-remote';
import type {
  ConnectRestaurantResult,
  LicenseStatus,
  PosConnectionStatus,
  SaasClient,
} from '@/lib/domain/types';
import { getClientById } from '@/lib/services/clients';
import { ensureClientPortalUser } from '@/lib/services/client-portal-user';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function mapLicenseStatus(raw?: string): LicenseStatus {
  if (!raw) return 'prueba';
  const s = raw.toLowerCase();
  if (s === 'active' || s === 'activo' || s === 'approved') return 'activo';
  if (s === 'suspended' || s === 'suspendido') return 'suspendido';
  if (s === 'expired' || s === 'vencido') return 'vencido';
  if (s === 'trial' || s === 'prueba') return 'prueba';
  return 'prueba';
}

async function resolvePlanId(planName?: string): Promise<string | null> {
  if (!planName?.trim()) return null;
  const name = planName.trim().toLowerCase();

  if (!isSupabaseConfigured()) {
    const p = MOCK_PLANS.find((x) => x.name.toLowerCase() === name);
    return p?.id ?? MOCK_PLANS[0]?.id ?? null;
  }

  const db = getSupabaseAdmin()!;
  const { data } = await db.from('plans').select('id, name, slug').limit(20);
  const match = (data ?? []).find(
    (p) =>
      String(p.name).toLowerCase() === name ||
      String(p.slug).toLowerCase() === name ||
      String(p.name).toLowerCase().includes(name)
  );
  return (match?.id as string) ?? null;
}

function mapRowToClient(
  c: Record<string, unknown>,
  lic?: { id: string; status: LicenseStatus; expires_at?: string }
): SaasClient {
  return {
    id: c.id as string,
    businessName: c.business_name as string,
    ruc: (c.ruc as string) ?? undefined,
    contactName: c.contact_name as string,
    email: c.email as string,
    phone: (c.phone as string) ?? '',
    planId: (c.plan_id as string) ?? '',
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

export async function connectRestaurantFromPos(input: {
  renderUrl: string;
  clientId: string;
}): Promise<ConnectRestaurantResult> {
  const renderUrl = normalizeBaseUrl(input.renderUrl);
  const clientId = input.clientId.trim();

  if (!UUID_RE.test(clientId)) {
    throw new Error('CLIENT_ID debe ser un UUID válido');
  }

  const info = await fetchPosRestaurantInfo(renderUrl);

  if (info.clientId !== clientId) {
    throw new Error(
      `El POS reportó clientId ${info.clientId}, no coincide con ${clientId}`
    );
  }

  const health = await fetchPosHealth(renderUrl);
  const posStatus: PosConnectionStatus = health.online ? 'online' : 'offline';
  const licenseStatus = mapLicenseStatus(info.licenseStatus);
  const planId = (await resolvePlanId(info.plan)) ?? undefined;
  const now = new Date().toISOString();
  const hasPosExpiration =
    Boolean(info.expirationDate) && !Number.isNaN(Date.parse(info.expirationDate!));
  const neverExpires = !hasPosExpiration;
  const expiresAt = hasPosExpiration
    ? new Date(info.expirationDate!).toISOString()
    : null;

  if (!isSupabaseConfigured()) {
    const existing = MOCK_CLIENTS.find((c) => c.id === clientId);
    const created = !existing;
    const client: SaasClient = {
      id: clientId,
      businessName: info.restaurantName,
      ruc: info.ruc,
      contactName: info.ownerName ?? info.restaurantName,
      email: info.email ?? 'sin-email@pos.local',
      phone: info.phone ?? '',
      planId: planId ?? MOCK_PLANS[0].id,
      licenseId: MOCK_LICENSES[0]?.id ?? 'lic_mock',
      licenseStatus,
      createdAt: existing?.createdAt ?? now,
      lastActivityAt: info.lastActivity ?? now,
      renderUrl,
      apiKey: info.apiKey,
      systemVersion: info.systemVersion,
      isActive: true,
      posConnectionStatus: posStatus,
      licenseExpiresAt: expiresAt ?? undefined,
    };
    if (existing) Object.assign(existing, client);
    else MOCK_CLIENTS.unshift(client);
    const portal = await ensureClientPortalUser({
      clientId,
      restaurantName: info.restaurantName,
    });
    return {
      client,
      created,
      posOnline: health.online,
      message: created
        ? 'Restaurante conectado y registrado'
        : portal.created
          ? 'Restaurante actualizado — acceso de cliente creado'
          : 'Restaurante actualizado desde POS',
      portalAccess:
        portal.password != null
          ? { username: portal.username, password: portal.password, email: portal.email }
          : undefined,
    };
  }

  const db = getSupabaseAdmin()!;

  const { data: existingById } = await db.from('clients').select('id').eq('id', clientId).maybeSingle();
  const { data: existingByUrl } = await db
    .from('clients')
    .select('id')
    .eq('render_url', renderUrl)
    .maybeSingle();

  if (existingByUrl && existingByUrl.id !== clientId) {
    throw new Error('Esa URL Render ya está vinculada a otro cliente');
  }

  const created = !existingById;

  const clientRow = {
    id: clientId,
    business_name: info.restaurantName,
    ruc: info.ruc ?? null,
    contact_name: info.ownerName ?? info.restaurantName,
    email: info.email ?? `pos-${clientId.slice(0, 8)}@resto-fadey.local`,
    phone: info.phone ?? null,
    plan_id: planId ?? null,
    render_url: renderUrl,
    api_key: info.apiKey ?? null,
    system_version: info.systemVersion ?? null,
    payment_status: null,
    last_activity_at: info.lastActivity ?? now,
    pos_connection_status: posStatus,
    pos_last_seen_at: health.online ? now : null,
    is_active: true,
  };

  const { error: upsertErr } = await db.from('clients').upsert(clientRow, { onConflict: 'id' });
  if (upsertErr) throw new Error(upsertErr.message);

  const licenseKey = `RF-${clientId.slice(0, 8).toUpperCase()}`;
  const { data: existingLic } = await db
    .from('licenses')
    .select('id')
    .eq('client_id', clientId)
    .maybeSingle();

  let licenseId = existingLic?.id as string | undefined;

  if (existingLic?.id) {
    await db
      .from('licenses')
      .update({
        status: licenseStatus,
        never_expires: neverExpires,
        expires_at: neverExpires ? null : expiresAt,
        plan_id: planId ?? undefined,
      })
      .eq('id', existingLic.id);
  } else if (planId) {
    const { data: newLic, error: licErr } = await db
      .from('licenses')
      .insert({
        client_id: clientId,
        plan_id: planId,
        status: licenseStatus,
        license_key: licenseKey,
        never_expires: neverExpires,
        expires_at: neverExpires ? null : expiresAt,
        modules_enabled: ['all'],
      })
      .select('id')
      .single();
    if (licErr) throw new Error(licErr.message);
    licenseId = newLic.id as string;
  }

  if (licenseId) {
    await db.from('clients').update({ license_id: licenseId }).eq('id', clientId);
  }

  const { data: licPlan } = await db
    .from('licenses')
    .select('plan_id')
    .eq('client_id', clientId)
    .maybeSingle();
  if (licPlan?.plan_id) {
    await db.from('clients').update({ plan_id: licPlan.plan_id }).eq('id', clientId);
  }

  const client = await getClientById(clientId);
  if (!client) throw new Error('No se pudo cargar el cliente tras conectar');

  const portal = await ensureClientPortalUser({
    clientId,
    restaurantName: info.restaurantName,
  });

  return {
    client,
    created,
    posOnline: health.online,
    message: created
      ? 'Restaurante conectado y registrado automáticamente'
      : portal.created
        ? 'Datos sincronizados — acceso de cliente creado'
        : 'Datos del restaurante sincronizados desde el POS',
    portalAccess:
      portal.password != null
        ? { username: portal.username, password: portal.password, email: portal.email }
        : undefined,
  };
}

export async function checkRestaurantConnection(clientId: string): Promise<{
  online: boolean;
  status: PosConnectionStatus;
}> {
  const client = await getClientById(clientId);
  if (!client?.renderUrl) {
    return { online: false, status: 'unknown' };
  }

  const health = await fetchPosHealth(client.renderUrl);
  const status: PosConnectionStatus = health.online ? 'online' : 'offline';

  if (isSupabaseConfigured()) {
    const db = getSupabaseAdmin()!;
    await db
      .from('clients')
      .update({
        pos_connection_status: status,
        pos_last_seen_at: health.online ? new Date().toISOString() : null,
      })
      .eq('id', clientId);
  }

  return { online: health.online, status };
}

export async function setClientLicenseStatus(
  clientId: string,
  status: LicenseStatus
): Promise<void> {
  if (!isSupabaseConfigured()) {
    const c = MOCK_CLIENTS.find((x) => x.id === clientId);
    if (c) c.licenseStatus = status;
    const lic = MOCK_LICENSES.find((l) => l.clientId === clientId);
    if (lic) lic.status = status;
    return;
  }

  const db = getSupabaseAdmin()!;
  await db.from('licenses').update({ status }).eq('client_id', clientId);
}

export async function deactivateClientInPanel(clientId: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const i = MOCK_CLIENTS.findIndex((c) => c.id === clientId);
    if (i >= 0) MOCK_CLIENTS.splice(i, 1);
    return;
  }

  const db = getSupabaseAdmin()!;
  await db.from('clients').update({ is_active: false }).eq('id', clientId);
}
