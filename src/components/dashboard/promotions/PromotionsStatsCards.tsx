"use client";

import { Banknote, Megaphone, ShoppingBag, Tag } from "lucide-react";
import { formatMoney, type PromotionDashboard } from "./promotion-types";

export default function PromotionsStatsCards({ stats }: { stats: PromotionDashboard["stats"] }) {
  const cards = [
    { label: "Active promotions", value: stats.activePromotions.toLocaleString(), detail: `${stats.upcomingPromotions} upcoming`, icon: Megaphone },
    { label: "Total discounts given", value: formatMoney(stats.totalDiscounts), detail: "From recorded sales", icon: Banknote },
    { label: "Promotion redemptions", value: stats.redemptions.toLocaleString(), detail: "Discounted sale lines", icon: Tag },
    { label: "Revenue from promotions", value: formatMoney(stats.revenueFromPromotions), detail: "Net discounted line revenue", icon: ShoppingBag },
  ];
  return <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{cards.map((card) => { const Icon = card.icon; return <div key={card.label} className="rounded-2xl border border-[var(--brand-stroke)] bg-white p-5 shadow-xs"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-green)] text-white"><Icon className="h-5 w-5" /></div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{card.label}</p><p className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--brand-black-font)]">{card.value}</p><p className="mt-1 text-xs text-slate-500">{card.detail}</p></div>; })}</div>;
}
