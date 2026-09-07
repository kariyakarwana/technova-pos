"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CreditCard, History, PackageCheck, RotateCcw, Search, Star } from "lucide-react";
import { useBranch } from "@/components/dashboard/BranchContext";
import { apiGet, apiPost } from "@/lib/api/client";
import PaginationControls, { type PageMeta } from "./PaginationControls";

type Page<T> = { data: T[]; meta: PageMeta };
type Customer = { id: string; customerNumber: string; firstName: string; lastName: string | null };
type Sale = {
  id: string; invoiceNumber: string; status: string; total: number | string; createdAt: string;
  customer?: Customer | null; branch: { name: string }; _count: { items: number };
};
type Detail = Sale & { items: Array<{ id: string; quantity: number | string; lineTotal: number | string; product: { name: string; sku: string }; inventoryUnit?: { serialNumber: string } | null }> };
type Line = { selected: boolean; quantity: number; condition: string; restock: boolean };
type Summary = { totalAmount: number; returnCount: number; returnRate: number; damagedItems: number; byResolution: Array<{ resolution: string; count: number; amount: number }> };

const resolutions = [
  { value: "ORIGINAL_METHOD", label: "Original method", icon: CreditCard, help: "Refund cash, card or bank payment" },
  { value: "STORE_CREDIT", label: "Store credit", icon: PackageCheck, help: "Add reusable credit to customer" },
  { value: "LOYALTY_POINTS", label: "Star points", icon: Star, help: "Convert LKR 100 to one point" },
  { value: "PRODUCT_EXCHANGE", label: "Product exchange", icon: RotateCcw, help: "Issue exchange credit for another product" },
];
const emptyMeta: PageMeta = { page: 1, pageSize: 10, total: 0, pageCount: 0 };

