"use client";

import { useEffect, useState } from "react";
import { Download, FileSpreadsheet, UploadCloud, X } from "lucide-react";
import { apiPost } from "@/lib/api/client";

type Lookup = { id: string; name: string };

type ProductImportDialogProps = {
  open: boolean;
  categories: Lookup[];
  brands: Lookup[];
  onClose: () => void;
  onImported: () => Promise<void>;
};

type ImportSummary = {
  imported: number;
  skipped: number;
  errors: string[];
};

function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"') {
      if (quoted && text[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      row.push(value.trim());
      value = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(value.trim());
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
      value = "";
    } else {
      value += character;
    }
  }

  if (quoted) throw new Error("The CSV contains an unclosed quoted value.");
  row.push(value.trim());
  if (row.some((cell) => cell.length > 0)) rows.push(row);
  return rows;
}

function normalizedHeader(value: string) {
  return value.trim().toLowerCase().replace(/[\s_-]+/g, "");
}

function downloadTemplate() {
  const content = [
    "sku,name,barcode,description,category,brand,costPrice,sellingPrice,taxRate,trackSerials,reorderLevel",
    'LAP-001,"Business Laptop",8901234567890,"14-inch business laptop",Laptops,Lenovo,180000,215000,0,true,5',
    'MOU-001,"Wireless Mouse",8901234567891,"Rechargeable wireless mouse",Accessories,Logitech,3500,5000,0,false,10',
  ].join("\n");
  const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "technova-product-import-template.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function errorText(error: unknown) {
  return error instanceof Error ? error.message : "Unknown import error.";
}

