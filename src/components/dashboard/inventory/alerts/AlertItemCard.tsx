"use client";

import { AlertTriangle, ArrowLeftRight, Clock } from "lucide-react";
import type { AlertItem } from "./InventoryAlertsMock";

interface AlertItemCardProps {
  alert: AlertItem;
  onPrimaryAction?: (item: AlertItem) => void;
  onSecondaryAction?: (item: AlertItem) => void;
}

export default function AlertItemCard({
  alert,
  onPrimaryAction,
  onSecondaryAction,
}: AlertItemCardProps) {
  const isCritical = alert.severity === "CRITICAL";

  return (
    <div
      className={[
        "bg-white rounded-xl border border-[var(--brand-stroke)] p-4 shadow-xs flex flex-col justify-between transition-all",
        isCritical ? "border-l-4 border-l-[#D32F2F]" : "",
      ].join(" ")}
    >
      <div>
        {/* Top Badge & SKU */}
        <div className="flex items-center gap-2">
          {isCritical ? (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#D32F2F] text-white">
              <AlertTriangle className="h-2.5 w-2.5" />
              <span>CRITICAL</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#E0F2FE] text-[#0284C7]">
              <Clock className="h-2.5 w-2.5" />
              <span>WARNING</span>
            </span>
          )}
          <span className="text-xs font-semibold text-slate-500">
            SKU: {alert.sku}
          </span>
        </div>

        {/* Product Title */}
        <h3 className="mt-2 text-sm font-bold text-[var(--brand-black-font)] leading-snug">
          {alert.name}
        </h3>

        {/* 3-Column Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-1 text-xs">
          <div>
            <span className="block text-[11px] text-slate-400 font-medium">
              Current Stock
            </span>
            <span
              className={[
                "block text-sm font-bold mt-0.5",
                isCritical ? "text-[#D32F2F]" : "text-[var(--brand-black-font)]",
              ].join(" ")}
            >
              {alert.currentStock}
            </span>
          </div>

          <div>
            <span className="block text-[11px] text-slate-400 font-medium">
              Velocity / Wk
            </span>
            <span className="block text-xs font-semibold text-slate-700 mt-0.5">
              {alert.velocityPerWeek}
            </span>
          </div>

          <div>
            <span className="block text-[11px] text-slate-400 font-medium">
              Suggested
            </span>
            <span className="block text-sm font-bold text-[var(--brand-green)] mt-0.5">
              {alert.suggestedReorder}
            </span>
          </div>
        </div>

        {/* Transfer Note (if available) */}
        {alert.transferNote && (
          <div className="mt-3.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <ArrowLeftRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>{alert.transferNote}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-1 flex items-center justify-between gap-2">
        {alert.secondaryActionLabel && (
          <button
            type="button"
            onClick={() => onSecondaryAction?.(alert)}
            className="text-xs font-semibold text-slate-700 hover:text-[var(--brand-green)] transition-colors cursor-pointer"
          >
            {alert.secondaryActionLabel}
          </button>
        )}

        {alert.primaryActionLabel && (
          <button
            type="button"
            onClick={() => onPrimaryAction?.(alert)}
            className="text-xs font-semibold text-[var(--brand-green)] hover:underline ml-auto transition-colors cursor-pointer"
          >
            {alert.primaryActionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
