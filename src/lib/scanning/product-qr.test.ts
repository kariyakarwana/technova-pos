import { describe, expect, it } from "vitest";
import { productQrToken } from "./product-qr";

describe("productQrToken", () => {
  const token = "00000000-0000-4000-8000-000000000001.1.signature";

  it("accepts the token printed in product labels", () => {
    expect(productQrToken(token)).toBe(token);
  });

  it("extracts the token from a full product-label URL", () => {
    expect(productQrToken(`https://pos.nxcodeworks.com/qr/product/${token}`)).toBe(token);
    expect(productQrToken(`http://localhost:3000/qr/product/${token}?source=scan`)).toBe(token);
  });

  it("rejects unrelated QR URLs and malformed values", () => {
    expect(productQrToken("https://example.com/qr/warranty/activate/secret")).toBeNull();
    expect(productQrToken("https://example.com/other/secret")).toBeNull();
    expect(productQrToken("not a token")).toBeNull();
  });
});
