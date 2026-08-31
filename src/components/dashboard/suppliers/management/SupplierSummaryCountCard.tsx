"use client";

import { FileSpreadsheet } from "lucide-react";

interface SupplierSummaryCountCardProps {
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
}

export default function SupplierSummaryCountCard({
  totalCount,
  activeCount,
  inactiveCount,
}: SupplierSummaryCountCardProps) {
  return (
    <div className="bg-[#E6F7F5] border border-[#CBEFE8] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="h-9 w-9 rounded-xl bg-white border border-[#CBEFE8] text-[var(--brand-green)] flex items-center justify-center mb-3 shadow-xs">
          <FileSpreadsheet className="h-4 w-4" />
        </div>

        <span className="text-xs font-bold text-slate-600 tracking-wide">
          Total Suppliers
        </span>

        <h2 className="text-3xl font-extrabold text-[var(--brand-black-font)] mt-1 tracking-tight">
          {totalCount}
        </h2>
      </div>

      <div className="flex items-center gap-4 pt-4 mt-3 border-t border-[#CBEFE8] text-xs font-semibold">
        <div className="flex items-center gap-1.5 text-slate-700">
          <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
          <span>{activeCount} Active</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-700">
          <span className="h-2 w-2 rounded-full bg-[#DC2626]" />
          <span>{inactiveCount} Inactive</span>
        </div>
      </div>
    </div>
  );
}