export default function ProductImportDialog({
  open,
  categories,
  brands,
  onClose,
  onImported,
}: ProductImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setFile(null);
      setProgress({ current: 0, total: 0 });
      setSummary(null);
      setError(null);
    }
  }, [open]);

  if (!open) return null;

  async function importProducts() {
    if (!file) {
      setError("Choose a CSV file first.");
      return;
    }

    setImporting(true);
    setError(null);
    setSummary(null);

    try {
      const parsed = parseCsv((await file.text()).replace(/^\uFEFF/, ""));
      if (parsed.length < 2) throw new Error("The CSV does not contain any product rows.");

      const headers = parsed[0].map(normalizedHeader);
      const rows = parsed.slice(1);
      if (rows.length > 500) throw new Error("Import a maximum of 500 products at a time.");

      const indexOf = (...names: string[]) =>
        headers.findIndex((header) => names.map(normalizedHeader).includes(header));
      const indexes = {
        sku: indexOf("sku"),
        name: indexOf("name", "product name"),
        barcode: indexOf("barcode"),
        description: indexOf("description"),
        category: indexOf("category"),
        brand: indexOf("brand"),
        costPrice: indexOf("costPrice", "cost price"),
        sellingPrice: indexOf("sellingPrice", "selling price", "price"),
        taxRate: indexOf("taxRate", "tax rate"),
        trackSerials: indexOf("trackSerials", "track serials"),
        reorderLevel: indexOf("reorderLevel", "reorder level"),
      };

      const missing = [
        ["sku", indexes.sku],
        ["name", indexes.name],
        ["costPrice", indexes.costPrice],
        ["sellingPrice", indexes.sellingPrice],
      ].filter(([, index]) => Number(index) < 0).map(([name]) => name);
      if (missing.length) throw new Error(`Missing required column${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}.`);

      const categoryByName = new Map(categories.map((item) => [item.name.trim().toLowerCase(), item.id]));
      const brandByName = new Map(brands.map((item) => [item.name.trim().toLowerCase(), item.id]));
      const importedSkus = new Set<string>();
      const result: ImportSummary = { imported: 0, skipped: 0, errors: [] };
      const cell = (row: string[], index: number) => index >= 0 ? (row[index] ?? "").trim() : "";

      setProgress({ current: 0, total: rows.length });
      for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
        const row = rows[rowIndex];
        const csvRowNumber = rowIndex + 2;
        try {
          const sku = cell(row, indexes.sku).toUpperCase();
          const name = cell(row, indexes.name);
          const costPrice = Number(cell(row, indexes.costPrice).replaceAll(",", ""));
          const sellingPrice = Number(cell(row, indexes.sellingPrice).replaceAll(",", ""));
          if (!sku || !name) throw new Error("SKU and name are required");
          if (!Number.isFinite(costPrice) || costPrice < 0) throw new Error("costPrice must be zero or greater");
          if (!Number.isFinite(sellingPrice) || sellingPrice < 0) throw new Error("sellingPrice must be zero or greater");
          if (importedSkus.has(sku)) throw new Error("duplicate SKU in this file");

          const categoryName = cell(row, indexes.category);
          const brandName = cell(row, indexes.brand);
          const categoryId = categoryName ? categoryByName.get(categoryName.toLowerCase()) : undefined;
          const brandId = brandName ? brandByName.get(brandName.toLowerCase()) : undefined;
          if (categoryName && !categoryId) throw new Error(`category "${categoryName}" was not found`);
          if (brandName && !brandId) throw new Error(`brand "${brandName}" was not found`);

          const taxValue = cell(row, indexes.taxRate);
          const reorderValue = cell(row, indexes.reorderLevel);
          const serialValue = cell(row, indexes.trackSerials).toLowerCase();
          const taxRate = taxValue ? Number(taxValue.replaceAll(",", "")) : 0;
          const reorderLevel = reorderValue ? Number(reorderValue.replaceAll(",", "")) : 0;
          if (!Number.isFinite(taxRate) || taxRate < 0) throw new Error("taxRate must be zero or greater");
          if (!Number.isFinite(reorderLevel) || reorderLevel < 0) throw new Error("reorderLevel must be zero or greater");
          if (serialValue && !["true", "false", "yes", "no", "1", "0"].includes(serialValue)) {
            throw new Error("trackSerials must be true or false");
          }

          await apiPost("/catalog/products", {
            sku,
            name,
            barcode: cell(row, indexes.barcode) || undefined,
            description: cell(row, indexes.description) || undefined,
            categoryId,
            brandId,
            costPrice,
            sellingPrice,
            taxRate,
            trackSerials: ["true", "yes", "1"].includes(serialValue),
            reorderLevel,
          });
          importedSkus.add(sku);
          result.imported += 1;
        } catch (rowError) {
          result.skipped += 1;
          if (result.errors.length < 8) result.errors.push(`Row ${csvRowNumber}: ${errorText(rowError)}`);
        }
        setProgress({ current: rowIndex + 1, total: rows.length });
      }

      setSummary(result);
      if (result.imported > 0) await onImported();
    } catch (importError) {
      setError(errorText(importError));
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/45 p-4 sm:p-8">
      <div role="dialog" aria-modal="true" aria-labelledby="product-import-title" className="mx-auto w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b p-5">
          <div><h2 id="product-import-title" className="text-lg font-bold text-slate-900">Import products</h2><p className="mt-1 text-sm text-slate-500">Create up to 500 products from a CSV file.</p></div>
          <button type="button" disabled={importing} onClick={onClose} aria-label="Close import dialog" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-5 p-5">
          <div className="rounded-xl border border-teal-100 bg-teal-50 p-4 text-sm text-teal-900">
            <div className="flex items-start gap-3"><FileSpreadsheet className="mt-0.5 h-5 w-5 shrink-0" /><div><p className="font-semibold">Prepare the CSV using the template</p><p className="mt-1 text-xs text-teal-800">Required: SKU, name, cost price and selling price. Category and brand names must already exist in TechNova.</p><button type="button" onClick={downloadTemplate} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-teal-300 bg-white px-3 py-2 text-xs font-semibold text-[#0E9384]"><Download className="h-4 w-4" />Download CSV template</button></div></div>
          </div>

          <label className="block rounded-xl border-2 border-dashed border-slate-300 p-6 text-center hover:border-[#0E9384]">
            <UploadCloud className="mx-auto h-8 w-8 text-[#0E9384]" /><span className="mt-2 block text-sm font-semibold text-slate-800">Choose product CSV</span><span className="mt-1 block text-xs text-slate-500">CSV files only · maximum 500 rows</span>
            <input type="file" accept=".csv,text/csv" disabled={importing} onChange={(event) => { setFile(event.target.files?.[0] ?? null); setError(null); setSummary(null); }} className="mx-auto mt-4 block max-w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-[#0E9384] file:px-3 file:py-2 file:font-semibold file:text-white" />
            {file && <span className="mt-3 block text-xs font-medium text-slate-700">Selected: {file.name}</span>}
          </label>

          {importing && <div className="rounded-xl bg-slate-50 p-4 text-sm"><div className="flex justify-between"><span>Importing products…</span><span>{progress.current} / {progress.total}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-[#0E9384] transition-all" style={{ width: `${progress.total ? (progress.current / progress.total) * 100 : 0}%` }} /></div></div>}
          {error && <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
          {summary && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><p className="font-semibold">Imported {summary.imported} product{summary.imported === 1 ? "" : "s"}. {summary.skipped} skipped.</p>{summary.errors.length > 0 && <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">{summary.errors.map((message) => <li key={message}>{message}</li>)}</ul>}{summary.skipped > summary.errors.length && <p className="mt-2 text-xs">Only the first {summary.errors.length} row errors are shown.</p>}</div>}
        </div>

        <div className="flex justify-end gap-3 border-t p-5"><button type="button" disabled={importing} onClick={onClose} className="rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-50">Close</button><button type="button" disabled={!file || importing} onClick={() => void importProducts()} className="rounded-xl bg-[#0E9384] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">{importing ? "Importing…" : "Import products"}</button></div>
      </div>
    </div>
  );
}
