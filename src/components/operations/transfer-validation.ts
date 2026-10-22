export type TransferLine = { productId: string; quantity: number };
export type TransferProduct = {
  id: string;
  stockLevels: Array<{
    quantityOnHand: string | number;
    quantityReserved: string | number;
  }>;
};

export function availableStock(product: TransferProduct): number {
  const level = product.stockLevels[0];
  return Math.max(
    0,
    Number(level?.quantityOnHand ?? 0) - Number(level?.quantityReserved ?? 0),
  );
}

export function validateTransferLines(
  lines: TransferLine[],
  products: TransferProduct[],
): string | null {
  if (!lines.length || lines.some((line) => !line.productId)) {
    return "Select a product for every transfer item.";
  }
  if (new Set(lines.map((line) => line.productId)).size !== lines.length) {
    return "Each product can appear only once in a transfer.";
  }
  for (const line of lines) {
    if (!Number.isFinite(line.quantity) || line.quantity <= 0) {
      return "Enter a quantity greater than zero for every item.";
    }
    const product = products.find((item) => item.id === line.productId);
    if (!product) return "The selected product is no longer available.";
    if (line.quantity > availableStock(product)) {
      return "Quantity cannot exceed available stock at source.";
    }
  }
  return null;
}
