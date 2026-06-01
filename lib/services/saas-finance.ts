import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getFinancialStats } from '@/lib/services/statistics';
import type {
  SaasFinanceSummary,
  SaasStaffMember,
  SaasStaffPayment,
  SaasTaxPayment,
  SaasUpcomingPayment,
} from '@/lib/domain/types';

let mockStaff: SaasStaffMember[] = [];
let mockStaffPayments: SaasStaffPayment[] = [];
let mockTaxPayments: SaasTaxPayment[] = [];

function uid() {
  return crypto.randomUUID();
}

function mapStaff(row: Record<string, unknown>): SaasStaffMember {
  return {
    id: row.id as string,
    name: row.name as string,
    role: (row.role as string) ?? undefined,
    phone: (row.phone as string) ?? undefined,
    email: (row.email as string) ?? undefined,
    payAmount: Number(row.pay_amount ?? 0),
    payDayOfMonth: row.pay_day_of_month != null ? Number(row.pay_day_of_month) : undefined,
    notes: (row.notes as string) ?? undefined,
    isActive: row.is_active !== false,
    createdAt: row.created_at as string,
  };
}

function mapStaffPayment(row: Record<string, unknown>, staffName?: string): SaasStaffPayment {
  return {
    id: row.id as string,
    staffId: row.staff_id as string,
    staffName: staffName ?? (row.staff_name as string | undefined),
    amount: Number(row.amount),
    dueDate: row.due_date as string,
    paidAt: (row.paid_at as string) ?? null,
    notes: (row.notes as string) ?? undefined,
    createdAt: row.created_at as string,
  };
}

function mapTaxPayment(row: Record<string, unknown>): SaasTaxPayment {
  return {
    id: row.id as string,
    taxType: row.tax_type as string,
    amount: Number(row.amount),
    dueDate: row.due_date as string,
    paidAt: (row.paid_at as string) ?? null,
    periodYear: Number(row.period_year),
    periodMonth: Number(row.period_month),
    reference: (row.reference as string) ?? undefined,
    notes: (row.notes as string) ?? undefined,
    createdAt: row.created_at as string,
  };
}

function daysUntil(dateStr: string, now: Date): number {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  const n = new Date(now);
  n.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - n.getTime()) / (1000 * 60 * 60 * 24));
}

function isInMonth(iso: string | null | undefined, year: number, month: number): boolean {
  if (!iso) return false;
  const d = new Date(iso);
  return d.getFullYear() === year && d.getMonth() + 1 === month;
}

function sumPaidInMonth(
  items: { amount: number; paidAt?: string | null }[],
  year: number,
  month: number
): number {
  return items
    .filter((i) => i.paidAt && isInMonth(i.paidAt, year, month))
    .reduce((s, i) => s + i.amount, 0);
}

function sumPaidTotal(items: { amount: number; paidAt?: string | null }[]): number {
  return items.filter((i) => i.paidAt).reduce((s, i) => s + i.amount, 0);
}

function sumPending(items: { amount: number; paidAt?: string | null }[]): number {
  return items.filter((i) => !i.paidAt).reduce((s, i) => s + i.amount, 0);
}

function buildUpcoming(
  staffPayments: SaasStaffPayment[],
  taxPayments: SaasTaxPayment[],
  now: Date
): SaasUpcomingPayment[] {
  const upcoming: SaasUpcomingPayment[] = [];

  for (const p of staffPayments) {
    if (p.paidAt) continue;
    const days = daysUntil(p.dueDate, now);
    if (days <= 7) {
      upcoming.push({
        id: p.id,
        kind: 'staff',
        label: `Planilla: ${p.staffName ?? 'Personal'}`,
        amount: p.amount,
        dueDate: p.dueDate,
        daysUntil: days,
        overdue: days < 0,
      });
    }
  }

  for (const t of taxPayments) {
    if (t.paidAt) continue;
    const days = daysUntil(t.dueDate, now);
    if (days <= 14) {
      upcoming.push({
        id: t.id,
        kind: 'tax',
        label: `Impuesto: ${t.taxType}`,
        amount: t.amount,
        dueDate: t.dueDate,
        daysUntil: days,
        overdue: days < 0,
      });
    }
  }

  return upcoming.sort((a, b) => a.daysUntil - b.daysUntil);
}

