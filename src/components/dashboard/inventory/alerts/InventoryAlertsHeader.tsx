"use client";

import Link from "next/link";
import { ChevronRight, Filter, ShoppingCart } from "lucide-react";

interface InventoryAlertsHeaderProps {
  onFilterBranch?: () => void;
  onBulkReorder?: () => void;
}

export default function InventoryAlertsHeader({
  onFilterBranch,
  onBulkReorder,
}: InventoryAlertsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      {/* Title & Breadcrumbs */}
      <div>
        <h1 className="text-xl font-bold text-[var(--brand-black-font)] tracking-tight">
          Inventory Management
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
            Inventory Management
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <span className="text-slate-500">Stock Alerts</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5">
        {/* Filter by Branch */}
        <button
          type="button"
          onClick={onFilterBranch}
          className="h-9 px-3.5 rounded-xl border border-[var(--brand-stroke)] bg-white hover:bg-slate-50 text-[var(--brand-black-font)] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Filter className="h-3.5 w-3.5 text-slate-500" />
          <span>Filter by Branch</span>
        </button>

        {/* Bulk Reorder */}
        <button
          type="button"
          onClick={onBulkReorder}
          className="h-9 px-4 rounded-xl bg-[var(--brand-green)] hover:bg-[#0B6E63] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          <span>Bulk Reorder</span>
        </button>
      </div>
    </div>
  );
}
