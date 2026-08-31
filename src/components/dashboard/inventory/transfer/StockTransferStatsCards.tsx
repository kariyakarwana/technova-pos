"use client";

import { AlertTriangle, Download, Truck } from "lucide-react";

export default function StockTransferStatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* 1. Active Transfers */}
      <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="h-9 w-9 rounded-xl bg-[#004532] text-white flex items-center justify-center mb-3">
            <Truck className="h-4 w-4" />
          </div>
          <span className="text-[11px] font-bold text-slate-500 tracking-wider">
            ACTIVE TRANSFERS
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <h2 className="text-2xl font-bold text-[var(--brand-black-font)] tracking-tight">
              12
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              Across all branches
            </span>
          </div>
        </div>
      </div>

      {/* 2. Incoming To Branch */}
      <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="h-9 w-9 rounded-xl bg-[#004532] text-white flex items-center justify-center mb-3">
            <Download className="h-4 w-4" />
          </div>
          <span className="text-[11px] font-bold text-slate-500 tracking-wider">
            INCOMING TO BRANCH
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <h2 className="text-2xl font-bold text-[var(--brand-black-font)] tracking-tight">
              12
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              2 from yearsterday
            </span>
          </div>
        </div>
      </div>

      {/* 3. Discrepancies Noted */}
      <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="h-9 w-9 rounded-xl bg-[#D32F2F] text-white flex items-center justify-center mb-3">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <span className="text-[11px] font-bold text-slate-500 tracking-wider">
            DISCREPANCIES NOTED
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <h2 className="text-2xl font-bold text-[var(--brand-black-font)] tracking-tight">
              3
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              require attention
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
