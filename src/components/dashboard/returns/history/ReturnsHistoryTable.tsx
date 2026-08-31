"use client";

import Link from "next/link";
import type { ReturnHistoryItem } from "./ReturnsHistoryMock";

interface ReturnsHistoryTableProps {
  items: ReturnHistoryItem[];
}

export default function ReturnsHistoryTable({
  items,
}: ReturnsHistoryTableProps) {
  function getConditionBadge(condition: "DAMAGED" | "RESALABLE") {
    if (condition === "DAMAGED") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEE2E2] text-[#991B1B] uppercase tracking-wider">
          DAMAGED
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#D1FAE5] text-[#065F46] uppercase tracking-wider">
        RESALABLE
      </span>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FAFB] text-slate-500 text-[11px] font-bold border-b border-[var(--brand-stroke)] tracking-wider uppercase">
              <th className="py-3.5 px-5 font-bold text-[var(--brand-black-font)]">
                RETURN ID
              </th>
              <th className="py-3.5 px-5 font-bold text-[var(--brand-black-font)]">
                DATE
              </th>
              <th className="py-3.5 px-5 font-bold text-[var(--brand-black-font)]">
                INVOICE ID
              </th>
              <th className="py-3.5 px-5 font-bold text-[var(--brand-black-font)]">
                CUSTOMER
              </th>
              <th className="py-3.5 px-5 font-bold text-[var(--brand-black-font)]">
                REASON
              </th>
              <th className="py-3.5 px-5 font-bold text-[var(--brand-black-font)]">
                CONDITION
              </th>
              <th className="py-3.5 px-5 font-bold text-[var(--brand-black-font)]">
                REFUND AMOUNT
              </th>
              <th className="py-3.5 px-5 font-bold text-[var(--brand-black-font)]">
                PRODUCT
              </th>
              <th className="py-3.5 px-5 font-bold text-[var(--brand-black-font)]">
                PROCESSED BY
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--brand-stroke)] text-xs text-[var(--brand-black-font)]">
            {items.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  No return history records found matching criteria.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {/* Return ID */}
                  <td className="py-4 px-5 font-bold text-[var(--brand-green)]">
                    <Link
                      href={`/returns-refunds/${item.returnId}`}
                      className="hover:underline"
                    >
                      {item.returnId}
                    </Link>
                  </td>

                  {/* Date & Time */}
                  <td className="py-4 px-5">
                    <div className="space-y-0.5">
                      <span className="block font-medium text-[var(--brand-black-font)]">
                        {item.date}
                      </span>
                      <span className="block text-[11px] text-slate-400">
                        {item.time}
                      </span>
                    </div>
                  </td>

                  {/* Invoice ID */}
                  <td className="py-4 px-5 font-medium text-slate-600">
                    {item.invoiceId}
                  </td>

                  {/* Customer */}
                  <td className="py-4 px-5 font-bold text-[var(--brand-black-font)]">
                    {item.customer}
                  </td>

                  {/* Reason */}
                  <td className="py-4 px-5 text-slate-600">
                    {item.reason}
                  </td>

                  {/* Condition Badge */}
                  <td className="py-4 px-5">
                    {getConditionBadge(item.condition)}
                  </td>

                  {/* Refund Amount */}
                  <td className="py-4 px-5 font-bold text-[var(--brand-black-font)]">
                    {item.refundAmount}
                  </td>

                  {/* Product */}
                  <td className="py-4 px-5 text-slate-600">
                    {item.product}
                  </td>

                  {/* Processed By */}
                  <td className="py-4 px-5 text-slate-600 font-medium">
                    {item.processedBy}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
