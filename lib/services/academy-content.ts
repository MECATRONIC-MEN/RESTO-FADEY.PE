import { ACADEMY_SYSTEM_MODULES } from '@/lib/academy/system-modules';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type {
  AcademyCourse,
  AcademyModuleVideo,
  AcademyResource,
  AcademyResourceType,
  ClientPromotion,
} from '@/lib/domain/types';

let mockCourses: AcademyCourse[] = [];
let mockVideos: Record<string, Partial<AcademyModuleVideo>> = {};
let mockResources: AcademyResource[] = [];

function mapCourse(row: Record<string, unknown>): AcademyCourse {
  return {
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string) ?? undefined,
    category: (row.category as string) ?? undefined,
    thumbnailUrl: (row.thumbnail_url as string) ?? undefined,
    contentUrl: (row.content_url as string) ?? undefined,
    duration: (row.duration as string) ?? undefined,
    isPublished: Boolean(row.is_published),
    sortOrder: Number(row.sort_order ?? 0),
    createdAt: row.created_at as string,
  };
}

export async function listCourses(publishedOnly = false): Promise<AcademyCourse[]> {
  if (!isSupabaseConfigured()) {
    const list = [...mockCourses].sort((a, b) => a.sortOrder - b.sortOrder);
    return publishedOnly ? list.filter((c) => c.isPublished) : list;
  }

  const db = getSupabaseAdmin()!;
  let q = db.from('courses').select('*').order('sort_order', { ascending: true });
  if (publishedOnly) q = q.eq('is_published', true);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => mapCourse(r as Record<string, unknown>));
}

