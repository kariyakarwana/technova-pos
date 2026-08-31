"use client";

import { BarChart3, MoreVertical } from "lucide-react";

interface DeliveryReliabilityChartProps {
  trendData: Array<{
    month: string;
    rate: number;
  }>;
}

export default function DeliveryReliabilityChart({
  trendData,
}: DeliveryReliabilityChartProps) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[var(--brand-black-font)]">
          Delivery Reliability Trend
        </h3>

        <button
          type="button"
          title="More options"
          className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      {/* Chart Visual Container */}
      <div className="h-56 bg-slate-50/70 border border-slate-100 rounded-xl p-5 flex flex-col justify-between">
        {/* Bars Container */}
        <div className="grid grid-cols-6 gap-3 items-end h-36 pt-2">
          {trendData.map((d) => (
            <div
              key={d.month}
              className="flex flex-col items-center gap-1.5 h-full justify-end group"
            >
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-[var(--brand-green)] transition-colors">
                {d.rate}%
              </span>
              <div
                style={{ height: `${(d.rate - 70) * 3}%` }}
                className="w-full max-w-[32px] bg-[#246A66] group-hover:bg-[var(--brand-green)] rounded-t-lg transition-all"
              />
              <span className="text-[10px] font-semibold text-slate-500">
                {d.month}
              </span>
            </div>
          ))}
        </div>

        {/* Subtitle Footer */}
        <div className="flex items-center justify-center gap-1.5 pt-2 text-[11px] font-medium text-slate-400 border-t border-slate-200/60">
          <BarChart3 className="h-3.5 w-3.5" />
          <span>6-Month Rolling Average Chart</span>
        </div>
      </div>
    </div>
  );
}
