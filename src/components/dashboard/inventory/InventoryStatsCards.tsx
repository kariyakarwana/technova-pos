"use client";

import {
  AlertTriangle,
  Boxes,
  CreditCard,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

export default function InventoryStatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Stock Value */}
      <div className="bg-white rounded-2xl border border-[#E4E7EC] p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 tracking-wider">
            TOTAL STOCK VALUE
          </span>
          <div className="h-9 w-9 rounded-xl bg-[#E6F7F5] text-[#0E9384] flex items-center justify-center">
            <CreditCard className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <h2 className="text-2xl font-bold text-[#1D2939] tracking-tight">
            $1.24M
          </h2>
          <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-[#0E9384]">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+2.4% this month</span>
          </div>
        </div>
      </div>

      {/* 2. Low on Stock (Red left accent border) */}
      <div className="bg-white rounded-2xl border border-[#E4E7EC] border-l-4 border-l-[#D32F2F] p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 tracking-wider">
              LOW ON STOCK
            </span>
            <span className="h-2 w-2 rounded-full bg-[#D32F2F]" />
          </div>
          <div className="h-9 w-9 rounded-xl bg-red-50 text-[#D32F2F] flex items-center justify-center">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <h2 className="text-2xl font-bold text-[#1D2939] tracking-tight">
            42
          </h2>
          <p className="mt-1 text-xs font-medium text-[#D32F2F]">
            Requires immediate attention
          </p>
        </div>
      </div>

      {/* 3. Out of Stock */}
      <div className="bg-white rounded-2xl border border-[#E4E7EC] p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 tracking-wider">
            OUT OF STOCK
          </span>
          <div className="h-9 w-9 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
            <ShoppingCart className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <h2 className="text-2xl font-bold text-[#1D2939] tracking-tight">
            15
          </h2>
          <p className="mt-1 text-xs font-medium text-slate-400">
            Across all branches
          </p>
        </div>
      </div>

      {/* 4. Total Products */}
      <div className="bg-white rounded-2xl border border-[#E4E7EC] p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 tracking-wider">
            TOTAL PRODUCTS
          </span>
          <div className="h-9 w-9 rounded-xl bg-[#E6F7F5] text-[#0E9384] flex items-center justify-center">
            <Boxes className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <h2 className="text-2xl font-bold text-[#1D2939] tracking-tight">
            3,842
          </h2>
          <p className="mt-1 text-xs font-medium text-slate-400">
            Active products
          </p>
        </div>
      </div>
    </div>
  );
}
