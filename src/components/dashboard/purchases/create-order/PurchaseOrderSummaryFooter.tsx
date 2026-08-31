"use client";

interface PurchaseOrderSummaryFooterProps {
  totalItems: number;
  taxEstimated: number;
  totalAmount: number;
}

export default function PurchaseOrderSummaryFooter({
  totalItems,
  taxEstimated,
  totalAmount,
}: PurchaseOrderSummaryFooterProps) {
  return (
    <div className="bg-[#E6F7F5] border border-[#CBEFE8] rounded-2xl p-6 shadow-xs flex flex-col items-end gap-2 text-right">
      <div className="flex items-center gap-12 text-sm text-slate-600 font-medium">
        <span>Total Items:</span>
        <span className="font-bold text-[var(--brand-black-font)] w-28 text-right">
          {totalItems}
        </span>
      </div>

      <div className="flex items-center gap-12 text-sm text-slate-600 font-medium">
        <span>Tax (10% estimated):</span>
        <span className="font-bold text-[var(--brand-black-font)] w-28 text-right">
          ${taxEstimated.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      <div className="pt-3 border-t border-[#CBEFE8] flex items-center gap-12 mt-1">
        <span className="text-base font-bold text-[var(--brand-black-font)]">
          Total Amount:
        </span>
        <span className="text-2xl font-extrabold text-[var(--brand-green)] tracking-tight w-36 text-right">
          ${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
}
