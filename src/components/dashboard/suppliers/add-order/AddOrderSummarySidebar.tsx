"use client";

import { Send } from "lucide-react";

interface AddOrderSummarySidebarProps {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  onSubmitForApproval: () => void;
  onSaveDraft: () => void;
  isSubmitting?: boolean;
}

export default function AddOrderSummarySidebar({
  subtotal,
  discount,
  tax,
  shipping,
  total,
  onSubmitForApproval,
  onSaveDraft,
  isSubmitting = false,
}: AddOrderSummarySidebarProps) {
  function formatCurrency(val: number) {
    return `$${val.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs space-y-6">
      {/* Title */}
      <h2 className="text-base font-bold text-[var(--brand-black-font)]">
        Order Summary
      </h2>

      {/* Breakdown Rows */}
      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between text-slate-600 font-medium">
          <span>Subtotal</span>
          <span className="font-bold text-[var(--brand-black-font)]">
            {formatCurrency(subtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-600 font-medium">
          <span>Discount</span>
          <span className="font-bold text-[#DC2626]">
            -{formatCurrency(discount)}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-600 font-medium">
          <span>Tax (8%)</span>
          <span className="font-bold text-[var(--brand-black-font)]">
            {formatCurrency(tax)}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-600 font-medium">
          <span>Shipping</span>
          <span className="font-bold text-[var(--brand-black-font)]">
            {formatCurrency(shipping)}
          </span>
        </div>

        {/* Divider & Total */}
        <div className="pt-4 border-t border-[var(--brand-stroke)] flex items-baseline justify-between">
          <span className="text-base font-bold text-[var(--brand-black-font)]">
            Total
          </span>
          <span className="text-2xl font-extrabold text-[var(--brand-green)] tracking-tight">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        {/* Submit for Approval */}
        <button
          type="button"
          onClick={onSubmitForApproval}
          disabled={isSubmitting}
          className="w-full h-11 rounded-xl bg-[var(--brand-green)] hover:bg-[#0B6E63] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
        >
          <span>{isSubmitting ? "Submitting..." : "Submit for Approval"}</span>
          <Send className="h-3.5 w-3.5" />
        </button>

        {/* Save as Draft */}
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isSubmitting}
          className="w-full h-11 rounded-xl border border-[var(--brand-stroke)] bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center transition-colors shadow-xs cursor-pointer disabled:opacity-50"
        >
          Save as Draft
        </button>
      </div>
    </div>
  );
}
