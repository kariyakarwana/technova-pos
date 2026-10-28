"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { apiGet } from "@/lib/api/client";
import PaginationControls from "@/components/operations/PaginationControls";
import PromotionsStatsCards from "../PromotionsStatsCards";
import { formatMoney, formatPromotionOffer, type PromotionDashboard } from "../promotion-types";
import PromotionPerformanceHeader from "./PromotionPerformanceHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const emptyData: PromotionDashboard = { stats: { activePromotions: 0, upcomingPromotions: 0, totalDiscounts: 0, revenueFromPromotions: 0, redemptions: 0 }, promotions: [], recentActivity: [] };

export default function PromotionPerformanceClientView() {
  const [data, setData] = useState(emptyData); const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""); const [status, setStatus] = useState("ALL"); const [page, setPage] = useState(1); const [pageSize, setPageSize] = useState(10);
  useEffect(() => { apiGet<PromotionDashboard>("/discounts/dashboard").then(setData).catch((caught) => toast.error(caught instanceof Error ? caught.message : "Unable to load performance.", { duration: 8000 })).finally(() => setLoading(false)); }, []);
  const filtered = useMemo(() => { const term = search.trim().toLowerCase(); return data.promotions.filter((item) => (status === "ALL" || item.lifecycleStatus === status) && (!term || item.name.toLowerCase().includes(term) || item.code?.toLowerCase().includes(term))); }, [data.promotions, search, status]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize)); const safePage = Math.min(page, pageCount); const rows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  return <main className="min-h-screen space-y-6 bg-[var(--brand-app-bg)] p-6"><PromotionPerformanceHeader /><PromotionsStatsCards stats={data.stats} />
    <section className="overflow-hidden rounded-2xl border border-[var(--brand-stroke)] bg-white shadow-xs"><div className="flex flex-col gap-3 border-b p-5 md:flex-row md:items-center md:justify-between"><div><h2 className="font-bold">Revenue and discount by promotion</h2><p className="mt-1 text-xs text-slate-500">Based on actual sales where each promotion was applied.</p></div><div className="flex flex-col gap-2 sm:flex-row"><label className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search promotion" className="h-9 rounded-xl border pl-9 pr-3 text-xs outline-none focus:border-[var(--brand-green)]" /></label><Select value={status} onValueChange={(val) => { setStatus(val); setPage(1); }}><SelectTrigger className="h-9 data-[size=default]:h-9 w-36 rounded-xl border bg-white px-3 text-xs"><SelectValue placeholder="All statuses" /></SelectTrigger><SelectContent className="max-h-72"><SelectItem value="ALL" className="text-xs hover:bg-[#F4FBF9] hover:text-[#0E9384] cursor-pointer">All statuses</SelectItem><SelectItem value="ACTIVE" className="text-xs hover:bg-[#F4FBF9] hover:text-[#0E9384] cursor-pointer">Active</SelectItem><SelectItem value="UPCOMING" className="text-xs hover:bg-[#F4FBF9] hover:text-[#0E9384] cursor-pointer">Upcoming</SelectItem><SelectItem value="PAUSED" className="text-xs hover:bg-[#F4FBF9] hover:text-[#0E9384] cursor-pointer">Paused</SelectItem><SelectItem value="EXPIRED" className="text-xs hover:bg-[#F4FBF9] hover:text-[#0E9384] cursor-pointer">Expired</SelectItem></SelectContent></Select></div></div>
      {loading ? <div className="p-12 text-center text-sm text-slate-500">Loading performance…</div> : <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-xs"><thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3">Promotion</th><th className="px-5 py-3">Offer</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Sales</th><th className="px-5 py-3 text-right">Units</th><th className="px-5 py-3 text-right">Redemptions</th><th className="px-5 py-3 text-right">Discount</th><th className="px-5 py-3 text-right">Revenue</th><th className="px-5 py-3 text-right">Revenue / sale</th></tr></thead><tbody className="divide-y">{rows.map((item) => <tr key={item.id} className="hover:bg-slate-50"><td className="px-5 py-4"><Link href={`/promotions/${item.id}`} className="font-bold text-[var(--brand-green)]">{item.name}</Link><p className="text-[11px] text-slate-500">{item.code}</p></td><td className="px-5 py-4">{formatPromotionOffer(item)}</td><td className="px-5 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold">{item.lifecycleStatus}</span></td><td className="px-5 py-4 text-right">{item.salesCount}</td><td className="px-5 py-4 text-right">{item.unitsSold}</td><td className="px-5 py-4 text-right">{item.usageCount}</td><td className="px-5 py-4 text-right font-semibold text-rose-600">{formatMoney(item.totalDiscount)}</td><td className="px-5 py-4 text-right font-semibold">{formatMoney(item.revenue)}</td><td className="px-5 py-4 text-right">{formatMoney(item.salesCount ? item.revenue / item.salesCount : 0)}</td></tr>)}{!rows.length && <tr><td colSpan={9} className="p-12 text-center text-slate-500">No promotion performance matches the filters.</td></tr>}</tbody></table></div>}
      <PaginationControls meta={{ page: safePage, pageSize, total: filtered.length, pageCount }} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} />
    </section>
  </main>;
}
