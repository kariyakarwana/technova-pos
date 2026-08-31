"use client";

import Link from "next/link";
import { Ban, ChevronRight, Trash2 } from "lucide-react";

interface CustomerDetailsHeaderProps {
  customerId: string;
  onDeactivate?: () => void;
  onDelete?: () => void;
}

export default function CustomerDetailsHeader({
  customerId,
  onDeactivate,
  onDelete,
}: CustomerDetailsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      {/* Title & Breadcrumbs */}
      <div>
        <h1 className="text-xl font-bold text-[var(--brand-black-font)] tracking-tight">
          Customer {customerId}
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
            Customers
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <span className="text-[var(--brand-black-font)] font-semibold">
            Customer {customerId}
          </span>
        </div>
      </div>

      {/* Right CTAs */}
      <div className="flex items-center gap-3">
        {/* Deactivate Account */}
        <button
          type="button"
          onClick={onDeactivate}
          className="h-9 px-3.5 rounded-xl border border-red-500 bg-white hover:bg-red-50 text-red-600 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Ban className="h-3.5 w-3.5" />
          <span>Deactivate Account</span>
        </button>

        {/* Delete Customer */}
        <button
          type="button"
          onClick={onDelete}
          className="h-9 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Delete Customer</span>
        </button>
      </div>
    </div>
  );
}
