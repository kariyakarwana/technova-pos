"use client";

import { AlertTriangle, FileText, Sparkles, Users } from "lucide-react";
import type { SupplierKPIData } from "./SupplierDashboardMock";

interface SupplierKPIStatsCardsProps {
  kpis: SupplierKPIData;
}

export default function SupplierKPIStatsCards({ kpis }: SupplierKPIStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* 1. Total Suppliers */}
      <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">
            Total Suppliers
          </span>
          <Users className="h-4 w-4 text-slate-400" />
        </div>

        <div className="flex items-baseline gap-2.5 mt-3">
          <h2 className="text-3xl font-bold text-[var(--brand-black-font)] tracking-tight">
            {kpis.totalSuppliers.toLocaleString()}
          </h2>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">
            {kpis.totalSuppliersTrend}
          </span>
        </div>
      </div>

      {/* 2. Pending POs */}
      <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">
            Pending POs
          </span>
          <FileText className="h-4 w-4 text-slate-400" />
        </div>

        <div className="flex items-baseline gap-2.5 mt-3">
          <h2 className="text-3xl font-bold text-[var(--brand-black-font)] tracking-tight">
            {kpis.pendingPOs}
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100/70 text-amber-800">
            {kpis.pendingPOsStatus}
          </span>
        </div>
      </div>

      {/* 3. Overdue Payments */}
      <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">
            Overdue Payments
          </span>
          <AlertTriangle className="h-4 w-4 text-red-400" />
        </div>

        <div className="flex items-baseline gap-2.5 mt-3">
          <h2 className="text-3xl font-bold text-[#DC2626] tracking-tight">
            {kpis.overduePayments}
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600">
            {kpis.overduePaymentsStatus}
          </span>
        </div>
      </div>

      {/* 4. AI Supplier Insights */}
      <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 shadow-xs flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-center gap-1.5 text-blue-900 text-xs font-bold">
          <Sparkles className="h-3.5 w-3.5 text-blue-600" />
          <span>AI Supplier Insights</span>
        </div>

        <p className="text-[11px] text-blue-900/80 font-medium leading-relaxed mt-2">
          {kpis.aiInsightText}
        </p>
      </div>
    </div>
  );
}
