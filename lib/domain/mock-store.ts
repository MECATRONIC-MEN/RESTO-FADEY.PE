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
  return list.sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
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
  const approved = payments.filter((p) => p.status === 'approved');
  const totalRevenue = approved.reduce((s, p) => s + p.amount, 0);
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const monthlyRevenue = approved
    .filter((p) => {
      const d = new Date(p.submittedAt);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    })
    .reduce((s, p) => s + p.amount, 0);

  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const revenueByMonth = months.map((month, i) => ({
    month,
    amount: approved
      .filter((p) => {
        const d = new Date(p.submittedAt);
        return d.getMonth() === i && d.getFullYear() === thisYear;
      })
      .reduce((s, p) => s + p.amount, 0),
  }));

  const activeClients = MOCK_CLIENTS.filter((c) => c.licenseStatus === 'activo').length;
  const premiumClients = MOCK_CLIENTS.filter((c) => c.planId === 'plan_premium').length;

  return {
    totalRevenue,
    monthlyRevenue,
    yearlyRevenue: totalRevenue,
    activeClients,
    premiumClients,
    pendingPayments: payments.filter((p) => p.status === 'pending').length,
    overdueClients: MOCK_CLIENTS.filter((c) => c.licenseStatus === 'vencido').length,
    newClientsThisMonth: 0,
    churnRate: 0,
    renewalRate: 0,
    activeUsers: MOCK_CLIENTS.length,
    revenueByMonth,
    planDistribution: premiumClients
      ? [{ plan: 'Premium', count: premiumClients }]
      : [],
    approvedPaymentsThisMonth: payments.filter((p) => {
      const d = new Date(p.submittedAt);
      return (
        p.status === 'approved' &&
        d.getMonth() === thisMonth &&
        d.getFullYear() === thisYear
      );
    }).length,
    rejectedPaymentsThisMonth: payments.filter((p) => {
      const d = new Date(p.submittedAt);
      return (
        p.status === 'rejected' &&
        d.getMonth() === thisMonth &&
        d.getFullYear() === thisYear
      );
    }).length,
  };
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
