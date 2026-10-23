import { describe, expect, it } from "vitest";
import { productCsv, productPrintHtml, type ExportProduct } from "./productExport";

const product: ExportProduct = {
  sku: "SKU-1",
  name: '=HYPERLINK("bad")',
  sellingPrice: "10.50",
  category: { name: "<Devices>" },
  brand: null,
  stockLevels: [{ quantityOnHand: "2" }, { quantityOnHand: "3" }],
};

describe("product exports", () => {
  it("escapes spreadsheet formulas and exports all stock levels", () => {
    const csv = productCsv([product]);
    expect(csv).toContain('"\'=HYPERLINK(""bad"")"');
    expect(csv).toContain('"10.50","5"');
  });

  it("escapes HTML in the printable product report", () => {
    const html = productPrintHtml([product]);
    expect(html).toContain("&lt;Devices&gt;");
    expect(html).toContain("=HYPERLINK(&quot;bad&quot;)");
    expect(html).not.toContain("<Devices>");
  });
});
