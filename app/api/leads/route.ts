import { jsonOk, jsonError } from '@/lib/api/server-auth';
import { createLead } from '@/lib/services/leads';
import type { CommercialLead } from '@/lib/domain/types';

/** POST — lead comercial desde /register (sin crear cuenta) */
export async function POST(request: Request) {
  let body: CommercialLead;
  try {
    body = await request.json();
  } catch {
    return jsonError('JSON inválido');
  }

  if (!body.name || !body.email) {
    return jsonError('name y email son requeridos');
  }

  try {
    const result = await createLead(body);
    return jsonOk(result, 201);
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
