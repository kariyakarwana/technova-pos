"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ShoppingBag } from "lucide-react";
import type { RecentSaleItem } from "./AdminDashboardMock";

interface RecentSalesCardProps {
  sales: RecentSaleItem[];
}

export default function RecentSalesCard({ sales }: RecentSalesCardProps) {
  const [period, setPeriod] = useState("Today");

  function getStatusBadge(status: "Processing" | "Cancelled" | "OnHold" | "Completed") {
    switch (status) {
      case "Processing":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-purple-500 text-white">
            • Processing
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-rose-600 text-white">
            • Cancelled
          </span>
        );
      case "OnHold":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-blue-500 text-white">
            • OnHold
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-[var(--brand-green)] text-white">
            • Completed
          </span>
        );
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-5 shadow-xs flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
            <ShoppingBag className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-sm font-bold text-[var(--brand-black-font)]">
            Recent Sales
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

      {/* Sales List */}
      <div className="space-y-3">
        {sales.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 text-xs"
          >
            {/* Left: Thumbnail & Name / Category */}
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
                  {item.category} • {item.price}
                </p>
              </div>
            </div>

            {/* Right: Date & Status Badge */}
            <div className="text-right shrink-0 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-medium block">
                {item.date}
              </span>
              <div>{getStatusBadge(item.status)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