export async function listStaff(): Promise<SaasStaffMember[]> {
  if (!isSupabaseConfigured()) {
    return [...mockStaff].sort((a, b) => a.name.localeCompare(b.name));
  }

  const db = getSupabaseAdmin()!;
  const { data, error } = await db.from('saas_staff').select('*').order('name');
  if (error) {
    if (error.message.includes('does not exist')) return [];
    throw new Error(error.message);
  }
  return (data ?? []).map((r) => mapStaff(r as Record<string, unknown>));
}

export async function createStaff(input: {
  name: string;
  role?: string;
  phone?: string;
  email?: string;
  payAmount: number;
  payDayOfMonth?: number;
  notes?: string;
}): Promise<SaasStaffMember> {
  if (!input.name.trim()) throw new Error('Nombre requerido');

  if (!isSupabaseConfigured()) {
    const member: SaasStaffMember = {
      id: uid(),
      name: input.name.trim(),
      role: input.role?.trim(),
      phone: input.phone?.trim(),
      email: input.email?.trim(),
      payAmount: input.payAmount,
      payDayOfMonth: input.payDayOfMonth,
      notes: input.notes?.trim(),
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    mockStaff.push(member);
    return member;
  }

  const db = getSupabaseAdmin()!;
  const { data, error } = await db
    .from('saas_staff')
    .insert({
      name: input.name.trim(),
      role: input.role?.trim() ?? null,
      phone: input.phone?.trim() ?? null,
      email: input.email?.trim() ?? null,
      pay_amount: input.payAmount,
      pay_day_of_month: input.payDayOfMonth ?? null,
      notes: input.notes?.trim() ?? null,
    })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return mapStaff(data as Record<string, unknown>);
}

export async function updateStaff(
  id: string,
  patch: Partial<{
    name: string;
    role: string;
    phone: string;
    email: string;
    payAmount: number;
    payDayOfMonth: number | null;
    notes: string;
    isActive: boolean;
  }>
): Promise<SaasStaffMember> {
  if (!isSupabaseConfigured()) {
    const idx = mockStaff.findIndex((s) => s.id === id);
    if (idx < 0) throw new Error('No encontrado');
    const nextPayDay =
      patch.payDayOfMonth === null
        ? undefined
        : patch.payDayOfMonth ?? mockStaff[idx].payDayOfMonth;
    mockStaff[idx] = {
      ...mockStaff[idx],
      ...patch,
      payDayOfMonth: nextPayDay,
      name: patch.name?.trim() ?? mockStaff[idx].name,
    };
    return mockStaff[idx];
  }

  const row: Record<string, unknown> = {};
  if (patch.name != null) row.name = patch.name.trim();
  if (patch.role != null) row.role = patch.role.trim() || null;
  if (patch.phone != null) row.phone = patch.phone.trim() || null;
  if (patch.email != null) row.email = patch.email.trim() || null;
  if (patch.payAmount != null) row.pay_amount = patch.payAmount;
  if (patch.payDayOfMonth !== undefined) row.pay_day_of_month = patch.payDayOfMonth;
  if (patch.notes != null) row.notes = patch.notes.trim() || null;
  if (patch.isActive != null) row.is_active = patch.isActive;

  const db = getSupabaseAdmin()!;
  const { data, error } = await db.from('saas_staff').update(row).eq('id', id).select('*').single();
  if (error) throw new Error(error.message);
  return mapStaff(data as Record<string, unknown>);
}

export async function deleteStaff(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    mockStaff = mockStaff.filter((s) => s.id !== id);
    mockStaffPayments = mockStaffPayments.filter((p) => p.staffId !== id);
    return;
  }
  const db = getSupabaseAdmin()!;
  const { error } = await db.from('saas_staff').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function listStaffPayments(): Promise<SaasStaffPayment[]> {
  if (!isSupabaseConfigured()) {
    return [...mockStaffPayments].sort(
      (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
    );
  }

  const db = getSupabaseAdmin()!;
  const { data, error } = await db
    .from('saas_staff_payments')
    .select('*, saas_staff(name)')
    .order('due_date', { ascending: false });
  if (error) {
    if (error.message.includes('does not exist')) return [];
    throw new Error(error.message);
  }

  return (data ?? []).map((r) => {
    const row = r as Record<string, unknown>;
    const staff = row.saas_staff as { name?: string } | null;
    return mapStaffPayment(row, staff?.name);
  });
}

export async function createStaffPayment(input: {
  staffId: string;
  amount: number;
  dueDate: string;
  notes?: string;
}): Promise<SaasStaffPayment> {
  if (!input.staffId) throw new Error('Personal requerido');
  if (!input.dueDate) throw new Error('Fecha de pago requerida');

  if (!isSupabaseConfigured()) {
    const staff = mockStaff.find((s) => s.id === input.staffId);
    const payment: SaasStaffPayment = {
      id: uid(),
      staffId: input.staffId,
      staffName: staff?.name,
      amount: input.amount,
      dueDate: input.dueDate,
      paidAt: null,
      notes: input.notes?.trim(),
      createdAt: new Date().toISOString(),
    };
    mockStaffPayments.push(payment);
    return payment;
  }

  const db = getSupabaseAdmin()!;
  const { data, error } = await db
    .from('saas_staff_payments')
    .insert({
      staff_id: input.staffId,
      amount: input.amount,
      due_date: input.dueDate,
      notes: input.notes?.trim() ?? null,
    })
    .select('*, saas_staff(name)')
    .single();
  if (error) throw new Error(error.message);
  const row = data as Record<string, unknown>;
  const staff = row.saas_staff as { name?: string } | null;
  return mapStaffPayment(row, staff?.name);
}

export async function markStaffPaymentPaid(id: string): Promise<SaasStaffPayment> {
  const paidAt = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    const idx = mockStaffPayments.findIndex((p) => p.id === id);
    if (idx < 0) throw new Error('No encontrado');
    mockStaffPayments[idx] = { ...mockStaffPayments[idx], paidAt };
    return mockStaffPayments[idx];
  }

  const db = getSupabaseAdmin()!;
  const { data, error } = await db
    .from('saas_staff_payments')
    .update({ paid_at: paidAt })
    .eq('id', id)
    .select('*, saas_staff(name)')
    .single();
  if (error) throw new Error(error.message);
  const row = data as Record<string, unknown>;
  const staff = row.saas_staff as { name?: string } | null;
  return mapStaffPayment(row, staff?.name);
}

export async function deleteStaffPayment(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    mockStaffPayments = mockStaffPayments.filter((p) => p.id !== id);
    return;
  }
  const db = getSupabaseAdmin()!;
  const { error } = await db.from('saas_staff_payments').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function listTaxPayments(): Promise<SaasTaxPayment[]> {
  if (!isSupabaseConfigured()) {
    return [...mockTaxPayments].sort(
      (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
    );
  }

  const db = getSupabaseAdmin()!;
  const { data, error } = await db.from('saas_tax_payments').select('*').order('due_date', {
    ascending: false,
  });
  if (error) {
    if (error.message.includes('does not exist')) return [];
    throw new Error(error.message);
  }
  return (data ?? []).map((r) => mapTaxPayment(r as Record<string, unknown>));
}

export async function createTaxPayment(input: {
  taxType: string;
  amount: number;
  dueDate: string;
  periodYear: number;
  periodMonth: number;
  reference?: string;
  notes?: string;
}): Promise<SaasTaxPayment> {
  if (!input.taxType.trim()) throw new Error('Tipo de impuesto requerido');

  if (!isSupabaseConfigured()) {
    const payment: SaasTaxPayment = {
      id: uid(),
      taxType: input.taxType.trim(),
      amount: input.amount,
      dueDate: input.dueDate,
      paidAt: null,
      periodYear: input.periodYear,
      periodMonth: input.periodMonth,
      reference: input.reference?.trim(),
      notes: input.notes?.trim(),
      createdAt: new Date().toISOString(),
    };
    mockTaxPayments.push(payment);
    return payment;
  }

  const db = getSupabaseAdmin()!;
  const { data, error } = await db
    .from('saas_tax_payments')
    .insert({
      tax_type: input.taxType.trim(),
      amount: input.amount,
      due_date: input.dueDate,
      period_year: input.periodYear,
      period_month: input.periodMonth,
      reference: input.reference?.trim() ?? null,
      notes: input.notes?.trim() ?? null,
    })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return mapTaxPayment(data as Record<string, unknown>);
}

export async function markTaxPaymentPaid(id: string): Promise<SaasTaxPayment> {
  const paidAt = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    const idx = mockTaxPayments.findIndex((p) => p.id === id);
    if (idx < 0) throw new Error('No encontrado');
    mockTaxPayments[idx] = { ...mockTaxPayments[idx], paidAt };
    return mockTaxPayments[idx];
  }

  const db = getSupabaseAdmin()!;
  const { data, error } = await db
    .from('saas_tax_payments')
    .update({ paid_at: paidAt })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return mapTaxPayment(data as Record<string, unknown>);
}

export async function deleteTaxPayment(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    mockTaxPayments = mockTaxPayments.filter((p) => p.id !== id);
    return;
  }
  const db = getSupabaseAdmin()!;
  const { error } = await db.from('saas_tax_payments').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

/** Genera pago pendiente del mes según día habitual del colaborador */
export async function scheduleStaffPaymentFromMember(staffId: string): Promise<SaasStaffPayment> {
  const staffList = await listStaff();
  const member = staffList.find((s) => s.id === staffId);
  if (!member) throw new Error('Personal no encontrado');

  const now = new Date();
  const day = member.payDayOfMonth ?? now.getDate();
  const due = new Date(now.getFullYear(), now.getMonth(), Math.min(day, 28));
  const dueStr = due.toISOString().split('T')[0];

  return createStaffPayment({
    staffId: member.id,
    amount: member.payAmount,
    dueDate: dueStr,
    notes: `Pago programado — ${now.toLocaleString('es-PE', { month: 'long', year: 'numeric' })}`,
  });
}

export async function getSaasFinanceSummary(): Promise<SaasFinanceSummary> {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const [stats, staffPayments, taxPayments] = await Promise.all([
    getFinancialStats(),
    listStaffPayments(),
    listTaxPayments(),
  ]);

  const payrollPaidTotal = sumPaidTotal(staffPayments);
  const payrollPaidThisMonth = sumPaidInMonth(staffPayments, year, month);
  const taxesPaidTotal = sumPaidTotal(taxPayments);
  const taxesPaidThisMonth = sumPaidInMonth(taxPayments, year, month);

  return {
    revenueTotal: stats.totalRevenue,
    revenueThisMonth: stats.monthlyRevenue,
    payrollPaidTotal,
    payrollPaidThisMonth,
    payrollPendingAmount: sumPending(staffPayments),
    taxesPaidTotal,
    taxesPaidThisMonth,
    taxesPendingAmount: sumPending(taxPayments),
    netProfitTotal: stats.totalRevenue - payrollPaidTotal - taxesPaidTotal,
    netProfitThisMonth: stats.monthlyRevenue - payrollPaidThisMonth - taxesPaidThisMonth,
    upcomingPayments: buildUpcoming(staffPayments, taxPayments, now),
  };
}
