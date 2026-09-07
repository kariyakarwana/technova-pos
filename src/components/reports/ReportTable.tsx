"use client";

import { useEffect, useMemo, useState } from "react";
import { apiGet } from "@/lib/api/client";
import { useBranch } from "@/components/dashboard/BranchContext";
import ReportExportActions from "./ReportExportActions";

type FilterKind = "search" | "status" | "supplier" | "customer" | "product" | "role" | "resolution" | "amount";
type Option = { id: string; label: string };
type Paged<T> = { data: T[] };
type ApiNamed = { id: string; name: string; code?: string; sku?: string };
type ApiCustomer = { id: string; customerNumber: string; firstName: string; lastName?: string | null };
type Cashier = { id: string; email: string };

export default function ReportTable({
  title, endpoint, branchScoped = false, dateScoped = true, cashierScoped = false,
  filters = [], statusOptions = [], searchPlaceholder = "Search report",
}: {
  title: string; endpoint: string; branchScoped?: boolean; dateScoped?: boolean; cashierScoped?: boolean;
  filters?: FilterKind[]; statusOptions?: string[]; searchPlaceholder?: string;
}) {
  const { branchId } = useBranch();
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState<string | null>(null), [loading, setLoading] = useState(true);
  const [from, setFrom] = useState(() => new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10));
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [values, setValues] = useState<Record<string, string>>({});
  const [options, setOptions] = useState<Record<string, Option[]>>({});
  const filterSet = useMemo(() => new Set(filters), [filters]);
  const has = (kind: FilterKind) => filterSet.has(kind);
  const set = (key: string, value: string) => setValues((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    const loaders: Array<Promise<[string, Option[]]>> = [];
    if (cashierScoped) loaders.push(apiGet<Cashier[]>("/sales/cashiers").then((items) => ["cashierId", items.map((item) => ({ id: item.id, label: item.email }))]));
    if (filterSet.has("supplier")) loaders.push(apiGet<Paged<ApiNamed>>("/suppliers?pageSize=100").then((result) => ["supplierId", result.data.map((item) => ({ id: item.id, label: `${item.code ?? ""} ${item.name}`.trim() }))]));
    if (filterSet.has("customer")) loaders.push(apiGet<Paged<ApiCustomer>>("/customers?pageSize=100").then((result) => ["customerId", result.data.map((item) => ({ id: item.id, label: `${item.customerNumber} · ${item.firstName} ${item.lastName ?? ""}`.trim() }))]));
    if (filterSet.has("product")) loaders.push(apiGet<Paged<ApiNamed>>("/catalog/products?pageSize=100").then((result) => ["productId", result.data.map((item) => ({ id: item.id, label: `${item.sku ?? ""} · ${item.name}` }))]));
    if (filterSet.has("role")) loaders.push(apiGet<ApiNamed[]>("/roles").then((items) => ["roleId", items.map((item) => ({ id: item.id, label: item.name.replaceAll("_", " ") }))]));
    void Promise.all(loaders).then((entries) => setOptions(Object.fromEntries(entries))).catch(() => setError("Some filter options could not be loaded."));
  }, [cashierScoped, filterSet]);

  const params = useMemo(() => {
    const result = new URLSearchParams();
    if (branchScoped && branchId) result.set("branchId", branchId);
    if (dateScoped && from) result.set("from", new Date(`${from}T00:00:00`).toISOString());
    if (dateScoped && to) result.set("to", new Date(`${to}T23:59:59.999`).toISOString());
    Object.entries(values).forEach(([key, value]) => { if (value.trim()) result.set(key, value.trim()); });
    return result;
  }, [branchId, branchScoped, dateScoped, from, to, values]);

  useEffect(() => {
    let active = true;
    setLoading(true); setError(null);
    apiGet<Record<string, unknown>[]>(`${endpoint}?${params}`)
      .then((result) => { if (active) setRows(result); })
      .catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "Unable to load report."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [endpoint, params]);

  const columns = rows[0] ? Object.keys(rows[0]) : [];
  const serverCsvUrl = `/api/backend${endpoint}.csv${params.size ? `?${params}` : ""}`;
  const select = (key: string, label: string, items: Option[]) => <label className="text-xs font-semibold">{label}<select value={values[key] ?? ""} onChange={(event) => set(key, event.target.value)} className="mt-1 block h-10 min-w-48 rounded-xl border px-3"><option value="">All {label.toLowerCase()}</option>{items.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>;

  return <main className="space-y-6 p-6">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wider text-[#0E9384]">Reports</p><h1 className="text-2xl font-bold">{title}</h1><p className="text-xs text-slate-500">PDF, print and CSV use the complete database result for the selected filters.</p></div><ReportExportActions title={title} rows={rows} serverCsvUrl={serverCsvUrl}/></div>
    <section className="flex flex-wrap items-end gap-3 rounded-2xl border bg-white p-4">
      {has("search") && <label className="text-xs font-semibold">Search<input value={values.search ?? ""} onChange={(event) => set("search", event.target.value)} placeholder={searchPlaceholder} className="mt-1 block h-10 min-w-56 rounded-xl border px-3"/></label>}
      {dateScoped && <><label className="text-xs font-semibold">From<input type="date" value={from} max={to} onChange={(event) => setFrom(event.target.value)} className="mt-1 block h-10 rounded-xl border px-3"/></label><label className="text-xs font-semibold">To<input type="date" value={to} min={from} onChange={(event) => setTo(event.target.value)} className="mt-1 block h-10 rounded-xl border px-3"/></label></>}
      {cashierScoped && select("cashierId", "Cashiers", options.cashierId ?? [])}
      {has("supplier") && select("supplierId", "Suppliers", options.supplierId ?? [])}
      {has("customer") && select("customerId", "Customers", options.customerId ?? [])}
      {has("product") && select("productId", "Products", options.productId ?? [])}
      {has("role") && select("roleId", "Roles", options.roleId ?? [])}
      {has("status") && select("status", "Statuses", statusOptions.map((item) => ({ id: item, label: item.replaceAll("_", " ") })))}
      {has("resolution") && select("resolution", "Resolutions", ["ORIGINAL_METHOD", "STORE_CREDIT", "LOYALTY_POINTS", "PRODUCT_EXCHANGE"].map((item) => ({ id: item, label: item.replaceAll("_", " ") })))}
      {has("amount") && <><label className="text-xs font-semibold">Minimum amount<input type="number" min="0" step="0.01" value={values.minAmount ?? ""} onChange={(event) => set("minAmount", event.target.value)} className="mt-1 block h-10 w-40 rounded-xl border px-3"/></label><label className="text-xs font-semibold">Maximum amount<input type="number" min="0" step="0.01" value={values.maxAmount ?? ""} onChange={(event) => set("maxAmount", event.target.value)} className="mt-1 block h-10 w-40 rounded-xl border px-3"/></label></>}
      {branchScoped && <p className="pb-2 text-xs text-slate-500">Branch: controlled by the top navigation selector.</p>}
      <button type="button" onClick={() => { setValues({}); if (dateScoped) { setFrom(new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10)); setTo(new Date().toISOString().slice(0, 10)); } }} className="h-10 rounded-xl border px-4 text-sm font-semibold text-slate-600">Clear filters</button>
    </section>
    {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white"><table className="w-full text-left text-sm"><thead className="bg-slate-50"><tr>{columns.map((column) => <th key={column} className="whitespace-nowrap px-4 py-3 text-xs uppercase text-slate-500">{column.replaceAll(/([A-Z])/g, " $1")}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row, index) => <tr key={String(row.id ?? row.returnNumber ?? row.orderNumber ?? row.transferNumber ?? row.invoiceNumber ?? index)}>{columns.map((column) => <td key={column} className="whitespace-nowrap px-4 py-3">{typeof row[column] === "object" && row[column] !== null ? JSON.stringify(row[column]) : String(row[column] ?? "—")}</td>)}</tr>)}</tbody></table>{loading && <p className="p-8 text-center text-sm text-slate-500">Loading report…</p>}{!loading && !rows.length && !error && <p className="p-8 text-center text-sm text-slate-500">No data matches these filters.</p>}</div>
  </main>;
}
