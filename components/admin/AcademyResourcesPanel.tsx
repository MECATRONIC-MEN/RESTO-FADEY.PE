'use client';

import { useState } from 'react';
import { Plus, Loader2, Trash2, Eye, EyeOff, ExternalLink, FileText } from 'lucide-react';
import { useAdminApi } from '@/hooks/useAdminApi';
import type { AcademyResource, AcademyResourceType } from '@/lib/domain/types';
import { AdminPageHeader } from './AdminPageHeader';
import { DashboardCard } from '@/components/dashboard/DashboardCard';

const inputClass =
  'w-full rounded-lg border border-brand-cyan/20 bg-white/10 px-3 py-2 text-sm text-brand-soft';

const RESOURCE_TYPES: { value: AcademyResourceType; label: string }[] = [
  { value: 'manual', label: 'Manual' },
  { value: 'plantilla', label: 'Plantilla' },
  { value: 'documento', label: 'Documento' },
  { value: 'enlace', label: 'Enlace' },
];

export function AcademyResourcesPanel() {
  const { data: resources, loading, refetch } = useAdminApi<AcademyResource[]>(
    '/api/admin/resources'
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [resourceType, setResourceType] = useState<AcademyResourceType>('documento');
  const [fileUrl, setFileUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [publishNow, setPublishNow] = useState(true);
  const [saving, setSaving] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          resourceType,
          fileUrl,
          thumbnailUrl,
          isPublished: publishNow,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Error');
      setTitle('');
      setDescription('');
      setCategory('');
      setFileUrl('');
      setThumbnailUrl('');
      refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error');
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(resource: AcademyResource) {
    const res = await fetch(`/api/admin/resources/${resource.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !resource.isPublished }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      alert(json.error ?? 'Error');
      return;
    }
    refetch();
  }

  async function remove(id: string) {
    if (!confirm('¿Eliminar este recurso?')) return;
    const res = await fetch(`/api/admin/resources/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok || !json.success) {
      alert(json.error ?? 'Error');
      return;
    }
    refetch();
  }

  const list = resources ?? [];

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <AdminPageHeader
        title="Recursos"
        description="Manuales, plantillas y documentos descargables. Los publicados aparecen en Academia → Recursos del panel cliente."
      />

      <DashboardCard title="Nuevo recurso">
        <form onSubmit={handleCreate} className="space-y-3">
          <input
            required
            placeholder="Título *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
          />
          <textarea
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className={inputClass}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              placeholder="Categoría (ej. SUNAT, Inventario)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
            />
            <select
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value as AcademyResourceType)}
              className={inputClass}
            >
              {RESOURCE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <input
            required
            placeholder="URL del archivo o enlace de descarga *"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            className={inputClass}
          />
          <input
            placeholder="URL miniatura (opcional)"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            className={inputClass}
          />
          <p className="text-xs text-brand-slate">
            Suba el archivo a Supabase Storage, Google Drive o similar y pegue aquí el enlace público.
          </p>
          <label className="flex items-center gap-2 text-sm text-brand-mist">
            <input
              type="checkbox"
              checked={publishNow}
              onChange={(e) => setPublishNow(e.target.checked)}
            />
            Publicar en panel cliente
          </label>
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 text-sm">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Agregar recurso
          </button>
        </form>
      </DashboardCard>

      <DashboardCard title={`Recursos (${list.length})`}>
        {loading ? (
          <p className="text-sm text-brand-mist">Cargando…</p>
        ) : list.length === 0 ? (
          <p className="text-sm text-brand-mist">No hay recursos cargados aún.</p>
        ) : (
          <ul className="space-y-3">
            {list.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-white/10 bg-white/5 p-4"
              >
                <div className="flex min-w-0 flex-1 gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-gold/15">
                    <FileText className="h-5 w-5 text-brand-gold-light" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-brand-soft">{r.title}</p>
                    <p className="text-xs text-brand-slate">
                      {[r.resourceType, r.category, r.isPublished ? 'Publicado' : 'Borrador']
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                    {r.description && (
                      <p className="mt-1 text-sm text-brand-mist">{r.description}</p>
                    )}
                    <a
                      href={r.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs text-brand-cyan hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Ver enlace
                    </a>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => togglePublish(r)}
                    className="rounded-lg border border-white/10 p-2 text-brand-mist hover:bg-white/10"
                    title={r.isPublished ? 'Ocultar' : 'Publicar'}
                  >
                    {r.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(r.id)}
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
