"use client";

import Link from "next/link";
import { Ban, Check, ChevronRight, Edit } from "lucide-react";

interface PurchaseDetailsHeaderProps {
  poNumber: string;
  onCancel?: () => void;
  onEdit?: () => void;
  onReject?: () => void;
  onApprove?: () => void;
}

export default function PurchaseDetailsHeader({
  poNumber,
  onCancel,
  onEdit,
  onReject,
  onApprove,
}: PurchaseDetailsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      {/* Title & Breadcrumbs */}
      <div>
        <h1 className="text-xl font-bold text-[var(--brand-black-font)] tracking-tight">
          {poNumber}
        </h1>
        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[var(--brand-muted-font)] font-medium">
          <Link
            href="/dashboard"
            className="hover:text-[var(--brand-green)] transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <Link
            href="/purchases"
            className="hover:text-[var(--brand-green)] transition-colors"
          >
            Purchases
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <span className="text-[var(--brand-black-font)] font-semibold">
            {poNumber}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Cancel */}
        <Link
          href="/purchases"
          onClick={onCancel}
          className="h-9 px-4 rounded-xl border border-[var(--brand-stroke)] bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center transition-colors shadow-xs"
        >
          Cancel
        </Link>

        {/* Edit */}
        <button
          type="button"
          onClick={onEdit}
          className="h-9 px-3.5 rounded-xl border border-[var(--brand-green)] bg-white hover:bg-[#E6F7F5] text-[var(--brand-green)] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Edit className="h-3.5 w-3.5" />
          <span>Edit</span>
        </button>

        {/* Rejected */}
        <button
          type="button"
          onClick={onReject}
          className="h-9 px-3.5 rounded-xl border border-red-500 bg-white hover:bg-red-50 text-red-600 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Ban className="h-3.5 w-3.5" />
          <span>Rejected</span>
        </button>

        {/* Approve Order */}
        <button
          type="button"
          onClick={onApprove}
          className="h-9 px-4 rounded-xl bg-[var(--brand-green)] hover:bg-[#0B6E63] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Check className="h-4 w-4 stroke-[3]" />
          <span>Approve Order</span>
        </button>
      </div>
    </div>
  );
}
