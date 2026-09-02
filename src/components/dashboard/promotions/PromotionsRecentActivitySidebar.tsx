"use client";

import Link from "next/link";
import { AlertCircle, ShoppingBag } from "lucide-react";
import type { PromotionActivityLogItem } from "./PromotionsMock";

interface PromotionsRecentActivitySidebarProps {
  activity: PromotionActivityLogItem[];
  onViewAllActivity?: () => void;
}

export default function PromotionsRecentActivitySidebar({
  activity,
  onViewAllActivity,
}: PromotionsRecentActivitySidebarProps) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] shadow-xs overflow-hidden flex flex-col justify-between">
      <div className="p-6 space-y-5">
        {/* Title */}
        <h2 className="text-base font-bold text-[var(--brand-black-font)]">
          Recent Activity
        </h2>

        {/* Activity Stream */}
        <div className="space-y-4">
          {activity.map((item) => {
            const isWarning = item.type === "warning";

            return (
              <div key={item.id} className="flex items-start gap-3 text-xs">
                {/* Icon */}
                <div
                  className={[
                    "h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-2xs mt-0.5",
                    isWarning
                      ? "bg-rose-100 text-rose-600"
                      : "bg-blue-100 text-blue-600",
                  ].join(" ")}
                >
                  {isWarning ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <ShoppingBag className="h-4 w-4" />
                  )}
                </div>

                {/* Content */}
                <div className="space-y-0.5 flex-1">
                  <p className="font-semibold text-[var(--brand-black-font)] leading-snug">
                    {item.highlightCode && (
                      <span className="font-bold">{item.highlightCode}</span>
                    )}{" "}
                    {item.title.replace(item.highlightCode || "", "").trim()}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Link */}
      <Link
        href="/promotions/performance"
        onClick={onViewAllActivity}
        className="py-3.5 bg-slate-50/50 hover:bg-slate-100/70 border-t border-[var(--brand-stroke)] text-[var(--brand-green)] text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer"
      >
        View All Activity
      </Link>
    </div>
  );
}
