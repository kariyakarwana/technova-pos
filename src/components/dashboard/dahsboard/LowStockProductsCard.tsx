"use client";

import Link from "next/link";
import Image from "next/image";
import { AlertTriangle } from "lucide-react";
import type { LowStockItem } from "./AdminDashboardMock";

interface LowStockProductsCardProps {
  products: LowStockItem[];
}

export default function LowStockProductsCard({
  products,
}: LowStockProductsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-5 shadow-xs flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
            <AlertTriangle className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-sm font-bold text-[var(--brand-black-font)]">
            Low Stock Products
          </h2>
        </div>

        <Link
          href="/inventory/alerts"
          className="text-xs font-semibold text-slate-400 hover:text-[var(--brand-green)] transition-colors"
        >
          View All
        </Link>
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {products.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 text-xs"
          >
            {/* Left: Thumbnail & Name/ID */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-slate-100 overflow-hidden relative shrink-0 border border-slate-100">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>

              <div className="min-w-0">
                <p className="font-bold text-[var(--brand-black-font)] truncate text-[11px]">
                  {item.name}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  {item.skuId}
                </p>
              </div>
            </div>

            {/* Right: In Stock Pill */}
            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-400 font-medium block">
                Instock
              </span>
              <span className="text-xs font-bold text-rose-500">
                {String(item.inStock).padStart(2, "0")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
