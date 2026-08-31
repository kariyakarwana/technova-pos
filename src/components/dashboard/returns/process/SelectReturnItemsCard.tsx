"use client";

import { ChevronDown } from "lucide-react";
import type { ReturnableItem } from "./ProcessReturnMock";

interface SelectReturnItemsCardProps {
  items: ReturnableItem[];
  onToggleItem: (id: string) => void;
  onUpdateCondition: (id: string, condition: string) => void;
  onUpdateReason: (id: string, reason: string) => void;
}

export default function SelectReturnItemsCard({
  items,
  onToggleItem,
  onUpdateCondition,
  onUpdateReason,
}: SelectReturnItemsCardProps) {
  const isAllSelected = items.length > 0 && items.every((i) => i.isSelected);

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4 flex items-center justify-between border-b border-[var(--brand-stroke)]">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-full bg-[var(--brand-green)] text-white text-xs font-bold flex items-center justify-center">
            2
          </div>
          <h2 className="text-base font-bold text-[var(--brand-black-font)]">
            Select Items for Return
          </h2>
        </div>

        <span className="text-[11px] font-mono text-slate-400 font-medium">
          FR-RET-002
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[620px]">
          <thead>
            <tr className="bg-[#F9FAFB] text-slate-500 text-[11px] font-bold border-b border-[var(--brand-stroke)] tracking-wider">
              <th className="py-3 px-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={() => {
                    items.forEach((i) => {
                      if (isAllSelected ? i.isSelected : !i.isSelected) {
                        onToggleItem(i.id);
                      }
                    });
                  }}
                  className="h-4 w-4 rounded border-[var(--brand-stroke)] text-[var(--brand-green)] focus:ring-[var(--brand-green)] cursor-pointer"
                />
              </th>
              <th className="py-3 px-4 font-bold text-[var(--brand-black-font)]">
                Product
              </th>
              <th className="py-3 px-4 font-bold text-[var(--brand-black-font)] text-center w-14">
                Qty
              </th>
              <th className="py-3 px-4 font-bold text-[var(--brand-black-font)] w-24">
                Price
              </th>
              <th className="py-3 px-4 font-bold text-[var(--brand-black-font)] w-36">
                Condition
              </th>
              <th className="py-3 px-4 font-bold text-[var(--brand-black-font)] w-40">
                Reason
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--brand-stroke)] text-xs">
            {items.map((item) => {
              return (
                <tr
                  key={item.id}
                  className={[
                    "transition-colors",
                    item.isSelected
                      ? "bg-[#0E9384] text-white"
                      : "bg-white text-[var(--brand-black-font)] hover:bg-slate-50",
                  ].join(" ")}
                >
                  {/* Checkbox */}
                  <td className="py-4 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={item.isSelected}
                      onChange={() => onToggleItem(item.id)}
                      className="h-4 w-4 rounded border-slate-300 text-[var(--brand-green)] focus:ring-[var(--brand-green)] cursor-pointer"
                    />
                  </td>

                  {/* Product */}
                  <td className="py-4 px-4">
                    <div className="space-y-0.5">
                      <p
                        className={[
                          "font-bold",
                          item.isSelected ? "text-white" : "text-[var(--brand-black-font)]",
                        ].join(" ")}
                      >
                        {item.name}
                      </p>
                      <p
                        className={[
                          "text-[11px] font-mono",
                          item.isSelected ? "text-emerald-100" : "text-slate-400",
                        ].join(" ")}
                      >
                        SKU: {item.sku}
                      </p>
                    </div>
                  </td>

                  {/* Qty */}
                  <td
                    className={[
                      "py-4 px-4 text-center font-bold",
                      item.isSelected ? "text-white" : "text-slate-700",
                    ].join(" ")}
                  >
                    {item.qty}
                  </td>

                  {/* Price */}
                  <td
                    className={[
                      "py-4 px-4 font-bold",
                      item.isSelected ? "text-white" : "text-[var(--brand-black-font)]",
                    ].join(" ")}
                  >
                    ${item.price.toFixed(2)}
                  </td>

                  {/* Condition Dropdown */}
                  <td className="py-4 px-4">
                    <div className="relative">
                      <select
                        value={item.isSelected ? item.condition : ""}
                        disabled={!item.isSelected}
                        onChange={(e) => onUpdateCondition(item.id, e.target.value)}
                        className={[
                          "w-full h-8 pl-3 pr-7 text-xs rounded-lg border appearance-none focus:outline-none cursor-pointer font-medium",
                          item.isSelected
                            ? "bg-white text-[var(--brand-black-font)] border-white shadow-2xs"
                            : "bg-slate-50 text-slate-400 border-[var(--brand-stroke)] cursor-not-allowed",
                        ].join(" ")}
                      >
                        {!item.isSelected && <option value="">Select...</option>}
                        <option value="Resalable">Resalable</option>
                        <option value="Damaged">Damaged</option>
                        <option value="Defective">Defective</option>
                      </select>
                      <ChevronDown
                        className={[
                          "absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none",
                          item.isSelected ? "text-slate-500" : "text-slate-400",
                        ].join(" ")}
                      />
                    </div>
                  </td>

                  {/* Reason Dropdown */}
                  <td className="py-4 px-4">
                    <div className="relative">
                      <select
                        value={item.isSelected ? item.reason : ""}
                        disabled={!item.isSelected}
                        onChange={(e) => onUpdateReason(item.id, e.target.value)}
                        className={[
                          "w-full h-8 pl-3 pr-7 text-xs rounded-lg border appearance-none focus:outline-none cursor-pointer font-medium",
                          item.isSelected
                            ? "bg-white text-[var(--brand-black-font)] border-white shadow-2xs"
                            : "bg-slate-50 text-slate-400 border-[var(--brand-stroke)] cursor-not-allowed",
                        ].join(" ")}
                      >
                        {!item.isSelected && <option value="">Select...</option>}
                        <option value="Changed Mind">Changed Mind</option>
                        <option value="Wrong Size">Wrong Size</option>
                        <option value="Defective">Defective</option>
                        <option value="Item Missing Parts">Item Missing Parts</option>
                      </select>
                      <ChevronDown
                        className={[
                          "absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none",
                          item.isSelected ? "text-slate-500" : "text-slate-400",
                        ].join(" ")}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
