"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Loader2, Plus } from "lucide-react";
import Code128Barcode, { canEncodeCode128 } from "./Code128Barcode";
import type { BarcodeProductItem } from "./BarcodeTypes";

export default function BarcodeProductTable({
  products,
  queuedIds,
  quantities,
  loading,
  generatingId,
  currentPage,
  totalPages,
  pageSize,
  total,
  onToggle,
  onQuantityChange,
  onGenerate,
  onPageChange,
  onPageSizeChange,
}: {
  products: BarcodeProductItem[];
  queuedIds: Set<string>;
  quantities: Record<string, number>;
  loading: boolean;
  generatingId: string | null;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  total: number;
  onToggle(product: BarcodeProductItem): void;
  onQuantityChange(id: string, quantity: number): void;
  onGenerate(product: BarcodeProductItem): void;
  onPageChange(page: number): void;
  onPageSizeChange(size: number): void;
}) {
  const pages = Array.from(
    new Set(
      [1, currentPage - 1, currentPage, currentPage + 1, totalPages].filter(
        (page) => page >= 1 && page <= totalPages,
      ),
    ),
  ).sort((a, b) => a - b);

  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--brand-stroke)] bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--brand-stroke)] bg-[#F9FAFB] text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3.5">Print</th>
              <th className="px-4 py-3.5">Product</th>
              <th className="px-4 py-3.5">SKU</th>
              <th className="px-4 py-3.5">Barcode</th>
              <th className="px-4 py-3.5">Available</th>
              <th className="px-4 py-3.5">Copies</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--brand-stroke)] text-xs">
            {products.map((product) => {
              const encodable = Boolean(
                product.barcodeCode && canEncodeCode128(product.barcodeCode),
              );
              const selected = queuedIds.has(product.id);
              return (
                <tr key={product.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      aria-label={`Include ${product.name} in print queue`}
                      checked={selected}
                      disabled={!encodable}
                      onChange={() => onToggle(product)}
                      className="h-4 w-4 accent-[var(--brand-green)] disabled:opacity-40"
                    />
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border bg-slate-50">
                        <Image
                          src={product.productImage}
                          alt=""
                          fill
                          unoptimized
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <span className="max-w-[220px] truncate">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-mono text-slate-600">
                    {product.sku}
                  </td>
                  <td className="px-4 py-4">
                    {product.barcodeCode ? (
                      encodable ? (
                        <div className="w-40">
                          <Code128Barcode value={product.barcodeCode} height={28} />
                          <p className="mt-1 truncate font-mono text-[10px] text-slate-500">
                            {product.barcodeCode}
                          </p>
                        </div>
                      ) : (
                        <span className="text-rose-600">Unsupported characters</span>
                      )
                    ) : (
                      <button
                        type="button"
                        disabled={generatingId === product.id}
                        onClick={() => onGenerate(product)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 font-semibold text-[#0E9384] disabled:opacity-60"
                      >
                        {generatingId === product.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Plus className="h-3.5 w-3.5" />
                        )}
                        Generate
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-700">
                    {product.stock}
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      disabled={!selected}
                      value={quantities[product.id] ?? 1}
                      onChange={(event) =>
                        onQuantityChange(
                          product.id,
                          Math.max(1, Math.min(100, Number(event.target.value) || 1)),
                        )
                      }
                      className="h-8 w-16 rounded-lg border px-2 text-center outline-none focus:border-[var(--brand-green)] disabled:bg-slate-100"
                    />
                  </td>
                </tr>
              );
            })}
            {!loading && products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-500">
                  No active products match the current filters.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-500">
                  Loading products…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col items-center justify-between gap-3 border-t bg-slate-50/60 p-4 text-xs text-slate-500 sm:flex-row">
        <div className="flex items-center gap-2">
          <span>{total} products</span>
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="h-8 rounded-lg border bg-white px-2 text-slate-700"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="grid h-8 w-8 place-items-center rounded-lg border bg-white disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {pages.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`h-8 min-w-8 rounded-lg px-2 font-semibold ${
                page === currentPage
                  ? "bg-[var(--brand-green)] text-white"
                  : "border bg-white text-slate-600"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="grid h-8 w-8 place-items-center rounded-lg border bg-white disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
