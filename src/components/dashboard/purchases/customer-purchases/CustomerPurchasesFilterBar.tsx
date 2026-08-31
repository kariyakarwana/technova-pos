"use client";

import { Calendar, ChevronDown, FileSpreadsheet, FileText, RotateCcw } from "lucide-react";

interface CustomerPurchasesFilterBarProps {
  dateRange: string;
  onDateRangeChange: (val: string) => void;
  selectedCashier: string;
  onCashierChange: (val: string) => void;
  selectedBranch: string;
  onBranchChange: (val: string) => void;
  cashiers: string[];
  branches: string[];
  onApplyFilters?: () => void;
  onResetFilters?: () => void;
  onExportPdf?: () => void;
  onExportExcel?: () => void;
}

export default function CustomerPurchasesFilterBar({
  dateRange,
  onDateRangeChange,
  selectedCashier,
  onCashierChange,
  selectedBranch,
  onBranchChange,
  cashiers,
  branches,
  onApplyFilters,
  onResetFilters,
  onExportPdf,
  onExportExcel,
}: CustomerPurchasesFilterBarProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
      {/* Left Filter Form */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 flex-1 max-w-2xl">
        {/* Choose Date */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[var(--brand-black-font)]">
            Choose Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={dateRange}
              onChange={(e) => onDateRangeChange(e.target.value)}
              placeholder="01-Aug-2026 - 12-Dec-2026"
              className="w-full h-9 pl-8 pr-3 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs font-medium"
            />
          </div>
        </div>

        {/* Cashier */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[var(--brand-black-font)]">
            Cashier
          </label>
          <div className="relative">
            <select
              value={selectedCashier}
              onChange={(e) => onCashierChange(e.target.value)}
              className="w-full h-9 pl-3 pr-8 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] appearance-none focus:outline-none focus:border-[var(--brand-green)] cursor-pointer shadow-xs font-medium"
            >
              {cashiers.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Branch */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[var(--brand-black-font)]">
            Branch
          </label>
          <div className="relative">
            <select
              value={selectedBranch}
              onChange={(e) => onBranchChange(e.target.value)}
              className="w-full h-9 pl-3 pr-8 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] appearance-none focus:outline-none focus:border-[var(--brand-green)] cursor-pointer shadow-xs font-medium"
            >
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Right Action Icons & Apply CTA */}
      <div className="flex items-center gap-2 self-end lg:self-auto">
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

        {/* Refresh / Reset */}
        <button
          type="button"
          onClick={onResetFilters}
          title="Reset Filters"
          className="h-9 w-9 rounded-xl border border-[var(--brand-stroke)] bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>

        {/* Apply Filters */}
        <button
          type="button"
          onClick={onApplyFilters}
          className="h-9 px-4 rounded-xl bg-[var(--brand-green)] hover:bg-[#0B6E63] text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
