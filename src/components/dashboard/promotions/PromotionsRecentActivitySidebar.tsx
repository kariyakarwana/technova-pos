"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { formatMoney, type PromotionActivity } from "./promotion-types";

export default function PromotionsRecentActivitySidebar({ activity }: { activity: PromotionActivity[] }) {
  return <div className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[var(--brand-stroke)] bg-white shadow-xs">
    <div className="space-y-5 p-6"><h2 className="text-base font-bold text-[var(--brand-black-font)]">Recent redemptions</h2><div className="space-y-4">
      {activity.map((item) => { const customer = item.sale.customer ? `${item.sale.customer.firstName} ${item.sale.customer.lastName}`.trim() : "Walk-in customer"; return <div key={item.id} className="flex items-start gap-3 text-xs"><div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[var(--brand-green)]"><ShoppingBag className="h-4 w-4" /></div><div><p className="font-bold text-[var(--brand-black-font)]">{item.promotionName}</p><p className="text-[11px] text-slate-500">{item.sale.invoiceNumber} · {customer}</p><p className="text-[11px] text-slate-500">{formatMoney(item.amount)} discount · {new Intl.DateTimeFormat("en-LK", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.sale.createdAt))}</p></div></div>; })}
      {!activity.length && <p className="py-8 text-center text-xs text-slate-500">Promotion redemptions will appear here after sales are completed.</p>}
    </div></div>
    <Link href="/promotions/performance" className="border-t border-[var(--brand-stroke)] bg-slate-50 py-3.5 text-center text-xs font-semibold text-[var(--brand-green)] hover:bg-slate-100">View complete performance</Link>
  </div>;
}
