export type ExportProduct = {
  sku: string;
  name: string;
  sellingPrice: string | number;
  category: { name: string } | null;
  brand: { name: string } | null;
  stockLevels: Array<{ quantityOnHand: string | number }>;
};

const columns = ["SKU", "Name", "Category", "Brand", "Price (LKR)", "On hand"];

function values(product: ExportProduct): Array<string | number> {
  return [
    product.sku,
    product.name,
    product.category?.name ?? "",
    product.brand?.name ?? "",
    Number(product.sellingPrice).toFixed(2),
    product.stockLevels.reduce((sum, stock) => sum + Number(stock.quantityOnHand), 0),
  ];
}

function csvCell(value: string | number): string {
  // Spreadsheet apps otherwise treat names beginning with these characters as formulas.
  const safe = String(value).replace(/^[=+@-]/, "'$&");
  return `"${safe.replaceAll('"', '""')}"`;
}

export function productCsv(products: ExportProduct[]): string {
  return [columns.map(csvCell).join(","), ...products.map((product) => values(product).map(csvCell).join(","))].join("\r\n");
}

function html(value: string | number): string {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]!);
}

export function productPrintHtml(products: ExportProduct[]): string {
  const headings = columns.map((column) => `<th>${html(column)}</th>`).join("");
  const rows = products.map((product) => `<tr>${values(product).map((value) => `<td>${html(value)}</td>`).join("")}</tr>`).join("");
  return `<!doctype html><html><head><meta charset="utf-8"><title>TechNova Product Report</title><style>body{font-family:Arial,sans-serif;margin:32px;color:#14212b}h1{font-size:22px}table{width:100%;border-collapse:collapse;font-size:11px}th,td{border-bottom:1px solid #ddd;padding:8px;text-align:left;overflow-wrap:anywhere}th{background:#f0f5f4}@media print{button{display:none}thead{display:table-header-group}tr{break-inside:avoid}}</style></head><body><h1>TechNova Product Report</h1><p>${products.length} products</p><button onclick="window.print()">Print / Save as PDF</button><table><thead><tr>${headings}</tr></thead><tbody>${rows}</tbody></table></body></html>`;
}
