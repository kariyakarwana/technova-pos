"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreVertical,
  Pencil,
} from "lucide-react";
import type { InventoryItem } from "./inventory.mock";

interface InventoryTableProps {
  items: InventoryItem[];
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectOne: (id: string) => void;
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

export default function InventoryTable({
  items,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectOne,
  currentPage,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: InventoryTableProps) {
  const isAllSelected = items.length > 0 && selectedIds.length === items.length;

  return (
    <div className="overflow-hidden">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FAFB] text-slate-500 text-[11px] font-bold border-y border-[#E4E7EC] tracking-wider uppercase">
              <th className="py-3 px-3 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="rounded border-slate-300 text-[#0E9384] focus:ring-[#0E9384] cursor-pointer"
                />
              </th>
              <th className="py-3 px-3">PRODUCT</th>
              <th className="py-3 px-3">SKU</th>
              <th className="py-3 px-3">BRANCH</th>
              <th className="py-3 px-3">ON HAND</th>
              <th className="py-3 px-3">REORDER LEVEL</th>
              <th className="py-3 px-3">STATUS</th>
              <th className="py-3 px-3 text-center">ACTIONS</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E4E7EC] text-xs text-[#1D2939]">
            {items.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  No inventory items match your search or filter criteria.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const isSelected = selectedIds.includes(item.id);

                return (
                  <tr
                    key={item.id}
                    className={[
                      "hover:bg-slate-50/70 transition-colors",
                      isSelected ? "bg-emerald-50/30" : "",
                    ].join(" ")}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectOne(item.id)}
                        className="rounded border-slate-300 text-[#0E9384] focus:ring-[#0E9384] cursor-pointer"
                      />
                    </td>

                    {/* Product & Category */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative h-9 w-9 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <Image
                            src={item.productImage}
                            alt={item.name}
                            fill
                            sizes="36px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div>
                          <p className="font-bold text-[#1D2939] leading-tight">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                            {item.categoryHierarchy}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-3.5 px-3 font-medium text-slate-500">
                      {item.sku}
                    </td>

                    {/* Branch */}
                    <td className="py-3.5 px-3 font-semibold text-[#1D2939]">
                      {item.branch}
                    </td>

                    {/* On Hand */}
                    <td
                      className={[
                        "py-3.5 px-3 font-bold",
                        item.onHand <= item.reorderLevel
                          ? "text-[#D32F2F]"
                          : "text-[#1D2939]",
                      ].join(" ")}
                    >
                      {item.onHand}
                    </td>

                    {/* Reorder Level */}
                    <td className="py-3.5 px-3 font-medium text-slate-600">
                      {item.reorderLevel}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-3">
                      {item.status === "Low Stock" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-600 border border-red-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                          <span>Low Stock</span>
                        </span>
                      )}

                      {item.status === "In Stock" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                          <span>In Stock</span>
                        </span>
                      )}

                      {item.status === "Out of Stock" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          <span>Out of Stock</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          href={`/products/product-list/${item.id}`}
                          title="View Product"
                          className="p-1 rounded text-slate-400 hover:text-[#0E9384] hover:bg-slate-100 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/products/product-list/${item.id}`}
                          title="Edit Stock"
                          className="p-1 rounded text-slate-400 hover:text-[#1E6DE2] hover:bg-slate-100 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          title="More options"
                          className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-2 text-xs text-slate-500">
        {/* Row Per Page */}
        <div className="flex items-center gap-2">
          <span>Row Per Page</span>
          <div className="relative">
            <select
              value={rowsPerPage}
              onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
              className="h-7 pl-2 pr-6 border border-[#E4E7EC] rounded-md bg-white text-xs text-[#1D2939] appearance-none focus:outline-none focus:border-[#0E9384] cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
          </div>
          <span>Entries</span>
        </div>

        {/* Page Nav */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="h-7 w-7 rounded-md border border-[#E4E7EC] bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          {[1, 2, 3, 4].map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={[
                "h-7 w-7 rounded-md text-xs font-semibold transition-colors cursor-pointer",
                currentPage === page
                  ? "bg-[#0E9384] text-white"
                  : "border border-[#E4E7EC] bg-white text-slate-600 hover:bg-slate-50",
              ].join(" ")}
            >
              {page}
            </button>
          ))}

          <span className="px-1 text-slate-400 font-bold">...</span>

          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            className={[
              "h-7 w-7 rounded-md text-xs font-semibold transition-colors cursor-pointer",
              currentPage === totalPages
                ? "bg-[#0E9384] text-white"
                : "border border-[#E4E7EC] bg-white text-slate-600 hover:bg-slate-50",
            ].join(" ")}
          >
            {totalPages}
          </button>

          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="h-7 w-7 rounded-md border border-[#E4E7EC] bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            aria-label="Next page"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
