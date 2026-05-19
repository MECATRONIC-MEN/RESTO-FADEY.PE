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

export type PosConnectionStatus = 'online' | 'offline' | 'unknown';

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
  renderUrl?: string;
  apiKey?: string;
  systemVersion?: string;
  isActive?: boolean;
  posConnectionStatus?: PosConnectionStatus;
  licenseExpiresAt?: string;
  paymentStatus?: PaymentStatus | null;
}

/** Respuesta GET {renderUrl}/api/restaurant/info del POS */
export interface PosRestaurantInfo {
  clientId: string;
  apiKey?: string;
  restaurantName: string;
  ownerName?: string;
  ruc?: string;
  phone?: string;
  email?: string;
  plan?: string;
  licenseStatus?: string;
  expirationDate?: string;
  lastActivity?: string;
  renderUrl?: string;
  systemVersion?: string;
}

export interface ClientPortalCredentials {
  username: string;
  password: string;
  email: string;
}

export interface ConnectRestaurantResult {
  client: SaasClient;
  created: boolean;
  posOnline: boolean;
  message: string;
  portalAccess?: ClientPortalCredentials;
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
  adminName?: string;
  adminEmail?: string;
  amount: number;
  method: PaymentMethod;
  voucherUrl?: string;
  reference?: string;
  operationNumber?: string;
  period?: string;
  submittedAt?: string;
  createdAt?: string;
  paymentDate?: string;
  plan?: string;
  paymentStatus?: PaymentStatus;
  renderUrl?: string;
}

/** Respuesta GET /api/license-status/:clientId para el POS */
export interface ClientLicenseStatusResponse {
  clientId: string;
  restaurantName: string;
  adminName: string;
  adminEmail: string;
  plan: string | null;
  licenseStatus: LicenseStatus;
  paymentStatus: PaymentStatus | null;
  expirationDate: string | null;
  renderUrl: string | null;
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

export interface CommercialLeadRecord extends CommercialLead {
  id: string;
  status?: string;
  createdAt: string;
}

export interface DemoRequest {
  name: string;
  email: string;
  phone?: string;
  businessName: string;
}

export interface DemoRequestRecord extends DemoRequest {
  id: string;
  createdAt: string;
}

export type AdminNotificationType = 'lead' | 'demo_request' | 'pwa_install';

export interface AdminNotification {
  id: string;
  type: AdminNotificationType;
  title: string;
  body: string;
  payload: Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
}
