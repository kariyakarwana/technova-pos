"use client";

import { Search } from "lucide-react";

interface PosHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onViewAllCategories?: () => void;
  /** Current offline state — drives the toggle visual. */
  isOffline?: boolean;
  /** Called when the dev toggle is flipped. */
  onToggleOffline?: () => void;
}

export function PosHeader({
  searchQuery,
  onSearchChange,
  onViewAllCategories,
  isOffline = false,
  onToggleOffline,
}: PosHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-[#E6EAED] shrink-0">
      <div>
        <h1 className="text-base font-bold text-[#212B36] tracking-tight">
          Welcome, Catchier 1
        </h1>
        <p className="text-xs text-slate-400 mt-0.5 font-normal">August 01, 2026</p>
      </div>

      <div className="flex items-center gap-3">
        {onToggleOffline && (
          <button
            type="button"
            onClick={onToggleOffline}
            title="Toggle offline mode simulation"
            className={[
              "flex items-center gap-1.5 h-8 px-2.5 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer",
              isOffline
                ? "border-[#D32F2F] bg-[#FDEDEC] text-[#D32F2F]"
                : "border-emerald-300 bg-emerald-50 text-emerald-700",
            ].join(" ")}
          >
            <span
              className={[
                "h-2 w-2 rounded-full shrink-0",
                isOffline ? "bg-[#D32F2F] animate-pulse" : "bg-emerald-500",
              ].join(" ")}
            />
            {isOffline ? "Offline Mode" : "Online Mode"}
          </button>
        )}

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="pos-search"
            type="text"
            placeholder="Search Product"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-3 h-9 w-64 rounded-lg border border-[#E6EAED] text-xs text-[#212B36] placeholder:text-slate-400 bg-white focus:outline-none focus:border-[#0E9384] focus:ring-1 focus:ring-[#0E9384]/20 transition-all"
          />
        </div>

        <button
          type="button"
          onClick={onViewAllCategories}
          className="h-9 px-4 rounded-lg bg-[#0D8275] hover:bg-[#0B6E63] text-white text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
        >
          View All Categories
        </button>
      </div>
    </div>
  );
}

export default PosHeader;
