"use client";

import Link from "next/link";
import { Calendar, ChevronRight, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
            <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--brand-green)] pointer-events-none z-10" />
            <Select
              value={dateRange}
              onValueChange={(val) => onDateRangeChange?.(val)}
            >
              <SelectTrigger className="h-9 data-[size=default]:h-9 pl-8 pr-3 rounded-xl border border-[var(--brand-green)] bg-white text-xs font-semibold text-slate-700 shadow-xs focus:ring-0 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Last 30 days" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Last 30 days</SelectItem>
                <SelectItem value="This Month" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">This Month</SelectItem>
                <SelectItem value="This Quarter" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">This Quarter</SelectItem>
                <SelectItem value="This Year" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
