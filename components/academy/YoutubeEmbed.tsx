import { getYoutubeEmbedUrl } from '@/lib/academy/youtube';

interface YoutubeEmbedProps {
  url: string;
  title?: string;
  className?: string;
}

export function YoutubeEmbed({ url, title, className }: YoutubeEmbedProps) {
  const embed = getYoutubeEmbedUrl(url);
  if (!embed) return null;

  return (
    <iframe
      src={embed}
      title={title ?? 'Video tutorial'}
      className={className ?? 'h-full w-full rounded-lg'}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
}
