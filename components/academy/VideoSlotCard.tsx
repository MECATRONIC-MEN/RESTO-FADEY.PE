'use client';

import { useState } from 'react';
import { PlayCircle, Clock, X } from 'lucide-react';
import type { AcademyModuleVideo } from '@/lib/domain/types';
import { getYoutubeEmbedUrl } from '@/lib/academy/youtube';
import { YoutubeEmbed } from './YoutubeEmbed';
import { cn } from '@/lib/utils';

interface VideoSlotCardProps {
  module: AcademyModuleVideo;
  /** Vista cliente: solo muestra reproductor si está publicado */
  clientView?: boolean;
}

export function VideoSlotCard({ module: mod, clientView = true }: VideoSlotCardProps) {
  const [playing, setPlaying] = useState(false);
  const embedUrl = mod.videoUrl ? getYoutubeEmbedUrl(mod.videoUrl) : null;
  const canPlay = Boolean(embedUrl && mod.hasVideo && (!clientView || mod.isPublished));

  return (
    <article
      className={cn(
        'flex flex-col rounded-xl border border-brand-cyan/15 bg-white/5 p-4 transition-colors',
        canPlay && 'hover:border-brand-cyan/30'
      )}
    >
      <div className="relative mb-3 aspect-video overflow-hidden rounded-lg bg-brand-navy/80">
        {playing && canPlay && mod.videoUrl ? (
          <>
            <YoutubeEmbed url={mod.videoUrl} title={mod.title} className="absolute inset-0 h-full w-full" />
            <button
              type="button"
              onClick={() => setPlaying(false)}
              className="absolute right-2 top-2 rounded-full bg-brand-deep/80 p-1 text-brand-soft hover:bg-brand-deep"
              aria-label="Cerrar video"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            disabled={!canPlay}
            onClick={() => canPlay && setPlaying(true)}
            className={cn(
              'flex h-full w-full flex-col items-center justify-center gap-2 px-2',
              canPlay ? 'cursor-pointer hover:bg-brand-cyan/5' : 'cursor-default'
            )}
          >
            {canPlay ? (
              <>
                <PlayCircle className="h-10 w-10 text-brand-cyan" />
                <span className="text-xs text-brand-cyan">Reproducir tutorial</span>
              </>
            ) : (
              <span className="text-center text-xs text-brand-slate">
                {clientView && mod.isPublished && !mod.hasVideo
                  ? 'Video pendiente'
                  : clientView && !mod.isPublished
                    ? 'Próximamente'
                    : 'Sin video'}
              </span>
            )}
          </button>
        )}
      </div>
      <h3 className="font-medium text-brand-soft">{mod.title}</h3>
      {mod.description && <p className="mt-1 flex-1 text-xs text-brand-mist">{mod.description}</p>}
      {!clientView && (
        <p className="mt-2 text-[10px] uppercase text-brand-slate">
          {mod.isPublished ? 'Publicado' : 'Borrador'}
          {mod.hasVideo ? ' · Con URL' : ''}
        </p>
      )}
      {clientView && !mod.isPublished && (
        <p className="mt-2 flex items-center gap-1 text-[10px] uppercase text-brand-slate">
          <Clock className="h-3 w-3" />
          En preparación
        </p>
      )}
    </article>
  );
}
