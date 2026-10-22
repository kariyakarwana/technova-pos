"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, RefreshCw, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiGet } from "@/lib/api/client";
import PaginationControls from "@/components/operations/PaginationControls";
import PromotionsHeader from "./PromotionsHeader";
import PromotionsStatsCards from "./PromotionsStatsCards";
import ActivePromotionsTableCard from "./ActivePromotionsTableCard";
import PromotionsRecentActivitySidebar from "./PromotionsRecentActivitySidebar";
import type { PromotionDashboard } from "./promotion-types";

const emptyData: PromotionDashboard = {
  stats: { activePromotions: 0, upcomingPromotions: 0, totalDiscounts: 0, revenueFromPromotions: 0, redemptions: 0 },
  promotions: [], recentActivity: [],
};

export default function PromotionsDashboardClientView() {
  const router = useRouter();
  const [data, setData] = useState<PromotionDashboard>(emptyData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  async function load() {
    setLoading(true); setError("");
    try { setData(await apiGet<PromotionDashboard>("/discounts/dashboard")); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to load promotions."); }
    finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return data.promotions.filter((item) => (status === "ALL" || item.lifecycleStatus === status) && (!term || item.name.toLowerCase().includes(term) || item.code?.toLowerCase().includes(term) || item.product?.name.toLowerCase().includes(term)));
  }, [data.promotions, search, status]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const rows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return <main className="min-h-screen space-y-6 bg-[var(--brand-app-bg)] p-6">
    <PromotionsHeader />
    {error && <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"><span>{error}</span><button type="button" onClick={() => void load()} className="font-bold">Try again</button></div>}
    <PromotionsStatsCards stats={data.stats} />
    <div className="flex flex-col gap-3 rounded-2xl border border-[var(--brand-stroke)] bg-white p-4 shadow-xs md:flex-row md:items-center">
      <label className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search promotion, code, or product" className="h-10 w-full rounded-xl border border-[var(--brand-stroke)] pl-9 pr-3 text-sm outline-none focus:border-[var(--brand-green)]" /></label>
      <Select
        value={status}
        onValueChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
      >
        <SelectTrigger className="h-10 data-[size=default]:h-10 w-fit min-w-[140px] rounded-xl border border-[var(--brand-stroke)] bg-white px-3 text-sm font-normal text-slate-800 shadow-none focus-visible:border-[var(--brand-green)] focus-visible:ring-0 cursor-pointer">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent
          position="popper"
          sideOffset={4}
          className="w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] max-h-72 rounded-xl border border-slate-200 bg-white p-1 shadow-lg ring-0"
        >
          <SelectItem
            value="ALL"
            className="cursor-pointer text-sm text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
          >
            All statuses
          </SelectItem>
          <SelectItem
            value="ACTIVE"
            className="cursor-pointer text-sm text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
          >
            Active
          </SelectItem>
          <SelectItem
            value="UPCOMING"
            className="cursor-pointer text-sm text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
          >
            Upcoming
          </SelectItem>
          <SelectItem
            value="PAUSED"
            className="cursor-pointer text-sm text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
          >
            Paused
          </SelectItem>
          <SelectItem
            value="EXPIRED"
            className="cursor-pointer text-sm text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
          >
            Expired
          </SelectItem>
          <SelectItem
            value="ARCHIVED"
            className="cursor-pointer text-sm text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
          >
            Archived
          </SelectItem>
        </SelectContent>
      </Select>
      <button type="button" onClick={() => router.push("/promotions/performance")} className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--brand-green)] px-4 text-sm font-semibold text-[var(--brand-green)]"><BarChart3 className="h-4 w-4" />Performance</button>
      <button type="button" onClick={() => void load()} className="flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh</button>
    </div>
    {loading && !data.promotions.length ? <div className="rounded-2xl border bg-white p-12 text-center text-sm text-slate-500">Loading promotions…</div> : <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12"><div className="lg:col-span-8"><ActivePromotionsTableCard promotions={rows} onActionClick={(item) => router.push(`/promotions/${item.id}`)} /><PaginationControls meta={{ page: safePage, pageSize, total: filtered.length, pageCount }} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} /></div><div className="lg:col-span-4"><PromotionsRecentActivitySidebar activity={data.recentActivity} /></div></div>}
  </main>;
}
