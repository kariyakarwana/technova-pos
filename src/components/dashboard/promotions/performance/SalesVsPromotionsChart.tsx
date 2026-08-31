"use client";

import type { MonthlySalesData } from "./PromotionPerformanceMock";

interface SalesVsPromotionsChartProps {
  data: MonthlySalesData[];
}

export default function SalesVsPromotionsChart({
  data,
}: SalesVsPromotionsChartProps) {
  const maxCapacity = 80;

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs flex flex-col justify-between space-y-6">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-base font-bold text-[var(--brand-black-font)]">
          Sales vs. Promotions
        </h2>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-green)]" />
            <span>Promo Sales</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border-2 border-slate-300 bg-transparent" />
            <span>Regular Sales</span>
          </div>
        </div>
      </div>

      {/* Chart Grid with Y-Axis and Bars */}
      <div className="flex items-end gap-3 pt-4">
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between h-44 text-[11px] font-semibold text-slate-400 pb-6 shrink-0">
          <span>80K</span>
          <span>60K</span>
          <span>40K</span>
          <span>20K</span>
          <span>0</span>
        </div>

        {/* Bars Container */}
        <div className="flex-1 grid grid-cols-12 gap-2 sm:gap-3 items-end h-44 pb-6 border-b border-slate-100">
          {data.map((item) => {
            const promoHeightPercent = (item.promoSales / maxCapacity) * 100;
            const totalHeightPercent = (item.totalSales / maxCapacity) * 100;

            return (
              <div
                key={item.month}
                className="relative h-full flex flex-col justify-end items-center group cursor-pointer"
              >
                {/* Regular Sales Track (Gray background bar) */}
                <div
                  style={{ height: `${totalHeightPercent}%` }}
                  className="w-full max-w-[28px] bg-slate-100/90 rounded-t-md absolute bottom-0"
                />

                {/* Promo Sales Foreground Bar (Teal) */}
                <div
                  style={{ height: `${promoHeightPercent}%` }}
                  className="w-full max-w-[28px] bg-[var(--brand-green)] rounded-t-md relative z-10 transition-all duration-300 group-hover:bg-[#0B6E63]"
                />

                {/* Tooltip on Hover */}
                <div className="absolute -top-9 z-30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap shadow-md">
                  Promo: {item.promoSales}K / Total: {item.totalSales}K
                </div>

                {/* Month Label */}
                <span className="absolute -bottom-6 text-[11px] font-semibold text-slate-500">
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
