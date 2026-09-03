"use client";

import { ChevronDown, Search } from "lucide-react";

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
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="h-8 pl-3 pr-7 text-xs bg-white border border-[#E4E7EC] rounded-lg text-slate-700 appearance-none focus:outline-none focus:border-[#0E9384] cursor-pointer shadow-xs font-medium"
          >
            <option value="All">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>

        {/* Brand dropdown */}
        <div className="relative">
          <select
            value={selectedBrand}
            onChange={(e) => onBrandChange(e.target.value)}
            className="h-8 pl-3 pr-7 text-xs bg-white border border-[#E4E7EC] rounded-lg text-slate-700 appearance-none focus:outline-none focus:border-[#0E9384] cursor-pointer shadow-xs font-medium"
          >
            <option value="All">All brands</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
