import { jsonOk, jsonError } from '@/lib/api/server-auth';
import { createAdminNotification } from '@/lib/services/notifications';

type PwaBody = {
  platform?: string;
  source?: string;
  userAgent?: string;
};

function detectPlatform(ua: string): string {
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Android/i.test(ua)) return 'Android';
  if (/Windows/i.test(ua)) return 'Windows';
  if (/Mac/i.test(ua)) return 'macOS';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Desconocido';
}

/** POST — aviso cuando alguien instala la PWA (público) */
export async function POST(request: Request) {
  let body: PwaBody = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const ua = body.userAgent ?? request.headers.get('user-agent') ?? '';
  const platform = body.platform ?? detectPlatform(ua);
  const source = body.source ?? 'install';

  const sourceLabel =
    source === 'standalone'
      ? 'abrió la app instalada'
      : source === 'appinstalled'
        ? 'instaló la aplicación'
        : 'registró instalación';

  try {
    const notification = await createAdminNotification({
      type: 'pwa_install',
      title: 'App instalada en dispositivo',
      body: `${platform} — usuario ${sourceLabel}`,
      payload: { platform, source, userAgent: ua.slice(0, 500) },
    });
    return jsonOk({ id: notification.id }, 201);
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
