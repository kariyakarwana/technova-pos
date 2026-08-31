"use client";

interface InventoryHealthGaugeCardProps {
  score: number;
  summary: string;
}

export default function InventoryHealthGaugeCard({
  score,
  summary,
}: InventoryHealthGaugeCardProps) {
  // SVG Gauge calculations
  const size = 130;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs flex flex-col justify-between space-y-4">
      {/* Title */}
      <h2 className="text-base font-bold text-[var(--brand-black-font)]">
        Inventory Health
      </h2>

      {/* Radial Gauge */}
      <div className="relative flex items-center justify-center my-auto">
        <svg
          width={size}
          height={size}
          className="rotate-[-90deg] transition-all duration-700 ease-out"
        >
          {/* Background Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Foreground Progress Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#0E9384"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-extrabold text-[var(--brand-black-font)] tracking-tight">
            {score}
          </span>
          <span className="text-[10px] font-bold text-slate-400 tracking-wider">
            SCORE
          </span>
        </div>
      </div>

      {/* Footer Text */}
      <p className="text-[11px] text-slate-500 font-medium text-center leading-relaxed px-2">
        {summary}
      </p>
    </div>
  );
}
