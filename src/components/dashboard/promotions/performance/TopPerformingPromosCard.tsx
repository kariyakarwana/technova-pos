"use client";

import type { TopPromoMetric } from "./PromotionPerformanceMock";

interface TopPerformingPromosCardProps {
  promos: TopPromoMetric[];
}

export default function TopPerformingPromosCard({
  promos,
}: TopPerformingPromosCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs flex flex-col justify-between space-y-5">
      {/* Title */}
      <h2 className="text-base font-bold text-[var(--brand-black-font)]">
        Top Performing Promos
      </h2>

      {/* Promos List */}
      <div className="space-y-4">
        {promos.map((item) => (
          <div key={item.id} className="space-y-1.5">
            {/* Label and Conversion Rate */}
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[var(--brand-black-font)]">{item.name}</span>
              <span className="text-[var(--brand-green)] font-bold text-[11px]">
                {item.conversionRate}
              </span>
            </div>

            {/* Progress Track */}
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                style={{
                  width: `${item.percentageWidth}%`,
                  backgroundColor: item.barColor,
                }}
                className="h-full rounded-full transition-all duration-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
