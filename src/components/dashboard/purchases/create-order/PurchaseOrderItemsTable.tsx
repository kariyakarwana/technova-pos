"use client";

import { Package, Plus } from "lucide-react";
import type { PurchaseOrderItemEntry } from "./CreatePurchaseOrderMock";

interface PurchaseOrderItemsTableProps {
  items: PurchaseOrderItemEntry[];
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectOne: (id: string) => void;
  onQuantityChange: (id: string, qty: number) => void;
  onUnitPriceChange: (id: string, price: number) => void;
  onAddProductPrompt?: () => void;
}

export default function PurchaseOrderItemsTable({
  items,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectOne,
  onQuantityChange,
  onUnitPriceChange,
  onAddProductPrompt,
}: PurchaseOrderItemsTableProps) {
  const isAllSelected =
    items.length > 0 && items.every((i) => selectedIds.includes(i.id));

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FAFB] text-slate-500 text-[11px] font-bold border-b border-[var(--brand-stroke)] tracking-wider">
              {/* Checkbox */}
              <th className="py-3.5 px-4 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="h-4 w-4 rounded border-[var(--brand-stroke)] text-[var(--brand-green)] focus:ring-[var(--brand-green)] cursor-pointer"
                />
              </th>
              <th className="py-3.5 px-4 font-bold text-[var(--brand-black-font)]">
                Product
              </th>
              <th className="py-3.5 px-4 font-bold text-[var(--brand-black-font)]">
                SKU
              </th>
              <th className="py-3.5 px-4 font-bold text-[var(--brand-black-font)]">
                Quantity
              </th>
              <th className="py-3.5 px-4 font-bold text-[var(--brand-black-font)]">
                <span className="underline underline-offset-2">Unit Price</span>
              </th>
              <th className="py-3.5 px-4 font-bold text-[var(--brand-black-font)]">
                Subtotal
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--brand-stroke)] text-xs text-[var(--brand-black-font)]">
            {items.map((item) => {
              const isSelected = selectedIds.includes(item.id);

              return (
                <tr
                  key={item.id}
                  className={[
                    "hover:bg-slate-50/70 transition-colors",
                    isSelected ? "bg-emerald-50/40" : "",
                  ].join(" ")}
                >
                  {/* Checkbox */}
                  <td className="py-4 px-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelectOne(item.id)}
                      className="h-4 w-4 rounded border-[var(--brand-stroke)] text-[var(--brand-green)] focus:ring-[var(--brand-green)] cursor-pointer"
                    />
                  </td>

                  {/* Product with Icon Badge */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-[#E6F7F5] border border-[#CBEFE8] text-[var(--brand-green)] flex items-center justify-center shrink-0">
                        <Package className="h-4 w-4" />
                      </div>
                      <span className="font-bold text-[var(--brand-black-font)]">
                        {item.productName}
                      </span>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="py-4 px-4 font-medium text-slate-500">
                    {item.sku}
                  </td>

                  {/* Quantity */}
                  <td className="py-4 px-4">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        onQuantityChange(
                          item.id,
                          Math.max(1, Number(e.target.value) || 1)
                        )
                      }
                      className="w-20 h-8 px-2 text-xs font-bold text-center bg-white border border-[var(--brand-stroke)] rounded-lg focus:outline-none focus:border-[var(--brand-green)] shadow-xs"
                    />
                  </td>

                  {/* Unit Price */}
                  <td className="py-4 px-4 font-bold text-[var(--brand-black-font)] underline underline-offset-2">
                    <input
                      type="number"
                      min={0}
                      step={10}
                      value={item.unitPrice}
                      onChange={(e) =>
                        onUnitPriceChange(
                          item.id,
                          Math.max(0, Number(e.target.value) || 0)
                        )
                      }
                      className="w-24 h-8 px-2 text-xs font-bold bg-white border border-[var(--brand-stroke)] rounded-lg focus:outline-none focus:border-[var(--brand-green)] shadow-xs"
                    />
                  </td>

                  {/* Subtotal */}
                  <td className="py-4 px-4 font-bold text-[var(--brand-black-font)]">
                    {item.subtotal.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bottom Row Helper Bar */}
      <div
        onClick={onAddProductPrompt}
        className="py-3 px-4 border-t border-dashed border-[var(--brand-stroke)] bg-slate-50/50 hover:bg-[#E6F7F5]/50 text-slate-400 hover:text-[var(--brand-green)] text-xs font-medium text-center flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
      >
        <Plus className="h-3.5 w-3.5" />
        <span>Scan barcode or use search bar to add more products...</span>
      </div>
    </div>
  );
}
