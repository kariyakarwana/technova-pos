"use client";

import Link from "next/link";
import { ChevronRight, History, Plus } from "lucide-react";

interface ReturnsManagementHeaderProps {
  onViewHistory?: () => void;
  onProcessReturn?: () => void;
}

export default function ReturnsManagementHeader({
  onViewHistory,
  onProcessReturn,
}: ReturnsManagementHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      {/* Title & Breadcrumbs */}
      <div>
        <h1 className="text-xl font-bold text-[var(--brand-black-font)] tracking-tight">
          Returns Management
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
            Returns & Refunds
          </span>
        </div>
      </div>

      {/* Right CTAs */}
      <div className="flex items-center gap-3">
        {/* View Full History */}
        <Link
          href="/returns-refunds/history"
          onClick={onViewHistory}
          className="h-9 px-3.5 rounded-xl border border-[var(--brand-green)] bg-white hover:bg-[#E6F7F5] text-[var(--brand-green)] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <History className="h-3.5 w-3.5" />
          <span>View Full History</span>
        </Link>

        {/* Process New Return */}
        <Link
          href="/returns-refunds"
          onClick={onProcessReturn}
          className="h-9 px-4 rounded-xl bg-[var(--brand-green)] hover:bg-[#0B6E63] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Process New Return</span>
        </Link>
      </div>
    </div>
  );
}
