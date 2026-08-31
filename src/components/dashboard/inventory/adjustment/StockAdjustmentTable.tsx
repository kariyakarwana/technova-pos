"use client";

import { ArrowDown, ArrowUp, Check, X } from "lucide-react";
import type { AdjustmentItem } from "./StockAdjustmentMock";

interface StockAdjustmentTableProps {
  items: AdjustmentItem[];
}

export default function StockAdjustmentTable({ items }: StockAdjustmentTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#F9FAFB] text-slate-500 text-[11px] font-bold border-b border-[var(--brand-stroke)] tracking-wider uppercase">
            <th className="py-3.5 px-4">DATE</th>
            <th className="py-3.5 px-4">PRODUCT & SKU</th>
            <th className="py-3.5 px-4">TYPE</th>
            <th className="py-3.5 px-4">QTY</th>
            <th className="py-3.5 px-4">REASON</th>
            <th className="py-3.5 px-4">ADJUSTED BY</th>
            <th className="py-3.5 px-4 text-center">STATUS</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--brand-stroke)] text-xs text-[var(--brand-black-font)]">
          {items.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-12 text-center text-slate-400">
                No adjustment records found matching your search.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/70 transition-colors"
              >
                {/* Date */}
                <td className="py-4 px-4 font-medium text-slate-600">
                  {item.date}
                </td>

                {/* Product & SKU */}
                <td className="py-4 px-4">
                  <div>
                    <p className="font-bold text-[var(--brand-black-font)]">
                      {item.productName}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                      {item.sku}
                    </p>
                  </div>
                </td>

                {/* Type */}
                <td className="py-4 px-4">
                  {item.type === "Inc" ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-[var(--brand-green)]">
                      <ArrowUp className="h-3.5 w-3.5" />
                      <span>Inc</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-semibold text-[#D32F2F]">
                      <ArrowDown className="h-3.5 w-3.5" />
                      <span>Dec</span>
                    </span>
                  )}
                </td>

                {/* Qty */}
                <td
                  className={[
                    "py-4 px-4 font-bold",
                    item.qty > 0 ? "text-[var(--brand-green)]" : "text-[var(--brand-black-font)]",
                  ].join(" ")}
                >
                  {item.qty > 0 ? `+${item.qty}` : item.qty}
                </td>

                {/* Reason */}
                <td className="py-4 px-4 text-slate-600 font-medium max-w-xs truncate">
                  {item.reason}
                </td>

                {/* Adjusted By */}
                <td className="py-4 px-4 font-semibold text-[var(--brand-black-font)]">
                  {item.adjustedBy}
                </td>

                {/* Status Badge */}
                <td className="py-4 px-4 text-center">
                  {item.status === "Pending" && (
                    <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold bg-[#092C4C] text-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      <span>Pending</span>
                    </span>
                  )}

                  {item.status === "Approved" && (
                    <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold bg-[var(--brand-green)] text-white">
                      <Check className="h-3 w-3 stroke-[3]" />
                      <span>Approved</span>
                    </span>
                  )}

                  {item.status === "Rejected" && (
                    <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold bg-[#D32F2F] text-white">
                      <X className="h-3 w-3 stroke-[3]" />
                      <span>Rejected</span>
                    </span>
                  )}

                  {item.status === "Cancelled" && (
                    <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold bg-[#E2E8F0] text-[#64748B]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#64748B]" />
                      <span>Cancelled</span>
                    </span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
