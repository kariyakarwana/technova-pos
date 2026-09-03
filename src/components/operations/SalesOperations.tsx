"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FileSpreadsheet, FileText, Printer, RefreshCw, Search } from "lucide-react";
import { useBranch } from "@/components/dashboard/BranchContext";
import PaginationControls, {
  type PageMeta,
} from "@/components/operations/PaginationControls";
import { apiGet } from "@/lib/api/client";

type Sale = {
  id: string;
  invoiceNumber: string;
  status: string;
  total: string | number;
  paidTotal: string | number;
  balanceDue: string | number;
  completedAt: string | null;
  customer: { firstName: string; lastName: string | null } | null;
  createdBy: { id: string; email: string };
  _count: { items: number };
};
type Cashier = { id: string; email: string };
const initialMeta: PageMeta = { page: 1, pageSize: 20, total: 0, pageCount: 0 };
const statusStyle: Record<string, string> = { COMPLETED: "bg-emerald-50 text-emerald-700 ring-emerald-200", PARTIALLY_REFUNDED: "bg-amber-50 text-amber-700 ring-amber-200", REFUNDED: "bg-blue-50 text-blue-700 ring-blue-200", VOIDED: "bg-rose-50 text-rose-700 ring-rose-200" };
const escapeHtml = (value: unknown) => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");

