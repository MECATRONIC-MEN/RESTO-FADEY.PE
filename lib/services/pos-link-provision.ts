import { randomUUID } from 'crypto';
import { SITE_URL } from '@/lib/constants';
import { MOCK_CLIENTS, MOCK_LICENSES, MOCK_PLANS } from '@/lib/domain/mock-store';
import type { GeneratePosLinkResult, LicenseStatus } from '@/lib/domain/types';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { ensureClientPortalUser } from '@/lib/services/client-portal-user';
import { slugifyRestaurantName } from '@/lib/services/client-portal-user';
import {
  buildLicenseKeyFromClientId,
  buildPosRenderEnvTemplate,
} from '@/lib/utils/pos-render-env';

function defaultExpirationIso(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString();
}

export async function generatePosRenderLink(input: {
  restaurantName: string;
  planId: string;
  ruc?: string;
  contactEmail?: string;
  neverExpires?: boolean;
}): Promise<GeneratePosLinkResult> {
  const restaurantName = input.restaurantName.trim();
  if (!restaurantName) {
    throw new Error('Nombre del restaurante es requerido');
  }
  if (!input.planId?.trim()) {
    throw new Error('Seleccione un plan');
  }

  const clientId = randomUUID();
  const licenseKey = buildLicenseKeyFromClientId(clientId);
  const neverExpires = Boolean(input.neverExpires);
  const expiresAt = neverExpires ? null : defaultExpirationIso();
  const now = new Date().toISOString();
  const contactEmail =
    input.contactEmail?.trim() || `${slugifyRestaurantName(restaurantName)}@rf.pe`;

  if (!isSupabaseConfigured()) {
    const plan = MOCK_PLANS.find((p) => p.id === input.planId) ?? MOCK_PLANS[0];
    const licenseId = `lic_${clientId.slice(0, 8)}`;

    MOCK_CLIENTS.unshift({
      id: clientId,
      businessName: restaurantName,
      ruc: input.ruc,
      contactName: restaurantName,
      email: contactEmail,
      phone: '',
      planId: plan.id,
      licenseId,
      licenseStatus: 'activo',
      createdAt: now,
      lastActivityAt: now,
      posConnectionStatus: 'unknown',
      licenseExpiresAt: expiresAt ?? undefined,
      isActive: true,
    });

    MOCK_LICENSES.unshift({
      id: licenseId,
      clientId,
      planId: plan.id,
      status: 'activo',
      licenseKey,
      expiresAt,
      neverExpires,
      modulesEnabled: ['all'],
      createdAt: now,
    });

    const portal = await ensureClientPortalUser({ clientId, restaurantName });
    const envTemplate = buildPosRenderEnvTemplate({
      clientId,
      licenseKey,
      restaurantName,
      planName: plan.name,
      expirationDate: expiresAt ? expiresAt.split('T')[0] : undefined,
    });

    return {
      message: 'Llaves generadas. Configure el POS en Render y luego conecte el restaurante.',
      bundle: {
        clientId,
        licenseKey,
        restaurantName,
        planName: plan.name,
        centralApiUrl: SITE_URL,
        envTemplate,
        expiresAt,
      },
      portalAccess:
        portal.password != null
          ? { username: portal.username, password: portal.password, email: portal.email }
          : undefined,
    };
  }

  const db = getSupabaseAdmin()!;
  const { data: planRow, error: planErr } = await db
    .from('plans')
    .select('id, name')
    .eq('id', input.planId)
    .maybeSingle();

  if (planErr) throw new Error(planErr.message);
  if (!planRow) throw new Error('Plan no encontrado');

  const { error: clientErr } = await db.from('clients').insert({
    id: clientId,
    business_name: restaurantName,
    ruc: input.ruc?.trim() || null,
    contact_name: restaurantName,
    email: contactEmail,
    phone: null,
    plan_id: planRow.id,
    last_activity_at: now,
    is_active: true,
    pos_connection_status: 'unknown',
  });

  if (clientErr) throw new Error(clientErr.message);

  const { data: newLic, error: licErr } = await db
    .from('licenses')
    .insert({
      client_id: clientId,
      plan_id: planRow.id,
      status: 'activo' satisfies LicenseStatus,
      license_key: licenseKey,
      expires_at: expiresAt,
      never_expires: neverExpires,
      modules_enabled: ['all'],
    })
    .select('id')
    .single();

  if (licErr) throw new Error(licErr.message);

  await db.from('clients').update({ license_id: newLic.id }).eq('id', clientId);

  const portal = await ensureClientPortalUser({ clientId, restaurantName });
  const planName = String(planRow.name);
  const envTemplate = buildPosRenderEnvTemplate({
    clientId,
    licenseKey,
    restaurantName,
    planName,
    expirationDate: expiresAt ? expiresAt.split('T')[0] : undefined,
  });

  return {
    message: 'Llaves generadas. Configure el POS en Render y luego conecte el restaurante.',
    bundle: {
      clientId,
      licenseKey,
      restaurantName,
      planName,
      centralApiUrl: SITE_URL,
      envTemplate,
      expiresAt,
    },
    portalAccess:
      portal.password != null
        ? { username: portal.username, password: portal.password, email: portal.email }
        : undefined,
  };
}
