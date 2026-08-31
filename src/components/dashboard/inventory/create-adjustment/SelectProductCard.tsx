"use client";

import { Armchair, PackageSearch, Search, X } from "lucide-react";

export interface SelectedProduct {
  name: string;
  sku: string;
  currentStock: number;
}

interface SelectProductCardProps {
  product: SelectedProduct | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRemoveProduct: () => void;
  onSelectProduct: (p: SelectedProduct) => void;
}

export default function SelectProductCard({
  product,
  searchQuery,
  onSearchChange,
  onRemoveProduct,
  onSelectProduct,
}: SelectProductCardProps) {
  return (
    <div className="bg-[var(--brand-card-bg)] rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs">
      {/* Title */}
      <div className="flex items-center gap-2 mb-4">
        <PackageSearch className="h-5 w-5 text-[var(--brand-green)]" />
        <h2 className="text-base font-bold text-[var(--brand-black-font)]">
          Select Product
        </h2>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Type product name or SKU (e.g., PRD-092)"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchQuery.trim()) {
              onSelectProduct({
                name: searchQuery.trim(),
                sku: "FUR-CH-092",
                currentStock: 142,
              });
            }
          }}
          className="w-full h-11 pl-10 pr-3 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)]/20 shadow-xs"
        />
      </div>

      {/* Selected Product Banner */}
      {product ? (
        <div className="bg-[#E6F7F5] border border-[#CBEFE8] rounded-xl p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-white border border-[#CBEFE8] text-[var(--brand-green)] flex items-center justify-center shrink-0">
              <Armchair className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--brand-black-font)] leading-tight">
                {product.name}
              </p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                SKU: {product.sku}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onRemoveProduct}
            className="h-7 px-2.5 rounded-lg bg-[#D32F2F] hover:bg-red-700 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
          >
            <X className="h-3 w-3" />
            <span>Remove</span>
          </button>
        </div>
      ) : (
        <p className="text-xs text-slate-400 font-medium italic">
          No product selected. Search above or type SKU to select.
        </p>
      )}
    </div>
  );
}
