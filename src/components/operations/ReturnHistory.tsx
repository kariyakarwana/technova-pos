"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, RotateCcw } from "lucide-react";
import { useBranch } from "@/components/dashboard/BranchContext";
import { apiGet } from "@/lib/api/client";
import ReportExportActions from "@/components/reports/ReportExportActions";
import PaginationControls, { type PageMeta } from "./PaginationControls";

type ReturnRecord = {
  id: string; returnNumber: string; status: string; reason: string; resolution: string;
  total: number | string; createdAt: string;
  sale: {
    invoiceNumber: string;
    customer: { customerNumber: string; firstName: string; lastName: string | null; phone: string | null } | null;
    branch: { code: string; name: string };
  };
  items: Array<{ condition: string | null; quantity: number | string }>;
  refundPayment?: { method: string } | null;
};
type Summary = {
  totalAmount: number; returnCount: number; returnRate: number; damagedItems: number;
};
const emptyMeta: PageMeta = { page: 1, pageSize: 20, total: 0, pageCount: 0 };

export default function ReturnHistory() {
  const { branchId } = useBranch();
  const [records, setRecords] = useState<ReturnRecord[]>([]);
  const [meta, setMeta] = useState<PageMeta>(emptyMeta);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [page, setPage] = useState(1), [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState(""), [phone, setPhone] = useState("");
  const [resolution, setResolution] = useState(""), [status, setStatus] = useState("");
  const [from, setFrom] = useState(""), [to, setTo] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const params = useMemo(() => {
    const value = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (branchId) value.set("branchId", branchId);
    if (search.trim()) value.set("search", search.trim());
    if (phone.trim()) value.set("customerPhone", phone.trim());
    if (resolution) value.set("resolution", resolution);
    if (status) value.set("status", status);
    if (from) value.set("from", new Date(`${from}T00:00:00`).toISOString());
    if (to) value.set("to", new Date(`${to}T23:59:59.999`).toISOString());
    return value;
  }, [branchId, from, page, pageSize, phone, resolution, search, status, to]);

  const load = useCallback(async () => {
    const result = await apiGet<{ data: ReturnRecord[]; meta: PageMeta }>(`/returns?${params}`);
    setRecords(result.data); setMeta(result.meta);
  }, [params]);
  useEffect(() => { void apiGet<Summary>("/returns/summary").then(setSummary).catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load return summary.")); }, []);
  useEffect(() => { void load().catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load return history.")); }, [load]);
  useEffect(() => setPage(1), [branchId, from, pageSize, phone, resolution, search, status, to]);

  const exportParams = new URLSearchParams(params); exportParams.delete("page"); exportParams.delete("pageSize");
  const exportRows = records.map((record) => ({
    returnNumber: record.returnNumber,
    invoiceNumber: record.sale.invoiceNumber,
    date: new Date(record.createdAt).toLocaleString(),
    branch: record.sale.branch.name,
    customer: record.sale.customer ? `${record.sale.customer.firstName} ${record.sale.customer.lastName ?? ""}`.trim() : "Walk-in",
    phone: record.sale.customer?.phone ?? "",
    reason: record.reason,
    resolution: record.resolution,
    amount: Number(record.total),
    status: record.status,
  }));
  const cards = [
    { label: "Total refunds / returns", value: `LKR ${(summary?.totalAmount ?? 0).toLocaleString()}` },
    { label: "Total returns", value: summary?.returnCount ?? 0 },
    { label: "Return rate", value: `${(summary?.returnRate ?? 0).toFixed(1)}%` },
    { label: "Damaged stock", value: summary?.damagedItems ?? 0 },
  ];

  return <main className="space-y-6 bg-[#F8FAFC] p-6">
    <header className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase text-[#0E9384]">Returns & Refunds / History</p><h1 className="text-2xl font-bold">Return History</h1><p className="text-sm text-slate-500">Complete refund, store-credit, points and exchange audit trail.</p></div><div className="flex flex-wrap gap-2"><Link href="/returns-refunds" className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold">Process a return</Link><ReportExportActions title="Return History" rows={exportRows} serverCsvUrl={`/api/backend/returns/history.csv${exportParams.size ? `?${exportParams}` : ""}`}/></div></header>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map((card) => <article key={card.label} className="rounded-2xl bg-gradient-to-r from-[#025148] to-[#0E9384] p-5 text-white shadow"><p className="text-xs uppercase text-white/70">{card.label}</p><p className="mt-2 text-2xl font-bold">{card.value}</p></article>)}</div>
    {message && <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-800">{message}</p>}
    <section className="rounded-2xl border bg-white shadow-sm">
      <div className="grid gap-3 border-b p-4 sm:grid-cols-2 xl:grid-cols-7">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Return, invoice, customer or reason" className="h-10 rounded-xl border px-3 xl:col-span-2"/>
        <input type="tel" inputMode="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Customer phone" className="h-10 rounded-xl border px-3"/>
        <select value={resolution} onChange={(event) => setResolution(event.target.value)} className="h-10 rounded-xl border px-3"><option value="">All resolutions</option><option>ORIGINAL_METHOD</option><option>STORE_CREDIT</option><option>LOYALTY_POINTS</option><option>PRODUCT_EXCHANGE</option></select>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 rounded-xl border px-3"><option value="">All statuses</option><option>REQUESTED</option><option>APPROVED</option><option>COMPLETED</option><option>REJECTED</option><option>CANCELLED</option></select>
        <label className="relative"><CalendarDays className="absolute left-3 top-3 h-4 w-4 text-slate-400"/><input aria-label="Returns from date" type="date" value={from} max={to || undefined} onChange={(event) => setFrom(event.target.value)} className="h-10 w-full rounded-xl border pl-9 pr-2"/></label>
        <input aria-label="Returns to date" type="date" value={to} min={from || undefined} onChange={(event) => setTo(event.target.value)} className="h-10 rounded-xl border px-3"/>
        <button type="button" onClick={() => { setSearch(""); setPhone(""); setResolution(""); setStatus(""); setFrom(""); setTo(""); }} className="h-10 rounded-xl border px-4 text-sm font-semibold text-slate-600">Clear filters</button>
      </div>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-4">Return</th><th className="p-4">Invoice</th><th className="p-4">Customer</th><th className="p-4">Branch</th><th className="p-4">Reason / condition</th><th className="p-4">Resolution</th><th className="p-4">Amount</th><th className="p-4">Status</th></tr></thead><tbody>{records.map((record) => <tr key={record.id} className="border-t hover:bg-slate-50"><td className="p-4"><Link href={`/returns-refunds/${record.id}`} className="font-bold text-[#0E9384] hover:underline">{record.returnNumber}</Link><small className="block text-slate-500">{new Date(record.createdAt).toLocaleString()}</small></td><td className="p-4">{record.sale.invoiceNumber}</td><td className="p-4">{record.sale.customer ? <><span>{record.sale.customer.firstName} {record.sale.customer.lastName}</span><small className="block text-slate-500">{record.sale.customer.phone || record.sale.customer.customerNumber}</small></> : "Walk-in"}</td><td className="p-4">{record.sale.branch.name}</td><td className="p-4">{record.reason}<small className="block text-slate-500">{[...new Set(record.items.map((item) => item.condition ?? "—"))].join(", ")}</small></td><td className="p-4"><span className="rounded-full bg-teal-50 px-2 py-1 text-xs text-teal-700">{record.resolution.replaceAll("_", " ")}</span></td><td className="p-4 font-semibold">LKR {Number(record.total).toLocaleString()}</td><td className="p-4">{record.status}</td></tr>)}</tbody></table>{!records.length && <div className="p-10 text-center text-slate-500"><RotateCcw className="mx-auto mb-2 h-7 w-7"/>No matching returns.</div>}</div>
      <PaginationControls meta={meta} onPageChange={setPage} onPageSizeChange={setPageSize}/>
    </section>
  </main>;
}
