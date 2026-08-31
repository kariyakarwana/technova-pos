"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function CustomerPurchasesHeader() {
  return (
    <div className="pb-1">
      <h1 className="text-xl font-bold text-[var(--brand-black-font)] tracking-tight">
        Customer Purchases
      </h1>
      <div className="flex items-center gap-1.5 mt-1 text-xs text-[var(--brand-muted-font)] font-medium">
        <Link
          href="/dashboard"
          className="hover:text-[var(--brand-green)] transition-colors"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-300" />
        <Link
          href="/purchases"
          className="hover:text-[var(--brand-green)] transition-colors"
        >
          Purchases
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-300" />
        <span className="text-[var(--brand-black-font)] font-semibold">
          Customer Purchases
        </span>
      </div>
    </div>
  );
}
