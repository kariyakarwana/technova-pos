"use client";

import React, { useMemo, useState } from "react";
import { GripVertical, MoreHorizontal, TrendingUp } from "lucide-react";
import type { PlatformAnalytics } from "./types";

interface WeeklyActivityProps {
  weeklyActivity?: PlatformAnalytics["weeklyActivity"];
}

export function WeeklyActivityChartCard({ weeklyActivity }: WeeklyActivityProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const days = useMemo(() => {
    if (weeklyActivity?.days && weeklyActivity.days.length > 0) {
      return weeklyActivity.days;
    }
    return [
      { dateKey: "1", day: "Mon", count: 0, volume: 0 },
      { dateKey: "2", day: "Tue", count: 0, volume: 0 },
      { dateKey: "3", day: "Wed", count: 0, volume: 0 },
      { dateKey: "4", day: "Thu", count: 0, volume: 0 },
      { dateKey: "5", day: "Fri", count: 0, volume: 0 },
      { dateKey: "6", day: "Sat", count: 0, volume: 0 },
      { dateKey: "7", day: "Sun", count: 0, volume: 0 },
    ];
  }, [weeklyActivity]);

  const totalTxns = weeklyActivity?.totalWeeklyTxns ?? 0;
  const prevTxns = weeklyActivity?.prevWeekTxns ?? 0;
  const avgDaily = weeklyActivity?.avgDailyTxns ?? 0;

  const pctChange = useMemo(() => {
    if (prevTxns === 0) {
      return totalTxns > 0 ? "+100%" : "0.0%";
    }
    const diff = ((totalTxns - prevTxns) / prevTxns) * 100;
    const sign = diff >= 0 ? "+" : "";
    return `${sign}${diff.toFixed(1)}%`;
  }, [totalTxns, prevTxns]);

  const maxCount = Math.max(...days.map((d) => d.count), 1);
  const peakIdx = days.reduce((best, cur, idx, arr) => (cur.count > arr[best].count ? idx : best), 0);

  return (
    <div className="bg-white rounded-2xl border border-[#E4E7EC] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-slate-300 shrink-0" />
          <h3 className="text-sm font-bold text-[#1D2939]">
            Tenant Platform Activity & Transactions
          </h3>
        </div>
        <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-[#E4E7EC] text-[10px] font-bold uppercase tracking-wider text-slate-600">
          This Week
        </span>
      </div>

      {/* Body Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        {/* Left Telemetry Metrics */}
        <div className="md:col-span-4 space-y-4">
          <div>
            <div className="text-[11px] font-medium text-slate-500">Total POS Volume</div>
            <div className="text-2xl font-extrabold text-[#1D2939] tracking-tight font-mono mt-0.5">
              {totalTxns.toLocaleString()} <span className="text-sm font-semibold text-slate-500">txn</span>
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0E9384] mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{pctChange} vs last week</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="text-[11px] font-medium text-slate-500">Avg Daily Throughput</div>
            <div className="text-lg font-extrabold text-[#1D2939] font-mono mt-0.5">
              {avgDaily.toLocaleString()} <span className="text-xs font-semibold text-slate-500">txn</span>
            </div>
            <div className="text-[11px] text-slate-400">7-day rolling fleet average</div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="text-[11px] font-medium text-slate-500">Active Sync Rails</div>
            <div className="text-lg font-extrabold text-[#0E9384] font-mono mt-0.5">
              99.98%
            </div>
            <div className="text-[11px] text-slate-400 font-mono">0 gateway drops</div>
          </div>
        </div>

        {/* Right 7-Day Bar Chart */}
        <div className="md:col-span-8">
          <div className="h-52 flex items-end justify-between gap-2.5 sm:gap-4 pt-6 px-1">
            {days.map((item, idx) => {
              const hasData = totalTxns > 0;
              const rawPercent = hasData ? (item.count / maxCount) * 100 : 12;
              const barHeight = Math.max(rawPercent, hasData && item.count === 0 ? 6 : 12);
              const isPeak = hasData && idx === peakIdx && item.count > 0;
              const isHovered = hoveredIdx === idx;

              return (
                <div
                  key={item.dateKey}
                  className="flex-1 flex flex-col items-center h-full justify-end group relative"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Hover Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-9 z-20 whitespace-nowrap rounded-lg bg-[#1D2939] px-2.5 py-1 text-[10px] font-mono text-white shadow-lg pointer-events-none">
                      {item.day}: {item.count} txn
                    </div>
                  )}

                  {/* Bar Track */}
                  <div className="w-full max-w-[38px] flex-1 flex items-end">
                    <div
                      style={{ height: `${barHeight}%` }}
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        isPeak
                          ? "bg-gradient-to-t from-[#004532] to-[#0E9384] shadow-sm shadow-[#0E9384]/30"
                          : isHovered
                          ? "bg-[#0E9384]"
                          : hasData && item.count > 0
                          ? "bg-[#3852D4] hover:bg-[#0E9384]"
                          : "bg-slate-200/80 hover:bg-[#0E9384]/50"
                      }`}
                    />
                  </div>

                  <span
                    className={`mt-2.5 text-[11px] font-medium ${
                      isPeak ? "font-bold text-[#0E9384]" : "text-slate-500"
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

interface PlanDonutProps {
  analytics: PlatformAnalytics;
}

const PLAN_COLORS: Record<string, string> = {
  ENTERPRISE: "#004532",
  PROFESSIONAL: "#3852D4",
  STANDARD: "#F59E0B",
  BASIC: "#0E9384",
  NONE: "#CBD5E1",
};

export function PlanDistributionDonutCard({ analytics }: PlanDonutProps) {
  const totalOrgs = analytics.tenants.total || 0;
  const dist = analytics.financials.planDistribution ?? [
    { code: "ENTERPRISE", name: "Enterprise Plan", count: 0 },
    { code: "PROFESSIONAL", name: "Professional Plan", count: 0 },
    { code: "STANDARD", name: "Standard Plan", count: 0 },
    { code: "BASIC", name: "Basic Plan", count: 0 },
  ];

  const assignedCount = dist.reduce((acc, item) => acc + item.count, 0);
  const unassignedCount = Math.max(totalOrgs - assignedCount, 0);

  const segments = [
    ...dist.map((d) => ({
      code: d.code,
      label: d.name,
      count: d.count,
      color: PLAN_COLORS[d.code] ?? "#0E9384",
    })),
    ...(unassignedCount > 0
      ? [
          {
            code: "NONE",
            label: "No Plan Assigned",
            count: unassignedCount,
            color: PLAN_COLORS.NONE,
          },
        ]
      : []),
  ];

  const donutTotal = Math.max(
    segments.reduce((sum, s) => sum + s.count, 0),
    1
  );

  // SVG Donut Geometry (r = 52, circumference ~ 326.72)
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  let cumulativeOffset = 0;

  return (
    <div className="bg-white rounded-2xl border border-[#E4E7EC] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-slate-300 shrink-0" />
          <h3 className="text-sm font-bold text-[#1D2939]">
            Subscription Plan Distribution
          </h3>
        </div>
        <MoreHorizontal className="w-4 h-4 text-slate-400" />
      </div>

      {/* Donut & Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-auto py-2">
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
            {/* Base track */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="transparent"
              stroke="#F1F5F9"
              strokeWidth="16"
            />
            {totalOrgs > 0 &&
              segments
                .filter((s) => s.count > 0)
                .map((seg) => {
                  const segFraction = seg.count / donutTotal;
                  const dashLength = segFraction * circumference;
                  const strokeDashoffset = -cumulativeOffset;
                  cumulativeOffset += dashLength;

                  return (
                    <circle
                      key={seg.code}
                      cx="70"
                      cy="70"
                      r={radius}
                      fill="transparent"
                      stroke={seg.color}
                      strokeWidth="16"
                      strokeDasharray={`${dashLength} ${circumference}`}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="butt"
                    />
                  );
                })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-extrabold text-[#1D2939] leading-none font-mono">
              {totalOrgs}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">
              Tenants
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="w-full space-y-2.5 text-xs">
          {segments.map((seg) => {
            const pct = totalOrgs > 0 ? Math.round((seg.count / totalOrgs) * 100) : 0;
            return (
              <div key={seg.code} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="text-slate-600 font-medium truncate">{seg.label}</span>
                </div>
                <div className="text-right font-mono shrink-0">
                  <span className="font-bold text-[#1D2939]">{seg.count}</span>{" "}
                  <span className="text-[11px] text-slate-400">({pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
        <span className="text-slate-500">Active paid subscriptions:</span>
        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#EEFFFD] text-[#0E9384] border border-[#0E9384]/20 font-mono">
          {analytics.financials.activeSubscriptionsCount} / {totalOrgs} Active
        </span>
      </div>
    </div>
  );
}