export async function createCourse(input: {
  title: string;
  description?: string;
  category?: string;
  thumbnailUrl?: string;
  contentUrl?: string;
  duration?: string;
  isPublished?: boolean;
}): Promise<AcademyCourse> {
  if (!isSupabaseConfigured()) {
    const course: AcademyCourse = {
      id: `course_${Date.now()}`,
      title: input.title,
      description: input.description,
      category: input.category,
      thumbnailUrl: input.thumbnailUrl,
      contentUrl: input.contentUrl,
      duration: input.duration,
      isPublished: input.isPublished ?? false,
      sortOrder: mockCourses.length,
      createdAt: new Date().toISOString(),
    };
    mockCourses.push(course);
    return course;
  }

  const db = getSupabaseAdmin()!;
  const { data, error } = await db
    .from('courses')
    .insert({
      title: input.title,
      description: input.description ?? null,
      category: input.category ?? null,
      thumbnail_url: input.thumbnailUrl ?? null,
      content_url: input.contentUrl ?? null,
      duration: input.duration ?? null,
      is_published: input.isPublished ?? false,
      sort_order: (await listCourses()).length,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return mapCourse(data as Record<string, unknown>);
}

export async function updateCourse(
  id: string,
  input: Partial<{
    title: string;
    description: string;
    category: string;
    thumbnailUrl: string;
    contentUrl: string;
    duration: string;
    isPublished: boolean;
  }>
): Promise<AcademyCourse> {
  if (!isSupabaseConfigured()) {
    const idx = mockCourses.findIndex((c) => c.id === id);
    if (idx < 0) throw new Error('Curso no encontrado');
    mockCourses[idx] = { ...mockCourses[idx], ...input };
    return mockCourses[idx];
  }

  const db = getSupabaseAdmin()!;
  const { data, error } = await db
    .from('courses')
    .update({
      title: input.title,
      description: input.description,
      category: input.category,
      thumbnail_url: input.thumbnailUrl,
      content_url: input.contentUrl,
      duration: input.duration,
      is_published: input.isPublished,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return mapCourse(data as Record<string, unknown>);
}

export async function deleteCourse(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    mockCourses = mockCourses.filter((c) => c.id !== id);
    return;
  }
  const db = getSupabaseAdmin()!;
  const { error } = await db.from('courses').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function listModuleVideos(publishedOnly = false): Promise<AcademyModuleVideo[]> {
  const dbRows = new Map<string, Record<string, unknown>>();

  if (isSupabaseConfigured()) {
    const db = getSupabaseAdmin()!;
    let q = db.from('academy_videos').select('*').order('sort_order', { ascending: true });
    if (publishedOnly) q = q.eq('is_published', true);
    const { data, error } = await q;
    if (error && !error.message.includes('does not exist')) throw new Error(error.message);
    for (const row of data ?? []) {
      dbRows.set(row.module_slug as string, row as Record<string, unknown>);
    }
  } else {
    for (const [slug, v] of Object.entries(mockVideos)) {
      dbRows.set(slug, {
        module_slug: slug,
        title: v.title,
        description: v.description,
        video_url: v.videoUrl,
        thumbnail_url: v.thumbnailUrl,
        is_published: v.isPublished,
      });
    }
  }

  return ACADEMY_SYSTEM_MODULES.map((mod, index) => {
    const row = dbRows.get(mod.slug);
    const videoUrl = row?.video_url as string | undefined;
    const isPublished = row ? Boolean(row.is_published) : false;
    return {
      slug: mod.slug,
      title: (row?.title as string) ?? mod.title,
      description: (row?.description as string) ?? mod.description,
      videoUrl,
      thumbnailUrl: (row?.thumbnail_url as string) ?? undefined,
      isPublished,
      hasVideo: Boolean(videoUrl?.trim()),
    };
  });
}

export async function upsertModuleVideo(
  moduleSlug: string,
  input: {
    title: string;
    description?: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    isPublished?: boolean;
  }
): Promise<AcademyModuleVideo> {
  const mod = ACADEMY_SYSTEM_MODULES.find((m) => m.slug === moduleSlug);
  if (!mod) throw new Error('Módulo no válido');

  if (!isSupabaseConfigured()) {
    mockVideos[moduleSlug] = {
      title: input.title,
      description: input.description,
      videoUrl: input.videoUrl,
      thumbnailUrl: input.thumbnailUrl,
      isPublished: input.isPublished,
    };
    const list = await listModuleVideos(false);
    return list.find((v) => v.slug === moduleSlug)!;
  }

  const db = getSupabaseAdmin()!;
  const { data, error } = await db
    .from('academy_videos')
    .upsert(
      {
        module_slug: moduleSlug,
        title: input.title,
        description: input.description ?? mod.description,
        video_url: input.videoUrl ?? null,
        thumbnail_url: input.thumbnailUrl ?? null,
        is_published: input.isPublished ?? false,
        sort_order: ACADEMY_SYSTEM_MODULES.findIndex((m) => m.slug === moduleSlug),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'module_slug' }
    )
    .select()
    .single();
  if (error) throw new Error(error.message);

  const videoUrl = data.video_url as string | undefined;
  return {
    slug: moduleSlug,
    title: data.title as string,
    description: (data.description as string) ?? mod.description,
    videoUrl,
    thumbnailUrl: (data.thumbnail_url as string) ?? undefined,
    isPublished: Boolean(data.is_published),
    hasVideo: Boolean(videoUrl?.trim()),
  };
}

function mapResource(row: Record<string, unknown>): AcademyResource {
  return {
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string) ?? undefined,
    category: (row.category as string) ?? undefined,
    resourceType: (row.resource_type as AcademyResourceType) ?? 'documento',
    fileUrl: row.file_url as string,
    thumbnailUrl: (row.thumbnail_url as string) ?? undefined,
    isPublished: Boolean(row.is_published),
    sortOrder: Number(row.sort_order ?? 0),
    createdAt: row.created_at as string,
  };
}

export async function listResources(publishedOnly = false): Promise<AcademyResource[]> {
  if (!isSupabaseConfigured()) {
    const list = [...mockResources].sort((a, b) => a.sortOrder - b.sortOrder);
    return publishedOnly ? list.filter((r) => r.isPublished) : list;
  }

  const db = getSupabaseAdmin()!;
  let q = db.from('academy_resources').select('*').order('sort_order', { ascending: true });
  if (publishedOnly) q = q.eq('is_published', true);
  const { data, error } = await q;
  if (error && !error.message.includes('does not exist')) throw new Error(error.message);
  return (data ?? []).map((r) => mapResource(r as Record<string, unknown>));
}

export async function createResource(input: {
  title: string;
  description?: string;
  category?: string;
  resourceType?: AcademyResourceType;
  fileUrl: string;
  thumbnailUrl?: string;
  isPublished?: boolean;
}): Promise<AcademyResource> {
  if (!input.fileUrl?.trim()) throw new Error('URL del recurso requerida');

  if (!isSupabaseConfigured()) {
    const resource: AcademyResource = {
      id: `res_${Date.now()}`,
      title: input.title,
      description: input.description,
      category: input.category,
      resourceType: input.resourceType ?? 'documento',
      fileUrl: input.fileUrl.trim(),
      thumbnailUrl: input.thumbnailUrl,
      isPublished: input.isPublished ?? false,
      sortOrder: mockResources.length,
      createdAt: new Date().toISOString(),
    };
    mockResources.push(resource);
    return resource;
  }

  const db = getSupabaseAdmin()!;
  const { data, error } = await db
    .from('academy_resources')
    .insert({
      title: input.title,
      description: input.description ?? null,
      category: input.category ?? null,
      resource_type: input.resourceType ?? 'documento',
      file_url: input.fileUrl.trim(),
      thumbnail_url: input.thumbnailUrl ?? null,
      is_published: input.isPublished ?? false,
      sort_order: (await listResources()).length,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return mapResource(data as Record<string, unknown>);
}

export async function updateResource(
  id: string,
  input: Partial<{
    title: string;
    description: string;
    category: string;
    resourceType: AcademyResourceType;
    fileUrl: string;
    thumbnailUrl: string;
    isPublished: boolean;
  }>
): Promise<AcademyResource> {
  if (!isSupabaseConfigured()) {
    const idx = mockResources.findIndex((r) => r.id === id);
    if (idx < 0) throw new Error('Recurso no encontrado');
    mockResources[idx] = { ...mockResources[idx], ...input };
    return mockResources[idx];
  }

  const db = getSupabaseAdmin()!;
  const { data, error } = await db
    .from('academy_resources')
    .update({
      title: input.title,
      description: input.description,
      category: input.category,
      resource_type: input.resourceType,
      file_url: input.fileUrl,
      thumbnail_url: input.thumbnailUrl,
      is_published: input.isPublished,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return mapResource(data as Record<string, unknown>);
}

export async function deleteResource(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    mockResources = mockResources.filter((r) => r.id !== id);
    return;
  }
  const db = getSupabaseAdmin()!;
  const { error } = await db.from('academy_resources').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function listActivePromotions(): Promise<ClientPromotion[]> {
  const now = new Date().toISOString();

  if (!isSupabaseConfigured()) return [];

  const db = getSupabaseAdmin()!;
  const { data, error } = await db
    .from('promotions')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? [])
    .filter((p) => {
      if (p.ends_at && new Date(p.ends_at as string) < new Date(now)) return false;
      if (p.starts_at && new Date(p.starts_at as string) > new Date(now)) return false;
      return true;
    })
    .map((p) => ({
      id: p.id as string,
      title: p.title as string,
      description: (p.description as string) ?? undefined,
      bannerUrl: (p.banner_url as string) ?? undefined,
      discountPercent: p.discount_percent != null ? Number(p.discount_percent) : undefined,
      endsAt: (p.ends_at as string) ?? undefined,
    }));
}
