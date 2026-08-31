"use client";

import { Plus, Search, Sparkles, Trash2 } from "lucide-react";
import type { AddOrderLineItem } from "./AddOrderMock";

interface AddOrderLineItemsTableProps {
  items: AddOrderLineItem[];
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onUpdateItem: <K extends keyof AddOrderLineItem>(
    id: string,
    field: K,
    value: AddOrderLineItem[K]
  ) => void;
  onDeleteItem: (id: string) => void;
  onAddBlankLine: () => void;
}

export default function AddOrderLineItemsTable({
  items,
  searchQuery,
  onSearchChange,
  onUpdateItem,
  onDeleteItem,
  onAddBlankLine,
}: AddOrderLineItemsTableProps) {
  function calculateLineAmount(item: AddOrderLineItem) {
    const rawTotal = item.qty * item.unitCost;
    const discountAmount = rawTotal * (item.discountPercent / 100);
    const discountedTotal = rawTotal - discountAmount;
    const taxAmount = discountedTotal * (item.taxPercent / 100);
    return discountedTotal + taxAmount;
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs space-y-4">
      {/* Title */}
      <h2 className="text-base font-bold text-[var(--brand-black-font)]">
        Line Items
      </h2>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search products by name or SKU to add..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-10 pl-10 pr-4 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs font-medium"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="bg-[#F9FAFB] text-slate-500 text-[11px] font-bold border-b border-[var(--brand-stroke)] tracking-wider uppercase">
              <th className="py-3 px-3 font-bold text-[var(--brand-black-font)] w-5/12">
                PRODUCT
              </th>
              <th className="py-3 px-3 font-bold text-[var(--brand-black-font)] w-1/12 text-center">
                QTY
              </th>
              <th className="py-3 px-3 font-bold text-[var(--brand-black-font)] w-2/12">
                UNIT COST
              </th>
              <th className="py-3 px-3 font-bold text-[var(--brand-black-font)] w-1/12 text-center">
                TAX %
              </th>
              <th className="py-3 px-3 font-bold text-[var(--brand-black-font)] w-1/12 text-center">
                DISC %
              </th>
              <th className="py-3 px-3 font-bold text-[var(--brand-black-font)] w-2/12 text-right">
                AMOUNT
              </th>
              <th className="py-3 px-3 w-10 text-center" />
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--brand-stroke)] text-xs text-[var(--brand-black-font)]">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                {/* Product Name & SKU */}
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-2">
                    {item.hasSparkle && (
                      <Sparkles className="h-3.5 w-3.5 text-[var(--brand-green)] shrink-0" />
                    )}
                    <div>
                      <p className="font-bold text-[var(--brand-black-font)]">
                        {item.productName || "New Custom Line Item"}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {item.sku || "SKU-AUTO"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* QTY */}
                <td className="py-3.5 px-3">
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) =>
                      onUpdateItem(item.id, "qty", Math.max(1, Number(e.target.value)))
                    }
                    className="w-16 h-8 text-center text-xs bg-slate-50 border border-[var(--brand-stroke)] rounded-lg text-[var(--brand-black-font)] font-semibold focus:outline-none focus:border-[var(--brand-green)] focus:bg-white"
                  />
                </td>

                {/* Unit Cost */}
                <td className="py-3.5 px-3">
                  <div className="relative w-28">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={item.unitCost}
                      onChange={(e) =>
                        onUpdateItem(item.id, "unitCost", parseFloat(e.target.value) || 0)
                      }
                      className="w-full h-8 pl-6 pr-2 text-xs bg-slate-50 border border-[var(--brand-stroke)] rounded-lg text-[var(--brand-black-font)] font-semibold focus:outline-none focus:border-[var(--brand-green)] focus:bg-white"
                    />
                  </div>
                </td>

                {/* Tax % */}
                <td className="py-3.5 px-3">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={item.taxPercent}
                    onChange={(e) =>
                      onUpdateItem(item.id, "taxPercent", parseFloat(e.target.value) || 0)
                    }
                    className="w-14 h-8 text-center text-xs bg-slate-50 border border-[var(--brand-stroke)] rounded-lg text-[var(--brand-black-font)] font-semibold focus:outline-none focus:border-[var(--brand-green)] focus:bg-white"
                  />
                </td>

                {/* Disc % */}
                <td className="py-3.5 px-3">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={item.discountPercent}
                    onChange={(e) =>
                      onUpdateItem(
                        item.id,
                        "discountPercent",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-14 h-8 text-center text-xs bg-slate-50 border border-[var(--brand-stroke)] rounded-lg text-[var(--brand-black-font)] font-semibold focus:outline-none focus:border-[var(--brand-green)] focus:bg-white"
                  />
                </td>

                {/* Amount */}
                <td className="py-3.5 px-3 text-right font-bold text-[var(--brand-black-font)]">
                  ${calculateLineAmount(item).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>

                {/* Action Trash */}
                <td className="py-3.5 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => onDeleteItem(item.id)}
                    title="Remove item"
                    className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Blank Line Button */}
      <button
        type="button"
        onClick={onAddBlankLine}
        className="w-full py-2.5 border border-dashed border-[var(--brand-stroke)] hover:border-[var(--brand-green)] hover:bg-[#F0FDF9] text-[var(--brand-green)] text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        <span>Add Blank Line</span>
      </button>
    </div>
  );
}
