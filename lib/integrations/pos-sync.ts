export { RestoFadeyPlatformClient, syncPaymentToPlatform } from './pos-client';
export type { PosPaymentSyncInput, PosLoginInput } from './pos-client';

export const PLATFORM_API = {
  login: '/api/auth/login',
  payments: '/api/payments',
  paymentsConfirm: '/api/payments/confirm',
  licenseStatus: (clientId: string) => `/api/license-status/${clientId}`,
  users: '/api/users',
  licenses: '/api/licenses',
  plans: '/api/plans',
  statistics: '/api/statistics',
  leads: '/api/leads',
} as const;
