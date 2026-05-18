/** Roles del sistema — escalable a permisos granulares */
export type UserRole = 'master_admin' | 'cliente' | 'observador';

export interface AppUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  clientId?: string | null;
  restaurant?: string | null;
  plan?: string | null;
  /** Preparado: stripeCustomerId, licenseKey, companyId */
  metadata?: Record<string, string>;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  restaurant?: string | null;
  plan?: string | null;
}