export default function SalesOperations({ isSuperAdmin = false }: { isSuperAdmin?: boolean }) {
  const { branchId, branches } = useBranch();
  const [salesBranchId, setSalesBranchId] = useState(branchId);
  const [result, setResult] = useState<{ data: Sale[]; meta: PageMeta }>({
    data: [],
    meta: initialMeta,
  });
  const [page, setPage] = useState(1),
    [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState(""),
    [status, setStatus] = useState(""),
    [cashierId, setCashierId] = useState(""),
    [from, setFrom] = useState(""),
    [to, setTo] = useState("");
  const [loading, setLoading] = useState(false),
    [message, setMessage] = useState<string | null>(null);
  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  useEffect(() => {
    void apiGet<Cashier[]>("/sales/cashiers").then(setCashiers).catch(() => setCashiers([]));
  }, []);
  useEffect(() => { if (!isSuperAdmin) setSalesBranchId(branchId); }, [branchId, isSuperAdmin]);
  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });
    if (salesBranchId) params.set("branchId", salesBranchId);
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (cashierId) params.set("cashierId", cashierId);
    if (from) params.set("from", `${from}T00:00:00.000Z`);
    if (to) params.set("to", `${to}T23:59:59.999Z`);
    try {
      setResult(
        await apiGet<{ data: Sale[]; meta: PageMeta }>(`/sales?${params}`),
      );
      setMessage(null);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to load sales.",
      );
    } finally {
      setLoading(false);
    }
  }, [cashierId, from, page, pageSize, salesBranchId, search, status, to]);
  useEffect(() => {
    const timer = setTimeout(() => void load(), 250);
    return () => clearTimeout(timer);
  }, [load]);
  useEffect(() => setPage(1), [salesBranchId, cashierId, search, status, from, to, pageSize]);
  const exportParams = new URLSearchParams();
  if (salesBranchId) exportParams.set("branchId", salesBranchId);
  if (from) exportParams.set("from", `${from}T00:00:00.000Z`);
  if (to) exportParams.set("to", `${to}T23:59:59.999Z`);
  if (cashierId) exportParams.set("cashierId", cashierId);
  function printSales() {
    const printable = window.open("", "_blank");
    if (!printable) return window.alert("Allow pop-ups to open the printable sales report.");
    const body = result.data.map((sale) => `<tr><td>${escapeHtml(sale.invoiceNumber)}</td><td>${escapeHtml(sale.customer ? `${sale.customer.firstName} ${sale.customer.lastName ?? ""}` : "Walk-in")}</td><td>${sale._count.items}</td><td>${Number(sale.total).toLocaleString()}</td><td>${Number(sale.paidTotal).toLocaleString()}</td><td>${Number(sale.balanceDue).toLocaleString()}</td><td>${escapeHtml(sale.status.replaceAll("_", " "))}</td></tr>`).join("");
    printable.document.write(`<!doctype html><html><head><title>TechNova Sales Report</title><style>@page{size:landscape;margin:12mm}body{font-family:Arial;color:#1D2939}h1{font-size:20px}p{font-size:11px;color:#667085}table{width:100%;border-collapse:collapse;font-size:10px}th,td{border:1px solid #E4E7EC;padding:7px;text-align:left}th{background:#E9F7F5;color:#0B6E63}</style></head><body><h1>TechNova Sales Report</h1><p>Page ${result.meta.page} · ${result.data.length} displayed rows · Printed ${escapeHtml(new Date().toLocaleString())}</p><table><thead><tr><th>Invoice</th><th>Customer</th><th>Items</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th></tr></thead><tbody>${body}</tbody></table><script>window.onload=()=>window.print()<\/script></body></html>`);
    printable.document.close();
  }
  return (
    <main className="space-y-5 bg-[#F8FAFC] p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#0E9384]">
          Transactions
        </p>
        <h1 className="text-2xl font-bold">Sales</h1>
        <p className="text-sm text-slate-500">
          Completed sales, payment balances and receipt details.
        </p>
        </div>
        <Link href="/pos" className="rounded-lg bg-[#0E9384] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0B6E63]">New POS sale</Link>
      </div>
      <section className={`grid items-end gap-4 rounded-2xl border border-[#E4E7EC] bg-white p-4 shadow-sm sm:grid-cols-2 ${isSuperAdmin ? "xl:grid-cols-8" : "xl:grid-cols-7"}`}>
        <label className="text-xs font-medium text-[#1D2939]">Search<div className="relative mt-1.5"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/><input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Invoice or customer"
          className="h-10 w-full rounded-lg border border-[#E4E7EC] pl-9 pr-3 text-xs focus:border-[#0E9384] focus:outline-none"
        /></div></label>
        <label className="text-xs font-medium text-[#1D2939]">Status<select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1.5 h-10 w-full rounded-lg border border-[#E4E7EC] px-3 text-xs focus:border-[#0E9384] focus:outline-none"
        >
          <option value="">All statuses</option>
          <option value="COMPLETED">Completed</option>
          <option value="PARTIALLY_REFUNDED">Partially refunded</option>
          <option value="REFUNDED">Refunded</option>
          <option value="VOIDED">Voided</option>
        </select></label>
        {isSuperAdmin && <label className="text-xs font-medium text-[#1D2939]">Branch<select value={salesBranchId} onChange={(event) => setSalesBranchId(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-[#E4E7EC] px-3 text-xs focus:border-[#0E9384] focus:outline-none"><option value="">All branches</option>{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></label>}
        <label className="text-xs font-medium text-[#1D2939]">Cashier<select
          value={cashierId}
          onChange={(e) => setCashierId(e.target.value)}
          className="mt-1.5 h-10 w-full rounded-lg border border-[#E4E7EC] px-3 text-xs focus:border-[#0E9384] focus:outline-none"
        >
          <option value="">All cashiers</option>
          {cashiers.map((cashier) => <option key={cashier.id} value={cashier.id}>{cashier.email}</option>)}
        </select></label>
        <label className="text-xs font-medium text-[#1D2939]">
          From
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="mt-1.5 h-10 w-full rounded-lg border border-[#E4E7EC] px-3 text-xs focus:border-[#0E9384] focus:outline-none"
          />
        </label>
        <label className="text-xs font-medium text-[#1D2939]">
          To
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="mt-1.5 h-10 w-full rounded-lg border border-[#E4E7EC] px-3 text-xs focus:border-[#0E9384] focus:outline-none"
          />
        </label>
        <button type="button" onClick={() => void load()} className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#0E9384] px-4 text-xs font-semibold text-white shadow-sm hover:bg-[#0B6E63]"><RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}/>Generate report</button>
        <button
          type="button"
          onClick={() => {
            setSearch("");
            setStatus("");
            setCashierId("");
            setFrom("");
            setTo("");
          }}
          className="h-10 rounded-lg border border-[#E4E7EC] bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50"
        >
          Clear filters
        </button>
      </section>
      {message && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {message}
        </p>
      )}
      <div className="overflow-hidden rounded-2xl border border-[#E4E7EC] bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E4E7EC] px-5 py-4"><div><h2 className="font-bold text-[#1D2939]">Sales Report</h2><p className="text-xs text-slate-400">{result.meta.total} matching transactions</p></div><div className="flex items-center gap-2"><button type="button" onClick={printSales} disabled={!result.data.length} title="Open PDF/print view" className="flex h-8 items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 text-[10px] font-semibold text-red-600 hover:bg-red-100 disabled:opacity-40"><FileText className="h-4 w-4"/>PDF</button><a href={`/api/backend/reports/sales.csv${exportParams.size ? `?${exportParams}` : ""}`} title="Export complete filtered CSV" className="flex h-8 items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-100"><FileSpreadsheet className="h-4 w-4"/>CSV</a><button type="button" onClick={printSales} disabled={!result.data.length} title="Print report" className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40"><Printer className="h-4 w-4"/></button></div></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F9FAFB] text-xs text-slate-600">
              <tr>
                <th className="px-4 py-3">Invoice</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Cashier</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Paid</th>
                <th className="px-4 py-3">Balance</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {result.data.map((sale) => (
                <tr key={sale.id} className="transition-colors hover:bg-teal-50/30">
                  <td className="px-4 py-3">
                    <Link
                      href={`/sales/${sale.id}`}
                      className="font-semibold text-[#0E9384]"
                    >
                      {sale.invoiceNumber}
                    </Link>
                    <p className="text-xs text-slate-500">
                      {sale.completedAt
                        ? new Date(sale.completedAt).toLocaleString()
                        : "Pending"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    {sale.customer
                      ? `${sale.customer.firstName} ${sale.customer.lastName ?? ""}`
                      : "Walk-in"}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{sale.createdBy.email}</td>
                  <td className="px-4 py-3">{sale._count.items}</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-[#1D2939]">LKR {Number(sale.total).toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-emerald-700">LKR {Number(sale.paidTotal).toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={Number(sale.balanceDue) > 0 ? "font-semibold text-amber-700" : "text-slate-500"}>LKR {Number(sale.balanceDue).toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${statusStyle[sale.status] ?? "bg-slate-50 text-slate-600 ring-slate-200"}`}>{sale.status.replaceAll("_", " ")}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <p className="p-6 text-center text-sm">Loading…</p>}
          {!loading && !result.data.length && (
            <p className="p-6 text-center text-sm text-slate-500">
              No sales match these filters.
            </p>
          )}
        </div>
        <PaginationControls
          meta={result.meta}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </main>
  );
}
