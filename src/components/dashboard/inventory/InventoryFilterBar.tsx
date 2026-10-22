"use client";

import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InventoryFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedBranch: string;
  onBranchChange: (branch: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  branches: string[];
  categories: string[];
  statuses: string[];
  onViewAll: () => void;
}

export default function InventoryFilterBar({
  searchQuery,
  onSearchChange,
  selectedBranch,
  onBranchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  branches,
  categories,
  statuses,
  onViewAll,
}: InventoryFilterBarProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end pb-4">
      {/* Search Input (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-1">
        <label className="text-[11px] font-semibold text-slate-500">
          Search Inventory
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, SKU, or barcode..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-[#E4E7EC] rounded-lg text-[#1D2939] placeholder:text-slate-400 focus:outline-none focus:border-[#0E9384] shadow-xs"
          />
        </div>
      </div>

      {/* Branch Selector (2 cols) */}
      <div className="lg:col-span-2 flex flex-col gap-1">
        <label className="text-[11px] font-semibold text-slate-500">
          Branch
        </label>
        <Select value={selectedBranch} onValueChange={onBranchChange}>
          <SelectTrigger className="w-full h-9 data-[size=default]:h-9 rounded-lg border border-[#E4E7EC] bg-white px-3 text-xs font-medium text-slate-700 shadow-xs focus-visible:border-[#0E9384] focus-visible:ring-0 cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            position="popper"
            sideOffset={4}
            className="w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] max-h-72 rounded-lg border border-slate-200 bg-white p-1 shadow-lg ring-0"
          >
            {branches.map((b) => (
              <SelectItem
                key={b}
                value={b}
                className="cursor-pointer text-xs text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
              >
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category Selector (2 cols) */}
      <div className="lg:col-span-2 flex flex-col gap-1">
        <label className="text-[11px] font-semibold text-slate-500">
          Category
        </label>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full h-9 data-[size=default]:h-9 rounded-lg border border-[#E4E7EC] bg-white px-3 text-xs font-medium text-slate-700 shadow-xs focus-visible:border-[#0E9384] focus-visible:ring-0 cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            position="popper"
            sideOffset={4}
            className="w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] max-h-72 rounded-lg border border-slate-200 bg-white p-1 shadow-lg ring-0"
          >
            {categories.map((c) => (
              <SelectItem
                key={c}
                value={c}
                className="cursor-pointer text-xs text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
              >
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status Selector (2 cols) */}
      <div className="lg:col-span-2 flex flex-col gap-1">
        <label className="text-[11px] font-semibold text-slate-500">
          Status
        </label>
        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full h-9 data-[size=default]:h-9 rounded-lg border border-[#E4E7EC] bg-white px-3 text-xs font-medium text-slate-700 shadow-xs focus-visible:border-[#0E9384] focus-visible:ring-0 cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            position="popper"
            sideOffset={4}
            className="w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] max-h-72 rounded-lg border border-slate-200 bg-white p-1 shadow-lg ring-0"
          >
            {statuses.map((s) => (
              <SelectItem
                key={s}
                value={s}
                className="cursor-pointer text-xs text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
              >
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* View All List Button (1 col) */}
      <div className="lg:col-span-1 flex flex-col justify-end">
        <button
          type="button"
          onClick={onViewAll}
          className="w-full h-9 rounded-lg bg-[#0E9384] hover:bg-[#0B6E63] text-white text-xs font-semibold px-2 flex items-center justify-center transition-colors shadow-xs cursor-pointer whitespace-nowrap"
        >
          View All List
        </button>
      </div>
    </div>
  );
}
