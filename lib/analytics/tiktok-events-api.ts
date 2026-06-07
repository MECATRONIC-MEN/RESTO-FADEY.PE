import { createHash } from 'crypto';
import { TIKTOK_PIXEL_ID } from '@/lib/analytics/tiktok-pixel';

export type TikTokServerEventName =
  | 'SubmitForm'
  | 'CompleteRegistration'
  | 'Contact'
  | 'PageView';

export type TikTokTrackParams = {
  event: TikTokServerEventName;
  eventId: string;
  email?: string;
  phone?: string;
  ip?: string;
  userAgent?: string;
  properties?: Record<string, unknown>;
};

function hashForTikTok(value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

/** Envía un evento server-side a TikTok Events API (requiere TIKTOK_ACCESS_TOKEN). */
export async function trackTikTokServerEvent(params: TikTokTrackParams): Promise<void> {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN?.trim();
  const pixelCode = process.env.TIKTOK_PIXEL_ID?.trim() || TIKTOK_PIXEL_ID;
  if (!accessToken) return;

  const user: Record<string, string> = {};
  if (params.email) user.email = hashForTikTok(params.email);
  if (params.phone) {
    const digits = params.phone.replace(/\D/g, '');
    if (digits) user.phone = hashForTikTok(digits);
  }

  const context: Record<string, string> = {};
  if (params.ip) context.ip = params.ip;
  if (params.userAgent) context.user_agent = params.userAgent;

  const siteUrl = process.env.NEXT_PUBLIC_PLATFORM_URL || 'https://restofadey.pe';

  const body: Record<string, unknown> = {
    pixel_code: pixelCode,
    event: params.event,
    event_id: params.eventId,
    timestamp: new Date().toISOString(),
  };

  if (Object.keys(context).length) {
    body.context = { ...context, page: { url: siteUrl } };
  }

  if (Object.keys(user).length) body.user = user;
  if (params.properties) body.properties = params.properties;

  try {
    const res = await fetch('https://business-api.tiktok.com/open_api/v1.3/pixel/track/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': accessToken,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('[tiktok] Events API:', res.status, text);
    }
  } catch (err) {
    console.error('[tiktok] Events API:', err instanceof Error ? err.message : err);
  }
}

/** No bloquea la respuesta al usuario si TikTok falla. */
export function trackTikTokServerEventAsync(params: TikTokTrackParams): void {
  void trackTikTokServerEvent(params);
}
