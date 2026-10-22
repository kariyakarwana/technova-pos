"use client";

import Link from "next/link";
import { Calendar, ChevronRight, Filter, Menu } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AIIntelligenceHeaderProps {
  isDetailsHidden: boolean;
  onToggleDetails: () => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  onFilterClick?: () => void;
}

export default function AIIntelligenceHeader({
  isDetailsHidden,
  onToggleDetails,
  dateRange,
  onDateRangeChange,
  onFilterClick,
}: AIIntelligenceHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      {/* Title & Controls */}
      <div>
        <h1 className="text-xl font-bold text-[var(--brand-black-font)] tracking-tight">
          AI Intelligence
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
            AI Intelligence
          </span>
        </div>

        {/* Toggle Details Button */}
        <button
          type="button"
          onClick={onToggleDetails}
          className="mt-2 h-7 px-3 rounded-md bg-[var(--brand-green)] hover:bg-[#0B6E63] text-white text-[11px] font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
        >
          <Menu className="h-3.5 w-3.5" />
          <span>{isDetailsHidden ? "View Details" : "Hide Details"}</span>
        </button>
      </div>

      {/* Right Date Selector & Filter */}
      <div className="flex flex-col items-end gap-1">
        <span className="text-[10px] font-semibold text-slate-500">
          Choose Date Range
        </span>
        <div className="flex items-center gap-2">
          {/* Filter button */}
          <button
            type="button"
            onClick={onFilterClick}
            title="Filter analytics"
            className="h-9 w-9 rounded-xl border border-[var(--brand-stroke)] hover:border-[var(--brand-green)] bg-white text-[var(--brand-green)] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
          >
            <Filter className="h-3.5 w-3.5" />
          </button>

          {/* Date Range Selector */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--brand-green)] pointer-events-none z-10" />
            <Select
              value={dateRange}
              onValueChange={(val) => onDateRangeChange(val)}
            >
              <SelectTrigger className="h-9 data-[size=default]:h-9 pl-9 pr-3 text-xs bg-white border border-[var(--brand-green)] rounded-xl text-[var(--brand-black-font)] font-semibold shadow-xs focus:ring-1 focus:ring-[var(--brand-green)] focus:outline-none cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Last 30 days" className="text-xs">Last 30 days</SelectItem>
                <SelectItem value="Last 90 days" className="text-xs">Last 90 days</SelectItem>
                <SelectItem value="This Year" className="text-xs">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
