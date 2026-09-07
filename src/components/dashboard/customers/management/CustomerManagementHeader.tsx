"use client";

import Link from "next/link";
import { ChevronRight, Plus, Trash2 } from "lucide-react";

interface CustomerManagementHeaderProps {
  onAddCustomer?: () => void;
  onDeleteSelected?: () => void;
  hasSelection?: boolean;
}

export default function CustomerManagementHeader({
  onAddCustomer,
  onDeleteSelected,
  hasSelection = false,
}: CustomerManagementHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      {/* Title & Breadcrumbs */}
      <div>
        <h1 className="text-xl font-bold text-[var(--brand-black-font)] tracking-tight">
          Customer Management
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
            Customer Management
          </span>
        </div>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Add Customer Button */}
        <Link
          href="/customers"
          onClick={onAddCustomer}
          className="h-9 px-4 rounded-xl border border-[var(--brand-green)] bg-white hover:bg-[#E6F7F5] text-[var(--brand-green)] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Customer</span>
        </Link>

        {/* Delete Customer Button */}
        <button
          type="button"
          onClick={onDeleteSelected}
          className={[
            "h-9 px-4 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer",
            hasSelection ? "ring-2 ring-red-300" : "",
          ].join(" ")}
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Delete Customer</span>
        </button>
      </div>
    </div>
  );
}
