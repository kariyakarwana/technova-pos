"use client";

import { Check, Info } from "lucide-react";

interface ReturnSummarySidebarProps {
  originalTotal: number;
  selectedTotal: number;
  selectedCount: number;
  taxRefund: number;
  restockingFee: number;
  refundableAmount: number;
  onAuthorizeRefund: () => void;
  onCancelReturn: () => void;
  isAuthorizing?: boolean;
}

export default function ReturnSummarySidebar({
  originalTotal,
  selectedTotal,
  selectedCount,
  taxRefund,
  restockingFee,
  refundableAmount,
  onAuthorizeRefund,
  onCancelReturn,
  isAuthorizing = false,
}: ReturnSummarySidebarProps) {
  function formatCurrency(amount: number) {
    return `$${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs space-y-6">
      {/* Title */}
      <h2 className="text-base font-bold text-[var(--brand-black-font)]">
        Return Summary
      </h2>

      {/* Breakdown Rows */}
      <div className="space-y-3.5 text-xs">
        <div className="flex items-center justify-between text-slate-600 font-medium">
          <span>Original Total</span>
          <span className="font-semibold text-slate-800">
            {formatCurrency(originalTotal)}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-600 font-medium">
          <span>Selected Items ({selectedCount})</span>
          <span className="font-bold text-[var(--brand-black-font)]">
            {formatCurrency(selectedTotal)}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-600 font-medium">
          <span>Tax Refund</span>
          <span className="font-semibold text-slate-800">
            {formatCurrency(taxRefund)}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-600 font-medium">
          <div className="flex items-center gap-1">
            <Info className="h-3 w-3 text-red-500" />
            <span>Restocking Fee (0%)</span>
          </div>
          <span className="font-bold text-red-500">
            -{formatCurrency(restockingFee)}
          </span>
        </div>

        {/* Divider & Refundable Amount */}
        <div className="pt-4 border-t border-[var(--brand-stroke)] flex items-baseline justify-between">
          <span className="text-sm font-bold text-[var(--brand-black-font)]">
            Refundable Amount
          </span>
          <span className="text-xl font-extrabold text-[var(--brand-green)] tracking-tight">
            {formatCurrency(refundableAmount)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2.5 pt-2">
        {/* Authorize Refund */}
        <button
          type="button"
          onClick={onAuthorizeRefund}
          disabled={selectedCount === 0 || isAuthorizing}
          className="w-full h-11 rounded-xl bg-[var(--brand-green)] hover:bg-[#0B6E63] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
        >
          <Check className="h-4 w-4 stroke-[3]" />
          <span>
            {isAuthorizing ? "Processing..." : "Authorize Refund"}
          </span>
        </button>

        {/* Cancel Return */}
        <button
          type="button"
          onClick={onCancelReturn}
          className="w-full h-11 rounded-xl border border-[var(--brand-green)] bg-white hover:bg-[#E6F7F5] text-[var(--brand-green)] text-xs font-semibold flex items-center justify-center transition-colors shadow-xs cursor-pointer"
        >
          Cancel Return
        </button>
      </div>
    </div>
  );
}
