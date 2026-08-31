"use client";

import { CheckCircle2, ClipboardList, FileText, TrendingUp, Truck } from "lucide-react";

export default function PurchaseOrderStatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* 1. Total POs */}
      <div className="bg-[#0A695E] text-white rounded-2xl p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-white/80 tracking-wider">
            TOTAL POS
          </span>
          <FileText className="h-4 w-4 text-white/80" />
        </div>

        <div className="mt-4">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            1,248
          </h2>
          <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-200">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+12% vs last month</span>
          </div>
        </div>
      </div>

      {/* 2. Pending Approval */}
      <div className="bg-[#0A695E] text-white rounded-2xl p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-white/80 tracking-wider">
            PENDING APPROVAL
          </span>
          <ClipboardList className="h-4 w-4 text-white/80" />
        </div>

        <div className="mt-4">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            42
          </h2>
          <p className="mt-2 text-xs font-medium text-white/80">
            Requires immediate action
          </p>
        </div>
      </div>

      {/* 3. In Transit */}
      <div className="bg-[#0A695E] text-white rounded-2xl p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-white/80 tracking-wider">
            IN TRANSIT
          </span>
          <Truck className="h-4 w-4 text-white/80" />
        </div>

        <div className="mt-4">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            87
          </h2>
          <p className="mt-2 text-xs font-medium text-white/80">
            Expected delivery this week
          </p>
        </div>
      </div>

      {/* 4. Completed */}
      <div className="bg-[#0A695E] text-white rounded-2xl p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-white/80 tracking-wider">
            COMPLETED
          </span>
          <CheckCircle2 className="h-4 w-4 text-white/80" />
        </div>

        <div className="mt-4">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            1,105
          </h2>
          <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-200">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+5% vs last month</span>
          </div>
        </div>
      </div>
    </div>
  );
}
