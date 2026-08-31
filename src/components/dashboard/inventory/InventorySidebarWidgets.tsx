"use client";

import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  PlusCircle,
  SlidersHorizontal,
  Truck,
} from "lucide-react";

export default function InventorySidebarWidgets() {
  return (
    <div className="flex flex-col gap-4">
      {/* 1. Stock Alerts Card (Navy Dark Theme) */}
      <div className="rounded-2xl bg-[#092C4C] p-5 text-white shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <BellRing className="h-4 w-4 text-[#0E9384]" />
            <span>Stock Alerts</span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-300">
            Demand for RTX 4090 GPUs is projected to spike by 25% in the Downtown
            branch next week based on historical trends.
          </p>
        </div>
        <div className="mt-4 pt-2">
          <Link
            href="/inventory/alerts"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-[#0E9384] transition-colors"
          >
            <span>See All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. Quick Actions Panel */}
      <div className="rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-xs">
        <h3 className="text-sm font-bold text-[#1D2939] mb-3.5">
          Quick Actions
        </h3>
        <div className="flex flex-col gap-2.5">
          {/* + Add New Product */}
          <Link
            href="/products/product-list/add-product"
            className="w-full h-10 rounded-xl bg-[#0E9384] hover:bg-[#0B6E63] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add New Product</span>
          </Link>

          {/* Adjustment Dashboard */}
          <Link
            href="/inventory/adjustments"
            className="w-full h-10 rounded-xl border border-[#E4E7EC] bg-white hover:bg-slate-50 text-[#1D2939] text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <SlidersHorizontal className="h-4 w-4 text-slate-500" />
            <span>Adjustment Dashboard</span>
          </Link>

          {/* Transfer Dashboard */}
          <Link
            href="/inventory/transfers"
            className="w-full h-10 rounded-xl border border-[#E4E7EC] bg-white hover:bg-slate-50 text-[#1D2939] text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <Truck className="h-4 w-4 text-slate-500" />
            <span>Transfer Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
