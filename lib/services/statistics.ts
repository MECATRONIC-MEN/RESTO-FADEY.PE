import { getFinancialStats as mockStats } from '@/lib/domain/mock-store';
import { getPayments } from './payments';
import { getClients } from './clients';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { FinancialStats } from '@/lib/domain/types';

export async function getFinancialStats(): Promise<FinancialStats> {
  if (!isSupabaseConfigured()) return mockStats();

  const [payments, clients] = await Promise.all([getPayments(), getClients()]);

  const approved = payments.filter((p) => p.status === 'approved');
  const totalRevenue = approved.reduce((s, p) => s + p.amount, 0);
  const now = new Date();
  const monthlyRevenue = approved
    .filter((p) => {
      const d = new Date(p.submittedAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s, p) => s + p.amount, 0);

  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
  const revenueByMonth = months.map((month, i) => {
    const monthPayments = approved.filter((p) => {
      const d = new Date(p.submittedAt);
      return d.getMonth() === i && d.getFullYear() === now.getFullYear();
    });
    return { month, amount: monthPayments.reduce((s, p) => s + p.amount, 0) };
  });

  const planCounts = new Map<string, number>();
  for (const c of clients) {
    const planName =
      c.planId.includes('premium') ? 'Premium' : c.planId.includes('pro') ? 'Pro' : 'Básico';
    planCounts.set(planName, (planCounts.get(planName) ?? 0) + 1);
  }

  return {
    totalRevenue,
    monthlyRevenue,
    yearlyRevenue: totalRevenue * 4.2,
    activeClients: clients.filter((c) => c.licenseStatus === 'activo').length,
    premiumClients: clients.filter((c) => c.planId.includes('premium')).length,
    pendingPayments: payments.filter((p) => p.status === 'pending').length,
    overdueClients: clients.filter((c) => c.licenseStatus === 'vencido').length,
    newClientsThisMonth: clients.filter((c) => {
      const d = new Date(c.createdAt);
      return d.getMonth() === now.getMonth();
    }).length,
    churnRate: 0,
    renewalRate: clients.length ? 100 : 0,
    activeUsers: clients.length,
    revenueByMonth,
    planDistribution: Array.from(planCounts.entries()).map(([plan, count]) => ({ plan, count })),
  };
}
