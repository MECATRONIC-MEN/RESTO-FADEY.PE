/**
 * Ejemplo de endpoints que el POS en Render debe exponer
 * para "Conectar Restaurante" desde el panel SaaS.
 *
 * Copiar/adaptar en el repositorio del POS:
 * - app/api/restaurant/info/route.ts
 * - app/api/system/health/route.ts
 * - app/api/license/confirm/route.ts
 */

import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.CLIENT_ID!;
const API_SECRET = process.env.API_SECRET_KEY!;

function authOk(request: Request): boolean {
  const bearer = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  return bearer === API_SECRET;
}

/** GET /api/restaurant/info */
export async function GET_restaurantInfo(request: Request) {
  if (!authOk(request)) {
    return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
  }

  return NextResponse.json({
    clientId: CLIENT_ID,
    apiKey: API_SECRET,
    restaurantName: process.env.RESTAURANT_NAME ?? 'Mi Restaurante',
    ownerName: process.env.OWNER_NAME ?? 'Propietario',
    ruc: process.env.RUC ?? '',
    phone: process.env.PHONE ?? '',
    email: process.env.EMAIL ?? '',
    plan: process.env.PLAN ?? 'Pro',
    licenseStatus: 'active',
    expirationDate: process.env.LICENSE_EXPIRES ?? new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    renderUrl: process.env.RENDER_EXTERNAL_URL ?? '',
    systemVersion: '1.0.0',
  });
}

/** GET /api/system/health */
export async function GET_systemHealth() {
  return NextResponse.json({ status: 'online' });
}

/** POST /api/license/confirm */
export async function POST_licenseConfirm(request: Request) {
  if (!authOk(request)) {
    return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
  }
  const body = await request.json();
  // Actualizar licencia local en el POS según body.licenseStatus
  return NextResponse.json({ success: true, licenseStatus: body.licenseStatus ?? 'active' });
}
