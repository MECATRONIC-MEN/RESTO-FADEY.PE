import type { FinancialStats, PaymentRecord, SaasClient } from '@/lib/domain/types';

export type PlanMeta = { slug: string; label: string };

const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export function planLabelFromSlug(slug: string): string {
  const s = slug.toLowerCase();
  if (s === 'basico' || s === 'básico') return 'Básico';
  if (s === 'pro' || s === 'intermedio') return 'Intermedio';
  if (s === 'premium') return 'Premium';
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export function resolveClientPlan(
  planId: string | undefined,
  planById: Map<string, PlanMeta>
): PlanMeta | null {
  if (!planId) return null;
  return planById.get(planId) ?? null;
}

export function isPremiumClient(planId: string | undefined, planById: Map<string, PlanMeta>): boolean {
  const plan = resolveClientPlan(planId, planById);
  return plan?.slug === 'premium';
}

function isLicenseExpired(client: SaasClient, now: Date): boolean {
  if (client.licenseStatus === 'vencido') return true;
  if (client.licenseExpiresAt && new Date(client.licenseExpiresAt) < now) return true;
  return false;
}

function isOverdueClient(client: SaasClient, now: Date): boolean {
  if (isLicenseExpired(client, now)) return true;
  if (client.licenseStatus === 'suspendido') return true;
  if (client.paymentStatus === 'pending' && client.licenseStatus !== 'activo') return true;
  return false;
}

function daysSince(iso: string, now: Date): number {
  return (now.getTime() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24);
}

export function computeFinancialStats(
  payments: PaymentRecord[],
  clients: SaasClient[],
  planById: Map<string, PlanMeta>
): FinancialStats {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const approved = payments.filter((p) => p.status === 'approved');
  const totalRevenue = approved.reduce((s, p) => s + p.amount, 0);

  const monthlyRevenue = approved
    .filter((p) => {
      const d = new Date(p.approvedAt ?? p.submittedAt);
      return d.getMonth() === month && d.getFullYear() === year;
    })
    .reduce((s, p) => s + p.amount, 0);

  const yearlyRevenue = approved
    .filter((p) => new Date(p.approvedAt ?? p.submittedAt).getFullYear() === year)
    .reduce((s, p) => s + p.amount, 0);

  const revenueByMonth: { month: string; amount: number }[] = [];
  for (let offset = 5; offset >= 0; offset--) {
    const d = new Date(year, month - offset, 1);
    const m = d.getMonth();
    const y = d.getFullYear();
    const amount = approved
      .filter((p) => {
        const pd = new Date(p.approvedAt ?? p.submittedAt);
        return pd.getMonth() === m && pd.getFullYear() === y;
      })
      .reduce((s, p) => s + p.amount, 0);
    revenueByMonth.push({ month: MONTH_LABELS[m], amount });
  }

  const planCounts = new Map<string, number>();
  const defaultBuckets = ['Básico', 'Intermedio', 'Premium'];
  for (const label of defaultBuckets) planCounts.set(label, 0);

  for (const c of clients) {
    const meta = resolveClientPlan(c.planId, planById);
    const label = meta ? planLabelFromSlug(meta.slug) : 'Básico';
    planCounts.set(label, (planCounts.get(label) ?? 0) + 1);
  }

  const planDistribution = Array.from(planCounts.entries())
    .filter(([, count]) => count > 0)
    .map(([plan, count]) => ({ plan, count }));

  const expiredCount = clients.filter((c) => isLicenseExpired(c, now)).length;
  const renewedCount = new Set(
    approved
      .filter((p) => {
        const d = new Date(p.approvedAt ?? p.submittedAt);
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .map((p) => p.clientId)
  ).size;

  const renewalRate =
    expiredCount > 0 ? Math.min(100, Math.round((renewedCount / expiredCount) * 100)) : 0;

  const suspendedOrExpired = clients.filter(
    (c) => c.licenseStatus === 'suspendido' || isLicenseExpired(c, now)
  ).length;
  const churnRate =
    clients.length > 0 ? Math.round((suspendedOrExpired / clients.length) * 100) : 0;

  const thisMonthPayments = payments.filter((p) => {
    const d = new Date(p.submittedAt);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  return {
    totalRevenue,
    monthlyRevenue,
    yearlyRevenue,
    activeClients: clients.filter((c) => c.licenseStatus === 'activo' && c.isActive !== false).length,
    premiumClients: clients.filter((c) => isPremiumClient(c.planId, planById)).length,
    pendingPayments: payments.filter((p) => p.status === 'pending').length,
    overdueClients: clients.filter((c) => isOverdueClient(c, now)).length,
    newClientsThisMonth: clients.filter((c) => {
      const d = new Date(c.createdAt);
      return d.getMonth() === month && d.getFullYear() === year;
    }).length,
    churnRate,
    renewalRate,
    activeUsers: clients.filter((c) => daysSince(c.lastActivityAt, now) <= 30).length,
    revenueByMonth,
    planDistribution,
    approvedPaymentsThisMonth: thisMonthPayments.filter((p) => p.status === 'approved').length,
    rejectedPaymentsThisMonth: thisMonthPayments.filter((p) => p.status === 'rejected').length,
  };
}

export function buildPlanMapFromRows(
  rows: { id: string; slug?: string; name?: string }[]
): Map<string, PlanMeta> {
  const map = new Map<string, PlanMeta>();
  for (const p of rows) {
    const slug = String(p.slug ?? p.name ?? '').toLowerCase();
    map.set(p.id, { slug, label: planLabelFromSlug(slug) });
  }
  return map;
}

export function buildPlanMapFromSaasPlans(
  plans: { id: string; name: string }[]
): Map<string, PlanMeta> {
  return buildPlanMapFromRows(
    plans.map((p) => ({
      id: p.id,
      slug: p.name.toLowerCase().includes('premium')
        ? 'premium'
        : p.name.toLowerCase().includes('pro')
          ? 'pro'
          : 'basico',
      name: p.name,
    }))
  );
}
