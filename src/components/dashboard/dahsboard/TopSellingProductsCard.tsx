"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronDown, Package } from "lucide-react";
import type { TopProductItem } from "./AdminDashboardMock";

interface TopSellingProductsCardProps {
  products: TopProductItem[];
}

export default function TopSellingProductsCard({
  products,
}: TopSellingProductsCardProps) {
  const [period, setPeriod] = useState("Today");

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-5 shadow-xs flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center">
            <Package className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-sm font-bold text-[var(--brand-black-font)]">
            Top Selling Products
          </h2>
        </div>

        {/* Period Selector */}
        <div className="relative">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="h-7 pl-2.5 pr-6 text-[11px] bg-slate-50 border border-[var(--brand-stroke)] rounded-lg text-slate-700 font-semibold appearance-none focus:outline-none cursor-pointer"
          >
            <option value="Today">Today</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
          <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {products.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 text-xs"
          >
            {/* Left: Thumbnail & Name/Price */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-slate-100 overflow-hidden relative shrink-0 border border-slate-100">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>

              <div className="min-w-0">
                <p className="font-bold text-[var(--brand-black-font)] truncate text-[11px]">
                  {item.name}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  {item.price} • {item.salesCount}
                </p>
              </div>
            </div>

            {/* Right: Trend Badge */}
            <span
              className={[
                "inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0",
                item.isPositive
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-rose-50 text-rose-500",
              ].join(" ")}
            >
              <ArrowUpRight className="h-2.5 w-2.5" />
              <span>{item.trend}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
