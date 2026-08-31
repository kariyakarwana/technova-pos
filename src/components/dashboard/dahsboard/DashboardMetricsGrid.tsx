"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  CreditCard,
  DollarSign,
  Gift,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import type { KpiCardItem, TopBannerMetric } from "./AdminDashboardMock";

interface DashboardMetricsGridProps {
  bannerMetrics: TopBannerMetric[];
  kpiCards: KpiCardItem[];
}

export default function DashboardMetricsGrid({
  bannerMetrics,
  kpiCards,
}: DashboardMetricsGridProps) {
  function getBannerIcon(name: string) {
    switch (name) {
      case "sales":
        return <DollarSign className="h-5 w-5" />;
      case "sales_return":
        return <RotateCcw className="h-5 w-5" />;
      case "purchase":
        return <Gift className="h-5 w-5" />;
      case "purchase_return":
        return <RotateCcw className="h-5 w-5" />;
      default:
        return <DollarSign className="h-5 w-5" />;
    }
  }

  function getKpiIcon(type: string) {
    switch (type) {
      case "profit":
        return <TrendingUp className="h-4 w-4" />;
      case "due":
        return <CreditCard className="h-4 w-4" />;
      case "expense":
        return <Wallet className="h-4 w-4" />;
      case "payment_return":
        return <RotateCcw className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  }

  return (
    <div className="space-y-5">
      {/* Row 1: 4 Colored Solid / Gradient Banner Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {bannerMetrics.map((item, idx) => (
          <div
            key={idx}
            className={[
              "rounded-2xl p-5 text-white shadow-xs flex flex-col justify-between space-y-4 relative overflow-hidden",
              item.bgGradient,
            ].join(" ")}
          >
            {/* Top Bar: Icon badge & Percentage change badge */}
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                {getBannerIcon(item.iconName)}
              </div>

              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/25 text-white">
                {item.isPositive ? (
                  <ArrowUp className="h-2.5 w-2.5" />
                ) : (
                  <ArrowDown className="h-2.5 w-2.5" />
                )}
                <span>{item.change}</span>
              </span>
            </div>

            {/* Label & Large Amount */}
            <div>
              <span className="text-[11px] font-semibold text-white/80 tracking-wide">
                {item.title}
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
                {item.amount}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: 4 White KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiCards.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-5 shadow-xs flex flex-col justify-between space-y-4"
          >
            {/* Top Row: Amount & Icon */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-[var(--brand-black-font)] tracking-tight">
                  {item.amount}
                </h3>
                <span className="text-xs font-semibold text-slate-500 mt-0.5 block">
                  {item.title}
                </span>
              </div>

              <div
                className={[
                  "h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
                  item.iconBg,
                  item.iconColor,
                ].join(" ")}
              >
                {getKpiIcon(item.iconType)}
              </div>
            </div>

            {/* Bottom Row: Trend Pill & View All Link */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-50">
              <span
                className={[
                  "inline-flex items-center gap-1 text-[11px] font-bold",
                  item.isPositive ? "text-emerald-600" : "text-rose-500",
                ].join(" ")}
              >
                {item.isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{item.changeText}</span>
              </span>

              <Link
                href="/sales"
                className="text-[11px] font-semibold text-slate-400 hover:text-[var(--brand-green)] transition-colors"
              >
                View All
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
