"use client";

import { CheckCircle2, ClipboardCheck, TrendingDown, Truck } from "lucide-react";
import type { SupplierPortalStats } from "./supplier-portal.mock";

interface SupplierPortalStatsCardsProps {
  stats: SupplierPortalStats;
}

export default function SupplierPortalStatsCards({
  stats,
}: SupplierPortalStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* 1. Pending Orders */}
      <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-5 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
            PENDING ORDERS
          </span>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-extrabold text-[var(--brand-black-font)] tracking-tight">
              {stats.pendingOrdersCount}
            </h2>
            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-rose-700">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>{stats.pendingOrdersTrend}</span>
            </span>
          </div>
        </div>

        <div className="h-11 w-11 rounded-xl bg-[#B91C1C] text-white flex items-center justify-center shadow-xs shrink-0">
          <ClipboardCheck className="h-5 w-5" />
        </div>
      </div>

      {/* 2. In Transit */}
      <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-5 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
            IN TRANSIT
          </span>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-extrabold text-[var(--brand-black-font)] tracking-tight">
              {stats.inTransitCount}
            </h2>
            <span className="text-xs font-bold text-slate-600">
              {stats.inTransitSubtitle}
            </span>
          </div>
        </div>

        <div className="h-11 w-11 rounded-xl bg-[#092C4C] text-white flex items-center justify-center shadow-xs shrink-0">
          <Truck className="h-5 w-5" />
        </div>
      </div>

      {/* 3. Completed (MTD) */}
      <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-5 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
            COMPLETED (MTD)
          </span>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-extrabold text-[var(--brand-black-font)] tracking-tight">
              {stats.completedMtdCount}
            </h2>
            <span className="text-xs font-bold text-[var(--brand-green)]">
              {stats.completedMtdRate}
            </span>
          </div>
        </div>

        <div className="h-11 w-11 rounded-xl bg-[var(--brand-green)] text-white flex items-center justify-center shadow-xs shrink-0">
          <CheckCircle2 className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
