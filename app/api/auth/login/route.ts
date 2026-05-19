import { jsonOk, jsonError } from '@/lib/api/server-auth';
import { verifyUserPassword } from '@/lib/services/users';
import { signPlatformToken } from '@/lib/jwt';

/**
 * Login compartido POS + plataforma (mismo email/contraseña en tabla users).
 * POST /api/auth/login
 */
export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError('JSON inválido');
  }

  if (!body.email || !body.password) {
    return jsonError('usuario (o email) y password son requeridos');
  }

  const user = await verifyUserPassword(body.email.trim(), body.password);
  if (!user) {
    return jsonError('Credenciales inválidas', 401);
  }

  const token = await signPlatformToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    clientId: user.clientId,
    name: user.name,
  });

  return jsonOk({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      clientId: user.clientId,
      restaurant: user.restaurant,
      plan: user.plan,
    },
  });
}
