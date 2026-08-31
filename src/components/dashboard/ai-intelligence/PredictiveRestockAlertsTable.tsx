"use client";

import Link from "next/link";
import type { RestockAlertItem } from "./AIIntelligenceMock";

interface PredictiveRestockAlertsTableProps {
  alerts: RestockAlertItem[];
  onOrder?: (item: RestockAlertItem) => void;
  onReview?: (item: RestockAlertItem) => void;
}

export default function PredictiveRestockAlertsTable({
  alerts,
  onOrder,
  onReview,
}: PredictiveRestockAlertsTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] shadow-xs overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="p-6 pb-4 flex items-center justify-between border-b border-[var(--brand-stroke)]">
        <h2 className="text-base font-bold text-[var(--brand-black-font)]">
          Predictive Restock Alerts
        </h2>

        <Link
          href="/inventory/alerts"
          className="text-xs font-bold text-[var(--brand-green)] hover:underline"
        >
          View All
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FAFB] text-slate-500 text-[11px] font-bold border-b border-[var(--brand-stroke)] tracking-wider uppercase">
              <th className="py-3 px-5 font-bold text-[var(--brand-black-font)]">
                SKU
              </th>
              <th className="py-3 px-5 font-bold text-[var(--brand-black-font)]">
                PRODUCT
              </th>
              <th className="py-3 px-5 font-bold text-[var(--brand-black-font)]">
                EST. EMPTY
              </th>
              <th className="py-3 px-5 font-bold text-[var(--brand-black-font)] text-center">
                ACTION
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--brand-stroke)] text-xs text-[var(--brand-black-font)]">
            {alerts.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/70 transition-colors"
              >
                {/* SKU */}
                <td className="py-3.5 px-5 font-mono text-[11px] text-slate-600 font-semibold">
                  {item.sku}
                </td>

                {/* Product */}
                <td className="py-3.5 px-5 font-bold text-[var(--brand-black-font)]">
                  {item.product}
                </td>

                {/* Est. Empty */}
                <td
                  className={[
                    "py-3.5 px-5 font-bold",
                    item.isUrgent ? "text-red-500" : "text-slate-500",
                  ].join(" ")}
                >
                  {item.estEmpty}
                </td>

                {/* Action */}
                <td className="py-3.5 px-5 text-center">
                  {item.actionType === "Order" ? (
                    <button
                      type="button"
                      onClick={() => onOrder?.(item)}
                      className="px-3.5 py-1 rounded-lg bg-[var(--brand-green)] hover:bg-[#0B6E63] text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                    >
                      Order
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onReview?.(item)}
                      className="px-3.5 py-1 rounded-lg border border-[var(--brand-green)] hover:bg-[#E6F7F5] text-[var(--brand-green)] text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                    >
                      Review
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
