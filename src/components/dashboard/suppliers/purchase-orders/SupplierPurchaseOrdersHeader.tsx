"use client";

import Link from "next/link";
import { ChevronRight, Download, Filter, Plus } from "lucide-react";

interface SupplierPurchaseOrdersHeaderProps {
  onAddNewOrder?: () => void;
  onFilterClick?: () => void;
  onExport?: () => void;
}

export default function SupplierPurchaseOrdersHeader({
  onAddNewOrder,
  onFilterClick,
  onExport,
}: SupplierPurchaseOrdersHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      {/* Title & Breadcrumbs */}
      <div>
        <h1 className="text-xl font-bold text-[var(--brand-black-font)] tracking-tight">
          Purchase Orders
        </h1>
        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[var(--brand-muted-font)] font-medium">
          <Link
            href="/dashboard"
            className="hover:text-[var(--brand-green)] transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <span className="text-[var(--brand-black-font)] font-semibold">
            Purchase Orders
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Add New Order */}
        <Link
          href="/purchases/create-order"
          onClick={onAddNewOrder}
          className="h-9 px-4 rounded-xl bg-[var(--brand-green)] hover:bg-[#0B6E63] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Add New Order</span>
        </Link>

        {/* Filter Button */}
        <button
          type="button"
          onClick={onFilterClick}
          title="Filter Orders"
          className="h-9 w-9 rounded-xl border border-[var(--brand-stroke)] bg-white hover:bg-slate-50 text-[var(--brand-green)] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
        >
          <Filter className="h-3.5 w-3.5" />
        </button>

        {/* Export Button */}
        <button
          type="button"
          onClick={onExport}
          className="h-9 px-4 rounded-xl bg-[var(--brand-green)] hover:bg-[#0B6E63] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}
