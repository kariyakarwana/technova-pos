"use client";

import { Eye } from "lucide-react";
import { formatMoney, formatPromotionOffer, type PromotionItem, type PromotionLifecycleStatus } from "./promotion-types";

const statusClasses: Record<PromotionLifecycleStatus, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700", UPCOMING: "bg-blue-100 text-blue-700",
  EXPIRED: "bg-slate-200 text-slate-700", PAUSED: "bg-amber-100 text-amber-700", ARCHIVED: "bg-rose-100 text-rose-700",
};

function dateLabel(value: string | null) {
  return value ? new Intl.DateTimeFormat("en-LK", { dateStyle: "medium" }).format(new Date(value)) : "No limit";
}

export default function ActivePromotionsTableCard({ promotions, onActionClick }: { promotions: PromotionItem[]; onActionClick?: (item: PromotionItem) => void }) {
  return <div className="overflow-hidden rounded-2xl border border-[var(--brand-stroke)] bg-white shadow-xs">
    <div className="border-b border-[var(--brand-stroke)] p-5"><h2 className="text-base font-bold text-[var(--brand-black-font)]">Promotion campaigns</h2></div>
    <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-xs">
      <thead className="border-b border-[var(--brand-stroke)] bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3">Promotion</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Applies to</th><th className="px-5 py-3">Offer</th><th className="px-5 py-3">Validity</th><th className="px-5 py-3">Performance</th><th className="px-5 py-3 text-center">Action</th></tr></thead>
      <tbody className="divide-y divide-[var(--brand-stroke)]">{promotions.map((promotion) => <tr key={promotion.id} className="hover:bg-slate-50/70">
        <td className="px-5 py-4"><p className="font-bold text-[var(--brand-black-font)]">{promotion.name}</p><p className="mt-0.5 text-[11px] text-slate-500">{promotion.code ?? "Automatic promotion"}</p></td>
        <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusClasses[promotion.lifecycleStatus]}`}>{promotion.lifecycleStatus}</span></td>
        <td className="px-5 py-4 text-slate-600">{promotion.product ? `${promotion.product.sku} · ${promotion.product.name}` : "All products"}</td>
        <td className="px-5 py-4 font-semibold">{formatPromotionOffer(promotion)}</td>
        <td className="px-5 py-4 text-slate-600">{dateLabel(promotion.startsAt)} – {dateLabel(promotion.endsAt)}</td>
        <td className="px-5 py-4"><p className="font-semibold">{promotion.usageCount} uses</p><p className="text-[11px] text-slate-500">{formatMoney(promotion.revenue)} revenue</p></td>
        <td className="px-5 py-4 text-center"><button type="button" onClick={() => onActionClick?.(promotion)} className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg border text-[var(--brand-green)] hover:bg-emerald-50" title="View promotion details"><Eye className="h-4 w-4" /></button></td>
      </tr>)}{!promotions.length && <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-500">No promotions match the selected filters.</td></tr>}</tbody>
    </table></div>
  </div>;
}
