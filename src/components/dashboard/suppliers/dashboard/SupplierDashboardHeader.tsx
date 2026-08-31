"use client";

import Link from "next/link";
import { Calendar, ChevronDown, ChevronRight, Filter } from "lucide-react";

interface SupplierDashboardHeaderProps {
  dateRange: string;
  onDateRangeChange?: (range: string) => void;
  onFilterClick?: () => void;
}

export default function SupplierDashboardHeader({
  dateRange,
  onDateRangeChange,
  onFilterClick,
}: SupplierDashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      {/* Title & Breadcrumbs */}
      <div>
        <h1 className="text-xl font-bold text-[var(--brand-black-font)] tracking-tight">
          Supplier Dashboard
        </h1>
        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[var(--brand-muted-font)] font-medium">
          <Link
            href="/dashboard"
            className="hover:text-[var(--brand-green)] transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <span className="text-[var(--brand-black-font)] font-semibold">
            Supplier Dashboard
          </span>
        </div>
      </div>

      {/* Right Date Selector & Filter */}
      <div className="flex flex-col items-start sm:items-end gap-1">
        <span className="text-[11px] font-semibold text-[var(--brand-green)] hidden sm:block">
          Choose Date Range
        </span>

        <div className="flex items-center gap-2">
          {/* Filter Button */}
          <button
            type="button"
            onClick={onFilterClick}
            className="h-9 w-9 rounded-xl border border-[var(--brand-stroke)] bg-white hover:bg-slate-50 text-[var(--brand-green)] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            title="Filter dashboard"
          >
            <Filter className="h-3.5 w-3.5" />
          </button>

          {/* Date Selector */}
          <div className="relative">
            <div className="h-9 pl-8 pr-7 rounded-xl border border-[var(--brand-green)] bg-white text-xs font-semibold text-slate-700 flex items-center shadow-xs cursor-pointer">
              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--brand-green)] pointer-events-none" />
              <select
                value={dateRange}
                onChange={(e) => onDateRangeChange?.(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer appearance-none pr-2"
              >
                <option value="Last 30 days">Last 30 days</option>
                <option value="This Month">This Month</option>
                <option value="This Quarter">This Quarter</option>
                <option value="This Year">This Year</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
