"use client";

import { Banknote, FileText, PackageX, ShoppingBag } from "lucide-react";
import type { ReturnStats } from "./ReturnsManagementMock";

interface ReturnsStatsCardsProps {
  stats: ReturnStats;
}

export default function ReturnsStatsCards({ stats }: ReturnsStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* 1. Total Refunds */}
      <div className="bg-[#246A66] text-white rounded-2xl p-5 shadow-xs flex items-center gap-4">
        <div className="h-11 w-11 rounded-full bg-white/15 flex items-center justify-center shrink-0">
          <Banknote className="h-6 w-6 text-white" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-white/75 tracking-wider uppercase">
            TOTAL REFUNDS
          </span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            {stats.totalRefunds}
          </h2>
        </div>
      </div>

      {/* 2. Pending Returns */}
      <div className="bg-[#246A66] text-white rounded-2xl p-5 shadow-xs flex items-center gap-4">
        <div className="h-11 w-11 rounded-full bg-white/15 flex items-center justify-center shrink-0">
          <ShoppingBag className="h-6 w-6 text-white" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-white/75 tracking-wider uppercase">
            PENDING RETURNS
          </span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            {stats.pendingReturns}
          </h2>
        </div>
      </div>

      {/* 3. Return Rate */}
      <div className="bg-[#246A66] text-white rounded-2xl p-5 shadow-xs flex items-center gap-4">
        <div className="h-11 w-11 rounded-full bg-white/15 flex items-center justify-center shrink-0">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-white/75 tracking-wider uppercase">
            RETURN RATE
          </span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            {stats.returnRate}
          </h2>
        </div>
      </div>

      {/* 4. Damaged Stock */}
      <div className="bg-[#246A66] text-white rounded-2xl p-5 shadow-xs flex items-center gap-4">
        <div className="h-11 w-11 rounded-full bg-white/15 flex items-center justify-center shrink-0">
          <PackageX className="h-6 w-6 text-white" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-white/75 tracking-wider uppercase">
            DAMAGED STOCK
          </span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            {stats.damagedStock}
          </h2>
        </div>
      </div>
    </div>
  );
}
