"use client";

import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductListFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
  categories: Array<{ id: string; name: string }>;
  brands: Array<{ id: string; name: string }>;
}

export default function ProductListFilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedBrand,
  onBrandChange,
  categories,
  brands,
}: ProductListFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4">
      {/* Left: Search Input */}
      <div className="relative w-full sm:w-64 md:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-8 pl-8 pr-3 text-xs bg-white border border-[#E4E7EC] rounded-lg text-[#1D2939] placeholder:text-slate-400 focus:outline-none focus:border-[#0E9384] transition-colors shadow-xs"
        />
      </div>

      {/* Right: Category & Brand Dropdowns */}
      <div className="flex items-center gap-2">
        {/* Category dropdown */}
        <Select
          value={selectedCategory}
          onValueChange={(val) => onCategoryChange(val)}
        >
          <SelectTrigger className="h-8 data-[size=default]:h-8 rounded-lg border border-[#E4E7EC] bg-white px-3 text-xs text-[#1D2939] shadow-xs focus-visible:border-[#0E9384] focus-visible:ring-0 cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={4} className="w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] max-h-72 rounded-xl border border-slate-200 bg-white p-1 shadow-lg ring-0">
            <SelectItem value="All" className="cursor-pointer text-xs text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem
                key={c.id}
                value={c.id}
                className="cursor-pointer text-xs text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
              >
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Brand dropdown */}
        <Select
          value={selectedBrand}
          onValueChange={(val) => onBrandChange(val)}
        >
          <SelectTrigger className="h-8 data-[size=default]:h-8 rounded-lg border border-[#E4E7EC] bg-white px-3 text-xs text-[#1D2939] shadow-xs focus-visible:border-[#0E9384] focus-visible:ring-0 cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={4} className="w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] max-h-72 rounded-xl border border-slate-200 bg-white p-1 shadow-lg ring-0">
            <SelectItem value="All" className="cursor-pointer text-xs text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]">All brands</SelectItem>
            {brands.map((b) => (
              <SelectItem
                key={b.id}
                value={b.id}
                className="cursor-pointer text-xs text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
              >
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
