"use client";

import { useState } from "react";
import { Layers } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderStatisticsHeatmapCardProps {
  days: string[];
  times: string[];
  matrix: number[][];
  initialPeriod?: string;
}

export default function OrderStatisticsHeatmapCard({
  days,
  times,
  matrix,
  initialPeriod = "Weekly",
}: OrderStatisticsHeatmapCardProps) {
  const [period, setPeriod] = useState(initialPeriod);

  const maximum = Math.max(0, ...matrix.flat());
  const intensity = (value: number) => value === 0 ? 0 : value >= maximum * 0.67 ? 2 : 1;

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
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="h-7 data-[size=default]:h-7 w-24 rounded-lg border border-[var(--brand-stroke)] bg-slate-50 px-2.5 text-[11px] font-semibold text-slate-700 shadow-none focus-visible:border-[var(--brand-green)] focus-visible:ring-0 cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            position="popper"
            sideOffset={4}
            className="w-24 min-w-[6rem] rounded-lg border border-slate-200 bg-white p-1 shadow-lg ring-0"
          >
            <SelectItem
              value="Weekly"
              className="cursor-pointer text-xs text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
            >
              Weekly
            </SelectItem>
            <SelectItem
              value="Today"
              className="cursor-pointer text-xs text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
            >
              Today
            </SelectItem>
            <SelectItem
              value="Monthly"
              className="cursor-pointer text-xs text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
            >
              Monthly
            </SelectItem>
          </SelectContent>
        </Select>
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
            {matrix.map((row, rIdx) => (
              <div key={rIdx} className="grid grid-cols-7 gap-1.5 h-4">
                {row.map((cellValue, cIdx) => (
                  <div
                    key={cIdx}
                    className={[
                      "h-full rounded-sm transition-colors cursor-pointer relative group",
                      getCellColor(intensity(cellValue)),
                    ].join(" ")}
                  >
                    {/* Hover Tooltip */}
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-900 text-white text-[9px] font-bold py-0.5 px-2 rounded whitespace-nowrap shadow-md z-30">
                      {cellValue} {cellValue === 1 ? "Order" : "Orders"}
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