export default function ReturnOperations() {
  const { branchId } = useBranch();
  const [transactions, setTransactions] = useState<Sale[]>([]);
  const [meta, setMeta] = useState<PageMeta>(emptyMeta);
  const [page, setPage] = useState(1), [pageSize, setPageSize] = useState(10);
  const [invoice, setInvoice] = useState(""), [customerPhone, setCustomerPhone] = useState("");
  const [from, setFrom] = useState(""), [to, setTo] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [sale, setSale] = useState<Detail | null>(null), [saleId, setSaleId] = useState("");
  const [reason, setReason] = useState("Customer return"), [method, setMethod] = useState("CASH");
  const [resolution, setResolution] = useState("ORIGINAL_METHOD");
  const [message, setMessage] = useState<string | null>(null);
  const [lines, setLines] = useState<Record<string, Line>>({});

  const loadTransactions = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize), eligibleForReturn: "true" });
    if (branchId) params.set("branchId", branchId);
    if (invoice.trim()) params.set("search", invoice.trim());
    if (customerPhone.trim()) params.set("customerPhone", customerPhone.trim());
    if (from) params.set("from", new Date(`${from}T00:00:00`).toISOString());
    if (to) params.set("to", new Date(`${to}T23:59:59.999`).toISOString());
    const result = await apiGet<Page<Sale>>(`/sales?${params}`);
    setTransactions(result.data); setMeta(result.meta);
  }, [branchId, customerPhone, from, invoice, page, pageSize, to]);

  useEffect(() => {
    void apiGet<Summary>("/returns/summary")
      .then(setSummary)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load return summary."));
  }, []);
  useEffect(() => { void loadTransactions().catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load transactions.")); }, [loadTransactions]);
  useEffect(() => setPage(1), [branchId, customerPhone, from, invoice, pageSize, to]);

  const selectedTotal = useMemo(() => sale?.items.reduce((sum, item) => sum + (lines[item.id]?.selected ? Number(item.lineTotal) / Number(item.quantity) * lines[item.id].quantity : 0), 0) ?? 0, [sale, lines]);
  async function choose(id: string) {
    setSaleId(id);
    if (!id) { setSale(null); setLines({}); return; }
    try {
      const detail = await apiGet<Detail>(`/sales/${id}`);
      setSale(detail);
      setLines(Object.fromEntries(detail.items.map((item) => [item.id, { selected: false, quantity: 1, condition: "RESALABLE", restock: true }])));
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to load transaction items."); }
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const items = Object.entries(lines).filter(([, line]) => line.selected).map(([saleItemId, line]) => ({ saleItemId, quantity: line.quantity, condition: line.condition, restock: line.restock }));
    if (!items.length) return setMessage("Select at least one item.");
    if (resolution !== "ORIGINAL_METHOD" && !sale?.customer) return setMessage("Store credit, points and exchanges require a registered customer.");
    try {
      const result = await apiPost<{ returnNumber: string }>("/returns", { saleId, reason, resolution, refundMethod: resolution === "ORIGINAL_METHOD" ? method : undefined, refundReference: `UI-${Date.now()}`, items });
      setMessage(`${result.returnNumber} completed using ${resolution.replaceAll("_", " ").toLowerCase()}.`);
      setSale(null); setSaleId(""); setLines({});
      const latestSummary = await apiGet<Summary>("/returns/summary"); setSummary(latestSummary);
      await loadTransactions();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Return failed."); }
  }

  const storeOrExchange = summary?.byResolution.filter((item) => ["STORE_CREDIT", "PRODUCT_EXCHANGE"].includes(item.resolution)).reduce((sum, item) => sum + item.count, 0) ?? 0;
  const pointsReturns = summary?.byResolution.find((item) => item.resolution === "LOYALTY_POINTS")?.count ?? 0;
  return <main className="space-y-6 bg-[#F8FAFC] p-6">
    <header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wider text-[#0E9384]">Returns management</p><h1 className="text-2xl font-bold">Returns & Refunds</h1><p className="text-sm text-slate-500">Find an eligible transaction, select its items and choose the customer resolution.</p></div><Link href="/returns-refunds/history" className="flex items-center gap-2 rounded-xl border border-[#0E9384] bg-white px-4 py-2.5 text-sm font-semibold text-[#0E9384]"><History className="h-4 w-4"/>View return history</Link></header>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[
      { label: "Total returned", value: `LKR ${Number(summary?.totalAmount ?? 0).toLocaleString()}` },
      { label: "Completed returns", value: summary?.returnCount ?? 0 },
      { label: "Store credit / exchanges", value: storeOrExchange },
      { label: "Points refunds", value: pointsReturns },
    ].map((card) => <div key={card.label} className="rounded-2xl bg-gradient-to-r from-[#025148] to-[#0E9384] p-5 text-white shadow"><p className="text-xs uppercase text-white/70">{card.label}</p><p className="mt-2 text-2xl font-bold">{card.value}</p></div>)}</div>
    {message && <div className="rounded-xl border border-teal-200 bg-teal-50 p-3 text-sm text-teal-800">{message}</div>}

    <section className="rounded-2xl border bg-white shadow-sm">
      <div className="border-b p-5"><h2 className="font-bold">1. Select transaction</h2><p className="text-xs text-slate-500">{meta.total} eligible transactions match the filters.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <label className="relative xl:col-span-1"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400"/><input value={invoice} onChange={(event) => setInvoice(event.target.value)} placeholder="Search invoice number" className="h-10 w-full rounded-xl border pl-9 pr-3 text-sm"/></label>
          <label className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400"/><input type="tel" inputMode="tel" value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder="Search customer phone" className="h-10 w-full rounded-xl border pl-9 pr-3 text-sm"/></label>
          <label className="text-xs font-semibold">From<input type="date" value={from} max={to || undefined} onChange={(event) => setFrom(event.target.value)} className="mt-1 h-10 w-full rounded-xl border px-3"/></label>
          <label className="text-xs font-semibold">To<input type="date" value={to} min={from || undefined} onChange={(event) => setTo(event.target.value)} className="mt-1 h-10 w-full rounded-xl border px-3"/></label>
          <button type="button" onClick={() => { setInvoice(""); setCustomerPhone(""); setFrom(""); setTo(""); }} className="h-10 self-end rounded-xl border px-4 text-sm font-semibold text-slate-600">Clear filters</button>
        </div>
      </div>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-4">Invoice</th><th className="p-4">Date</th><th className="p-4">Customer</th><th className="p-4">Branch</th><th className="p-4">Items</th><th className="p-4">Total</th><th className="p-4">Status</th><th className="p-4"></th></tr></thead><tbody>{transactions.map((transaction) => <tr key={transaction.id} className={`border-t ${saleId === transaction.id ? "bg-teal-50" : "hover:bg-slate-50"}`}><td className="p-4 font-semibold text-[#0E9384]">{transaction.invoiceNumber}</td><td className="p-4">{new Date(transaction.createdAt).toLocaleString()}</td><td className="p-4">{transaction.customer ? `${transaction.customer.firstName} ${transaction.customer.lastName ?? ""}`.trim() : "Walk-in"}</td><td className="p-4">{transaction.branch.name}</td><td className="p-4">{transaction._count.items}</td><td className="p-4 font-semibold">LKR {Number(transaction.total).toLocaleString()}</td><td className="p-4">{transaction.status.replaceAll("_", " ")}</td><td className="p-4"><button type="button" onClick={() => void choose(transaction.id)} className="rounded-lg bg-[#0E9384] px-3 py-2 text-xs font-semibold text-white">{saleId === transaction.id ? "Selected" : "Select"}</button></td></tr>)}</tbody></table>{!transactions.length && <p className="p-8 text-center text-sm text-slate-500">No eligible transactions match these filters.</p>}</div>
      <PaginationControls meta={meta} onPageChange={setPage} onPageSizeChange={setPageSize}/>
    </section>

    {sale && <div className="grid gap-6 xl:grid-cols-[1.2fr_420px]"><section className="rounded-2xl border bg-white p-5"><h2 className="font-bold">2. Select items from {sale.invoiceNumber}</h2><div className="mt-4 space-y-2">{sale.items.map((item) => { const line = lines[item.id]; return <div key={item.id} className={`rounded-xl border p-3 ${line?.selected ? "border-[#0E9384] bg-teal-50" : ""}`}><label className="flex gap-3"><input type="checkbox" checked={line?.selected ?? false} onChange={(event) => setLines({ ...lines, [item.id]: { ...line, selected: event.target.checked } })}/><span className="flex-1"><b>{item.product.name}</b><small className="block text-slate-500">{item.product.sku} · LKR {Number(item.lineTotal).toFixed(2)}{item.inventoryUnit ? ` · S/N ${item.inventoryUnit.serialNumber}` : ""}</small></span></label>{line?.selected && <div className="mt-3 grid grid-cols-3 gap-2"><input aria-label="Return quantity" type="number" min=".001" max={Number(item.quantity)} step=".001" value={line.quantity} onChange={(event) => setLines({ ...lines, [item.id]: { ...line, quantity: Number(event.target.value) } })} className="h-9 rounded-lg border px-2"/><select aria-label="Returned item condition" value={line.condition} onChange={(event) => setLines({ ...lines, [item.id]: { ...line, condition: event.target.value } })} className="h-9 rounded-lg border"><option>RESALABLE</option><option>DAMAGED</option><option>OPENED</option></select><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={line.restock} onChange={(event) => setLines({ ...lines, [item.id]: { ...line, restock: event.target.checked } })}/>Restock</label></div>}</div>; })}</div></section>
      <form onSubmit={submit} className="space-y-4 rounded-2xl border bg-white p-5"><h2 className="font-bold">3. Resolution</h2><div className="grid grid-cols-2 gap-2">{resolutions.map((item) => { const Icon = item.icon; return <button type="button" key={item.value} onClick={() => setResolution(item.value)} className={`rounded-xl border p-3 text-left ${resolution === item.value ? "border-[#0E9384] bg-teal-50" : ""}`}><Icon className="h-5 w-5 text-[#0E9384]"/><b className="mt-2 block text-sm">{item.label}</b><small className="text-slate-500">{item.help}</small></button>; })}</div>{resolution === "ORIGINAL_METHOD" && <select value={method} onChange={(event) => setMethod(event.target.value)} className="h-10 w-full rounded-xl border px-3"><option>CASH</option><option>CARD</option><option>BANK_TRANSFER</option></select>}<textarea aria-label="Return reason" value={reason} onChange={(event) => setReason(event.target.value)} className="min-h-20 w-full rounded-xl border p-3"/><div className="rounded-xl bg-slate-50 p-4"><div className="flex justify-between text-sm"><span>Selected refund value</span><b>LKR {selectedTotal.toFixed(2)}</b></div>{resolution === "LOYALTY_POINTS" && <p className="mt-2 text-xs text-slate-500">Estimated award: {Math.floor(selectedTotal / 100)} points</p>}</div><button disabled={selectedTotal <= 0} className="w-full rounded-xl bg-[#0E9384] py-3 font-bold text-white disabled:opacity-50">Authorize return</button></form>
    </div>}
  </main>;
}
