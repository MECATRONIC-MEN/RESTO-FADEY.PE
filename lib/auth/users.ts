import type { AppUser } from './types';
import { DEMO_CLIENT_ID, DEMO_BUSINESS_NAME, DEMO_CLIENT_EMAIL } from '@/lib/demo';

/**
 * Usuarios demo — en producción con Supabase usar seed 002.
 */
export const USERS: AppUser[] = [
  {
    id: 'usr_master_001',
    email: 'admin@restofadey.pe',
    passwordHash: '$2b$10$ZDhAIVgqbjWZ5ln2b5t9ze7/u5x8ywGWtopz7SqiJctUO/ckJA1hK',
    name: 'Administrador Maestro',
    role: 'master_admin',
    clientId: null,
    restaurant: null,
    plan: null,
  },
  {
    id: 'usr_cliente_001',
    email: DEMO_CLIENT_EMAIL,
    passwordHash: '$2b$10$FBhxRxnX.k/O0nAlwKh3I.2apfZU4yoBPb0PFx2GLjp9m1PnJxBhe',
    name: 'Restaurante Demo',
    role: 'cliente',
    clientId: DEMO_CLIENT_ID,
    restaurant: DEMO_BUSINESS_NAME,
    plan: 'Premium',
  },
];

export function findUserByEmail(email: string): AppUser | undefined {
  return USERS.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
}
