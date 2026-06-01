import type {
  FinancialStats,
  License,
  PaymentRecord,
  SaasClient,
  SaasPlan,
  PaymentStatus,
  PosPaymentPayload,
} from './types';
import { DEMO_CLIENT_ID, DEMO_BUSINESS_NAME, DEMO_CLIENT_EMAIL } from '@/lib/demo';
import { buildPlanMapFromSaasPlans, computeFinancialStats } from '@/lib/analytics/financial-metrics';

/** Pagos en memoria (solo desarrollo sin Supabase; en Vercel usar Supabase) */
let payments: PaymentRecord[] = [];

export const MOCK_PLANS: SaasPlan[] = [
  {
    id: 'plan_basico',
    name: 'Básico',
    priceMonthly: 150,
    currency: 'PEN',
    modules: ['ventas', 'mesas', 'sunat'],
    limits: { usuarios: 3, sucursales: 1 },
  },
  {
    id: 'plan_pro',
    name: 'Pro',
    priceMonthly: 200,
    currency: 'PEN',
    modules: ['ventas', 'cocina', 'delivery', 'inventario', 'sunat'],
    limits: { usuarios: 10, sucursales: 1 },
  },
  {
    id: 'plan_premium',
    name: 'Premium',
    priceMonthly: 299,
    currency: 'PEN',
    modules: ['all'],
    limits: { usuarios: 'ilimitado', sucursales: 1 },
    highlighted: true,
  },
];

/** Un solo cliente demo vinculado a cliente@restofadey.pe */
export const MOCK_CLIENTS: SaasClient[] = [
  {
    id: DEMO_CLIENT_ID,
    businessName: DEMO_BUSINESS_NAME,
    ruc: '20123456789',
    contactName: 'Restaurante Demo',
    email: DEMO_CLIENT_EMAIL,
    phone: '+51 935 968 198',
    planId: 'plan_premium',
    licenseId: 'lic_demo_001',
    licenseStatus: 'activo',
    createdAt: new Date().toISOString(),
    lastActivityAt: new Date().toISOString(),
    posDeviceId: 'POS-FADEY-DEMO',
  },
];

export const MOCK_LICENSES: License[] = [
  {
    id: 'lic_demo_001',
    clientId: DEMO_CLIENT_ID,
    planId: 'plan_premium',
    status: 'activo',
    licenseKey: 'RF-DEMO-2026',
    expiresAt: '2026-12-31T23:59:59Z',
    neverExpires: false,
    modulesEnabled: ['all'],
    createdAt: new Date().toISOString(),
  },
];

function resolveMockClientId(clientId: string): string {
  const exists = MOCK_CLIENTS.some((c) => c.id === clientId);
  return exists ? clientId : DEMO_CLIENT_ID;
}

export function getPayments(filters?: {
  status?: PaymentStatus;
  clientId?: string;
  q?: string;
  limit?: number;
}): PaymentRecord[] {
  let list = [...payments];
  if (filters?.status) list = list.filter((p) => p.status === filters.status);
  if (filters?.clientId) list = list.filter((p) => p.clientId === filters.clientId);
  if (filters?.q?.trim()) {
    const q = filters.q.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.clientName.toLowerCase().includes(q) ||
        p.restaurantName.toLowerCase().includes(q) ||
        p.reference?.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    );
  }
  list = list.sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
  if (filters?.limit && filters.limit > 0) return list.slice(0, filters.limit);
  return list;
}

export function getPaymentById(id: string): PaymentRecord | undefined {
  return payments.find((p) => p.id === id);
}

export function updatePaymentStatus(
  id: string,
  status: PaymentStatus,
  reviewedBy: string,
  notes?: string
): PaymentRecord | null {
  const idx = payments.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const at = new Date().toISOString();
  payments[idx] = {
    ...payments[idx],
    status,
    approvedAt: at,
    approvedBy: reviewedBy,
    reviewedAt: at,
    reviewedBy,
    notes,
  };
  if (status === 'approved') {
    const client = MOCK_CLIENTS.find((c) => c.id === payments[idx].clientId);
    if (client) {
      client.licenseStatus = 'activo';
      const lic = MOCK_LICENSES.find((l) => l.id === client.licenseId);
      if (lic) lic.status = 'activo';
    }
  }
  return payments[idx];
}

export function createPaymentFromPos(payload: PosPaymentPayload): PaymentRecord {
  const clientId = resolveMockClientId(payload.clientId);
  const client = MOCK_CLIENTS.find((c) => c.id === clientId)!;
  const displayName =
    payload.restaurantName ?? payload.businessName ?? client.businessName;

  const createdAt = payload.submittedAt ?? payload.createdAt ?? new Date().toISOString();
  const record: PaymentRecord = {
    id: `pay_${Date.now()}`,
    clientId,
    clientName: displayName,
    restaurantName: displayName,
    amount: payload.amount,
    currency: 'PEN',
    method: payload.method,
    status: payload.paymentStatus ?? 'pending',
    voucherUrl: payload.voucherUrl,
    reference: payload.reference,
    planName: payload.plan,
    period:
      payload.period ??
      new Date().toLocaleString('es-PE', { month: 'long', year: 'numeric' }),
    createdAt,
    submittedAt: createdAt,
    source: 'pos',
  };
  payments = [record, ...payments];
  client.lastActivityAt = new Date().toISOString();
  return record;
}

export function getFinancialStats(): FinancialStats {
  return computeFinancialStats(payments, MOCK_CLIENTS, buildPlanMapFromSaasPlans(MOCK_PLANS));
}

/** Vacía pagos y datos operativos de prueba (modo sin Supabase). */
export function clearMockOperationalData(options?: { removeTestClients?: boolean }) {
  const count = payments.length;
  payments = [];

  for (const c of MOCK_CLIENTS) {
    c.paymentStatus = null;
    c.posConnectionStatus = 'unknown';
  }

  let clientsRemoved = 0;
  if (options?.removeTestClients) {
    const before = MOCK_CLIENTS.length;
    const kept = MOCK_CLIENTS.filter((c) => c.id === DEMO_CLIENT_ID);
    MOCK_CLIENTS.length = 0;
    MOCK_CLIENTS.push(...kept);
    clientsRemoved = before - kept.length;
    const keptLic = MOCK_LICENSES.filter((l) => l.clientId === DEMO_CLIENT_ID);
    MOCK_LICENSES.length = 0;
    MOCK_LICENSES.push(...keptLic);
  }

  return { payments: count, clients: clientsRemoved };
}

export function getClients() {
  return [...MOCK_CLIENTS];
}

export function getLicenses() {
  return [...MOCK_LICENSES];
}

export function getPlans() {
  return [...MOCK_PLANS];
}
