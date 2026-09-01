"use client";

import Image from "next/image";
import { ChevronDown, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import type { BarcodeProductItem } from "./BarcodeMock";

interface BarcodeProductTableProps {
  products: BarcodeProductItem[];
  quantities: Record<string, number>;
  onQuantityChange: (id: string, qty: number) => void;
  onDeleteRow: (id: string) => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
}

export default function BarcodeProductTable({
  products,
  quantities,
  onQuantityChange,
  onDeleteRow,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: BarcodeProductTableProps) {
  const pages = Array.from({ length: Math.min(totalPages, 4) }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[#F9FAFB] text-slate-500 text-[11px] font-bold border-b border-[var(--brand-stroke)] tracking-wider uppercase">
              <th className="py-3.5 px-4 font-bold text-[var(--brand-black-font)]">
                Product
              </th>
              <th className="py-3.5 px-4 font-bold text-[var(--brand-black-font)]">
                SKU
              </th>
              <th className="py-3.5 px-4 font-bold text-[var(--brand-black-font)]">
                Code
              </th>
              <th className="py-3.5 px-4 font-bold text-[var(--brand-black-font)]">
                Barcode
              </th>
              <th className="py-3.5 px-4 font-bold text-[var(--brand-black-font)]">
                Qty
              </th>
              <th className="py-3.5 px-4 font-bold text-[var(--brand-black-font)] text-right">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--brand-stroke)] text-xs text-[var(--brand-black-font)]">
            {products.map((item) => {
              const qty = quantities[item.id] ?? 100;

              return (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {/* Product */}
                  <td className="py-4 px-4 font-bold text-[var(--brand-black-font)]">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-slate-100 overflow-hidden relative shrink-0 border border-slate-100">
                        <Image
                          src={item.productImage}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="36px"
                        />
                      </div>
                      <span className="truncate max-w-[180px]">{item.name}</span>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="py-4 px-4 text-slate-600 font-medium">
                    {item.sku}
                  </td>

                  {/* Code */}
                  <td className="py-4 px-4 font-mono text-[11px] text-slate-700">
                    {item.barcodeCode}
                  </td>

                  {/* Barcode Graphic */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col items-start py-1">
                      <svg
                        className="w-24 h-6"
                        viewBox="0 0 112 28"
                        fill="currentColor"
                      >
                        <rect x="0" y="0" width="2" height="28" fill="#151C27" />
                        <rect x="4" y="0" width="1" height="28" fill="#151C27" />
                        <rect x="7" y="0" width="3" height="28" fill="#151C27" />
                        <rect x="12" y="0" width="1" height="28" fill="#151C27" />
                        <rect x="15" y="0" width="2" height="28" fill="#151C27" />
                        <rect x="19" y="0" width="4" height="28" fill="#151C27" />
                        <rect x="25" y="0" width="1" height="28" fill="#151C27" />
                        <rect x="28" y="0" width="2" height="28" fill="#151C27" />
                        <rect x="32" y="0" width="3" height="28" fill="#151C27" />
                        <rect x="37" y="0" width="1" height="28" fill="#151C27" />
                        <rect x="40" y="0" width="2" height="28" fill="#151C27" />
                        <rect x="44" y="0" width="1" height="28" fill="#151C27" />
                        <rect x="47" y="0" width="3" height="28" fill="#151C27" />
                        <rect x="52" y="0" width="2" height="28" fill="#151C27" />
                        <rect x="56" y="0" width="1" height="28" fill="#151C27" />
                        <rect x="59" y="0" width="4" height="28" fill="#151C27" />
                        <rect x="65" y="0" width="2" height="28" fill="#151C27" />
                        <rect x="69" y="0" width="1" height="28" fill="#151C27" />
                        <rect x="72" y="0" width="3" height="28" fill="#151C27" />
                        <rect x="77" y="0" width="2" height="28" fill="#151C27" />
                        <rect x="81" y="0" width="1" height="28" fill="#151C27" />
                        <rect x="84" y="0" width="2" height="28" fill="#151C27" />
                        <rect x="88" y="0" width="3" height="28" fill="#151C27" />
                        <rect x="93" y="0" width="1" height="28" fill="#151C27" />
                        <rect x="96" y="0" width="2" height="28" fill="#151C27" />
                        <rect x="100" y="0" width="4" height="28" fill="#151C27" />
                        <rect x="106" y="0" width="1" height="28" fill="#151C27" />
                        <rect x="109" y="0" width="2" height="28" fill="#151C27" />
                      </svg>
                    </div>
                  </td>

                  {/* Quantity */}
                  <td className="py-4 px-4">
                    <input
                      type="number"
                      min={1}
                      value={qty}
                      onChange={(e) =>
                        onQuantityChange(item.id, parseInt(e.target.value, 10) || 1)
                      }
                      className="w-16 h-8 px-2 text-center rounded-lg border border-[var(--brand-stroke)] bg-white text-xs text-[var(--brand-black-font)] focus:outline-none focus:border-[var(--brand-green)]"
                    />
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onDeleteRow(item.id)}
                      title="Delete"
                      className="h-7 w-7 rounded-lg hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center ml-auto transition-colors cursor-pointer text-slate-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Strip */}
      <div className="p-4 border-t border-[var(--brand-stroke)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 bg-[#FAFAFC]">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-8 pl-2.5 pr-7 bg-white border border-[var(--brand-stroke)] rounded-lg text-slate-700 font-semibold appearance-none focus:outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
          </div>
          <span>entries</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="h-8 w-8 rounded-lg border border-[var(--brand-stroke)] bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          {pages.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={[
                "h-8 w-8 rounded-lg font-bold text-xs flex items-center justify-center transition-colors cursor-pointer",
                currentPage === p
                  ? "bg-[var(--brand-green)] text-white shadow-2xs"
                  : "bg-white border border-[var(--brand-stroke)] text-slate-600 hover:bg-slate-50",
              ].join(" ")}
            >
              {p}
            </button>
          ))}

          {totalPages > 4 && (
            <>
              <span className="px-1 text-slate-400">...</span>
              <button
                type="button"
                onClick={() => onPageChange(totalPages)}
                className={[
                  "h-8 w-8 rounded-lg font-bold text-xs flex items-center justify-center transition-colors cursor-pointer",
                  currentPage === totalPages
                    ? "bg-[var(--brand-green)] text-white shadow-2xs"
                    : "bg-white border border-[var(--brand-stroke)] text-slate-600 hover:bg-slate-50",
                ].join(" ")}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="h-8 w-8 rounded-lg border border-[var(--brand-stroke)] bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
