"use client";

import { Banknote, ShieldCheck, Truck } from "lucide-react";

interface SupplierPerformanceStatsCardsProps {
  reliabilityScore: number;
  reliabilityTrend: string;
  totalPurchasesYTD: string;
  avgLeadTime: string;
  avgLeadTimeTrend: string;
}

export default function SupplierPerformanceStatsCards({
  reliabilityScore,
  reliabilityTrend,
  totalPurchasesYTD,
  avgLeadTime,
  avgLeadTimeTrend,
}: SupplierPerformanceStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* 1. Reliability Score */}
      <div className="bg-[#246A66] text-white rounded-2xl p-5 shadow-xs flex items-center gap-4">
        <div className="h-11 w-11 rounded-full bg-white/15 flex items-center justify-center shrink-0">
          <ShieldCheck className="h-6 w-6 text-white" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-white/75 tracking-wider uppercase">
            RELIABILITY SCORE
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <h3 className="text-2xl font-extrabold text-white tracking-tight">
              {reliabilityScore}%
            </h3>
            <span className="text-xs font-semibold text-emerald-200">
              {reliabilityTrend}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Total Purchases (YTD) */}
      <div className="bg-[#246A66] text-white rounded-2xl p-5 shadow-xs flex items-center gap-4">
        <div className="h-11 w-11 rounded-full bg-white/15 flex items-center justify-center shrink-0">
          <Banknote className="h-6 w-6 text-white" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-white/75 tracking-wider uppercase">
            TOTAL PURCHASES (YTD)
          </span>
          <div className="mt-0.5">
            <h3 className="text-2xl font-extrabold text-white tracking-tight">
              {totalPurchasesYTD}
            </h3>
          </div>
        </div>
      </div>

      {/* 3. Avg Lead Time */}
      <div className="bg-[#246A66] text-white rounded-2xl p-5 shadow-xs flex items-center gap-4">
        <div className="h-11 w-11 rounded-full bg-white/15 flex items-center justify-center shrink-0">
          <Truck className="h-6 w-6 text-white" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-white/75 tracking-wider uppercase">
            AVG LEAD TIME
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <h3 className="text-2xl font-extrabold text-white tracking-tight">
              {avgLeadTime}
            </h3>
            <span className="text-xs font-semibold text-red-300">
              {avgLeadTimeTrend}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
