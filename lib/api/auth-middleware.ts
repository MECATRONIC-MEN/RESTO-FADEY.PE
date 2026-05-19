import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { isValidApiSecret, verifyPlatformToken } from '@/lib/jwt';

export type ApiAuthResult =
  | { type: 'admin'; email: string }
  | {
      type: 'pos';
      sub: string;
      email: string;
      clientId?: string | null;
      usesSharedSecret?: boolean;
      boundClientId?: string | null;
    }
  | { type: 'error'; response: NextResponse };

/** Admin (sesión web) o POS (API_SECRET / JWT) */
export async function requirePlatformAuth(request: Request): Promise<ApiAuthResult> {
  const authHeader = request.headers.get('authorization');
  const bearer = authHeader?.replace(/^Bearer\s+/i, '') ?? '';

  const boundClientId = request.headers.get('x-client-id')?.trim() || null;

  if (bearer && isValidApiSecret(bearer)) {
    return {
      type: 'pos',
      sub: 'pos-service',
      email: 'pos@system',
      usesSharedSecret: true,
      boundClientId,
    };
  }

  if (bearer) {
    const jwt = await verifyPlatformToken(bearer);
    if (jwt) {
      return {
        type: 'pos',
        sub: jwt.sub,
        email: jwt.email,
        clientId: jwt.clientId ?? null,
        usesSharedSecret: false,
        boundClientId,
      };
    }
  }

  const session = await auth();
  if (session?.user?.role === 'master_admin') {
    return { type: 'admin', email: session.user.email ?? 'admin' };
  }

  return {
    type: 'error',
    response: NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 }),
  };
}

export async function requireAdminOrPosWrite(request: Request): Promise<ApiAuthResult> {
  return requirePlatformAuth(request);
}
