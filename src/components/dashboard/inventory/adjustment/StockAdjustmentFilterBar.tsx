"use client";

import { Download, Filter, Search } from "lucide-react";

interface StockAdjustmentFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick?: () => void;
  onExportClick?: () => void;
}

export default function StockAdjustmentFilterBar({
  searchQuery,
  onSearchChange,
  onFilterClick,
  onExportClick,
}: StockAdjustmentFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-4">
      {/* Left: Choose Date Range / Search Input */}
      <div className="flex flex-col gap-1.5 flex-1 max-w-sm">
        <label className="text-xs font-semibold text-[var(--brand-muted-font)]">
          Choose Date Range
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Adjustment"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)]/20 shadow-xs"
          />
        </div>
      </div>

      {/* Right: Filter & Export Action Buttons */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        {/* Filter Button */}
        <button
          type="button"
          onClick={onFilterClick}
          title="Filter adjustments"
          className="h-10 w-10 rounded-xl border border-[var(--brand-stroke)] bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
        >
          <Filter className="h-4 w-4" />
        </button>

        {/* Export Button */}
        <button
          type="button"
          onClick={onExportClick}
          className="h-10 px-4 rounded-xl bg-[var(--brand-green)] hover:bg-[#0B6E63] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}
