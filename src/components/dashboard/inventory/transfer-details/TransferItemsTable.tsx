"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import type { TransferItemDetail } from "./TransferDetailsMock";

interface TransferItemsTableProps {
  items: TransferItemDetail[];
  totalExpectedUnits: number;
}

export default function TransferItemsTable({
  items,
  totalExpectedUnits,
}: TransferItemsTableProps) {
  const [filterQuery, setFilterQuery] = useState("");

  const filtered = items.filter(
    (item) =>
      item.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs space-y-4">
      {/* Header & Filter Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--brand-stroke)]">
        <h2 className="text-base font-bold text-[var(--brand-black-font)]">
          Transfer Items
        </h2>

        <div className="relative w-full sm:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Filter Items..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-3 text-xs bg-white border border-[var(--brand-stroke)] rounded-lg text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FAFB] text-slate-500 text-[11px] font-bold border-b border-[var(--brand-stroke)] tracking-wider uppercase">
              <th className="py-3 px-3 w-10 text-center">#</th>
              <th className="py-3 px-4">PRODUCT DETAILS</th>
              <th className="py-3 px-4">SKU / BARCODE</th>
              <th className="py-3 px-4 text-center">EXPECTED QTY</th>
              <th className="py-3 px-4 text-center">RECEIVED QTY</th>
              <th className="py-3 px-4 text-center">STATUS</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--brand-stroke)] text-xs text-[var(--brand-black-font)]">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                {/* Index */}
                <td className="py-4 px-3 text-center text-slate-400 font-semibold">
                  {item.index}
                </td>

                {/* Product details */}
                <td className="py-4 px-4">
                  <p className="font-bold text-[var(--brand-black-font)] leading-snug">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    Category: {item.category}
                  </p>
                </td>

                {/* SKU */}
                <td className="py-4 px-4 font-mono text-[11px] text-slate-600 font-medium">
                  {item.sku}
                </td>

                {/* Expected Qty */}
                <td className="py-4 px-4 text-center font-bold text-[var(--brand-black-font)]">
                  {item.expectedQty}
                </td>

                {/* Received Qty */}
                <td className="py-4 px-4 text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold bg-[#092C4C] text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    <span>{item.receivedQtyStatus}</span>
                  </span>
                </td>

                {/* Status */}
                <td className="py-4 px-4 text-center">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#E6F7F5] text-[var(--brand-green)]">
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Summary Strip */}
      <div className="pt-4 border-t border-[var(--brand-stroke)] flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">
          Showing {filtered.length} of {items.length} items
        </span>
        <span className="font-bold text-[#004532]">
          Total Expected Units: {totalExpectedUnits}
        </span>
      </div>
    </div>
  );
}
