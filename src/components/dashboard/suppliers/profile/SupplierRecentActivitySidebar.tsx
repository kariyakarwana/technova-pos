"use client";

import Link from "next/link";

interface SupplierRecentActivitySidebarProps {
  activities: Array<{
    id: string;
    title: string;
    timestamp: string;
    statusColor: "blue" | "gray" | "green";
  }>;
  onViewAll?: () => void;
}

export default function SupplierRecentActivitySidebar({
  activities,
  onViewAll,
}: SupplierRecentActivitySidebarProps) {
  function getDotColor(color: "blue" | "gray" | "green") {
    switch (color) {
      case "blue":
        return "bg-blue-600";
      case "green":
        return "bg-[var(--brand-green)]";
      case "gray":
      default:
        return "bg-slate-400";
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[var(--brand-black-font)]">
          Recent Activity
        </h3>

        <Link
          href="/purchases/order-management"
          onClick={onViewAll}
          className="text-xs font-semibold text-[var(--brand-green)] hover:underline cursor-pointer"
        >
          View All
        </Link>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-5 space-y-5 pt-1 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {activities.map((act) => (
          <div key={act.id} className="relative">
            {/* Dot */}
            <div
              className={[
                "absolute -left-5 top-1 h-3 w-3 rounded-full border-2 border-white shadow-xs",
                getDotColor(act.statusColor),
              ].join(" ")}
            />

            {/* Details */}
            <div>
              <p className="text-xs font-bold text-[var(--brand-black-font)]">
                {act.title}
              </p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                {act.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
