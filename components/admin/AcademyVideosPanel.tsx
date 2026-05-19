'use client';

import { useState } from 'react';
import { Loader2, Save, ExternalLink } from 'lucide-react';
import { useAdminApi } from '@/hooks/useAdminApi';
import type { AcademyModuleVideo } from '@/lib/domain/types';
import { AdminPageHeader } from './AdminPageHeader';
import { DashboardCard } from '@/components/dashboard/DashboardCard';

const inputClass =
  'w-full rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-brand-soft placeholder:text-brand-slate';

export function AcademyVideosPanel() {
  const { data: modules, loading, refetch } = useAdminApi<AcademyModuleVideo[]>('/api/admin/videos');
  const [editing, setEditing] = useState<Record<string, Partial<AcademyModuleVideo>>>({});
  const [savingSlug, setSavingSlug] = useState<string | null>(null);

  function getEdit(mod: AcademyModuleVideo) {
    return editing[mod.slug] ?? mod;
  }

  function setField(slug: string, field: keyof AcademyModuleVideo, value: string | boolean) {
    setEditing((prev) => {
      const base = modules?.find((m) => m.slug === slug);
      if (!base) return prev;
      const current = prev[slug] ?? base;
      return { ...prev, [slug]: { ...current, [field]: value } };
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
          thumbnailUrl: data.thumbnailUrl,
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
      alert(e instanceof Error ? e.message : 'Error');
    } finally {
      setSavingSlug(null);
    }
  }

  const list = modules ?? [];
  const publishedCount = list.filter((m) => m.isPublished && m.hasVideo).length;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <AdminPageHeader
        title="Videos por módulo"
        description={`Configure los 9 tutoriales del sistema. En el panel cliente se muestran en rejilla 3×3. Publicados con video: ${publishedCount}/9.`}
      />

      {loading ? (
        <p className="text-brand-mist">Cargando módulos…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((mod) => {
            const data = getEdit(mod);
            const dirty = Boolean(editing[mod.slug]);
            return (
              <DashboardCard key={mod.slug} title={mod.title}>
                <p className="mb-3 text-xs text-brand-slate">{mod.description}</p>
                <div className="space-y-2">
                  <input
                    value={data.title ?? ''}
                    onChange={(e) => setField(mod.slug, 'title', e.target.value)}
                    className={inputClass}
                    placeholder="Título visible"
                  />
                  <textarea
                    value={data.description ?? ''}
                    onChange={(e) => setField(mod.slug, 'description', e.target.value)}
                    className={inputClass}
                    rows={2}
                    placeholder="Descripción breve"
                  />
                  <input
                    value={data.videoUrl ?? ''}
                    onChange={(e) => setField(mod.slug, 'videoUrl', e.target.value)}
                    className={inputClass}
                    placeholder="URL del video (YouTube, Vimeo, etc.)"
                  />
                  <input
                    value={data.thumbnailUrl ?? ''}
                    onChange={(e) => setField(mod.slug, 'thumbnailUrl', e.target.value)}
                    className={inputClass}
                    placeholder="URL miniatura (opcional)"
                  />
                  <label className="flex items-center gap-2 text-xs text-brand-mist">
                    <input
                      type="checkbox"
                      checked={Boolean(data.isPublished)}
                      onChange={(e) => setField(mod.slug, 'isPublished', e.target.checked)}
                    />
                    Publicado en panel cliente
                  </label>
                  {data.videoUrl && (
                    <a
                      href={data.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] text-brand-cyan hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Probar enlace
                    </a>
                  )}
                  <button
                    type="button"
                    disabled={savingSlug === mod.slug}
                    onClick={() => save(mod)}
                    className="btn-secondary flex w-full items-center justify-center gap-1 py-1.5 text-xs"
                  >
                    {savingSlug === mod.slug ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Save className="h-3 w-3" />
                    )}
                    {dirty ? 'Guardar cambios' : 'Guardar'}
                  </button>
                </div>
              </DashboardCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
