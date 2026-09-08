"use client";

import { useState } from "react";
import type { MonthlySalesPurchase } from "./AdminDashboardTypes";

interface SalesPurchaseChartCardProps {
  data: MonthlySalesPurchase[];
}

export default function SalesPurchaseChartCard({
  data,
}: SalesPurchaseChartCardProps) {
  const [activeTimeframe, setActiveTimeframe] = useState("1Y");
  const timeframes = ["1D", "1W", "1M", "3M", "6M", "1Y"];
  const totalPurchase = data.reduce((sum, item) => sum + item.purchase, 0);
  const totalSales = data.reduce((sum, item) => sum + item.sales, 0);
  const maxValue = Math.max(1, ...data.flatMap((item) => [item.purchase, item.sales]));
  const maxScale = Math.ceil(maxValue / 1000) * 1000 || 1;
  const compact = (value: number) => new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs flex flex-col justify-between space-y-6">
      {/* Header Row: Title & Timeframe Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Title */}
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[#E6F7F5] text-[var(--brand-green)] flex items-center justify-center">
            🛒
          </div>
          <h2 className="text-base font-bold text-[var(--brand-black-font)]">
            Sales & Purchase
          </h2>
        </div>

        {/* Timeframe Pills */}
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
          {timeframes.map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setActiveTimeframe(tf)}
              className={[
                "px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer",
                activeTimeframe === tf
                  ? "bg-[var(--brand-green)] text-white shadow-2xs"
                  : "text-slate-500 hover:text-slate-800",
              ].join(" ")}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Legend Strip */}
      <div className="flex items-center gap-5 pt-1">
        {/* Total Purchase */}
        <div className="bg-[#F0FDF9] border border-[#CBEFE8] rounded-xl px-4 py-2 flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#5EEAD4]" />
          <div>
            <span className="text-[10px] font-semibold text-slate-500 block">
              Total Purchase
            </span>
            <span className="text-sm font-bold text-[var(--brand-black-font)]">
              {compact(totalPurchase)}
            </span>
          </div>
        </div>

        {/* Total Sales */}
        <div className="bg-[#F0FDF9] border border-[#CBEFE8] rounded-xl px-4 py-2 flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-green)]" />
          <div>
            <span className="text-[10px] font-semibold text-slate-500 block">
              Total Sales
            </span>
            <span className="text-sm font-bold text-[var(--brand-black-font)]">
              {compact(totalSales)}
            </span>
          </div>
        </div>
      </div>

      {/* Chart Grid */}
      <div className="flex items-end gap-3 pt-4">
        {/* Y-Axis */}
        <div className="flex flex-col justify-between h-44 text-[11px] font-semibold text-slate-400 pb-6 shrink-0">
          {Array.from({ length: 7 }, (_, index) => <span key={index}>{compact(maxScale * (6 - index) / 6)}</span>)}
        </div>

        {/* Dual Bars Container */}
        <div className="flex-1 grid grid-cols-12 gap-1.5 sm:gap-3 items-end h-44 pb-6 border-b border-slate-100">
          {data.map((item) => {
            const purchasePercent = (item.purchase / maxScale) * 100;
            const salesPercent = (item.sales / maxScale) * 100;

            return (
              <div
                key={item.month}
                className="relative h-full flex items-end justify-center gap-1 group cursor-pointer"
              >
                {/* Purchase Bar (Mint) */}
                <div
                  style={{ height: `${purchasePercent}%` }}
                  className="w-2.5 sm:w-3.5 bg-[#5EEAD4] rounded-t-md transition-all duration-300 group-hover:bg-[#2DD4BF]"
                />

                {/* Sales Bar (Teal) */}
                <div
                  style={{ height: `${salesPercent}%` }}
                  className="w-2.5 sm:w-3.5 bg-[var(--brand-green)] rounded-t-md transition-all duration-300 group-hover:bg-[#0B6E63]"
                />

                {/* Tooltip on Hover */}
                <div className="absolute -top-10 z-30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap shadow-md">
                  Purchase: {compact(item.purchase)} | Sales: {compact(item.sales)}
                </div>

                {/* Month Label */}
                <span className="absolute -bottom-6 text-[10px] sm:text-[11px] font-semibold text-slate-500">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
