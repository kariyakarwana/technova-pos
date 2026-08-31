"use client";

import type { ReturnReasonItem } from "./ReturnsManagementMock";

interface ReturnReasonsChartCardProps {
  totalReturns: number;
  breakdown: ReturnReasonItem[];
}

export default function ReturnReasonsChartCard({
  totalReturns,
  breakdown,
}: ReturnReasonsChartCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs flex flex-col justify-between space-y-6">
      {/* Title */}
      <h2 className="text-base font-bold text-[var(--brand-black-font)]">
        Return Reasons
      </h2>

      {/* Center Tile Metric */}
      <div className="flex items-center justify-center my-auto py-6">
        <div className="h-32 w-32 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center shadow-2xs">
          <span className="text-3xl font-extrabold text-[var(--brand-black-font)] tracking-tight">
            {totalReturns}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 mt-0.5">
            Total Returns
          </span>
        </div>
      </div>

      {/* Breakdown List */}
      <div className="space-y-3 pt-2">
        {breakdown.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between text-xs font-semibold"
          >
            <div className="flex items-center gap-2 text-slate-700">
              <span
                style={{ backgroundColor: item.color }}
                className="h-2.5 w-2.5 rounded-xs shrink-0"
              />
              <span>{item.label}</span>
            </div>
            <span className="text-[var(--brand-black-font)] font-bold">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
