"use client";

import { Menu } from "lucide-react";
import type { PromotionPerformanceItem } from "./PromotionPerformanceMock";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PromotionPerformanceTableProps {
  items: PromotionPerformanceItem[];
  selectedTypeFilter?: string;
  onTypeFilterChange?: (type: string) => void;
}

export default function PromotionPerformanceTable({
  items,
  selectedTypeFilter = "All Types",
  onTypeFilterChange,
}: PromotionPerformanceTableProps) {
  function getStatusBadge(status: "Active" | "Ended" | "Upcoming") {
    if (status === "Active") {
      return (
        <span className="inline-flex items-center px-3 py-0.5 rounded text-[11px] font-bold bg-[var(--brand-green)] text-white">
          Active
        </span>
      );
    }
    if (status === "Ended") {
      return (
        <span className="inline-flex items-center px-3 py-0.5 rounded text-[11px] font-bold bg-slate-300 text-slate-700">
          Ended
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-0.5 rounded text-[11px] font-bold bg-[#092C4C] text-white">
        Upcoming
      </span>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 flex items-center justify-between border-b border-[var(--brand-stroke)]">
        <h2 className="text-base font-bold text-[var(--brand-black-font)]">
          Promotion Details
        </h2>

        {/* Filter Dropdown */}
        <div className="relative">
          <Menu className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white pointer-events-none z-10" />
          <Select
            value={selectedTypeFilter}
            onValueChange={(val) => onTypeFilterChange?.(val)}
          >
            <SelectTrigger className="h-8 data-[size=default]:h-8 pl-7 pr-3 rounded-lg bg-[var(--brand-green)] hover:bg-[#0B6E63] text-white text-xs font-semibold border-0 shadow-2xs focus:ring-0 [&>svg]:text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Types" className="text-slate-800 hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)]">All Types</SelectItem>
              <SelectItem value="Percentage" className="text-slate-800 hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)]">Percentage</SelectItem>
              <SelectItem value="Fixed Amount" className="text-slate-800 hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)]">Fixed Amount</SelectItem>
              <SelectItem value="Free Shipping" className="text-slate-800 hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)]">Free Shipping</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="bg-[#F9FAFB] text-slate-500 text-[11px] font-bold border-b border-[var(--brand-stroke)] tracking-wider uppercase">
              <th className="py-3.5 px-5 font-bold text-[var(--brand-black-font)]">
                PROMO NAME
              </th>
              <th className="py-3.5 px-5 font-bold text-[var(--brand-black-font)]">
                CODE
              </th>
              <th className="py-3.5 px-5 font-bold text-[var(--brand-black-font)]">
                TYPE
              </th>
              <th className="py-3.5 px-5 font-bold text-[var(--brand-black-font)]">
                USES
              </th>
              <th className="py-3.5 px-5 font-bold text-[var(--brand-black-font)]">
                CONV. RATE
              </th>
              <th className="py-3.5 px-5 font-bold text-[var(--brand-black-font)]">
                TOTAL DISCOUNT
              </th>
              <th className="py-3.5 px-5 font-bold text-[var(--brand-black-font)]">
                GENERATED REV
              </th>
              <th className="py-3.5 px-5 font-bold text-[var(--brand-black-font)]">
                ROI
              </th>
              <th className="py-3.5 px-5 font-bold text-[var(--brand-black-font)] text-center">
                STATUS
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--brand-stroke)] text-xs text-[var(--brand-black-font)]">
            {items.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/70 transition-colors"
              >
                {/* Name */}
                <td className="py-4 px-5 font-bold text-[var(--brand-black-font)]">
                  {item.name}
                </td>

                {/* Code Pill Box */}
                <td className="py-4 px-5">
                  <span className="inline-block px-2.5 py-1 rounded-md bg-[#F0FDF9] text-teal-800 border border-[#CBEFE8] font-mono text-[11px] font-semibold">
                    {item.code}
                  </span>
                </td>

                {/* Type */}
                <td className="py-4 px-5 text-slate-600 font-medium">
                  {item.type}
                </td>

                {/* Uses */}
                <td className="py-4 px-5 font-medium text-slate-700">
                  {item.uses}
                </td>

                {/* Conversion Rate */}
                <td
                  className={[
                    "py-4 px-5 font-bold",
                    item.isConversionPositive
                      ? "text-[var(--brand-green)]"
                      : "text-red-500",
                  ].join(" ")}
                >
                  {item.conversionRate}
                </td>

                {/* Total Discount */}
                <td className="py-4 px-5 font-medium text-slate-700">
                  {item.totalDiscount}
                </td>

                {/* Generated Revenue */}
                <td className="py-4 px-5 font-semibold text-[var(--brand-black-font)]">
                  {item.generatedRevenue}
                </td>

                {/* ROI */}
                <td
                  className={[
                    "py-4 px-5 font-bold",
                    item.isRoiPositive
                      ? "text-[var(--brand-green)]"
                      : "text-red-500",
                  ].join(" ")}
                >
                  {item.roi}
                </td>

                {/* Status */}
                <td className="py-4 px-5 text-center">
                  {getStatusBadge(item.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
