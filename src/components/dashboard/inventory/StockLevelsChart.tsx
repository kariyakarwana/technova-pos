"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { MOCK_STOCK_CHART_DATA } from "./inventory.mock";

export default function StockLevelsChart() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("This Week");

  return (
    <div className="bg-white rounded-2xl border border-[#E4E7EC] p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Chart Header */}
      <div className="flex items-center justify-between pb-6">
        <h3 className="text-base font-bold text-[#1D2939]">
          Stock Levels vs Sales
        </h3>
        <div className="relative">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="flex items-center gap-1.5 px-3 py-1 pr-7 rounded-lg border border-[#E4E7EC] bg-[#F8FAFC] text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer appearance-none"
          >
            <option value="This Week">This Week</option>
            <option value="Last Week">Last Week</option>
            <option value="This Month">This Month</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Chart Canvas / Visual Bars */}
      <div className="pt-2 pb-4">
        <div className="h-52 flex items-end justify-between gap-2 sm:gap-4 px-2">
          {MOCK_STOCK_CHART_DATA.map((item) => (
            <div
              key={item.day}
              className="flex-1 flex flex-col items-center h-full justify-end group"
            >
              {/* Stacked Bar container */}
              <div className="w-full max-w-[42px] flex flex-col justify-end h-full">
                {/* Top segment: Stock Levels (Teal) */}
                {item.stockLevelPercent > 0 && (
                  <div
                    style={{ height: `${item.stockLevelPercent}%` }}
                    className="w-full bg-[#0E9384] rounded-t-sm transition-all duration-300 group-hover:brightness-95"
                    title={`${item.day} Stock Levels: ${item.stockLevelPercent}%`}
                  />
                )}
                {/* Bottom segment: Sales Volume (Mint) */}
                <div
                  style={{ height: `${item.salesVolumePercent}%` }}
                  className={[
                    "w-full bg-[#CBEFE8] transition-all duration-300 group-hover:brightness-95",
                    item.stockLevelPercent === 0 ? "rounded-t-sm" : "",
                  ].join(" ")}
                  title={`${item.day} Sales Volume: ${item.salesVolumePercent}%`}
                />
              </div>

              {/* Day Label */}
              <span className="mt-3 text-xs font-medium text-slate-500">
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 pt-4 border-t border-slate-100 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#0E9384]" />
          <span className="text-[#1D2939]">Stock Levels</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#CBEFE8]" />
          <span className="text-slate-600">Sales Volume</span>
        </div>
      </div>
    </div>
  );
}
