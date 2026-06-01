import { SITE_URL } from '@/lib/constants';

export function buildLicenseKeyFromClientId(clientId: string): string {
  return `RF-${clientId.slice(0, 8).toUpperCase()}`;
}

export function buildPosRenderEnvTemplate(opts: {
  clientId: string;
  licenseKey: string;
  restaurantName: string;
  planName: string;
  centralApiUrl?: string;
  expirationDate?: string;
}): string {
  const central = opts.centralApiUrl ?? SITE_URL;
  const lines = [
    '# Variables para vincular el POS en Render',
    `CLIENT_ID=${opts.clientId}`,
    `LICENSE_KEY=${opts.licenseKey}`,
    `CENTRAL_API_URL=${central}`,
    `RESTAURANT_NAME=${opts.restaurantName}`,
    `PLAN=${opts.planName}`,
    'API_SECRET_KEY=(misma clave del panel SaaS — Entorno e integraciones)',
  ];
  if (opts.expirationDate) {
    lines.push(`LICENSE_EXPIRES=${opts.expirationDate}`);
  }
  lines.push('', '# Luego use «Conectar restaurante» en Clientes con la URL Render y este CLIENT_ID.');
  return lines.join('\n');
}
