"use client";

import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InventoryProductListFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedBranch: string;
  onBranchChange: (branch: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  branches: string[];
  categories: string[];
  statuses: string[];
}

export default function InventoryProductListFilterBar({
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
}: InventoryProductListFilterBarProps) {
  return (
    <div className="bg-[var(--brand-card-bg)] border border-[var(--brand-stroke)] rounded-2xl p-4 sm:p-5 shadow-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Search Inventory */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-[var(--brand-muted-font)]">
            Search Inventory
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, SKU, or barcode..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-10 pl-9 pr-3 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)]/20 shadow-xs"
            />
          </div>
        </div>

        {/* Branch Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-[var(--brand-muted-font)]">
            Branch
          </label>
          <Select value={selectedBranch} onValueChange={onBranchChange}>
            <SelectTrigger className="w-full h-10 data-[size=default]:h-10 rounded-xl border border-[var(--brand-stroke)] bg-white px-3 text-xs font-medium text-[var(--brand-black-font)] shadow-xs focus-visible:border-[var(--brand-green)] focus-visible:ring-0 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={4}
              className="w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] max-h-72 rounded-xl border border-slate-200 bg-white p-1 shadow-lg ring-0"
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

        {/* Category Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-[var(--brand-muted-font)]">
            Category
          </label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-full h-10 data-[size=default]:h-10 rounded-xl border border-[var(--brand-stroke)] bg-white px-3 text-xs font-medium text-[var(--brand-black-font)] shadow-xs focus-visible:border-[var(--brand-green)] focus-visible:ring-0 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={4}
              className="w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] max-h-72 rounded-xl border border-slate-200 bg-white p-1 shadow-lg ring-0"
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

        {/* Status Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-[var(--brand-muted-font)]">
            Status
          </label>
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full h-10 data-[size=default]:h-10 rounded-xl border border-[var(--brand-stroke)] bg-white px-3 text-xs font-medium text-[var(--brand-black-font)] shadow-xs focus-visible:border-[var(--brand-green)] focus-visible:ring-0 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={4}
              className="w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] max-h-72 rounded-xl border border-slate-200 bg-white p-1 shadow-lg ring-0"
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
      </div>
    </div>
  );
}
