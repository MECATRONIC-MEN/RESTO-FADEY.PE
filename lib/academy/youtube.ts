/** Extrae el ID de un enlace o embed de YouTube */
export function extractYoutubeVideoId(url: string): string | null {
  if (!url?.trim()) return null;
  const raw = url.trim();

  try {
    const parsed = new URL(raw);
    const host = parsed.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = parsed.pathname.slice(1).split('/')[0];
      return id || null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      if (parsed.pathname.startsWith('/embed/')) {
        return parsed.pathname.split('/')[2] ?? null;
      }
      if (parsed.pathname.startsWith('/shorts/')) {
        return parsed.pathname.split('/')[2] ?? null;
      }
      const v = parsed.searchParams.get('v');
      return v || null;
    }
  } catch {
    /* no es URL absoluta */
  }

  const embedMatch = raw.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/);
  if (embedMatch) return embedMatch[1];

  const watchMatch = raw.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
  if (watchMatch) return watchMatch[1];

  const shortMatch = raw.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  if (shortMatch) return shortMatch[1];

  return null;
}

export function getYoutubeEmbedUrl(url: string): string | null {
  const id = extractYoutubeVideoId(url);
  if (!id) return null;
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
}

export function isYoutubeUrl(url: string): boolean {
  return Boolean(extractYoutubeVideoId(url));
}
