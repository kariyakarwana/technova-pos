"use client";

import { Banknote, DollarSign, Megaphone, Tag, TrendingDown, TrendingUp } from "lucide-react";
import type { PromotionStats } from "./PromotionsMock";

interface PromotionsStatsCardsProps {
  stats: PromotionStats;
}

export default function PromotionsStatsCards({
  stats,
}: PromotionsStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* 1. Active Promotions */}
      <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-5 shadow-xs flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-xl bg-[var(--brand-green)] text-white flex items-center justify-center shadow-2xs">
            <Megaphone className="h-5 w-5" />
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E0F2FE] text-[#0369A1]">
            <TrendingUp className="h-3 w-3" />
            <span>{stats.activeTrend}</span>
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
            ACTIVE PROMOTIONS
          </span>
          <h2 className="text-2xl font-extrabold text-[var(--brand-black-font)] tracking-tight mt-0.5">
            {stats.activePromotions}
          </h2>
        </div>
      </div>

      {/* 2. Total Discounts Given */}
      <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-5 shadow-xs flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-xl bg-[var(--brand-green)] text-white flex items-center justify-center shadow-2xs">
            <Banknote className="h-5 w-5" />
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
            TOTAL DISCOUNTS GIVEN
          </span>
          <h2 className="text-2xl font-extrabold text-[var(--brand-black-font)] tracking-tight mt-0.5">
            {stats.totalDiscounts}
          </h2>
        </div>
      </div>

      {/* 3. Redemption Rate */}
      <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-5 shadow-xs flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-xl bg-[var(--brand-green)] text-white flex items-center justify-center shadow-2xs">
            <Tag className="h-5 w-5" />
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEE2E2] text-[#DC2626]">
            <TrendingDown className="h-3 w-3" />
            <span>{stats.redemptionTrend}</span>
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
            REDEMPTION RATE
          </span>
          <h2 className="text-2xl font-extrabold text-[var(--brand-black-font)] tracking-tight mt-0.5">
            {stats.redemptionRate}
          </h2>
        </div>
      </div>

      {/* 4. Revenue from Promos */}
      <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-5 shadow-xs flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-xl bg-[var(--brand-green)] text-white flex items-center justify-center shadow-2xs">
            <DollarSign className="h-5 w-5" />
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E0F2FE] text-[#0369A1]">
            <TrendingUp className="h-3 w-3" />
            <span>{stats.revenueTrend}</span>
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
            REVENUE FROM PROMOS
          </span>
          <h2 className="text-2xl font-extrabold text-[var(--brand-black-font)] tracking-tight mt-0.5">
            {stats.revenueFromPromos}
          </h2>
        </div>
      </div>
    </div>
  );
}
