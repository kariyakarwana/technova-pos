"use client";

import type { PaymentStatusData } from "./SupplierDashboardMock";

interface SupplierPaymentStatusChartProps {
  data: PaymentStatusData;
}

export default function SupplierPaymentStatusChart({
  data,
}: SupplierPaymentStatusChartProps) {
  // SVG Donut metrics
  const size = 200;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const paidDash = (data.paidPercent / 100) * circumference;
  const pendingDash = (data.pendingPercent / 100) * circumference;
  const overdueDash = (data.overduePercent / 100) * circumference;

  // Offsets
  const paidOffset = 0;
  const pendingOffset = -paidDash;
  const overdueOffset = -(paidDash + pendingDash);

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs flex flex-col justify-between">
      {/* Title */}
      <h2 className="text-base font-bold text-[var(--brand-black-font)] mb-4">
        Payment Status
      </h2>

      {/* Donut SVG */}
      <div className="flex items-center justify-center my-auto py-2">
        <div className="relative w-44 h-44 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
            {/* Background Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#F1F5F9"
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Paid Arc (Green) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#16A34A"
              strokeWidth={strokeWidth}
              strokeDasharray={`${paidDash} ${circumference}`}
              strokeDashoffset={paidOffset}
              fill="transparent"
              strokeLinecap="butt"
            />

            {/* Pending Arc (Orange) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#F59E0B"
              strokeWidth={strokeWidth}
              strokeDasharray={`${pendingDash} ${circumference}`}
              strokeDashoffset={pendingOffset}
              fill="transparent"
              strokeLinecap="butt"
            />

            {/* Overdue Arc (Red) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#DC2626"
              strokeWidth={strokeWidth}
              strokeDasharray={`${overdueDash} ${circumference}`}
              strokeDashoffset={overdueOffset}
              fill="transparent"
              strokeLinecap="butt"
            />
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 pt-4 text-xs font-semibold text-slate-600 border-t border-[var(--brand-stroke)]">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#16A34A]" />
          <span>Paid</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
          <span>Pending</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#DC2626]" />
          <span>Overdue</span>
        </div>
      </div>
    </div>
  );
}
