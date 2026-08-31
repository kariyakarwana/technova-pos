"use client";

import { ChevronDown } from "lucide-react";

interface RevenueForecastChartCardProps {
  timeHorizon?: string;
  onTimeHorizonChange?: (val: string) => void;
}

export default function RevenueForecastChartCard({
  timeHorizon = "Next 30 Days",
  onTimeHorizonChange,
}: RevenueForecastChartCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs flex flex-col justify-between space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-[var(--brand-black-font)]">
          Revenue Forecast
        </h2>

        <div className="relative">
          <select
            value={timeHorizon}
            onChange={(e) => onTimeHorizonChange?.(e.target.value)}
            className="h-8 pl-3 pr-7 text-xs bg-slate-50 border border-[var(--brand-stroke)] rounded-lg text-slate-700 font-semibold appearance-none focus:outline-none focus:border-[var(--brand-green)] cursor-pointer"
          >
            <option value="Next 30 Days">Next 30 Days</option>
            <option value="Next 60 Days">Next 60 Days</option>
            <option value="Next Quarter">Next Quarter</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Visual Area Chart */}
      <div className="relative h-48 w-full border border-dashed border-[#5EEAD4] bg-[#F0FDF9]/50 rounded-2xl overflow-hidden flex items-center justify-center">
        {/* SVG Area with Smooth Curves */}
        <svg
          viewBox="0 0 500 180"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="forecastTealGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0E9384" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0E9384" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Shaded Area */}
          <path
            d="M 0 130 C 120 120, 200 90, 320 85 C 400 80, 450 50, 500 40 L 500 180 L 0 180 Z"
            fill="url(#forecastTealGrad)"
          />

          {/* Lower Bound Curve */}
          <path
            d="M 0 145 C 130 135, 220 110, 330 100 C 410 95, 460 70, 500 60"
            fill="none"
            stroke="#5EEAD4"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Upper Forecast Curve */}
          <path
            d="M 0 125 C 120 115, 200 85, 320 80 C 400 75, 450 45, 500 35"
            fill="none"
            stroke="#0E9384"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        {/* Center Label */}
        <div className="relative z-10 px-4 py-1.5 rounded-xl bg-white/80 backdrop-blur-xs border border-[var(--brand-stroke)] shadow-2xs">
          <span className="text-xs font-bold text-[var(--brand-black-font)]">
            AI Forecast Visualization Area
          </span>
        </div>
      </div>
    </div>
  );
}
