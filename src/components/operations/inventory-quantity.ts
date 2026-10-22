const SCALE = 1000;

function roundQuantity(value: number): number {
  return Number.isFinite(value) ? Math.round(value * SCALE) / SCALE : 0;
}

export function normalizeQuantity(value: number): number {
  return Math.max(0, roundQuantity(value));
}

export function stepQuantity(value: number, direction: 1 | -1): number {
  return Math.max(0.001, normalizeQuantity(value + direction));
}

export function calculateBalance(
  current: number,
  quantity: number,
  direction: "IN" | "OUT",
): number {
  return roundQuantity(current + (direction === "IN" ? quantity : -quantity));
}

export function formatQuantity(value: number): string {
  return roundQuantity(value).toFixed(3).replace(/\.?0+$/, "");
}
