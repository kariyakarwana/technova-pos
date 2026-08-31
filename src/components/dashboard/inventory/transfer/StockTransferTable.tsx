"use client";

import Link from "next/link";
import { Check, CheckCheck, X } from "lucide-react";
import type { TransferItem } from "./StockTransferMock";

interface StockTransferTableProps {
  items: TransferItem[];
}

export default function StockTransferTable({ items }: StockTransferTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#F9FAFB] text-slate-500 text-[11px] font-bold border-b border-[var(--brand-stroke)] tracking-wider uppercase">
            <th className="py-3.5 px-4">TRANSFER ID</th>
            <th className="py-3.5 px-4">SOURCE</th>
            <th className="py-3.5 px-4">DESTINATION</th>
            <th className="py-3.5 px-4">ITEMS</th>
            <th className="py-3.5 px-4">VALUE</th>
            <th className="py-3.5 px-4 text-center">STATUS</th>
            <th className="py-3.5 px-4">LAST UPDATED</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--brand-stroke)] text-xs text-[var(--brand-black-font)]">
          {items.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-12 text-center text-slate-400">
                No transfer records found matching your filter criteria.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/70 transition-colors"
              >
                {/* Transfer ID */}
                <td className="py-4 px-4 font-semibold text-[var(--brand-green)]">
                  <Link
                    href={`/inventory/transfer/${item.transferId}`}
                    className="hover:underline"
                  >
                    {item.transferId}
                  </Link>
                </td>

                {/* Source */}
                <td className="py-4 px-4 font-medium text-slate-700">
                  {item.source}
                </td>

                {/* Destination */}
                <td className="py-4 px-4 font-medium text-slate-700">
                  {item.destination}
                </td>

                {/* Items */}
                <td className="py-4 px-4 font-medium text-slate-700">
                  {item.items}
                </td>

                {/* Value */}
                <td className="py-4 px-4 font-semibold text-[var(--brand-black-font)]">
                  {item.value}
                </td>

                {/* Status Badge */}
                <td className="py-4 px-4 text-center">
                  {item.status === "In Transit" && (
                    <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold bg-[var(--brand-green)] text-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      <span>In Transit</span>
                    </span>
                  )}

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

                  {item.status === "Completed" && (
                    <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold bg-[var(--brand-green)] text-white">
                      <CheckCheck className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>Completed</span>
                    </span>
                  )}
                </td>

                {/* Last Updated */}
                <td className="py-4 px-4 text-slate-500 font-medium">
                  {item.lastUpdated}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
