import { describe, expect, it } from "vitest";
import { parseWholePurchaseQuantity } from "./purchaseQuantity";

describe("parseWholePurchaseQuantity", () => {
  it("accepts whole numbers and an empty field while editing", () => {
    expect(parseWholePurchaseQuantity("3")).toBe(3);
    expect(parseWholePurchaseQuantity("03")).toBe(3);
    expect(parseWholePurchaseQuantity("")).toBe(0);
  });

  it("rejects decimals, negatives, and unsafe integers", () => {
    expect(parseWholePurchaseQuantity("1.017")).toBeNull();
    expect(parseWholePurchaseQuantity("1.0")).toBeNull();
    expect(parseWholePurchaseQuantity("-1")).toBeNull();
    expect(parseWholePurchaseQuantity("9007199254740992")).toBeNull();
  });
});
