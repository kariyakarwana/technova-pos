"use client";

import { Filter, MoreVertical } from "lucide-react";
import type { PromotionItem, PromotionStatus } from "./PromotionsMock";

interface ActivePromotionsTableCardProps {
  promotions: PromotionItem[];
  onFilterClick?: () => void;
  onActionClick?: (item: PromotionItem) => void;
}

export default function ActivePromotionsTableCard({
  promotions,
  onFilterClick,
  onActionClick,
}: ActivePromotionsTableCardProps) {
  function getStatusBadge(status: PromotionStatus) {
    if (status === "Active") {
      return (
        <span className="inline-flex items-center px-3 py-0.5 rounded text-[11px] font-bold bg-[var(--brand-green)] text-white">
          Active
        </span>
      );
    }
    if (status === "Upcoming") {
      return (
        <span className="inline-flex items-center px-3 py-0.5 rounded text-[11px] font-bold bg-[#092C4C] text-white">
          Upcoming
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-0.5 rounded text-[11px] font-bold bg-slate-200 text-slate-700">
        {status}
      </span>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] shadow-xs overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="p-5 flex items-center justify-between border-b border-[var(--brand-stroke)]">
        <h2 className="text-base font-bold text-[var(--brand-black-font)]">
          Active & Upcoming
        </h2>

        <button
          type="button"
          onClick={onFilterClick}
          title="Filter promotions"
          className="h-8 w-8 rounded-lg border border-[var(--brand-stroke)] hover:bg-slate-50 text-[var(--brand-green)] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
        >
          <Filter className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[620px]">
          <thead>
            <tr className="bg-[#F9FAFB] text-slate-500 text-[11px] font-bold border-b border-[var(--brand-stroke)] tracking-wider uppercase">
              <th className="py-3 px-5 font-bold text-[var(--brand-black-font)]">
                PROMOTION NAME
              </th>
              <th className="py-3 px-5 font-bold text-[var(--brand-black-font)]">
                STATUS
              </th>
              <th className="py-3 px-5 font-bold text-[var(--brand-black-font)]">
                TYPE
              </th>
              <th className="py-3 px-5 font-bold text-[var(--brand-black-font)]">
                VALIDITY
              </th>
              <th className="py-3 px-5 font-bold text-[var(--brand-black-font)]">
                USAGE
              </th>
              <th className="py-3 px-5 font-bold text-[var(--brand-black-font)] text-center">
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--brand-stroke)] text-xs text-[var(--brand-black-font)]">
            {promotions.map((promo) => (
              <tr
                key={promo.id}
                className="hover:bg-slate-50/70 transition-colors"
              >
                {/* Promotion Name & Code */}
                <td className="py-4 px-5">
                  <div className="space-y-0.5">
                    <p className="font-bold text-[var(--brand-black-font)]">
                      {promo.name}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Code: {promo.code}
                    </p>
                  </div>
                </td>

                {/* Status */}
                <td className="py-4 px-5">
                  {getStatusBadge(promo.status)}
                </td>

                {/* Type */}
                <td className="py-4 px-5 text-slate-600 font-medium">
                  {promo.type}
                </td>

                {/* Validity */}
                <td className="py-4 px-5 text-slate-600 font-medium">
                  {promo.validity}
                </td>

                {/* Usage */}
                <td className="py-4 px-5">
                  {promo.usagePercent !== undefined ? (
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          style={{ width: `${promo.usagePercent}%` }}
                          className="h-full bg-[var(--brand-green)] rounded-full"
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-700">
                        {promo.usageText}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-600 font-medium">
                      {promo.usageText}
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-4 px-5 text-center">
                  <button
                    type="button"
                    onClick={() => onActionClick?.(promo)}
                    title="Options"
                    className="h-7 w-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center mx-auto transition-colors cursor-pointer"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
