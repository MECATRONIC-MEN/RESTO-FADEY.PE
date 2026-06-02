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
  /** Null cuando neverExpires es true */
  expiresAt: string | null;
  neverExpires: boolean;
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

/** Llaves para configurar el POS en Render antes de conectar */
export interface PosRenderLinkBundle {
  clientId: string;
  licenseKey: string;
  restaurantName: string;
  planName: string;
  centralApiUrl: string;
  envTemplate: string;
  expiresAt: string | null;
}

export interface GeneratePosLinkResult {
  message: string;
  bundle: PosRenderLinkBundle;
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

/** Colaborador interno Resto Fadey (planilla admin) */
export interface SaasStaffMember {
  id: string;
  name: string;
  role?: string;
  phone?: string;
  email?: string;
  payAmount: number;
  /** Día del mes (1–28) para aviso de pago recurrente */
  payDayOfMonth?: number;
  notes?: string;
  isActive: boolean;
  createdAt: string;
}

/** Pago programado o realizado a personal interno */
export interface SaasStaffPayment {
  id: string;
  staffId: string;
  staffName?: string;
  amount: number;
  dueDate: string;
  paidAt?: string | null;
  notes?: string;
  createdAt: string;
}

/** Obligación tributaria sobre ingresos SaaS */
export interface SaasTaxPayment {
  id: string;
  taxType: string;
  amount: number;
  dueDate: string;
  paidAt?: string | null;
  periodYear: number;
  periodMonth: number;
  reference?: string;
  notes?: string;
  createdAt: string;
}

export interface SaasUpcomingPayment {
  id: string;
  kind: 'staff' | 'tax';
  label: string;
  amount: number;
  dueDate: string;
  daysUntil: number;
  overdue: boolean;
}

/** Resumen financiero del negocio SaaS (ingresos − impuestos − planilla) */
export interface SaasFinanceSummary {
  revenueTotal: number;
  revenueThisMonth: number;
  payrollPaidTotal: number;
  payrollPaidThisMonth: number;
  payrollPendingAmount: number;
  taxesPaidTotal: number;
  taxesPaidThisMonth: number;
  taxesPendingAmount: number;
  netProfitTotal: number;
  netProfitThisMonth: number;
  upcomingPayments: SaasUpcomingPayment[];
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
  /** Contraseña de entrega al restaurante (solo admin) */
  portalDeliveryPassword?: string | null;
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

export interface VisitorRatingInput {
  name: string;
  restaurant: string;
  role: string;
  comment: string;
  result?: string;
  rating: number;
}

export type VisitorRatingStatus = 'pending' | 'approved' | 'rejected';

export interface VisitorRatingRecord extends VisitorRatingInput {
  id: string;
  status: VisitorRatingStatus;
  createdAt: string;
}

export type AdminNotificationType = 'lead' | 'demo_request' | 'pwa_install' | 'visitor_rating';

export interface AcademyCourse {
  id: string;
  title: string;
  description?: string;
  category?: string;
  thumbnailUrl?: string;
  contentUrl?: string;
  duration?: string;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
}

export type AcademyResourceType = 'manual' | 'plantilla' | 'documento' | 'enlace';

export interface AcademyResource {
  id: string;
  title: string;
  description?: string;
  category?: string;
  resourceType: AcademyResourceType;
  fileUrl: string;
  thumbnailUrl?: string;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface AcademyModuleVideo {
  slug: string;
  title: string;
  description: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  isPublished: boolean;
  hasVideo: boolean;
  /** Módulo extra creado en admin (no es de los 9 del sistema) */
  isCustom?: boolean;
  sortOrder?: number;
}

export interface ClientPromotion {
  id: string;
  title: string;
  description?: string;
  bannerUrl?: string;
  discountPercent?: number;
  endsAt?: string;
}

export interface ClientDashboardSummary {
  planName: string | null;
  licenseStatus: string | null;
  licenseExpiresAt: string | null;
  publishedCoursesCount: number;
  publishedVideosCount: number;
  publishedResourcesCount: number;
  activePromotionsCount: number;
}

export interface AdminNotification {
  id: string;
  type: AdminNotificationType;
  title: string;
  body: string;
  payload: Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
}
