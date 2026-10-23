export function parseWholePurchaseQuantity(value: string): number | null {
  if (value === "") return 0;
  if (!/^[0-9]+$/.test(value)) return null;
  const quantity = Number(value);
  return Number.isSafeInteger(quantity) ? quantity : null;
}
