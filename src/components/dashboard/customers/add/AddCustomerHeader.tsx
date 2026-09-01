"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight, ChevronUp, RotateCcw } from "lucide-react";

interface AddCustomerHeaderProps {
  onRefresh?: () => void;
  onToggleCollapse?: () => void;
}

export default function AddCustomerHeader({
  onRefresh,
  onToggleCollapse,
}: AddCustomerHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      {/* Title & Breadcrumbs */}
      <div>
        <h1 className="text-xl font-bold text-[var(--brand-black-font)] tracking-tight">
          Add Customer Management
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
            href="/customers"
            className="hover:text-[var(--brand-green)] transition-colors"
          >
            Customer Management
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <span className="text-[var(--brand-black-font)] font-semibold">
            Add Customer Information
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Refresh */}
        <button
          type="button"
          onClick={onRefresh}
          title="Refresh form"
          className="h-9 w-9 rounded-xl border border-[var(--brand-stroke)] bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>

        {/* Collapse Chevron */}
        <button
          type="button"
          onClick={onToggleCollapse}
          title="Toggle view"
          className="h-9 w-9 rounded-xl border border-[var(--brand-stroke)] bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
        >
          <ChevronUp className="h-4 w-4" />
        </button>

        {/* Back to Customer Management */}
        <Link
          href="/customers"
          className="h-9 px-4 rounded-xl bg-[var(--brand-green)] hover:bg-[#0B6E63] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Customer Management</span>
        </Link>
      </div>
    </div>
  );
}
