import bcrypt from 'bcryptjs';
import { findUserByEmail as findMockUser, USERS } from '@/lib/auth/users';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { PlatformUser } from '@/lib/domain/types';
import type { UserRole } from '@/lib/auth/types';

type DbUser = {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: UserRole;
  client_id: string | null;
  is_active: boolean;
  clients?: { business_name: string; plan_id: string | null } | null;
};

async function mapDbUser(row: DbUser): Promise<PlatformUser> {
  let plan: string | null = null;
  if (row.clients?.plan_id) {
    const db = getSupabaseAdmin();
    if (db) {
      const { data: p } = await db.from('plans').select('name').eq('id', row.clients.plan_id).single();
      plan = p?.name ?? null;
    }
  }
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    name: row.name,
    role: row.role,
    clientId: row.client_id,
    restaurant: row.clients?.business_name ?? null,
    plan,
    isActive: row.is_active,
  };
}

export async function findUserByEmail(email: string): Promise<PlatformUser | null> {
  const normalized = email.toLowerCase().trim();

  if (isSupabaseConfigured()) {
    const db = getSupabaseAdmin()!;
    const { data, error } = await db
      .from('users')
      .select('*, clients(business_name, plan_id)')
      .eq('email', normalized)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) return null;
    return mapDbUser(data as DbUser);
  }

  const mock = findMockUser(normalized);
  if (!mock) return null;
  return {
    id: mock.id,
    email: mock.email,
    passwordHash: mock.passwordHash,
    name: mock.name,
    role: mock.role,
    clientId: null,
    restaurant: mock.restaurant ?? null,
    plan: mock.plan ?? null,
    isActive: true,
  };
}

export async function verifyUserPassword(
  email: string,
  password: string
): Promise<PlatformUser | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  return valid ? user : null;
}

export async function listUsers(): Promise<PlatformUser[]> {
  if (!isSupabaseConfigured()) {
    return USERS.map((u) => ({
      id: u.id,
      email: u.email,
      passwordHash: u.passwordHash,
      name: u.name,
      role: u.role,
      clientId: null,
      restaurant: u.restaurant ?? null,
      plan: u.plan ?? null,
      isActive: true,
    }));
  }

  const db = getSupabaseAdmin()!;
  const { data } = await db
    .from('users')
    .select('*, clients(business_name, plan_id)')
    .order('created_at', { ascending: false });

  if (!data) return [];
  return Promise.all(data.map((row) => mapDbUser(row as DbUser)));
}
