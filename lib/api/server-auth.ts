import { auth } from '@/auth';
import { NextResponse } from 'next/server';

/** Sesión admin (NextAuth) para rutas del backoffice */
export async function requireAdminSession() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'master_admin') {
    return { error: NextResponse.json({ error: 'No autorizado' }, { status: 401 }) };
  }
  return { session };
}

/**
 * JWT / API Key para el POS (futuro).
 * Header: Authorization: Bearer <POS_API_KEY>
 */
export function requirePosApiKey(request: Request): NextResponse | null {
  const key = process.env.POS_API_KEY;
  if (!key) return null;
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace(/^Bearer\s+/i, '');
  if (token !== key) {
    return NextResponse.json({ error: 'API key inválida' }, { status: 401 });
  }
  return null;
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}
