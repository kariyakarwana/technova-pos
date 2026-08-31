"use client";

import { Lightbulb, Sparkles, TrendingDown, Truck } from "lucide-react";
import type { ProactiveRecommendation } from "./AIIntelligenceMock";

interface ProactiveRecommendationsCardProps {
  recommendations: ProactiveRecommendation[];
  onActionClick?: (item: ProactiveRecommendation) => void;
}

export default function ProactiveRecommendationsCard({
  recommendations,
  onActionClick,
}: ProactiveRecommendationsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-[var(--brand-green)]" />
          <h2 className="text-base font-bold text-[var(--brand-black-font)]">
            Proactive Recommendations
          </h2>
        </div>

        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--brand-green)] text-white">
          <Sparkles className="h-2.5 w-2.5" />
          <span>AI Generated</span>
        </span>
      </div>

      {/* 2-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {recommendations.map((rec) => {
          const isOverstock = rec.type === "overstock";

          return (
            <div
              key={rec.id}
              className="rounded-2xl border border-[#CBEFE8] bg-[#F0FDF9] p-5 flex flex-col justify-between space-y-4 hover:border-[var(--brand-green)] transition-all shadow-2xs"
            >
              <div className="space-y-3">
                {/* Icon & Impact Badge */}
                <div className="flex items-center justify-between">
                  <div
                    className={[
                      "h-8 w-8 rounded-xl flex items-center justify-center shadow-2xs",
                      isOverstock
                        ? "bg-rose-100 text-rose-600"
                        : "bg-teal-100 text-teal-700",
                    ].join(" ")}
                  >
                    {isOverstock ? (
                      <TrendingDown className="h-4 w-4" />
                    ) : (
                      <Truck className="h-4 w-4" />
                    )}
                  </div>

                  <span className="text-[11px] font-bold text-slate-600">
                    {rec.impactLevel}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-xs font-bold text-[var(--brand-black-font)]">
                    {rec.title}
                  </h3>
                  <p className="text-[11px] text-slate-600 font-medium mt-1 leading-relaxed">
                    {rec.description}
                  </p>
                </div>
              </div>

              {/* Action Link */}
              <div>
                <button
                  type="button"
                  onClick={() => onActionClick?.(rec)}
                  className="text-xs font-bold text-[var(--brand-green)] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{rec.actionText}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
