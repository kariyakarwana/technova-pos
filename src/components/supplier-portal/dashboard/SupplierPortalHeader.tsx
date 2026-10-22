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

interface SupplierPortalHeaderProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  onFilterClick?: () => void;
}

export default function SupplierPortalHeader({
  dateRange,
  onDateRangeChange,
  onFilterClick,
}: SupplierPortalHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      {/* Title & Breadcrumbs */}
      <div>
        <h1 className="text-xl font-bold text-[var(--brand-black-font)] tracking-tight">
          Supplier Dashboard
        </h1>
        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[var(--brand-muted-font)] font-medium">
          <Link
            href="/supplier-dashboard"
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

      {/* Right Date Range Controls */}
      <div className="flex flex-col items-end gap-1">
        <span className="text-[11px] font-semibold text-[var(--brand-green)]">
          Choose Date Range
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onFilterClick}
            title="Filter parameters"
            className="h-9 w-9 rounded-xl border border-[var(--brand-stroke)] bg-white hover:bg-slate-50 text-[var(--brand-green)] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
          >
            <Filter className="h-3.5 w-3.5" />
          </button>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--brand-green)] pointer-events-none z-10" />
            <Select
              value={dateRange}
              onValueChange={(val) => onDateRangeChange(val)}
            >
              <SelectTrigger className="h-9 data-[size=default]:h-9 pl-9 pr-3 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-slate-700 font-semibold focus:border-[var(--brand-green)] shadow-2xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Last 30 days</SelectItem>
                <SelectItem value="90" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Last 90 days</SelectItem>
                <SelectItem value="365" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Last 12 months</SelectItem>
                <SelectItem value="all" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">All orders</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
