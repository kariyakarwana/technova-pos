"use client";

import { ChevronsUp, RefreshCw } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";

interface AddProductHeaderProps {
  onRefresh?: () => void;
  onCollapseAll?: () => void;
}

export default function AddProductHeader({
  onRefresh,
  onCollapseAll,
}: AddProductHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0E9384]">
          Products / Create
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Create Product
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Maintain catalog, pricing, stock controls, images and serialized warranty tracking.
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
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

        <BackButton
          href="/products/product-list"
          label="Back to Product List"
        />
      </div>
    </header>
  );
}
