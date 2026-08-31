"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";

export default function PromotionPerformanceHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      {/* Title & Breadcrumbs */}
      <div>
        <h1 className="text-xl font-bold text-[var(--brand-black-font)] tracking-tight">
          Promotion Performance
        </h1>
        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[var(--brand-muted-font)] font-medium">
          <Link
            href="/dashboard"
            className="hover:text-[var(--brand-green)] transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <Link
            href="/promotions"
            className="hover:text-[var(--brand-green)] transition-colors"
          >
            Create New Promotion
          </Link>
        </div>
      </div>

      {/* Right Action */}
      <Link
        href="/promotions"
        className="h-9 px-4 rounded-xl bg-[var(--brand-green)] hover:bg-[#0B6E63] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Promotion</span>
      </Link>
    </div>
  );
}
