'use client';

import { useState } from 'react';
import { Plus, Loader2, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { useAdminApi } from '@/hooks/useAdminApi';
import type { AcademyCourse } from '@/lib/domain/types';
import { AdminPageHeader } from './AdminPageHeader';
import { DashboardCard } from '@/components/dashboard/DashboardCard';

const inputClass =
  'w-full rounded-lg border border-brand-cyan/20 bg-white/10 px-3 py-2 text-sm text-brand-soft placeholder:text-brand-slate';

export function AcademyCoursesPanel() {
  const { data: courses, loading, refetch } = useAdminApi<AcademyCourse[]>('/api/admin/courses');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [publishNow, setPublishNow] = useState(true);
  const [saving, setSaving] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          duration,
          thumbnailUrl,
          contentUrl,
          isPublished: publishNow,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Error');
      setTitle('');
      setDescription('');
      setCategory('');
      setDuration('');
      setThumbnailUrl('');
      setContentUrl('');
      refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error');
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(course: AcademyCourse) {
    const res = await fetch(`/api/admin/courses/${course.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !course.isPublished }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      alert(json.error ?? 'Error');
      return;
    }
    refetch();
  }

  async function remove(id: string) {
    if (!confirm('¿Eliminar este curso?')) return;
    const res = await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok || !json.success) {
      alert(json.error ?? 'Error');
      return;
    }
    refetch();
  }

  const list = courses ?? [];

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <AdminPageHeader
        title="Cursos"
        description="Cree rutas de aprendizaje con enlace al material. Los publicados se listan en el panel del cliente."
      />

      <DashboardCard title="Nuevo curso">
        <form onSubmit={handleCreate} className="space-y-3">
          <input
            required
            placeholder="Título del curso *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
          />
          <textarea
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={inputClass}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              placeholder="Categoría (ej. Operaciones)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
            />
            <input
              placeholder="Duración (ej. 45 min)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className={inputClass}
            />
          </div>
          <input
            placeholder="URL miniatura (opcional)"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            className={inputClass}
          />
          <input
            placeholder="URL del curso / video / PDF (opcional)"
            value={contentUrl}
            onChange={(e) => setContentUrl(e.target.value)}
            className={inputClass}
          />
          <label className="flex items-center gap-2 text-sm text-brand-mist">
            <input
              type="checkbox"
              checked={publishNow}
              onChange={(e) => setPublishNow(e.target.checked)}
            />
            Publicar de inmediato en panel cliente
          </label>
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 text-sm">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {publishNow ? 'Crear y publicar' : 'Guardar borrador'}
          </button>
        </form>
      </DashboardCard>

      <DashboardCard title={`Cursos registrados (${list.length})`}>
        {loading ? (
          <p className="text-sm text-brand-mist">Cargando…</p>
        ) : list.length === 0 ? (
          <p className="text-sm text-brand-mist">
            No hay cursos. Complete el formulario superior para cargar el primero.
          </p>
        ) : (
          <ul className="space-y-3">
            {list.map((c) => (
              <li
                key={c.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-white/10 bg-white/5 p-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-brand-soft">{c.title}</p>
                  {c.category && (
                    <span className="mt-1 inline-block rounded bg-brand-cyan/10 px-2 py-0.5 text-[10px] uppercase text-brand-cyan">
                      {c.category}
                    </span>
                  )}
                  {c.description && <p className="mt-2 text-sm text-brand-mist">{c.description}</p>}
                  <p className="mt-1 text-xs text-brand-slate">
                    {[c.duration, c.isPublished ? 'Visible en cliente' : 'Borrador']
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                  {c.contentUrl && (
                    <a
                      href={c.contentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs text-brand-cyan hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Ver material
                    </a>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => togglePublish(c)}
                    className="rounded-lg border border-white/10 p-2 text-brand-mist hover:bg-white/10"
                    title={c.isPublished ? 'Ocultar del cliente' : 'Publicar en cliente'}
                  >
                    {c.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(c.id)}
                    className="rounded-lg border border-red-400/30 p-2 text-red-200 hover:bg-red-400/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </DashboardCard>
    </div>
  );
}
