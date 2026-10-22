"use client";

import { ArrowDown, ArrowUp, Minus, Plus, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type StockAdjustmentType = "OUT" | "IN";

interface AdjustmentDetailsFormProps {
  adjustmentType: StockAdjustmentType;
  onAdjustmentTypeChange: (type: StockAdjustmentType) => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  reason: string;
  onReasonChange: (reason: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
}

export default function AdjustmentDetailsForm({
  adjustmentType,
  onAdjustmentTypeChange,
  quantity,
  onQuantityChange,
  reason,
  onReasonChange,
  notes,
  onNotesChange,
}: AdjustmentDetailsFormProps) {
  return (
    <div className="bg-[var(--brand-card-bg)] rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs space-y-5">
      {/* Title */}
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-5 w-5 text-[var(--brand-green)]" />
        <h2 className="text-base font-bold text-[var(--brand-black-font)]">
          Adjustment Details
        </h2>
      </div>

      {/* 1. Adjustment Type Toggle Buttons */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[var(--brand-black-font)]">
          Adjustment Type
        </label>
        <div className="grid grid-cols-2 gap-3 max-w-sm">
          {/* Stock Out */}
          <button
            type="button"
            onClick={() => onAdjustmentTypeChange("OUT")}
            className={[
              "h-10 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer",
              adjustmentType === "OUT"
                ? "bg-[var(--brand-green)] text-white shadow-xs"
                : "border border-[var(--brand-stroke)] bg-white text-slate-700 hover:bg-slate-50",
            ].join(" ")}
          >
            <ArrowDown className="h-3.5 w-3.5" />
            <span>Stock Out</span>
          </button>

          {/* Stock In */}
          <button
            type="button"
            onClick={() => onAdjustmentTypeChange("IN")}
            className={[
              "h-10 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer",
              adjustmentType === "IN"
                ? "bg-[var(--brand-green)] text-white shadow-xs"
                : "border border-[var(--brand-stroke)] bg-white text-slate-700 hover:bg-slate-50",
            ].join(" ")}
          >
            <ArrowUp className="h-3.5 w-3.5" />
            <span>Stock In</span>
          </button>
        </div>
      </div>

      {/* 2. Quantity to Adjust Stepper */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[var(--brand-black-font)]">
          Quantity to Adjust
        </label>
        <div className="flex items-center gap-2 max-w-xs">
          <button
            type="button"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="h-10 w-10 rounded-xl border border-[var(--brand-stroke)] bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
          >
            <Minus className="h-4 w-4" />
          </button>

          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => onQuantityChange(Math.max(1, Number(e.target.value) || 1))}
            className="h-10 flex-1 text-center font-bold text-sm text-[var(--brand-black-font)] bg-white border border-[var(--brand-stroke)] rounded-xl focus:outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)]/20 shadow-xs"
          />

          <button
            type="button"
            onClick={() => onQuantityChange(quantity + 1)}
            className="h-10 w-10 rounded-xl border border-[var(--brand-stroke)] bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 3. Reason for Adjustment */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[var(--brand-black-font)]">
          Reason for Adjustment
        </label>
        <div className="max-w-md">
          <Select
            value={reason || "Damaged Goods"}
            onValueChange={(val) => onReasonChange(val)}
          >
            <SelectTrigger className="w-full h-10 data-[size=default]:h-10 px-3.5 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] focus:outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)]/20 cursor-pointer shadow-xs font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value="Damaged Goods" className="text-xs hover:bg-[#F4FBF9] hover:text-[#0E9384] cursor-pointer">
                Damaged Goods
              </SelectItem>
              <SelectItem value="Inventory Count Correction" className="text-xs hover:bg-[#F4FBF9] hover:text-[#0E9384] cursor-pointer">
                Inventory Count Correction
              </SelectItem>
              <SelectItem value="Expired Stock" className="text-xs hover:bg-[#F4FBF9] hover:text-[#0E9384] cursor-pointer">
                Expired Stock
              </SelectItem>
              <SelectItem value="Display Write-Off" className="text-xs hover:bg-[#F4FBF9] hover:text-[#0E9384] cursor-pointer">
                Display Write-Off
              </SelectItem>
              <SelectItem value="Theft/Lost" className="text-xs hover:bg-[#F4FBF9] hover:text-[#0E9384] cursor-pointer">
                Theft/Lost
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 4. Additional Notes */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[var(--brand-black-font)]">
          Additional Notes
        </label>
        <textarea
          rows={3}
          placeholder="Provide extra context for this adjustment..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="w-full p-3 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)]/20 shadow-xs resize-none font-medium"
        />
      </div>
    </div>
  );
}
