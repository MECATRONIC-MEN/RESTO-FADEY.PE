/**
 * Prueba local: simula el POS enviando un pago a la plataforma.
 * Uso: node scripts/test-pos-sync.mjs
 * Requiere: dev server en marcha + API_SECRET_KEY en .env.local
 */
const platformUrl = process.env.NEXT_PUBLIC_PLATFORM_URL ?? 'http://localhost:3000';
const apiSecret = process.env.API_SECRET_KEY ?? process.env.POS_API_KEY;
const clientId = process.env.DEMO_CLIENT_ID ?? 'b0000001-0000-4000-8000-000000000001';

if (!apiSecret) {
  console.error('Define API_SECRET_KEY (o POS_API_KEY) en el entorno.');
  process.exit(1);
}

const base = platformUrl.replace(/\/$/, '');
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${apiSecret}`,
  'X-Client-Id': clientId,
};

const payload = {
  clientId,
  restaurantName: 'Restaurante Demo POS',
  adminName: 'Admin Demo',
  adminEmail: 'demo@restofadey.pe',
  amount: 199,
  method: 'yape',
  voucherUrl: 'https://example.com/voucher-demo.jpg',
  operationNumber: `OP-${Date.now()}`,
  paymentDate: new Date().toISOString(),
  plan: 'Pro',
  paymentStatus: 'pending',
};

const payRes = await fetch(`${base}/api/payments`, {
  method: 'POST',
  headers,
  body: JSON.stringify(payload),
});
const payJson = await payRes.json();
console.log('POST /api/payments', payRes.status, payJson);

const licRes = await fetch(`${base}/api/license-status/${clientId}`, { headers });
const licJson = await licRes.json();
console.log('GET /api/license-status', licRes.status, licJson);

process.exit(payRes.ok && payJson.success ? 0 : 1);
