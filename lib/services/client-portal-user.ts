import bcrypt from 'bcryptjs';
import { randomInt } from 'crypto';
import { USERS } from '@/lib/auth/users';

/** Elimina cuentas de acceso al panel del cliente (no toca pagos). */
export async function deleteClientPortalUsersByClientId(clientId: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    for (let i = USERS.length - 1; i >= 0; i--) {
      if (USERS[i].clientId === clientId && USERS[i].role === 'cliente') {
        USERS.splice(i, 1);
      }
    }
    return;
  }

  const db = getSupabaseAdmin()!;
  const { error } = await db.from('users').delete().eq('client_id', clientId);
  if (error) throw new Error(error.message);
}
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

/** Nombre normalizado para el correo (ej. "SISTEMA DEMO" → sistemademo) */
export function slugifyRestaurantName(restaurantName: string): string {
  return (
    restaurantName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
      .slice(0, 48) || 'cliente'
  );
}

/** Correo de acceso: nombre@rf.pe */
export function buildClientPortalEmail(restaurantName: string): string {
  return `${slugifyRestaurantName(restaurantName)}@rf.pe`;
}

/** Contraseña: nombre unido (sin espacios) + 4 dígitos aleatorios (ej. sistemademo3847) */
export function generateClientPortalPassword(restaurantName: string): string {
  const base = slugifyRestaurantName(restaurantName);
  const digits = String(randomInt(1000, 10000));
  return `${base}${digits}`;
}

async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

async function isEmailTakenByOtherClient(email: string, clientId: string): Promise<boolean> {
  const normalized = email.toLowerCase();

  if (!isSupabaseConfigured()) {
    return USERS.some(
      (u) => u.email.toLowerCase() === normalized && u.clientId !== clientId
    );
  }

  const db = getSupabaseAdmin()!;
  const { data } = await db
    .from('users')
    .select('client_id')
    .eq('email', normalized)
    .maybeSingle();

  return Boolean(data && data.client_id !== clientId);
}

/** Resuelve un correo único; solo añade sufijo si otro cliente ya usa el mismo. */
async function resolveClientPortalEmail(
  restaurantName: string,
  clientId: string
): Promise<string> {
  const base = buildClientPortalEmail(restaurantName);
  if (!(await isEmailTakenByOtherClient(base, clientId))) {
    return base;
  }
  const suffix = clientId.replace(/-/g, '').slice(0, 4);
  return `${slugifyRestaurantName(restaurantName)}${suffix}@rf.pe`;
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
    portal_delivery_password?: string | null;
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
 * Usuario = nombre del restaurante; correo = nombre@rf.pe; contraseña = nombreunido + 4 dígitos.
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

  const email = await resolveClientPortalEmail(username, input.clientId);
  const existing = await findUserByClientId(input.clientId);

  if (!isSupabaseConfigured()) {
    if (existing) {
      const mockUser = USERS.find((u) => u.clientId === input.clientId);
      if (mockUser) {
        mockUser.name = username;
        mockUser.restaurant = username;
        if (mockUser.email !== email) {
          mockUser.email = email;
        }
        if (input.regeneratePassword) {
          const password = generateClientPortalPassword(username);
          mockUser.passwordHash = await hashPassword(password);
          mockUser.portalDeliveryPassword = password;
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
      portalDeliveryPassword: password,
    });

    return { username, password, email, created: true, regenerated: false };
  }

  const db = getSupabaseAdmin()!;

  if (existing) {
    const updates: Record<string, string> = { name: username };
    if (existing.email !== email) {
      updates.email = email;
    }
    if (input.regeneratePassword) {
      const password = generateClientPortalPassword(username);
      updates.password_hash = await hashPassword(password);
      updates.portal_delivery_password = password;
      await db.from('users').update(updates).eq('id', existing.id);
      return {
        username,
        password,
        email: updates.email ?? existing.email,
        created: false,
        regenerated: true,
      };
    }
    await db.from('users').update(updates).eq('id', existing.id);
    return {
      username,
      password: null,
      email: updates.email ?? existing.email,
      created: false,
      regenerated: false,
    };
  }

  const password = generateClientPortalPassword(username);
  const { error } = await db.from('users').insert({
    email,
    password_hash: await hashPassword(password),
    portal_delivery_password: password,
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

/** Crea la cuenta cliente si el restaurante aún no tiene una vinculada. */
export async function ensureClientPortalUser(input: {
  clientId: string;
  restaurantName: string;
}): Promise<ClientPortalAccess> {
  const existing = await findUserByClientId(input.clientId);
  if (existing) {
    return provisionClientPortalUser({ ...input, regeneratePassword: false });
  }
  return provisionClientPortalUser(input);
}

/** Guarda la contraseña actual para entrega al cliente sin cambiar el hash de login. */
export async function storePortalDeliveryPassword(input: {
  userId: string;
  password: string;
}): Promise<{ stored: boolean; email: string; name: string }> {
  const password = input.password.trim();
  if (!password) throw new Error('Contraseña requerida');

  if (!isSupabaseConfigured()) {
    const mockUser = USERS.find((u) => u.id === input.userId && u.role === 'cliente');
    if (!mockUser) throw new Error('Usuario cliente no encontrado');
    const valid = await bcrypt.compare(password, mockUser.passwordHash);
    if (!valid) throw new Error('La contraseña no coincide con la cuenta actual');
    mockUser.portalDeliveryPassword = password;
    return { stored: true, email: mockUser.email, name: mockUser.name };
  }

  const db = getSupabaseAdmin()!;
  const { data, error } = await db
    .from('users')
    .select('id, email, name, role, password_hash')
    .eq('id', input.userId)
    .eq('role', 'cliente')
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Usuario cliente no encontrado');

  const valid = await bcrypt.compare(password, data.password_hash as string);
  if (!valid) throw new Error('La contraseña no coincide con la cuenta actual');

  const { error: updateErr } = await db
    .from('users')
    .update({ portal_delivery_password: password })
    .eq('id', input.userId);

  if (updateErr) throw new Error(updateErr.message);

  return {
    stored: true,
    email: data.email as string,
    name: data.name as string,
  };
}
