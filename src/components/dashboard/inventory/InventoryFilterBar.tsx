"use client";

import { ChevronDown, Search } from "lucide-react";

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
        <div className="relative">
          <select
            value={selectedBranch}
            onChange={(e) => onBranchChange(e.target.value)}
            className="w-full h-9 pl-3 pr-7 text-xs bg-white border border-[#E4E7EC] rounded-lg text-slate-700 appearance-none focus:outline-none focus:border-[#0E9384] cursor-pointer shadow-xs font-medium"
          >
            {branches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Category Selector (2 cols) */}
      <div className="lg:col-span-2 flex flex-col gap-1">
        <label className="text-[11px] font-semibold text-slate-500">
          Category
        </label>
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full h-9 pl-3 pr-7 text-xs bg-white border border-[#E4E7EC] rounded-lg text-slate-700 appearance-none focus:outline-none focus:border-[#0E9384] cursor-pointer shadow-xs font-medium"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Status Selector (2 cols) */}
      <div className="lg:col-span-2 flex flex-col gap-1">
        <label className="text-[11px] font-semibold text-slate-500">
          Status
        </label>
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full h-9 pl-3 pr-7 text-xs bg-white border border-[#E4E7EC] rounded-lg text-slate-700 appearance-none focus:outline-none focus:border-[#0E9384] cursor-pointer shadow-xs font-medium"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>
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
