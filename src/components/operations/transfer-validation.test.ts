import { describe, expect, it } from "vitest";
import { availableStock, validateTransferLines } from "./transfer-validation";

const product = {
  id: "product-1",
  stockLevels: [{ quantityOnHand: 5, quantityReserved: 2 }],
};

describe("stock transfer validation", () => {
  it("subtracts reserved stock from the source balance", () => {
    expect(availableStock(product)).toBe(3);
  });

  it("rejects a zero-stock product", () => {
    expect(
      validateTransferLines([{ productId: "product-1", quantity: 1 }], [
        { ...product, stockLevels: [] },
      ]),
    ).toMatch(/available stock/);
  });

  it("rejects a quantity above the available balance", () => {
    expect(
      validateTransferLines([{ productId: "product-1", quantity: 4 }], [product]),
    ).toMatch(/available stock/);
  });

  it("accepts the exact available quantity", () => {
    expect(
      validateTransferLines([{ productId: "product-1", quantity: 3 }], [product]),
    ).toBeNull();
  });

  it("rejects fractional transfer quantities", () => {
    expect(
      validateTransferLines([{ productId: "product-1", quantity: 1.5 }], [product]),
    ).toMatch(/whole numbers/);
  });

  it("rejects empty selections and duplicate products", () => {
    expect(validateTransferLines([{ productId: "", quantity: 1 }], [product])).toMatch(/Select/);
    expect(
      validateTransferLines(
        [{ productId: "product-1", quantity: 1 }, { productId: "product-1", quantity: 1 }],
        [product],
      ),
    ).toMatch(/only once/);
  });
});
