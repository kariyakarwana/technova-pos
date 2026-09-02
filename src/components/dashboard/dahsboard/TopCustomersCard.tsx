"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Users } from "lucide-react";
import type { TopCustomerItem } from "./AdminDashboardTypes";

interface TopCustomersCardProps {
  customers: TopCustomerItem[];
}

export default function TopCustomersCard({ customers }: TopCustomersCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-5 shadow-xs flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
            <Users className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-sm font-bold text-[var(--brand-black-font)]">
            Top Customers
          </h2>
        </div>

        <Link
          href="/customers"
          className="text-xs font-semibold text-slate-400 hover:text-[var(--brand-green)] transition-colors"
        >
          View All
        </Link>
      </div>

      {/* Customer List */}
      <div className="space-y-3">
        {customers.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 text-xs"
          >
            {/* Left: Avatar & Name/Country */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-full bg-slate-100 overflow-hidden relative shrink-0 border border-slate-100">
                <Image
                  src={item.avatarUrl}
                  loader={({ src }) => src}
                  unoptimized
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
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                  <MapPin className="h-2.5 w-2.5 text-slate-400" />
                  <span>
                    {item.country} • {item.orderCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Total Spend */}
            <span className="text-xs font-bold text-[var(--brand-black-font)] shrink-0">
              {item.spentAmount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
