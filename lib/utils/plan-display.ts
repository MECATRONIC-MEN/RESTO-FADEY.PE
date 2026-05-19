import type { SaasPlan } from '@/lib/domain/types';

/** Etiqueta de plan para tablas admin (UUID o slug en planId). */
export function resolvePlanLabel(
  planId: string | undefined,
  planById: Map<string, SaasPlan>
): string {
  if (!planId) return '—';
  const plan = planById.get(planId);
  if (plan?.name) return plan.name;
  const lower = planId.toLowerCase();
  if (lower.includes('premium')) return 'Premium';
  if (lower.includes('pro') || lower.includes('intermedio')) return 'Pro';
  if (lower.includes('basico') || lower.includes('básico')) return 'Básico';
  return '—';
}
