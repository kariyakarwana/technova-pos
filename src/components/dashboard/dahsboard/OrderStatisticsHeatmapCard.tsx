"use client";

import { useState } from "react";
import { ChevronDown, Layers } from "lucide-react";

interface OrderStatisticsHeatmapCardProps {
  days: string[];
  times: string[];
}

export default function OrderStatisticsHeatmapCard({
  days,
  times,
}: OrderStatisticsHeatmapCardProps) {
  const [period, setPeriod] = useState("Weekly");

  // Grid activity values (0: light mint, 1: medium mint, 2: dark teal)
  const heatmapMatrix: number[][] = [
    // 12 mp
    [1, 1, 1, 1, 1, 2, 2],
    // 12 pm
    [1, 0, 1, 1, 2, 1, 1],
    // 02 pm
    [1, 1, 1, 1, 1, 1, 1],
    // 12 am
    [1, 1, 1, 1, 1, 1, 1],
    // 10 am
    [2, 2, 2, 1, 1, 1, 1],
    // 8 am
    [1, 1, 1, 1, 1, 2, 2],
    // 6 am
    [1, 1, 1, 1, 1, 1, 1],
    // 4 am
    [2, 2, 2, 2, 1, 1, 1],
    // 2 am
    [2, 2, 2, 1, 1, 1, 1],
  ];

  function getCellColor(intensity: number) {
    switch (intensity) {
      case 2:
        return "bg-[#094F45] hover:bg-[#063831]"; // Darkest Teal
      case 1:
        return "bg-[#7FE3D6] hover:bg-[#5EEAD4]"; // Medium Mint
      case 0:
      default:
        return "bg-slate-100 hover:bg-slate-200"; // Empty / Inactive
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-5 shadow-xs flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center">
            <Layers className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-sm font-bold text-[var(--brand-black-font)]">
            Order Statistics
          </h2>
        </div>

        {/* Period Selector */}
        <div className="relative">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="h-7 pl-2.5 pr-6 text-[11px] bg-slate-50 border border-[var(--brand-stroke)] rounded-lg text-slate-700 font-semibold appearance-none focus:outline-none cursor-pointer"
          >
            <option value="Weekly">Weekly</option>
            <option value="Today">Today</option>
            <option value="Monthly">Monthly</option>
          </select>
          <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="flex gap-2">
        {/* Y-Axis Time Labels */}
        <div className="flex flex-col justify-between text-[10px] font-semibold text-slate-400 py-0.5 shrink-0 text-right pr-1">
          {times.map((t, idx) => (
            <span key={idx} className="h-4 leading-4">
              {t}
            </span>
          ))}
        </div>

        {/* 7 Columns */}
        <div className="flex-1 space-y-2">
          <div className="grid grid-rows-9 gap-1.5">
            {heatmapMatrix.map((row, rIdx) => (
              <div key={rIdx} className="grid grid-cols-7 gap-1.5 h-4">
                {row.map((cellValue, cIdx) => (
                  <div
                    key={cIdx}
                    className={[
                      "h-full rounded-sm transition-colors cursor-pointer relative group",
                      getCellColor(cellValue),
                    ].join(" ")}
                  >
                    {/* Hover Tooltip */}
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-900 text-white text-[9px] font-bold py-0.5 px-2 rounded whitespace-nowrap shadow-md z-30">
                      {cellValue === 2
                        ? "297 Orders"
                        : cellValue === 1
                        ? "145 Orders"
                        : "0 Orders"}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* X-Axis Day Labels */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-semibold text-slate-500 pt-1">
            {days.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
