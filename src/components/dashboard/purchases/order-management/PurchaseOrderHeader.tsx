"use client";

import Link from "next/link";
import { ChevronRight, Filter, Plus } from "lucide-react";

interface PurchaseOrderHeaderProps {
  onFilterClick?: () => void;
  onCreatePOClick?: () => void;
}

export default function PurchaseOrderHeader({
  onFilterClick,
  onCreatePOClick,
}: PurchaseOrderHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      {/* Title & Breadcrumbs */}
      <div>
        <h1 className="text-xl font-bold text-[var(--brand-black-font)] tracking-tight">
          Purchase Order Management
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
            Purchase Order Management
          </span>
        </div>
      </div>

      {/* Top Right Controls */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onFilterClick}
          className="h-9 px-3.5 rounded-xl border border-[var(--brand-stroke)] bg-white hover:bg-slate-50 text-[var(--brand-green)] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Filter className="h-3.5 w-3.5" />
          <span>Filter</span>
        </button>

        <button
          type="button"
          onClick={onCreatePOClick}
          className="h-9 px-4 rounded-xl bg-[var(--brand-green)] hover:bg-[#0B6E63] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Create Purchase Order</span>
        </button>
      </div>
    </div>
  );
}
