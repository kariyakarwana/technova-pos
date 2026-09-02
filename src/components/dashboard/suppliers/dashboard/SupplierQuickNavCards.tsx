"use client";

import Link from "next/link";
import { LayoutGrid, Truck } from "lucide-react";

export default function SupplierQuickNavCards() {
  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {/* Card 1: Suppliers */}
        <Link
          href="/suppliers/management"
          className="group h-32 rounded-2xl bg-[#246A66] hover:bg-[#1D5753] text-white p-6 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
        >
          <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
            <Truck className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Suppliers</span>
        </Link>

        {/* Card 2: Purches Orders */}
        <Link
          href="/purchases/order-management"
          className="group h-32 rounded-2xl bg-[#246A66] hover:bg-[#1D5753] text-white p-6 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
        >
          <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
            <LayoutGrid className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Purches Orders
          </span>
        </Link>
      </div>
    </div>
  );
}
