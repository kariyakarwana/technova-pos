"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Image as ImageIcon, MoreVertical, Pencil } from "lucide-react";
import type { InventoryListItem } from "./InventoryListMock";

interface InventoryProductListTableProps {
  items: InventoryListItem[];
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectOne: (id: string) => void;
}

export default function InventoryProductListTable({
  items,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectOne,
}: InventoryProductListTableProps) {
  const isAllSelected = items.length > 0 && selectedIds.length === items.length;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#F9FAFB] text-slate-500 text-[11px] font-bold border-b border-[var(--brand-stroke)] tracking-wider uppercase">
            <th className="py-3.5 px-4 w-10 text-center">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={onToggleSelectAll}
                className="rounded border-slate-300 text-[var(--brand-green)] focus:ring-[var(--brand-green)] cursor-pointer"
              />
            </th>
            <th className="py-3.5 px-4">PRODUCT</th>
            <th className="py-3.5 px-4">SKU</th>
            <th className="py-3.5 px-4">BRANCH</th>
            <th className="py-3.5 px-4">ON HAND</th>
            <th className="py-3.5 px-4">REORDER LEVEL</th>
            <th className="py-3.5 px-4">STATUS</th>
            <th className="py-3.5 px-4 text-center">ACTIONS</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--brand-stroke)] text-xs text-[var(--brand-black-font)]">
          {items.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-12 text-center text-slate-400">
                No inventory items match your search or filter criteria.
              </td>
            </tr>
          ) : (
            items.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              const isLowStock = item.onHand <= item.reorderLevel;

              return (
                <tr
                  key={item.id}
                  className={[
                    "hover:bg-slate-50/70 transition-colors",
                    isSelected ? "bg-emerald-50/30" : "",
                    isLowStock && item.status === "Low Stock"
                      ? "border-l-4 border-l-[#D32F2F]"
                      : "",
                  ].join(" ")}
                >
                  {/* Checkbox */}
                  <td className="py-3.5 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelectOne(item.id)}
                      className="rounded border-slate-300 text-[var(--brand-green)] focus:ring-[var(--brand-green)] cursor-pointer"
                    />
                  </td>

                  {/* Product Details */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 flex items-center justify-center">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-[var(--brand-black-font)] leading-tight">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-[var(--brand-muted-font)] mt-0.5 font-medium">
                          {item.category}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="py-3.5 px-4 font-medium text-slate-500">
                    {item.sku}
                  </td>

                  {/* Branch */}
                  <td className="py-3.5 px-4 font-semibold text-[var(--brand-black-font)]">
                    {item.branch}
                  </td>

                  {/* On Hand */}
                  <td
                    className={[
                      "py-3.5 px-4 font-bold text-sm",
                      isLowStock ? "text-red-500" : "text-[var(--brand-black-font)]",
                    ].join(" ")}
                  >
                    {item.onHand}
                  </td>

                  {/* Reorder Level */}
                  <td className="py-3.5 px-4 font-medium text-slate-600">
                    {item.reorderLevel}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">
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
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Link
                        href={`/products/product-list/${item.id}`}
                        title="View Product"
                        className="p-1 rounded text-slate-400 hover:text-[var(--brand-green)] hover:bg-slate-100 transition-colors"
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
                        title="More actions"
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
  );
}
