"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PurchaseTrendDataPoint } from "./SupplierDashboardMock";

interface PurchaseTrendsChartProps {
  data: PurchaseTrendDataPoint[];
}

export default function PurchaseTrendsChart({ data }: PurchaseTrendsChartProps) {
  // Chart dimensions
  const height = 260;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 35;
  const chartWidth = 600;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxValue = 4.5;

  const getX = (index: number) => {
    return paddingLeft + (index / (data.length - 1)) * (chartWidth - paddingLeft - paddingRight);
  };

  const getY = (val: number) => {
    return paddingTop + chartHeight - (val / maxValue) * chartHeight;
  };

  // Generate SVG path for line and area
  const points = data.map((d, i) => `${getX(i)},${getY(d.value)}`);
  const linePath = `M ${points.join(" L ")}`;
  const areaPath = `M ${points[0]} L ${points.join(" L ")} L ${getX(data.length - 1)},${paddingTop + chartHeight} L ${getX(0)},${paddingTop + chartHeight} Z`;

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs space-y-4">
      {/* Title & Timeframe Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-[var(--brand-black-font)]">
          Purchase Trends
        </h2>

        <Select defaultValue="This Year">
          <SelectTrigger className="h-8 data-[size=default]:h-8 px-3 rounded-lg border border-[var(--brand-stroke)] bg-white text-xs font-semibold text-slate-700 shadow-xs focus:border-[var(--brand-green)]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="This Year" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">This Year</SelectItem>
            <SelectItem value="Last Year" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Last Year</SelectItem>
            <SelectItem value="All Time" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Responsive SVG Chart */}
      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines and Y-axis labels */}
          {[4.5, 4.0, 3.5, 3.0, 2.5, 2.0, 1.5, 1.0, 0.5, 0].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - paddingRight}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="#94A3B8"
                  fontWeight="600"
                >
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#blueGradient)" />

          {/* Line Path */}
          <path
            d={linePath}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {data.map((d, i) => (
            <circle
              key={d.month}
              cx={getX(i)}
              cy={getY(d.value)}
              r="4.5"
              fill="#FFFFFF"
              stroke="#3B82F6"
              strokeWidth="2"
              className="hover:r-6 transition-all cursor-pointer"
            >
              <title>{`${d.month}: $${d.value}M`}</title>
            </circle>
          ))}

          {/* X-axis Month Labels */}
          {data.map((d, i) => (
            <text
              key={d.month}
              x={getX(i)}
              y={height - 10}
              textAnchor="middle"
              fontSize="10"
              fill="#64748B"
              fontWeight="600"
            >
              {d.month}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
