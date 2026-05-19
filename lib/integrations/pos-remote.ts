import type { PosRestaurantInfo } from '@/lib/domain/types';

function normalizeBaseUrl(url: string): string {
  let u = url.trim();
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
  return u.replace(/\/$/, '');
}

function apiSecret(): string {
  const s = process.env.API_SECRET_KEY ?? process.env.POS_API_KEY;
  if (!s) throw new Error('API_SECRET_KEY no configurada en el panel');
  return s;
}

function authHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${apiSecret()}`,
    Accept: 'application/json',
  };
}

const TIMEOUT_MS = 15000;

/** GET {renderUrl}/api/restaurant/info */
export async function fetchPosRestaurantInfo(renderUrl: string): Promise<PosRestaurantInfo> {
  const base = normalizeBaseUrl(renderUrl);
  const res = await fetch(`${base}/api/restaurant/info`, {
    headers: authHeaders(),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  const text = await res.text();
  let json: Record<string, unknown> = {};
  try {
    json = JSON.parse(text) as Record<string, unknown>;
  } catch {
    /* ignore */
  }

  if (!res.ok) {
    const err =
      (json.error as string) ??
      (json.message as string) ??
      `POS respondió ${res.status}`;
    throw new Error(err);
  }

  const data = (json.data ?? json) as Record<string, unknown>;

  const clientId = String(data.clientId ?? data.client_id ?? '');
  const restaurantName = String(data.restaurantName ?? data.restaurant_name ?? data.businessName ?? '');

  if (!clientId || !restaurantName) {
    throw new Error('El POS no devolvió clientId o restaurantName en /api/restaurant/info');
  }

  return {
    clientId,
    apiKey: data.apiKey != null ? String(data.apiKey) : data.api_key != null ? String(data.api_key) : undefined,
    restaurantName,
    ownerName:
      data.ownerName != null
        ? String(data.ownerName)
        : data.owner_name != null
          ? String(data.owner_name)
          : undefined,
    ruc: data.ruc != null ? String(data.ruc) : undefined,
    phone: data.phone != null ? String(data.phone) : undefined,
    email: data.email != null ? String(data.email) : undefined,
    plan: data.plan != null ? String(data.plan) : undefined,
    licenseStatus:
      data.licenseStatus != null
        ? String(data.licenseStatus)
        : data.license_status != null
          ? String(data.license_status)
          : undefined,
    expirationDate:
      data.expirationDate != null
        ? String(data.expirationDate)
        : data.expiration_date != null
          ? String(data.expiration_date)
          : undefined,
    lastActivity:
      data.lastActivity != null
        ? String(data.lastActivity)
        : data.last_activity != null
          ? String(data.last_activity)
          : undefined,
    renderUrl: data.renderUrl != null ? String(data.renderUrl) : base,
    systemVersion:
      data.systemVersion != null
        ? String(data.systemVersion)
        : data.system_version != null
          ? String(data.system_version)
          : undefined,
  };
}

/** GET {renderUrl}/api/system/health */
export async function fetchPosHealth(renderUrl: string): Promise<{ online: boolean; status?: string }> {
  const base = normalizeBaseUrl(renderUrl);
  try {
    const res = await fetch(`${base}/api/system/health`, {
      headers: authHeaders(),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { online: false };
    const json = (await res.json()) as Record<string, unknown>;
    const data = (json.data ?? json) as Record<string, unknown>;
    const status = String(data.status ?? '');
    return { online: status === 'online' || res.ok, status };
  } catch {
    return { online: false };
  }
}

export interface LicenseConfirmBody {
  clientId: string;
  paymentId?: string;
  status?: string;
  planStatus: string;
  planName?: string;
  expirationDate?: string | null;
}

/** POST {renderUrl}/api/license/confirm — fallback /api/payments/confirm */
export async function notifyPosLicenseConfirm(
  renderUrl: string,
  body: LicenseConfirmBody
): Promise<{ ok: boolean; error?: string }> {
  const base = normalizeBaseUrl(renderUrl);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...authHeaders(),
  };

  const payload = {
    success: true,
    clientId: body.clientId,
    paymentId: body.paymentId,
    status: body.status,
    licenseStatus: body.planStatus === 'activo' ? 'active' : body.planStatus,
    planName: body.planName,
    expirationDate: body.expirationDate,
  };

  for (const path of ['/api/license/confirm', '/api/payments/confirm']) {
    try {
      const res = await fetch(`${base}${path}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15000),
      });
      if (res.ok) return { ok: true };
      const text = await res.text().catch(() => '');
      if (path === '/api/license/confirm') continue;
      return { ok: false, error: `POS ${res.status}: ${text.slice(0, 200)}` };
    } catch (e) {
      if (path === '/api/payments/confirm') {
        return { ok: false, error: e instanceof Error ? e.message : 'Error al contactar POS' };
      }
    }
  }

  return { ok: false, error: 'POS no respondió en /api/license/confirm ni /api/payments/confirm' };
}

export { normalizeBaseUrl };
