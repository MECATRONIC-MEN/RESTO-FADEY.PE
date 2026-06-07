/** Eventos estándar del píxel TikTok en el navegador */
export type TikTokBrowserEventName = 'SubmitForm' | 'CompleteRegistration' | 'Contact';

type TikTokQueue = {
  track: (event: string, params?: Record<string, unknown>) => void;
  identify?: (params: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    ttq?: TikTokQueue;
  }
}

export type TikTokSubmitFormParams = {
  /** Mismo ID que el servidor (demo_xxx / lead_xxx) para deduplicación */
  eventId: string;
  contentName: string;
  email?: string;
  phone?: string;
};

/** Dispara SubmitForm en el navegador (complementa Events API server-side). */
export function trackTikTokSubmitForm(params: TikTokSubmitFormParams): void {
  if (typeof window === 'undefined' || !window.ttq?.track) return;

  window.ttq.track('SubmitForm', {
    event_id: params.eventId,
    contents: [
      {
        content_name: params.contentName,
        content_type: 'lead',
      },
    ],
  });
}
