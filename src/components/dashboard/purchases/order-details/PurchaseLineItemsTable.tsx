"use client";

import { Package } from "lucide-react";
import type { LineItem } from "./PurchaseDetailsMock";

interface PurchaseLineItemsTableProps {
  items: LineItem[];
  subtotal: string;
  tax: string;
  shipping: string;
  total: string;
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectOne: (id: string) => void;
}

export default function PurchaseLineItemsTable({
  items,
  subtotal,
  tax,
  shipping,
  total,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectOne,
}: PurchaseLineItemsTableProps) {
  const isAllSelected =
    items.length > 0 && items.every((i) => selectedIds.includes(i.id));

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] shadow-xs overflow-hidden">
      {/* Title Header */}
      <div className="p-6 pb-4 flex items-center justify-between border-b border-[var(--brand-stroke)]">
        <div className="flex items-center gap-2.5">
          <Package className="h-5 w-5 text-[var(--brand-green)]" />
          <h2 className="text-base font-bold text-[var(--brand-black-font)]">
            Line Items
          </h2>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
          {items.length} Items
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FAFB] text-slate-500 text-[11px] font-bold border-b border-[var(--brand-stroke)] tracking-wider">
              {/* Checkbox */}
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="h-4 w-4 rounded border-[var(--brand-stroke)] text-[var(--brand-green)] focus:ring-[var(--brand-green)] cursor-pointer"
                />
              </th>
              <th className="py-3 px-4 font-bold text-[var(--brand-black-font)]">
                Product
              </th>
              <th className="py-3 px-4 font-bold text-[var(--brand-black-font)]">
                SKU
              </th>
              <th className="py-3 px-4 font-bold text-[var(--brand-black-font)]">
                Quantity
              </th>
              <th className="py-3 px-4 font-bold text-[var(--brand-black-font)]">
                <span className="underline underline-offset-2">Unit Price</span>
              </th>
              <th className="py-3 px-4 font-bold text-[var(--brand-black-font)]">
                Total
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
                  <td className="py-4 px-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelectOne(item.id)}
                      className="h-4 w-4 rounded border-[var(--brand-stroke)] text-[var(--brand-green)] focus:ring-[var(--brand-green)] cursor-pointer"
                    />
                  </td>
                  <td className="py-4 px-4 font-bold text-[var(--brand-black-font)]">
                    {item.productName}
                  </td>
                  <td className="py-4 px-4 font-medium text-slate-500">
                    {item.sku}
                  </td>
                  <td className="py-4 px-4 font-medium text-slate-700">
                    {item.quantity}
                  </td>
                  <td className="py-4 px-4 font-bold text-[var(--brand-black-font)] underline underline-offset-2">
                    {item.unitPrice}
                  </td>
                  <td className="py-4 px-4 font-bold text-[var(--brand-black-font)]">
                    {item.total}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Financial Summary */}
      <div className="p-6 bg-[#F9FAFB]/60 border-t border-[var(--brand-stroke)] flex justify-end">
        <div className="w-64 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-600 font-medium">
            <span>Subtotal</span>
            <span className="font-bold text-[var(--brand-black-font)]">
              {subtotal}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600 font-medium">
            <span>Tax (8.5%)</span>
            <span className="font-bold text-[var(--brand-black-font)]">
              {tax}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600 font-medium">
            <span>Shipping</span>
            <span className="font-bold text-[var(--brand-black-font)]">
              {shipping}
            </span>
          </div>

          <div className="pt-2.5 border-t border-[var(--brand-stroke)] flex items-baseline justify-between">
            <span className="text-sm font-bold text-[var(--brand-black-font)]">
              Total
            </span>
            <span className="text-xl font-extrabold text-[var(--brand-black-font)] tracking-tight">
              {total}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
