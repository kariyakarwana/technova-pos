"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface UpdateSupplierHeaderProps {
  isPreferred: boolean;
  onTogglePreferred: (value: boolean) => void;
}

export default function UpdateSupplierHeader({
  isPreferred,
  onTogglePreferred,
}: UpdateSupplierHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      {/* Title & Breadcrumbs */}
      <div>
        <h1 className="text-xl font-bold text-[var(--brand-black-font)] tracking-tight">
          Update Supplier
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
            href="/suppliers/management"
            className="hover:text-[var(--brand-green)] transition-colors"
          >
            Suppliers
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <span className="text-[var(--brand-black-font)] font-semibold">
            Update Supplier
          </span>
        </div>
      </div>

      {/* Preferred Supplier Toggle Switch */}
      <div className="flex items-center gap-3 self-start sm:self-auto">
        <button
          type="button"
          role="switch"
          aria-checked={isPreferred}
          onClick={() => onTogglePreferred(!isPreferred)}
          className={[
            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
            isPreferred ? "bg-[var(--brand-green)]" : "bg-slate-200",
          ].join(" ")}
        >
          <span
            className={[
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
              isPreferred ? "translate-x-5" : "translate-x-0",
            ].join(" ")}
          />
        </button>
        <span className="text-xs font-semibold text-[var(--brand-black-font)]">
          Preferred Supplier
        </span>
      </div>
    </div>
  );
}
