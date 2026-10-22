"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
                    <Select
                      value={item.isSelected ? item.condition || "none" : "none"}
                      disabled={!item.isSelected}
                      onValueChange={(val) => onUpdateCondition(item.id, val === "none" ? "" : val)}
                    >
                      <SelectTrigger
                        className={[
                          "w-full h-8 data-[size=default]:h-8 px-3 text-xs rounded-lg border font-medium",
                          item.isSelected
                            ? "bg-white text-[var(--brand-black-font)] border-white shadow-2xs"
                            : "bg-slate-50 text-slate-400 border-[var(--brand-stroke)] cursor-not-allowed",
                        ].join(" ")}
                      >
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-72">
                        <SelectItem value="none" className="text-xs hover:bg-[#F4FBF9] hover:text-[#0E9384] cursor-pointer">
                          Select...
                        </SelectItem>
                        <SelectItem value="Resalable" className="text-xs hover:bg-[#F4FBF9] hover:text-[#0E9384] cursor-pointer">
                          Resalable
                        </SelectItem>
                        <SelectItem value="Damaged" className="text-xs hover:bg-[#F4FBF9] hover:text-[#0E9384] cursor-pointer">
                          Damaged
                        </SelectItem>
                        <SelectItem value="Defective" className="text-xs hover:bg-[#F4FBF9] hover:text-[#0E9384] cursor-pointer">
                          Defective
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </td>

                  {/* Reason Dropdown */}
                  <td className="py-4 px-4">
                    <Select
                      value={item.isSelected ? item.reason || "none" : "none"}
                      disabled={!item.isSelected}
                      onValueChange={(val) => onUpdateReason(item.id, val === "none" ? "" : val)}
                    >
                      <SelectTrigger
                        className={[
                          "w-full h-8 data-[size=default]:h-8 px-3 text-xs rounded-lg border font-medium",
                          item.isSelected
                            ? "bg-white text-[var(--brand-black-font)] border-white shadow-2xs"
                            : "bg-slate-50 text-slate-400 border-[var(--brand-stroke)] cursor-not-allowed",
                        ].join(" ")}
                      >
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-72">
                        <SelectItem value="none" className="text-xs hover:bg-[#F4FBF9] hover:text-[#0E9384] cursor-pointer">
                          Select...
                        </SelectItem>
                        <SelectItem value="Changed Mind" className="text-xs hover:bg-[#F4FBF9] hover:text-[#0E9384] cursor-pointer">
                          Changed Mind
                        </SelectItem>
                        <SelectItem value="Wrong Size" className="text-xs hover:bg-[#F4FBF9] hover:text-[#0E9384] cursor-pointer">
                          Wrong Size
                        </SelectItem>
                        <SelectItem value="Defective" className="text-xs hover:bg-[#F4FBF9] hover:text-[#0E9384] cursor-pointer">
                          Defective
                        </SelectItem>
                        <SelectItem value="Item Missing Parts" className="text-xs hover:bg-[#F4FBF9] hover:text-[#0E9384] cursor-pointer">
                          Item Missing Parts
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
