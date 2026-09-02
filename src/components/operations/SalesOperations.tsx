"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useBranch } from "@/components/dashboard/BranchContext";
import PaginationControls, { type PageMeta } from "@/components/operations/PaginationControls";
import { apiGet } from "@/lib/api/client";

type Sale = { id: string; invoiceNumber: string; status: string; total: string | number; paidTotal: string | number; balanceDue: string | number; completedAt: string | null; customer: { firstName: string; lastName: string | null } | null; _count: { items: number } };
const initialMeta: PageMeta = { page: 1, pageSize: 20, total: 0, pageCount: 0 };

export default function SalesOperations() {
  const { branchId } = useBranch();
  const [result, setResult] = useState<{ data: Sale[]; meta: PageMeta }>({ data: [], meta: initialMeta });
  const [page, setPage] = useState(1), [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState(""), [status, setStatus] = useState(""), [from, setFrom] = useState(""), [to, setTo] = useState("");
  const [loading, setLoading] = useState(false), [message, setMessage] = useState<string | null>(null);
  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (branchId) params.set("branchId", branchId); if (search) params.set("search", search); if (status) params.set("status", status); if (from) params.set("from", `${from}T00:00:00.000Z`); if (to) params.set("to", `${to}T23:59:59.999Z`);
    try { setResult(await apiGet<{ data: Sale[]; meta: PageMeta }>(`/sales?${params}`)); setMessage(null); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Unable to load sales."); }
    finally { setLoading(false); }
  }, [branchId, from, page, pageSize, search, status, to]);
  useEffect(() => { const timer = setTimeout(() => void load(), 250); return () => clearTimeout(timer); }, [load]);
  useEffect(() => setPage(1), [branchId, search, status, from, to, pageSize]);
  return <main className="space-y-6 p-6"><div><p className="text-xs font-semibold uppercase tracking-wider text-[#0E9384]">Transactions</p><h1 className="text-2xl font-bold">Sales</h1><p className="text-sm text-slate-500">Completed sales, payment balances and receipt details.</p></div>
    <section className="grid gap-3 rounded-2xl border bg-white p-4 sm:grid-cols-2 xl:grid-cols-5"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Invoice or customer" className="h-10 rounded-xl border px-3 text-sm"/><select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-xl border px-3 text-sm"><option value="">All statuses</option><option value="COMPLETED">Completed</option><option value="PARTIALLY_REFUNDED">Partially refunded</option><option value="REFUNDED">Refunded</option><option value="VOIDED">Voided</option></select><label className="text-xs font-semibold">From<input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1 h-8 w-full rounded-lg border px-2"/></label><label className="text-xs font-semibold">To<input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 h-8 w-full rounded-lg border px-2"/></label><button type="button" onClick={() => { setSearch(""); setStatus(""); setFrom(""); setTo(""); }} className="h-10 rounded-xl border font-semibold">Clear filters</button></section>
    {message && <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{message}</p>}<div className="overflow-hidden rounded-2xl border bg-white"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50"><tr><th className="px-4 py-3">Invoice</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Items</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Paid</th><th className="px-4 py-3">Balance</th><th className="px-4 py-3">Status</th></tr></thead><tbody className="divide-y">{result.data.map((sale) => <tr key={sale.id}><td className="px-4 py-3"><Link href={`/sales/${sale.id}`} className="font-semibold text-[#0E9384]">{sale.invoiceNumber}</Link><p className="text-xs text-slate-500">{sale.completedAt ? new Date(sale.completedAt).toLocaleString() : "Pending"}</p></td><td className="px-4 py-3">{sale.customer ? `${sale.customer.firstName} ${sale.customer.lastName ?? ""}` : "Walk-in"}</td><td className="px-4 py-3">{sale._count.items}</td><td className="px-4 py-3">{Number(sale.total).toLocaleString()}</td><td className="px-4 py-3">{Number(sale.paidTotal).toLocaleString()}</td><td className="px-4 py-3">{Number(sale.balanceDue).toLocaleString()}</td><td className="px-4 py-3">{sale.status.replaceAll("_", " ")}</td></tr>)}</tbody></table>{loading && <p className="p-6 text-center text-sm">Loading…</p>}{!loading && !result.data.length && <p className="p-6 text-center text-sm text-slate-500">No sales match these filters.</p>}</div><PaginationControls meta={result.meta} onPageChange={setPage} onPageSizeChange={setPageSize}/></div></main>;
}
