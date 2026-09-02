"use client";

import { Download, Printer } from "lucide-react";

type Row = Record<string, unknown>;
const label = (key: string) => key.replaceAll(/([A-Z])/g, " $1").replaceAll("_", " ").trim();
const value = (input: unknown) => input && typeof input === "object" ? JSON.stringify(input) : String(input ?? "");
const escapeHtml = (input: unknown) => value(input).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
const fileName = (title: string) => title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function ReportExportActions({ title, rows, serverCsvUrl }: { title: string; rows: Row[]; serverCsvUrl?: string }) {
  const columns = rows[0] ? Object.keys(rows[0]) : [];
  function exportCsv() {
    const csv = [columns.map(label), ...rows.map((row) => columns.map((column) => value(row[column])))]
      .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = `${fileName(title)}-${new Date().toISOString().slice(0, 10)}.csv`; anchor.click();
    URL.revokeObjectURL(url);
  }
  function printPdf() {
    const report = window.open("", "_blank");
    if (!report) return window.alert("Allow pop-ups to open the printable report.");
    report.opener = null;
    const headings = columns.map((column) => `<th>${escapeHtml(label(column))}</th>`).join("");
    const body = rows.map((row) => `<tr>${columns.map((column) => `<td>${escapeHtml(row[column])}</td>`).join("")}</tr>`).join("");
    report.document.write(`<!doctype html><html><head><title>${escapeHtml(title)}</title><style>@page{size:landscape;margin:12mm}body{font-family:Arial,sans-serif;color:#172033}h1{font-size:20px;margin:0 0 4px}p{font-size:11px;color:#64748b;margin:0 0 16px}table{width:100%;border-collapse:collapse;font-size:10px}th,td{border:1px solid #cbd5e1;padding:6px;text-align:left;vertical-align:top}th{background:#e6f4f2;text-transform:uppercase}tr:nth-child(even){background:#f8fafc}</style></head><body><h1>TechNova — ${escapeHtml(title)}</h1><p>Generated ${escapeHtml(new Date().toLocaleString())} · ${rows.length} records</p><table><thead><tr>${headings}</tr></thead><tbody>${body}</tbody></table><script>window.onload=()=>window.print()<\/script></body></html>`);
    report.document.close();
  }
  return <div className="flex flex-wrap gap-2">{serverCsvUrl ? <a href={serverCsvUrl} className="inline-flex items-center gap-2 rounded-xl border border-[#0E9384] px-4 py-2.5 text-sm font-semibold text-[#0E9384]"><Download className="h-4 w-4" />Export full CSV</a> : <button type="button" onClick={exportCsv} disabled={!rows.length} className="inline-flex items-center gap-2 rounded-xl border border-[#0E9384] px-4 py-2.5 text-sm font-semibold text-[#0E9384] disabled:opacity-40"><Download className="h-4 w-4" />Export CSV</button>}<button type="button" onClick={printPdf} disabled={!rows.length} className="inline-flex items-center gap-2 rounded-xl bg-[#0E9384] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"><Printer className="h-4 w-4" />Print / Save PDF</button></div>;
}
