import { SignJWT, jwtVerify } from 'jose';
import type { UserRole } from '@/lib/auth/types';

const ISSUER = 'resto-fadey';
const AUDIENCE = 'resto-fadey-pos';

export interface PlatformJwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  clientId?: string | null;
  name: string;
}

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET ?? process.env.AUTH_SECRET;
  if (!secret) throw new Error('JWT_SECRET o AUTH_SECRET no configurado');
  return new TextEncoder().encode(secret);
}

export async function signPlatformToken(payload: PlatformJwtPayload, expiresIn = '7d') {
  return new SignJWT({
    email: payload.email,
    role: payload.role,
    clientId: payload.clientId ?? null,
    name: payload.name,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecret());
}

export async function verifyPlatformToken(token: string): Promise<PlatformJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      role: payload.role as UserRole,
      clientId: (payload.clientId as string | null) ?? null,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}

export function isValidApiSecret(token: string | null | undefined): boolean {
  const secret = process.env.API_SECRET_KEY ?? process.env.POS_API_KEY;
  if (!secret || !token) return false;
  return token === secret;
}
