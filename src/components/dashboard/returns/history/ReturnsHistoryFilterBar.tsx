"use client";

import { Calendar, ChevronDown, FileSpreadsheet, FileText, RotateCcw } from "lucide-react";

interface ReturnsHistoryFilterBarProps {
  dateRange: string;
  onDateRangeChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  branch: string;
  onBranchChange: (val: string) => void;
  onExportPdf?: () => void;
  onExportExcel?: () => void;
  onRefresh?: () => void;
  onApplyFilters?: () => void;
}

export default function ReturnsHistoryFilterBar({
  dateRange,
  onDateRangeChange,
  status,
  onStatusChange,
  branch,
  onBranchChange,
  onExportPdf,
  onExportExcel,
  onRefresh,
  onApplyFilters,
}: ReturnsHistoryFilterBarProps) {
  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
      {/* Left Form Filters */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Choose Date Range */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700">
            Choose Date Range
          </label>
          <div className="relative w-64">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={dateRange}
              onChange={(e) => onDateRangeChange(e.target.value)}
              placeholder="01-Aug-2026 - 12-Dec-2026"
              className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs font-medium"
            />
          </div>
        </div>

        {/* Return Status */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700">
            Return Status
          </label>
          <div className="relative w-44">
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full h-9 pl-3 pr-8 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] appearance-none focus:outline-none focus:border-[var(--brand-green)] cursor-pointer shadow-xs font-medium"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="DAMAGED">Damaged</option>
              <option value="RESALABLE">Resalable</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Branch */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700">
            Branch
          </label>
          <div className="relative w-44">
            <select
              value={branch}
              onChange={(e) => onBranchChange(e.target.value)}
              className="w-full h-9 pl-3 pr-8 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] appearance-none focus:outline-none focus:border-[var(--brand-green)] cursor-pointer shadow-xs font-medium"
            >
              <option value="All">All</option>
              <option value="Branch 1 - Main">Branch 1 - Main</option>
              <option value="Branch 2 - Downtown">Branch 2 - Downtown</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Right Action Icons & Apply */}
      <div className="flex items-center gap-2 self-end xl:self-auto pt-1">
        {/* PDF Export */}
        <button
          type="button"
          onClick={onExportPdf}
          title="Export to PDF"
          className="h-9 w-9 rounded-xl border border-[var(--brand-stroke)] bg-white hover:bg-slate-50 text-red-500 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
        >
          <FileText className="h-4 w-4" />
        </button>

        {/* Excel Export */}
        <button
          type="button"
          onClick={onExportExcel}
          title="Export to Excel"
          className="h-9 w-9 rounded-xl border border-[var(--brand-stroke)] bg-white hover:bg-slate-50 text-emerald-600 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
        >
          <FileSpreadsheet className="h-4 w-4" />
        </button>

        {/* Refresh */}
        <button
          type="button"
          onClick={onRefresh}
          title="Reset filters"
          className="h-9 w-9 rounded-xl border border-[var(--brand-stroke)] bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>

        {/* Apply Filters */}
        <button
          type="button"
          onClick={onApplyFilters}
          className="h-9 px-4 rounded-xl bg-[var(--brand-green)] hover:bg-[#0B6E63] text-white text-xs font-semibold flex items-center justify-center transition-colors shadow-xs cursor-pointer"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
