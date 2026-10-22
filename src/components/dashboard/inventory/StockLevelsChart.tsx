"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
        <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
          <SelectTrigger className="h-8 data-[size=default]:h-8 w-28 rounded-lg border border-[#E4E7EC] bg-[#F8FAFC] px-3 text-xs font-semibold text-slate-700 shadow-none focus-visible:border-[#0E9384] focus-visible:ring-0 cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            position="popper"
            sideOffset={4}
            className="w-28 min-w-[7rem] rounded-lg border border-slate-200 bg-white p-1 shadow-lg ring-0"
          >
            <SelectItem
              value="This Week"
              className="cursor-pointer text-xs text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
            >
              This Week
            </SelectItem>
            <SelectItem
              value="Last Week"
              className="cursor-pointer text-xs text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
            >
              Last Week
            </SelectItem>
            <SelectItem
              value="This Month"
              className="cursor-pointer text-xs text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
            >
              This Month
            </SelectItem>
          </SelectContent>
        </Select>
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
