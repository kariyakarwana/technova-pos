"use client";

import { useState } from "react";
import { ChevronDown, Tag } from "lucide-react";
import type { CategoryMetric } from "./AdminDashboardMock";

interface TopCategoriesCardProps {
  categories: CategoryMetric[];
  totalCategories: number;
  totalProducts: number;
}

export default function TopCategoriesCard({
  categories,
  totalCategories,
  totalProducts,
}: TopCategoriesCardProps) {
  const [period, setPeriod] = useState("Weekly");

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-5 shadow-xs flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center">
            <Tag className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-sm font-bold text-[var(--brand-black-font)]">
            Top Categories
          </h2>
        </div>

        {/* Period Selector */}
        <div className="relative">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="h-7 pl-2.5 pr-6 text-[11px] bg-slate-50 border border-[var(--brand-stroke)] rounded-lg text-slate-700 font-semibold appearance-none focus:outline-none cursor-pointer"
          >
            <option value="Weekly">Weekly</option>
            <option value="Today">Today</option>
            <option value="Monthly">Monthly</option>
          </select>
          <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Donut Chart & Legend */}
      <div className="flex items-center justify-between gap-4 py-1">
        {/* SVG Donut Chart */}
        <div className="relative h-28 w-28 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="h-full w-full rotate-[-90deg]">
            {/* Lifestyles Segment 50% (Orange) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              stroke="#F97316"
              strokeWidth="14"
              strokeDasharray="238.7"
              strokeDashoffset="119.35"
              fill="transparent"
            />
            {/* Sports Segment 24% (Dark Red) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              stroke="#991B1B"
              strokeWidth="14"
              strokeDasharray="238.7"
              strokeDashoffset="181.4"
              strokeDashoffset-offset="119.35"
              fill="transparent"
              className="rotate-[180deg] origin-center"
            />
            {/* Electronics Segment 16% (Teal) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              stroke="#0E9384"
              strokeWidth="14"
              strokeDasharray="238.7"
              strokeDashoffset="200.5"
              fill="transparent"
              className="rotate-[270deg] origin-center"
            />
          </svg>

          {/* Percentage overlay pills */}
          <span className="absolute left-1 bottom-8 text-[9px] font-bold text-slate-600 bg-white/90 px-1 rounded shadow-2xs">
            50%
          </span>
          <span className="absolute top-1 right-7 text-[9px] font-bold text-slate-600 bg-white/90 px-1 rounded shadow-2xs">
            16%
          </span>
          <span className="absolute right-1 bottom-10 text-[9px] font-bold text-slate-600 bg-white/90 px-1 rounded shadow-2xs">
            24%
          </span>
        </div>

        {/* Categories Legend */}
        <div className="space-y-2 flex-1">
          {categories.map((cat) => (
            <div key={cat.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  style={{ backgroundColor: cat.color }}
                  className="h-2.5 w-1 rounded-full shrink-0"
                />
                <span className="text-slate-600 font-medium text-[11px]">
                  {cat.name}
                </span>
              </div>
              <span className="font-bold text-[var(--brand-black-font)] text-[11px]">
                {cat.salesCount}{" "}
                <span className="font-normal text-slate-400">Sales</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Statistics Summary Box */}
      <div className="pt-2 border-t border-slate-100 space-y-1.5">
        <span className="text-[11px] font-bold text-slate-700 block">
          Category Statistics
        </span>

        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            <span>Total Number Of Categories</span>
          </div>
          <span className="font-bold text-[var(--brand-black-font)]">
            {totalCategories}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span>Total Number Of Products</span>
          </div>
          <span className="font-bold text-[var(--brand-black-font)]">
            {totalProducts}
          </span>
        </div>
      </div>
    </div>
  );
}
