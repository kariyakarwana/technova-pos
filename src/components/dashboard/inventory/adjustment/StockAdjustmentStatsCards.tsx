"use client";

import { BarChart2, ClipboardList, Package, TrendingDown } from "lucide-react";

export default function StockAdjustmentStatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* 1. Total Adjustments (MTD) */}
      <div className="relative overflow-hidden bg-white rounded-2xl border border-[var(--brand-stroke)] p-5 shadow-xs flex flex-col justify-between">
        <div className="relative z-10">
          <span className="text-[11px] font-bold text-slate-500 tracking-wider">
            TOTAL ADJUSTMENTS (MTD)
          </span>
          <h2 className="text-3xl font-bold text-[#004532] mt-2 tracking-tight">
            142
          </h2>
          <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-[#D32F2F]">
            <TrendingDown className="h-3.5 w-3.5" />
            <span>-12% vs last month</span>
          </div>
        </div>

        {/* Watermark Graphic */}
        <div className="absolute -right-2 -bottom-2 text-slate-100/80 pointer-events-none">
          <BarChart2 className="h-28 w-28 text-slate-100" strokeWidth={1.5} />
        </div>
      </div>

      {/* 2. Pending Approvals */}
      <div className="relative overflow-hidden bg-white rounded-2xl border border-[var(--brand-stroke)] p-5 shadow-xs flex flex-col justify-between">
        <div className="relative z-10">
          <span className="text-[11px] font-bold text-slate-500 tracking-wider">
            PENDING APPROVALS
          </span>
          <h2 className="text-3xl font-bold text-[var(--brand-black-font)] mt-2 tracking-tight">
            24
          </h2>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                style={{ width: "45%" }}
                className="h-full bg-[#004532] rounded-full"
              />
            </div>
            <p className="mt-2 text-xs text-slate-500 font-medium">
              Require attention today
            </p>
          </div>
        </div>

        {/* Watermark Graphic */}
        <div className="absolute -right-2 -bottom-2 text-slate-100/80 pointer-events-none">
          <ClipboardList className="h-28 w-28 text-slate-100" strokeWidth={1.5} />
        </div>
      </div>

      {/* 3. Most Adjusted Product */}
      <div className="relative overflow-hidden bg-white rounded-2xl border border-[var(--brand-stroke)] p-5 shadow-xs flex flex-col justify-between">
        <div className="relative z-10">
          <span className="text-[11px] font-bold text-slate-500 tracking-wider">
            MOST ADJUSTED PRODUCT
          </span>
          <h2 className="text-lg font-bold text-[var(--brand-black-font)] mt-2 truncate tracking-tight">
            Wireless Earbuds Pro
          </h2>

          <div className="mt-4">
            <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600">
              SKU: WE-PRO-BLK
            </span>
          </div>
        </div>

        {/* Watermark Graphic */}
        <div className="absolute -right-2 -bottom-2 text-slate-100/80 pointer-events-none">
          <Package className="h-28 w-28 text-slate-100" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
