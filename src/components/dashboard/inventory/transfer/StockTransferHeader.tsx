"use client";

import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";

interface StockTransferHeaderProps {
  onCreateTransfer?: () => void;
}

export default function StockTransferHeader({
  onCreateTransfer,
}: StockTransferHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      {/* Title & Breadcrumbs */}
      <div>
        <h1 className="text-xl font-bold text-[var(--brand-black-font)] tracking-tight">
          Stock Transfer Management
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
            href="/inventory"
            className="hover:text-[var(--brand-green)] transition-colors"
          >
            Inventory
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <span className="text-slate-500">Stock Transfer Management</span>
        </div>
      </div>

      {/* Right CTA */}
      <button
        type="button"
        onClick={onCreateTransfer}
        className="h-9 px-4 rounded-xl bg-[var(--brand-green)] hover:bg-[#0B6E63] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
      >
        <Plus className="h-3.5 w-3.5" />
        <span>Create Transfer</span>
      </button>
    </div>
  );
}
