"use client";

import { Calendar, FileSpreadsheet, FileText, RotateCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
          <Select
            value={selectedCashier}
            onValueChange={(val) => onCashierChange(val)}
          >
            <SelectTrigger className="w-full h-9 data-[size=default]:h-9 px-3 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] shadow-xs font-medium focus:border-[var(--brand-green)]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {cashiers.map((c) => (
                <SelectItem
                  key={c}
                  value={c}
                  className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer"
                >
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Branch */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[var(--brand-black-font)]">
            Branch
          </label>
          <Select
            value={selectedBranch}
            onValueChange={(val) => onBranchChange(val)}
          >
            <SelectTrigger className="w-full h-9 data-[size=default]:h-9 px-3 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] shadow-xs font-medium focus:border-[var(--brand-green)]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {branches.map((b) => (
                <SelectItem
                  key={b}
                  value={b}
                  className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer"
                >
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
