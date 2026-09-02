"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api/client";
import { useBranch } from "@/components/dashboard/BranchContext";
import ReportExportActions from "./ReportExportActions";

export default function ReportTable({ title, endpoint, branchScoped = false, dateScoped = true }: { title: string; endpoint: string; branchScoped?: boolean; dateScoped?: boolean }) {
  const { branchId } = useBranch();
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState(() => new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10));
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));
  useEffect(() => {
    let active = true;
    setLoading(true); setError(null);
    const params = new URLSearchParams();
    if (branchScoped && branchId) params.set("branchId", branchId);
    if (dateScoped && from) params.set("from", new Date(`${from}T00:00:00`).toISOString());
    if (dateScoped && to) params.set("to", new Date(`${to}T23:59:59.999`).toISOString());
    apiGet<Record<string, unknown>[]>(`${endpoint}?${params}`)
      .then((result) => { if (active) setRows(result); })
      .catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "Unable to load report."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [endpoint, branchId, branchScoped, dateScoped, from, to]);
  const columns = rows[0] ? Object.keys(rows[0]) : [];
  const exportParams = new URLSearchParams();
  if (branchScoped && branchId) exportParams.set("branchId", branchId);
  if (dateScoped && from) exportParams.set("from", new Date(`${from}T00:00:00`).toISOString());
  if (dateScoped && to) exportParams.set("to", new Date(`${to}T23:59:59.999`).toISOString());
  const serverCsvUrl = `/api/backend${endpoint}.csv${exportParams.size ? `?${exportParams}` : ""}`;
  return <main className="space-y-6 p-6">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wider text-[#0E9384]">Reports</p><h1 className="text-2xl font-bold">{title}</h1><p className="text-xs text-slate-500">Exports contain the complete database result for the selected filters.</p></div><ReportExportActions title={title} rows={rows} serverCsvUrl={serverCsvUrl} /></div>
    {dateScoped && <section className="flex flex-wrap items-end gap-3 rounded-2xl border bg-white p-4"><label className="text-xs font-semibold">From<input type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="mt-1 block h-10 rounded-xl border px-3" /></label><label className="text-xs font-semibold">To<input type="date" value={to} min={from} onChange={(event) => setTo(event.target.value)} className="mt-1 block h-10 rounded-xl border px-3" /></label>{branchScoped && <p className="pb-2 text-xs text-slate-500">The branch selector in the top navigation controls this report.</p>}</section>}
    {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white"><table className="w-full text-left text-sm"><thead className="bg-slate-50"><tr>{columns.map((column) => <th key={column} className="whitespace-nowrap px-4 py-3 text-xs uppercase text-slate-500">{column.replaceAll(/([A-Z])/g, " $1")}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row, index) => <tr key={String(row.id ?? row.agreementId ?? row.invoiceNumber ?? index)}>{columns.map((column) => <td key={column} className="whitespace-nowrap px-4 py-3">{typeof row[column] === "object" ? JSON.stringify(row[column]) : String(row[column] ?? "—")}</td>)}</tr>)}</tbody></table>{loading && <p className="p-8 text-center text-sm text-slate-500">Loading report…</p>}{!loading && rows.length === 0 && !error && <p className="p-8 text-center text-sm text-slate-500">No data for this report.</p>}</div>
  </main>;
}
