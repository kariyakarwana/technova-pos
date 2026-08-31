"use client";

import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";

interface PromotionsHeaderProps {
  onCreatePromotion?: () => void;
}

export default function PromotionsHeader({
  onCreatePromotion,
}: PromotionsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      {/* Title & Breadcrumbs */}
      <div>
        <h1 className="text-xl font-bold text-[var(--brand-black-font)] tracking-tight">
          Promotions
        </h1>
        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[var(--brand-muted-font)] font-medium">
          <Link
            href="/dashboard"
            className="hover:text-[var(--brand-green)] transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <span className="text-[var(--brand-black-font)] font-semibold">
            Promotions
          </span>
        </div>
      </div>

      {/* Right Action */}
      <Link
        href="/promotions/create"
        onClick={onCreatePromotion}
        className="h-9 px-4 rounded-xl bg-[var(--brand-green)] hover:bg-[#0B6E63] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        <span>Create New Promotion</span>
      </Link>
    </div>
  );
}
