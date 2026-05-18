/** Cliente admin — eliminar notificaciones y solicitudes */
export async function deleteNotification(id: string): Promise<void> {
  const res = await fetch(`/api/notifications/${encodeURIComponent(id)}`, { method: 'DELETE' });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error ?? 'No se pudo eliminar');
  }
}

export async function deleteLeadById(id: string): Promise<void> {
  const res = await fetch(`/api/leads/${encodeURIComponent(id)}`, { method: 'DELETE' });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error ?? 'No se pudo eliminar');
  }
}

export async function deleteDemoById(id: string): Promise<void> {
  const res = await fetch(`/api/demos/${encodeURIComponent(id)}`, { method: 'DELETE' });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error ?? 'No se pudo eliminar');
  }
}
