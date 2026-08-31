"use client";

import { FileSpreadsheet, FileText, RotateCcw, Search } from "lucide-react";

interface PurchaseOrderFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatusChip: string;
  onStatusChipChange: (chip: string) => void;
  onExportPdf?: () => void;
  onExportExcel?: () => void;
  onRefresh?: () => void;
}

export default function PurchaseOrderFilterBar({
  searchQuery,
  onSearchChange,
  selectedStatusChip,
  onStatusChipChange,
  onExportPdf,
  onExportExcel,
  onRefresh,
}: PurchaseOrderFilterBarProps) {
  const statusChips = ["All Statuses", "Pending", "In Transit"];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
      {/* Left: Search Input */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search PO, Supplier..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-10 pl-10 pr-3 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)]/20 shadow-xs"
        />
      </div>

      {/* Right: Export buttons & Quick Status Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* PDF Export */}
        <button
          type="button"
          onClick={onExportPdf}
          title="Export PDF"
          className="h-9 w-9 rounded-xl border border-[var(--brand-stroke)] bg-white hover:bg-slate-50 text-red-500 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
        >
          <FileText className="h-4 w-4" />
        </button>

        {/* Excel Export */}
        <button
          type="button"
          onClick={onExportExcel}
          title="Export Excel"
          className="h-9 w-9 rounded-xl border border-[var(--brand-stroke)] bg-white hover:bg-slate-50 text-emerald-600 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
        >
          <FileSpreadsheet className="h-4 w-4" />
        </button>

        {/* Refresh */}
        <button
          type="button"
          onClick={onRefresh}
          title="Refresh"
          className="h-9 w-9 rounded-xl border border-[var(--brand-stroke)] bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>

        {/* Status Chips */}
        <div className="flex items-center gap-1.5 ml-1">
          {statusChips.map((chip) => {
            const isActive = selectedStatusChip === chip;

            return (
              <button
                key={chip}
                type="button"
                onClick={() => onStatusChipChange(chip)}
                className={[
                  "h-9 px-3.5 rounded-full text-xs font-semibold transition-all cursor-pointer",
                  isActive
                    ? "bg-[#E6F7F5] border border-[var(--brand-green)] text-[var(--brand-green)]"
                    : "border border-[var(--brand-stroke)] bg-white text-slate-600 hover:bg-slate-50",
                ].join(" ")}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
