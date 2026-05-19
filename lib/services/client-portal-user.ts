import bcrypt from 'bcryptjs';
import { randomInt } from 'crypto';
import { USERS } from '@/lib/auth/users';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { PlatformUser } from '@/lib/domain/types';

export type ClientPortalAccess = {
  username: string;
  password: string | null;
  email: string;
  created: boolean;
  regenerated: boolean;
};

/** Contraseña: nombre del restaurante + 5 dígitos aleatorios */
export function generateClientPortalPassword(restaurantName: string): string {
  const base = restaurantName.trim();
  const digits = String(randomInt(10000, 100000));
  return `${base}${digits}`;
}

export function buildClientPortalEmail(restaurantName: string, clientId: string): string {
  const slug = restaurantName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
  const shortId = clientId.replace(/-/g, '').slice(0, 8);
  return `${slug || 'cliente'}.${shortId}@portal.restofadey.pe`;
}

async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

async function findUserByClientId(clientId: string): Promise<PlatformUser | null> {
  if (!isSupabaseConfigured()) {
    const u = USERS.find((x) => x.clientId === clientId && x.role === 'cliente');
    if (!u) return null;
    return {
      id: u.id,
      email: u.email,
      passwordHash: u.passwordHash,
      name: u.name,
      role: u.role,
      clientId: u.clientId,
      restaurant: u.restaurant,
      plan: u.plan,
      isActive: true,
    };
  }

  const db = getSupabaseAdmin()!;
  const { data } = await db
    .from('users')
    .select('*, clients(business_name, plan_id)')
    .eq('client_id', clientId)
    .eq('role', 'cliente')
    .eq('is_active', true)
    .maybeSingle();

  if (!data) return null;

  const row = data as {
    id: string;
    email: string;
    password_hash: string;
    name: string;
    role: 'cliente';
    client_id: string;
    clients?: { business_name: string; plan_id: string | null } | null;
  };

  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    name: row.name,
    role: row.role,
    clientId: row.client_id,
    restaurant: row.clients?.business_name ?? null,
    plan: null,
    isActive: true,
  };
}

/**
 * Crea o actualiza el usuario del panel cliente vinculado al restaurante.
 * Usuario = nombre del restaurante; contraseña = nombre + 5 dígitos (solo al crear o regenerar).
 */
export async function provisionClientPortalUser(input: {
  clientId: string;
  restaurantName: string;
  regeneratePassword?: boolean;
}): Promise<ClientPortalAccess> {
  const username = input.restaurantName.trim();
  if (!username) {
    throw new Error('Nombre de restaurante requerido para crear acceso');
  }

  const email = buildClientPortalEmail(username, input.clientId);
  const existing = await findUserByClientId(input.clientId);

  if (!isSupabaseConfigured()) {
    if (existing) {
      const mockUser = USERS.find((u) => u.clientId === input.clientId);
      if (mockUser) {
        mockUser.name = username;
        mockUser.restaurant = username;
        if (input.regeneratePassword) {
          const password = generateClientPortalPassword(username);
          mockUser.passwordHash = await hashPassword(password);
          return {
            username,
            password,
            email: mockUser.email,
            created: false,
            regenerated: true,
          };
        }
      }
      return {
        username,
        password: null,
        email: existing.email,
        created: false,
        regenerated: false,
      };
    }

    const password = generateClientPortalPassword(username);
    USERS.push({
      id: `usr_${input.clientId.slice(0, 8)}`,
      email,
      passwordHash: await hashPassword(password),
      name: username,
      role: 'cliente',
      clientId: input.clientId,
      restaurant: username,
      plan: null,
    });

    return { username, password, email, created: true, regenerated: false };
  }

  const db = getSupabaseAdmin()!;

  if (existing) {
    const updates: Record<string, string> = { name: username };
    if (input.regeneratePassword) {
      const password = generateClientPortalPassword(username);
      updates.password_hash = await hashPassword(password);
      await db.from('users').update(updates).eq('id', existing.id);
      return {
        username,
        password,
        email: existing.email,
        created: false,
        regenerated: true,
      };
    }
    await db.from('users').update(updates).eq('id', existing.id);
    return {
      username,
      password: null,
      email: existing.email,
      created: false,
      regenerated: false,
    };
  }

  const password = generateClientPortalPassword(username);
  const { error } = await db.from('users').insert({
    email,
    password_hash: await hashPassword(password),
    name: username,
    role: 'cliente',
    client_id: input.clientId,
    is_active: true,
  });

  if (error) {
    if (error.code === '23505') {
      const { data: dup } = await db
        .from('users')
        .select('id, client_id')
        .eq('email', email)
        .maybeSingle();
      if (dup?.client_id === input.clientId) {
        return provisionClientPortalUser({ ...input, regeneratePassword: true });
      }
    }
    throw new Error(error.message);
  }

  return { username, password, email, created: true, regenerated: false };
}
