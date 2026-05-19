import { NextResponse } from 'next/server';
import type { ApiAuthResult } from '@/lib/api/auth-middleware';

const CLIENT_ID_HEADER = 'x-client-id';

export function getRequestClientId(request: Request): string | null {
  const header = request.headers.get(CLIENT_ID_HEADER)?.trim();
  if (header) return header;
  return null;
}

/**
 * Con API_SECRET compartida, el POS debe enviar X-Client-Id = su CLIENT_ID.
 * Con JWT, el token debe incluir el mismo clientId (si está definido).
 */
export function assertPosClientAccess(
  auth: Exclude<ApiAuthResult, { type: 'error' }>,
  clientId: string,
  request?: Request
): NextResponse | null {
  if (auth.type === 'admin') return null;

  if (auth.type === 'pos') {
    if (auth.usesSharedSecret) {
      const bound = auth.boundClientId ?? getRequestClientId(request ?? new Request(''));
      if (!bound) {
        return NextResponse.json(
          {
            success: false,
            error: `Header ${CLIENT_ID_HEADER} es requerido con API_SECRET_KEY`,
          },
          { status: 403 }
        );
      }
      if (bound !== clientId) {
        return NextResponse.json(
          { success: false, error: 'clientId no coincide con el header de cliente' },
          { status: 403 }
        );
      }
      return null;
    }

    if (auth.clientId && auth.clientId !== clientId) {
      return NextResponse.json(
        { success: false, error: 'No autorizado para este cliente' },
        { status: 403 }
      );
    }

    return null;
  }

  return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
}

export function assertBodyClientMatchesHeader(
  bodyClientId: string,
  request: Request
): NextResponse | null {
  const headerId = getRequestClientId(request);
  if (!headerId) return null;
  if (headerId !== bodyClientId) {
    return NextResponse.json(
      { success: false, error: 'clientId del body no coincide con X-Client-Id' },
      { status: 403 }
    );
  }
  return null;
}
