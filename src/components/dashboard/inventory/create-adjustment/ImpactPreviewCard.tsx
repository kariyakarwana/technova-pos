"use client";

import { ArrowDown, ArrowUp, BarChart3 } from "lucide-react";
import type { StockAdjustmentType } from "./AdjustmentDetailsForm";

interface ImpactPreviewCardProps {
  currentStock: number;
  quantity: number;
  adjustmentType: StockAdjustmentType;
}

export default function ImpactPreviewCard({
  currentStock,
  quantity,
  adjustmentType,
}: ImpactPreviewCardProps) {
  const diff = adjustmentType === "OUT" ? -quantity : quantity;
  const newBalance = Math.max(0, currentStock + diff);

  return (
    <div className="bg-[#004532] text-white rounded-2xl p-6 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-2 text-white/90 text-xs font-bold tracking-wider">
        <BarChart3 className="h-4 w-4 text-[var(--brand-green)]" />
        <span>IMPACT PREVIEW</span>
      </div>

      {/* Metrics breakdown */}
      <div className="mt-5 space-y-3">
        {/* Current Stock */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/80 font-medium">Current Stock</span>
          <span className="font-bold text-sm text-white">{currentStock}</span>
        </div>

        {/* Adjustment */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/80 font-medium flex items-center gap-1">
            {adjustmentType === "OUT" ? (
              <>
                <ArrowDown className="h-3 w-3 text-red-300" />
                <span>Stock Out</span>
              </>
            ) : (
              <>
                <ArrowUp className="h-3 w-3 text-emerald-300" />
                <span>Stock In</span>
              </>
            )}
          </span>
          <span
            className={[
              "font-bold text-sm",
              adjustmentType === "OUT" ? "text-red-300" : "text-emerald-300",
            ].join(" ")}
          >
            {diff > 0 ? `+${diff}` : diff}
          </span>
        </div>

        {/* Divider */}
        <div className="pt-2 border-t border-white/15" />

        {/* New Balance */}
        <div className="flex items-baseline justify-between pt-1">
          <span className="text-xs font-bold text-white/90">New Balance</span>
          <span className="text-3xl font-extrabold text-white tracking-tight">
            {newBalance}
          </span>
        </div>
      </div>
    </div>
  );
}
