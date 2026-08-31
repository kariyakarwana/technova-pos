"use client";

import { Filter, Search } from "lucide-react";
import type { TransferDirection } from "./StockTransferMock";

interface StockTransferTabsFilterProps {
  activeTab: TransferDirection;
  onTabChange: (tab: TransferDirection) => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onFilterClick?: () => void;
}

export default function StockTransferTabsFilter({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  onFilterClick,
}: StockTransferTabsFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-[var(--brand-stroke)]">
      {/* Left Tabs */}
      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={() => onTabChange("outgoing")}
          className={[
            "text-xs font-bold pb-2 transition-all cursor-pointer relative",
            activeTab === "outgoing"
              ? "text-[var(--brand-green)] border-b-2 border-[var(--brand-green)]"
              : "text-slate-500 hover:text-slate-700",
          ].join(" ")}
        >
          Outgoing
        </button>

        <button
          type="button"
          onClick={() => onTabChange("incoming")}
          className={[
            "text-xs font-bold pb-2 transition-all cursor-pointer relative",
            activeTab === "incoming"
              ? "text-[var(--brand-green)] border-b-2 border-[var(--brand-green)]"
              : "text-slate-500 hover:text-slate-700",
          ].join(" ")}
        >
          Incoming
        </button>
      </div>

      {/* Right Search and Filter button */}
      <div className="flex items-center gap-2.5">
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Branch 1"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-8 pl-8 pr-3 text-xs bg-white border border-[var(--brand-stroke)] rounded-lg text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs"
          />
        </div>

        <button
          type="button"
          onClick={onFilterClick}
          title="Filter transfers"
          className="h-8 w-8 rounded-lg border border-[var(--brand-stroke)] bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <Filter className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
