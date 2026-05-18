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

const payload = {
  clientId,
  restaurantName: 'Restaurante Demo POS',
  amount: 199,
  method: 'yape',
  voucherUrl: 'https://example.com/voucher-demo.jpg',
  plan: 'pro',
  createdAt: new Date().toISOString(),
  paymentStatus: 'pending',
};

const res = await fetch(`${platformUrl.replace(/\/$/, '')}/api/payments`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiSecret}`,
  },
  body: JSON.stringify(payload),
});

const json = await res.json();
console.log(res.status, JSON.stringify(json, null, 2));
process.exit(res.ok && json.success ? 0 : 1);
