"use client";

import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SupplierStatus } from "./SupplierManagementMock";

interface SupplierQuickFiltersSidebarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: "All" | SupplierStatus;
  onStatusFilterChange: (status: "All" | SupplierStatus) => void;
  categoryFilter: string;
  onCategoryFilterChange: (cat: string) => void;
  categories: string[];
}

export default function SupplierQuickFiltersSidebar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  categories,
}: SupplierQuickFiltersSidebarProps) {
  const statuses: Array<"All" | SupplierStatus> = ["All", "Active", "Inactive"];

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-[var(--brand-green)]" />
        <h2 className="text-sm font-bold text-[var(--brand-black-font)]">
          Quick Filters
        </h2>
      </div>

      {/* Search Input */}
      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-slate-500">
          Search ID or Name
        </label>
        <input
          type="text"
          placeholder="e.g. SUP-1002"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-9 px-3 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs font-medium"
        />
      </div>

      {/* Status Segmented Buttons */}
      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-slate-500">
          Status
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/70 rounded-xl border border-[var(--brand-stroke)]">
          {statuses.map((st) => {
            const isActive = statusFilter === st;

            return (
              <button
                key={st}
                type="button"
                onClick={() => onStatusFilterChange(st)}
                className={[
                  "h-7 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  isActive
                    ? "bg-[#004532] text-white shadow-xs"
                    : "text-slate-600 hover:text-[var(--brand-black-font)]",
                ].join(" ")}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Dropdown */}
      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-slate-500">
          Category
        </label>
        <Select
          value={categoryFilter}
          onValueChange={(val) => onCategoryFilterChange(val)}
        >
          <SelectTrigger className="w-full h-9 data-[size=default]:h-9 px-3 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] shadow-xs font-medium focus:border-[var(--brand-green)]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {categories.map((c) => (
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
    </div>
  );
}
