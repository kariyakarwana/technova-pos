"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

interface AISupplyInsightCardProps {
  insightText: string;
  onReviewPO?: () => void;
}

export default function AISupplyInsightCard({
  insightText,
  onReviewPO,
}: AISupplyInsightCardProps) {
  return (
    <div className="bg-[#F0FDF9] border border-[#CBEFE8] rounded-2xl p-6 shadow-xs space-y-3.5">
      {/* Header */}
      <div className="flex items-center gap-2 text-[var(--brand-green)]">
        <Sparkles className="h-4 w-4" />
        <h3 className="text-sm font-bold text-[var(--brand-black-font)]">
          AI Supply Insight
        </h3>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-600 font-medium leading-relaxed">
        {insightText}
      </p>

      {/* CTA Link */}
      <div>
        <Link
          href="/purchases/order-management"
          onClick={onReviewPO}
          className="text-xs font-bold text-[var(--brand-green)] hover:underline inline-flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>Review Recommended PO</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
