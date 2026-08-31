"use client";

import Link from "next/link";
import { Bookmark, ChevronRight } from "lucide-react";

interface CreateAdjustmentHeaderProps {
  onCancel?: () => void;
  onSaveDraft?: () => void;
}

export default function CreateAdjustmentHeader({
  onCancel,
  onSaveDraft,
}: CreateAdjustmentHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      {/* Title & Breadcrumbs */}
      <div>
        <h1 className="text-xl font-bold text-[var(--brand-black-font)] tracking-tight">
          Create Stock Adjustment
        </h1>
        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-400 font-medium">
          <Link
            href="/dashboard"
            className="hover:text-[var(--brand-green)] transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <Link
            href="/inventory"
            className="hover:text-[var(--brand-green)] transition-colors"
          >
            Inventory
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <Link
            href="/inventory/adjustment"
            className="hover:text-[var(--brand-green)] transition-colors"
          >
            Stock Adjustment
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <span className="text-slate-500">Create</span>
        </div>
      </div>

      {/* Top CTA Buttons */}
      <div className="flex items-center gap-2.5">
        <Link
          href="/inventory/adjustment"
          onClick={onCancel}
          className="h-9 px-4 rounded-xl border border-[var(--brand-stroke)] bg-white hover:bg-slate-50 text-[var(--brand-black-font)] text-xs font-semibold flex items-center justify-center transition-colors shadow-xs"
        >
          Cancel
        </Link>

        <button
          type="button"
          onClick={onSaveDraft}
          className="h-9 px-4 rounded-xl bg-[var(--brand-green)] hover:bg-[#0B6E63] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Bookmark className="h-3.5 w-3.5" />
          <span>Save Draft</span>
        </button>
      </div>
    </div>
  );
}
