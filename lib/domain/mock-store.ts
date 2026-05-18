import type {
  FinancialStats,
  License,
  PaymentRecord,
  SaasClient,
  SaasPlan,
  PaymentStatus,
  PosPaymentPayload,
} from './types';

/** Store en memoria — reemplazar por Supabase/PostgreSQL */
let payments: PaymentRecord[] = [
  {
    id: 'pay_001',
    clientId: 'cli_001',
    clientName: 'La Cevichería Fadey',
    amount: 299,
    currency: 'PEN',
    method: 'yape',
    status: 'pending',
    voucherUrl: '/images/dashboard-panel.png',
    reference: 'YAPE-88421',
    period: 'May 2026',
    submittedAt: '2026-05-17T14:30:00Z',
    source: 'pos',
  },
  {
    id: 'pay_002',
    clientId: 'cli_002',
    clientName: 'Pollería El Dorado',
    amount: 200,
    currency: 'PEN',
    method: 'transferencia',
    status: 'approved',
    voucherUrl: '/images/dashboard-ventas.png',
    reference: 'BCP-992011',
    period: 'May 2026',
    submittedAt: '2026-05-15T10:00:00Z',
    reviewedAt: '2026-05-15T11:20:00Z',
    reviewedBy: 'admin@restofadey.pe',
    source: 'pos',
  },
  {
    id: 'pay_003',
    clientId: 'cli_003',
    clientName: 'Café Lima Centro',
    amount: 150,
    currency: 'PEN',
    method: 'plin',
    status: 'pending',
    reference: 'PLIN-44102',
    period: 'May 2026',
    submittedAt: '2026-05-16T18:45:00Z',
    source: 'pos',
  },
  {
    id: 'pay_004',
    clientId: 'cli_004',
    clientName: 'Pizza Nova Miraflores',
    amount: 299,
    currency: 'PEN',
    method: 'transferencia',
    status: 'rejected',
    period: 'Abr 2026',
    submittedAt: '2026-04-28T09:00:00Z',
    reviewedAt: '2026-04-28T15:00:00Z',
    notes: 'Voucher ilegible',
    source: 'manual',
  },
];

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

export const MOCK_CLIENTS: SaasClient[] = [
  {
    id: 'cli_001',
    businessName: 'La Cevichería Fadey',
    ruc: '20123456789',
    contactName: 'Carlos Mendoza',
    email: 'cliente@restofadey.pe',
    phone: '+51 935 968 198',
    planId: 'plan_premium',
    licenseId: 'lic_001',
    licenseStatus: 'activo',
    createdAt: '2025-11-01T00:00:00Z',
    lastActivityAt: '2026-05-17T12:00:00Z',
    posDeviceId: 'POS-FADEY-001',
  },
  {
    id: 'cli_002',
    businessName: 'Pollería El Dorado',
    contactName: 'María Ríos',
    email: 'maria@eldorado.pe',
    phone: '+51 999 111 222',
    planId: 'plan_pro',
    licenseId: 'lic_002',
    licenseStatus: 'activo',
    createdAt: '2026-01-15T00:00:00Z',
    lastActivityAt: '2026-05-16T08:00:00Z',
  },
  {
    id: 'cli_003',
    businessName: 'Café Lima Centro',
    contactName: 'Roberto Vargas',
    email: 'roberto@cafelima.pe',
    phone: '+51 988 333 444',
    planId: 'plan_basico',
    licenseId: 'lic_003',
    licenseStatus: 'prueba',
    createdAt: '2026-04-01T00:00:00Z',
    lastActivityAt: '2026-05-14T20:00:00Z',
  },
  {
    id: 'cli_004',
    businessName: 'Pizza Nova Miraflores',
    contactName: 'Ana Torres',
    email: 'ana@pizzanova.pe',
    phone: '+51 977 555 666',
    planId: 'plan_premium',
    licenseId: 'lic_004',
    licenseStatus: 'vencido',
    createdAt: '2025-06-01T00:00:00Z',
    lastActivityAt: '2026-04-20T10:00:00Z',
  },
];

export const MOCK_LICENSES: License[] = MOCK_CLIENTS.map((c) => ({
  id: c.licenseId,
  clientId: c.id,
  planId: c.planId,
  status: c.licenseStatus,
  licenseKey: `RF-${c.id.toUpperCase().slice(-6)}-2026`,
  expiresAt:
    c.licenseStatus === 'vencido' ? '2026-04-01T00:00:00Z' : '2026-12-31T23:59:59Z',
  modulesEnabled:
    MOCK_PLANS.find((p) => p.id === c.planId)?.modules ?? [],
  createdAt: c.createdAt,
}));

export function getPayments(filters?: {
  status?: PaymentStatus;
  clientId?: string;
}): PaymentRecord[] {
  let list = [...payments];
  if (filters?.status) list = list.filter((p) => p.status === filters.status);
  if (filters?.clientId) list = list.filter((p) => p.clientId === filters.clientId);
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
  payments[idx] = {
    ...payments[idx],
    status,
    reviewedAt: new Date().toISOString(),
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
  const client =
    MOCK_CLIENTS.find((c) => c.id === payload.clientId) ??
    MOCK_CLIENTS[0];
  const record: PaymentRecord = {
    id: `pay_${Date.now()}`,
    clientId: payload.clientId,
    clientName: payload.businessName ?? client.businessName,
    amount: payload.amount,
    currency: 'PEN',
    method: payload.method,
    status: 'pending',
    voucherUrl: payload.voucherUrl,
    reference: payload.reference,
    period: payload.period ?? new Date().toLocaleString('es-PE', { month: 'long', year: 'numeric' }),
    submittedAt: payload.submittedAt ?? new Date().toISOString(),
    source: 'pos',
  };
  payments = [record, ...payments];
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

  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
  const revenueByMonth = months.map((month, i) => ({
    month,
    amount: Math.round(800 + i * 420 + Math.random() * 200),
  }));

  return {
    totalRevenue: totalRevenue + 12450,
    monthlyRevenue: monthlyRevenue || 2499,
    yearlyRevenue: totalRevenue + 48200,
    activeClients: MOCK_CLIENTS.filter((c) => c.licenseStatus === 'activo').length,
    premiumClients: MOCK_CLIENTS.filter((c) => c.planId === 'plan_premium').length,
    pendingPayments: payments.filter((p) => p.status === 'pending').length,
    overdueClients: MOCK_CLIENTS.filter((c) => c.licenseStatus === 'vencido').length,
    newClientsThisMonth: 2,
    churnRate: 4.2,
    renewalRate: 91.5,
    activeUsers: 47,
    revenueByMonth,
    planDistribution: [
      { plan: 'Básico', count: 5 },
      { plan: 'Pro', count: 8 },
      { plan: 'Premium', count: 4 },
    ],
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
