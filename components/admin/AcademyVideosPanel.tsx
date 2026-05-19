'use client';

import { useMemo, useState } from 'react';
import { Loader2, Save, Plus, Trash2 } from 'lucide-react';
import { useAdminApi } from '@/hooks/useAdminApi';
import { buildDefaultModuleVideos } from '@/lib/academy/default-modules';
import { getYoutubeEmbedUrl } from '@/lib/academy/youtube';
import type { AcademyModuleVideo } from '@/lib/domain/types';
import { AdminPageHeader } from './AdminPageHeader';
import { YoutubeEmbed } from '@/components/academy/YoutubeEmbed';

const inputClass =
  'w-full rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-brand-soft placeholder:text-brand-slate';

function mergeWithDefaults(apiModules: AcademyModuleVideo[] | null | undefined): AcademyModuleVideo[] {
  const defaults = buildDefaultModuleVideos();
  if (!apiModules?.length) return defaults;

  const bySlug = new Map(apiModules.map((m) => [m.slug, m]));
  const system = defaults.map((d) => bySlug.get(d.slug) ?? d);
  const customs = apiModules.filter((m) => m.isCustom || !defaults.some((d) => d.slug === m.slug));
  return [...system, ...customs];
}

interface AcademyVideosPanelProps {
  initialModules?: AcademyModuleVideo[];
}

export function AcademyVideosPanel({ initialModules }: AcademyVideosPanelProps) {
  const { data: apiModules, loading, error, refetch } = useAdminApi<AcademyModuleVideo[]>(
    '/api/admin/videos'
  );
  const [editing, setEditing] = useState<Record<string, Partial<AcademyModuleVideo>>>({});
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);

  const list = useMemo(
    () => mergeWithDefaults(apiModules ?? initialModules),
    [apiModules, initialModules]
  );

  function getEdit(mod: AcademyModuleVideo) {
    return { ...mod, ...editing[mod.slug] };
  }

  function setField(slug: string, field: keyof AcademyModuleVideo, value: string | boolean) {
    setEditing((prev) => {
      const base = list.find((m) => m.slug === slug);
      if (!base) return prev;
      return { ...prev, [slug]: { ...prev[slug], ...base, [field]: value } };
    });
  }

  async function save(mod: AcademyModuleVideo) {
    const data = getEdit(mod);
    setSavingSlug(mod.slug);
    try {
      const res = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleSlug: mod.slug,
          title: data.title,
          description: data.description,
          videoUrl: data.videoUrl,
          isPublished: data.isPublished,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Error');
      setEditing((prev) => {
        const next = { ...prev };
        delete next[mod.slug];
        return next;
      });
      refetch();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error al guardar');
    } finally {
      setSavingSlug(null);
    }
  }

  async function remove(mod: AcademyModuleVideo) {
    const msg = mod.isCustom
      ? '¿Eliminar este módulo de video?'
      : '¿Quitar el video de este módulo? (el espacio del sistema se mantiene)';
    if (!confirm(msg)) return;

    try {
      const res = await fetch(`/api/admin/videos?moduleSlug=${encodeURIComponent(mod.slug)}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Error');
      refetch();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error al eliminar');
    }
  }

  async function addModule() {
    const title = prompt('Título del nuevo módulo de video:');
    if (!title?.trim()) return;
    setSavingSlug('__new__');
    try {
      const res = await fetch('/api/admin/videos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Error');
      refetch();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error');
    } finally {
      setSavingSlug(null);
    }
  }

  const publishedCount = list.filter((m) => m.isPublished && m.hasVideo).length;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminPageHeader
        title="Videos por módulo"
        description={`Rejilla igual al panel cliente (3×3). Pegue la URL de YouTube y reproduzca aquí. Publicados con video: ${publishedCount}/${list.length}.`}
      />

      {error && (
        <p className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          No se pudo sincronizar con el servidor ({error}). Mostrando módulos por defecto; puede
          editar y guardar igualmente.
        </p>
      )}

      {loading && !list.length ? (
        <p className="text-brand-mist">Cargando módulos…</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((mod) => {
              const data = getEdit(mod);
              const embed = data.videoUrl ? getYoutubeEmbedUrl(data.videoUrl) : null;
              const showPreview = previewSlug === mod.slug && embed;

              return (
                <article
                  key={mod.slug}
                  className="flex flex-col rounded-xl border border-brand-gold/20 bg-white/5 p-3"
                >
                  <div className="relative mb-3 aspect-video overflow-hidden rounded-lg bg-brand-navy/80">
                    {showPreview && data.videoUrl ? (
                      <YoutubeEmbed
                        url={data.videoUrl}
                        title={data.title}
                        className="absolute inset-0 h-full w-full"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-2 text-center text-xs text-brand-slate">
                        {embed ? 'Vista previa disponible' : 'Espacio vacío — agregue URL de YouTube'}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <input
                      value={data.title ?? ''}
                      onChange={(e) => setField(mod.slug, 'title', e.target.value)}
                      className={inputClass}
                      placeholder="Título"
                    />
                    <textarea
                      value={data.description ?? ''}
                      onChange={(e) => setField(mod.slug, 'description', e.target.value)}
                      className={inputClass}
                      rows={2}
                      placeholder="Descripción"
                    />
                    <input
                      value={data.videoUrl ?? ''}
                      onChange={(e) => setField(mod.slug, 'videoUrl', e.target.value)}
                      className={inputClass}
                      placeholder="URL YouTube (watch o youtu.be)"
                    />
                    <label className="flex items-center gap-2 text-xs text-brand-mist">
                      <input
                        type="checkbox"
                        checked={Boolean(data.isPublished)}
                        onChange={(e) => setField(mod.slug, 'isPublished', e.target.checked)}
                      />
                      Publicado en panel cliente
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {embed && (
                        <button
                          type="button"
                          onClick={() => setPreviewSlug(showPreview ? null : mod.slug)}
                          className="btn-secondary flex-1 py-1.5 text-[10px]"
                        >
                          {showPreview ? 'Ocultar' : 'Vista previa'}
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={savingSlug === mod.slug}
                        onClick={() => save(mod)}
                        className="btn-primary flex flex-1 items-center justify-center gap-1 py-1.5 text-[10px]"
                      >
                        {savingSlug === mod.slug ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Save className="h-3 w-3" />
                        )}
                        Guardar
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(mod)}
                        className="rounded border border-red-400/30 p-1.5 text-red-200 hover:bg-red-400/10"
                        title="Eliminar"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <button
            type="button"
            disabled={savingSlug === '__new__'}
            onClick={addModule}
            className="btn-secondary flex w-full items-center justify-center gap-2 py-3 text-sm sm:w-auto"
          >
            {savingSlug === '__new__' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Agregar módulo de video
          </button>
        </>
      )}
    </div>
  );
}
