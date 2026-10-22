import { describe, expect, it } from "vitest";
import {
  calculateBalance,
  formatQuantity,
  normalizeQuantity,
  stepQuantity,
} from "./inventory-quantity";

describe("inventory adjustment quantities", () => {
  it("rounds floating point input to the backend's three-decimal precision", () => {
    expect(normalizeQuantity(21.000999999999998)).toBe(21.001);
    expect(formatQuantity(5.000999999999994)).toBe("5.001");
  });

  it("steps without accumulating floating point artifacts", () => {
    expect(stepQuantity(21.000999999999998, 1)).toBe(22.001);
    expect(stepQuantity(0.001, -1)).toBe(0.001);
  });

  it("formats preview balances and whole numbers cleanly", () => {
    expect(calculateBalance(5, 0.001, "IN")).toBe(5.001);
    expect(calculateBalance(5, 0.001, "OUT")).toBe(4.999);
    expect(formatQuantity(21)).toBe("21");
  });
});
