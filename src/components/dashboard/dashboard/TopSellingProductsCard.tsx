"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Package } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TopProductItem } from "./AdminDashboardTypes";

interface TopSellingProductsCardProps {
  products: TopProductItem[];
  limit?: number;
}

export default function TopSellingProductsCard({
  products,
  limit = 5,
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
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="h-7 data-[size=default]:h-7 w-24 rounded-lg border border-[var(--brand-stroke)] bg-slate-50 px-2.5 text-[11px] font-semibold text-slate-700 shadow-none focus-visible:border-[var(--brand-green)] focus-visible:ring-0 cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            position="popper"
            sideOffset={4}
            className="w-24 min-w-[6rem] rounded-lg border border-slate-200 bg-white p-1 shadow-lg ring-0"
          >
            <SelectItem
              value="Today"
              className="cursor-pointer text-xs text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
            >
              Today
            </SelectItem>
            <SelectItem
              value="Weekly"
              className="cursor-pointer text-xs text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
            >
              Weekly
            </SelectItem>
            <SelectItem
              value="Monthly"
              className="cursor-pointer text-xs text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
            >
              Monthly
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {products.slice(0, limit).map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 text-xs"
          >
            {/* Left: Thumbnail & Name/Price */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-slate-100 overflow-hidden relative shrink-0 border border-slate-100">
                <Image
                  src={item.imageUrl}
                  loader={({ src }) => src}
                  unoptimized
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
