"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function StockReceiptHeader() {
  return (
    <div className="pb-1">
      <h1 className="text-xl font-bold text-[#1D2939] tracking-tight">
        Inventory Stock Receive From Supplier
      </h1>
      <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400 font-medium">
        <Link
          href="/dashboard"
          className="hover:text-[#0E9384] transition-colors"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-300" />
        <Link
          href="/inventory"
          className="hover:text-[#0E9384] transition-colors"
        >
          Inventory
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-300" />
        <span className="text-slate-500">
          Inventory Stock Receive From Supplier
        </span>
      </div>
    </div>
  );
}
