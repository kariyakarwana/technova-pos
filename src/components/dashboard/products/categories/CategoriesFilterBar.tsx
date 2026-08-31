"use client";

import { ChevronDown, Search } from "lucide-react";
import { CATEGORY_OPTIONS } from "./CategoriesMock";

interface CategoriesFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (val: string) => void;
}

export default function CategoriesFilterBar({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: CategoriesFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white border border-[var(--brand-stroke)] rounded-2xl shadow-xs">
      {/* Search Input */}
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search Category"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)]"
        />
      </div>

      {/* Category Filter Dropdown */}
      <div className="relative w-full sm:w-48">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full h-9 pl-3 pr-8 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-slate-600 appearance-none focus:outline-none focus:border-[var(--brand-green)] cursor-pointer"
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}
