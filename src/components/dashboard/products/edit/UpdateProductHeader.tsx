"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight, ChevronsUp, RefreshCw } from "lucide-react";

interface UpdateProductHeaderProps {
  onRefresh?: () => void;
  onCollapseAll?: () => void;
}

export default function UpdateProductHeader({
  onRefresh,
  onCollapseAll,
}: UpdateProductHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      {/* Title & Breadcrumbs */}
      <div>
        <h1 className="text-xl font-bold text-[var(--brand-black-font)] tracking-tight">
          Update Product
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
            href="/products/product-list"
            className="hover:text-[var(--brand-green)] transition-colors"
          >
            Products
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <span className="text-[var(--brand-black-font)] font-semibold">
            Update Product
          </span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          title="Refresh"
          className="h-8 w-8 rounded-lg border border-[var(--brand-stroke)] flex items-center justify-center text-slate-500 hover:border-[var(--brand-green)] hover:text-[var(--brand-green)] transition-all cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={onCollapseAll}
          title="Collapse all"
          className="h-8 w-8 rounded-lg border border-[var(--brand-stroke)] flex items-center justify-center text-slate-500 hover:border-[var(--brand-green)] hover:text-[var(--brand-green)] transition-all cursor-pointer"
        >
          <ChevronsUp className="h-3.5 w-3.5" />
        </button>

        <Link
          href="/products/product-list"
          className="flex items-center gap-1.5 h-8 px-4 rounded-xl bg-[#1E5D57] text-white text-xs font-medium hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Products
        </Link>
      </div>
    </div>
  );
}
