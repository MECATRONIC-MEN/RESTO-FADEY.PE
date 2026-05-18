import type { UserRole } from '@/lib/auth/types';

/** Modelos del backoffice — listos para Supabase / PostgreSQL */

export type LicenseStatus = 'activo' | 'suspendido' | 'vencido' | 'prueba';
export type PaymentStatus = 'pending' | 'approved' | 'rejected';
export type PaymentMethod = 'transferencia' | 'yape' | 'plin' | 'efectivo' | 'tarjeta' | 'otro';
export type PlanTier = 'Básico' | 'Pro' | 'Premium';

export interface SaasPlan {
  id: string;
  name: PlanTier;
  priceMonthly: number;
  currency: 'PEN';
  modules: string[];
  limits: Record<string, number | string>;
  highlighted?: boolean;
}

export interface License {
  id: string;
  clientId: string;
  planId: string;
  status: LicenseStatus;
  licenseKey: string;
  expiresAt: string;
  modulesEnabled: string[];
  createdAt: string;
}

export interface SaasClient {
  id: string;
  businessName: string;
  ruc?: string;
  contactName: string;
  email: string;
  phone: string;
  planId: string;
  licenseId: string;
  licenseStatus: LicenseStatus;
  createdAt: string;
  lastActivityAt: string;
  posDeviceId?: string;
}

export interface PaymentRecord {
  id: string;
  clientId: string;
  clientName: string;
  restaurantName: string;
  amount: number;
  currency: 'PEN';
  method: PaymentMethod;
  status: PaymentStatus;
  voucherUrl?: string;
  reference?: string;
  period: string;
  planName?: string;
  /** Fecha de envío desde POS */
  createdAt: string;
  submittedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  /** Alias legacy */
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
  source: 'pos' | 'manual' | 'webhook';
  posNotifiedAt?: string;
}

/** Respuesta enviada al POS tras aprobar/rechazar */
export interface PaymentConfirmPayload {
  paymentId: string;
  clientId: string;
  status: PaymentStatus;
  approvedAt: string | null;
  planStatus: LicenseStatus;
  planName?: string;
  amount: number;
  restaurantName: string;
}

export interface PaymentApprovalResult {
  payment: PaymentRecord;
  planStatus: LicenseStatus;
  posNotified: boolean;
  posNotifyError?: string;
}

export interface FinancialStats {
  totalRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  activeClients: number;
  premiumClients: number;
  pendingPayments: number;
  overdueClients: number;
  newClientsThisMonth: number;
  churnRate: number;
  renewalRate: number;
  activeUsers: number;
  revenueByMonth: { month: string; amount: number }[];
  planDistribution: { plan: string; count: number }[];
  approvedPaymentsThisMonth?: number;
  rejectedPaymentsThisMonth?: number;
}

export interface PosPaymentPayload {
  clientId: string;
  businessName?: string;
  restaurantName?: string;
  amount: number;
  method: PaymentMethod;
  voucherUrl?: string;
  reference?: string;
  period?: string;
  submittedAt?: string;
  createdAt?: string;
  plan?: string;
  paymentStatus?: PaymentStatus;
}

export interface PlatformUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  clientId?: string | null;
  restaurant?: string | null;
  plan?: string | null;
  isActive: boolean;
}

export interface CommercialLead {
  name: string;
  email: string;
  phone?: string;
  businessName?: string;
  planInterest?: string;
  message?: string;
  survey?: Record<string, string | boolean>;
}
