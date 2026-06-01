/** Referencia interna para calcular avance; no se expone en la UI. */
export const PROFIT_GROWTH_REFERENCE = 1_000_000;

export function profitGrowthProgress(amount: number): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return Math.min(100, (amount / PROFIT_GROWTH_REFERENCE) * 100);
}
