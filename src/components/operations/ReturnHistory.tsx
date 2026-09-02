"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, FileDown, RotateCcw } from "lucide-react";
import { apiGet } from "@/lib/api/client";
type ReturnRecord = {
  id: string;
  returnNumber: string;
  status: string;
  reason: string;
  resolution: string;
  total: number | string;
  createdAt: string;
  sale: { invoiceNumber: string; customerId?: string | null };
  items: Array<{
    condition: string | null;
    quantity: number | string;
    saleItem?: { product?: { name: string } };
  }>;
  refundPayment?: { method: string } | null;
};
type Summary = {
  totalAmount: number;
  returnCount: number;
  returnRate: number;
  damagedItems: number;
  byResolution: Array<{ resolution: string; count: number; amount: number }>;
  byReason: Array<{ reason: string; count: number }>;
};
export default function ReturnHistory() {
  const [records, setRecords] = useState<ReturnRecord[]>([]),
    [summary, setSummary] = useState<Summary | null>(null),
    [search, setSearch] = useState(""),
    [resolution, setResolution] = useState("ALL"),
    [from, setFrom] = useState(""),
    [to, setTo] = useState(""),
    [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    void Promise.all([
      apiGet<{ data: ReturnRecord[] }>("/returns?pageSize=100"),
      apiGet<Summary>("/returns/summary"),
    ])
      .then(([r, s]) => {
        setRecords(r.data);
        setSummary(s);
      })
      .catch((e) =>
        setMessage(
          e instanceof Error ? e.message : "Unable to load return history.",
        ),
      );
  }, []);
  const filtered = useMemo(
    () =>
      records.filter((r) => {
        const date = new Date(r.createdAt);
        return (
          (!search ||
            `${r.returnNumber} ${r.sale.invoiceNumber} ${r.reason}`
              .toLowerCase()
              .includes(search.toLowerCase())) &&
          (resolution === "ALL" || r.resolution === resolution) &&
          (!from || date >= new Date(`${from}T00:00:00`)) &&
          (!to || date <= new Date(`${to}T23:59:59`))
        );
      }),
    [records, search, resolution, from, to],
  );
  function exportCsv() {
    const rows = [
      ["Return", "Invoice", "Date", "Reason", "Resolution", "Amount", "Status"],
      ...filtered.map((r) => [
        r.returnNumber,
        r.sale.invoiceNumber,
        new Date(r.createdAt).toISOString(),
        r.reason,
        r.resolution,
        String(r.total),
        r.status,
      ]),
    ];
    const blob = new Blob(
      [
        rows
          .map((row) =>
            row.map((value) => `"${value.replaceAll('"', '""')}"`).join(","),
          )
          .join("\n"),
      ],
      { type: "text/csv" },
    );
    const url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = "technova-return-history.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  const cards = [
    {
      label: "Total refunds / returns",
      value: `LKR ${(summary?.totalAmount ?? 0).toLocaleString()}`,
    },
    { label: "Total returns", value: summary?.returnCount ?? 0 },
    {
      label: "Return rate",
      value: `${(summary?.returnRate ?? 0).toFixed(1)}%`,
    },
    { label: "Damaged stock", value: summary?.damagedItems ?? 0 },
  ];
  return (
    <main className="space-y-6 bg-[#F8FAFC] p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[#0E9384]">
            Returns / History
          </p>
          <h1 className="text-2xl font-bold">Return History</h1>
          <p className="text-sm text-slate-500">
            Complete refund, store-credit, points and exchange audit trail.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/returns-refunds"
            className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold"
          >
            Process return
          </Link>
          <button
            onClick={exportCsv}
            className="flex items-center gap-2 rounded-xl bg-[#0E9384] px-4 py-2 text-sm font-semibold text-white"
          >
            <FileDown className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <article
            key={c.label}
            className="rounded-2xl bg-gradient-to-r from-[#025148] to-[#0E9384] p-5 text-white shadow"
          >
            <p className="text-xs uppercase text-white/70">{c.label}</p>
            <p className="mt-2 text-2xl font-bold">{c.value}</p>
          </article>
        ))}
      </div>
      {message && (
        <p className="rounded-xl bg-amber-50 p-3 text-amber-800">{message}</p>
      )}
      <section className="rounded-2xl border bg-white shadow-sm">
        <div className="grid gap-3 border-b p-4 md:grid-cols-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Return, invoice or reason"
            className="h-10 rounded-xl border px-3"
          />
          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="h-10 rounded-xl border px-3"
          >
            <option value="ALL">All resolutions</option>
            <option>ORIGINAL_METHOD</option>
            <option>STORE_CREDIT</option>
            <option>LOYALTY_POINTS</option>
            <option>PRODUCT_EXCHANGE</option>
          </select>
          <label className="relative">
            <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="h-10 w-full rounded-xl border pl-9 pr-2"
            />
          </label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="h-10 rounded-xl border px-3"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-4">Return</th>
                <th className="p-4">Invoice</th>
                <th className="p-4">Reason</th>
                <th className="p-4">Condition</th>
                <th className="p-4">Resolution</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-4">
                    <Link href={`/returns-refunds/${r.id}`} className="font-bold text-[#0E9384] hover:underline">{r.returnNumber}</Link>
                    <small className="block text-slate-500">
                      {new Date(r.createdAt).toLocaleString()}
                    </small>
                  </td>
                  <td className="p-4">{r.sale.invoiceNumber}</td>
                  <td className="p-4">{r.reason}</td>
                  <td className="p-4">
                    {Array.from(
                      new Set(r.items.map((i) => i.condition ?? "—")),
                    ).join(", ")}
                  </td>
                  <td className="p-4">
                    <span className="rounded-full bg-teal-50 px-2 py-1 text-xs text-teal-700">
                      {r.resolution.replaceAll("_", " ")}
                    </span>
                  </td>
                  <td className="p-4 font-semibold">
                    LKR {Number(r.total).toLocaleString()}
                  </td>
                  <td className="p-4">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filtered.length && (
          <div className="p-10 text-center text-slate-500">
            <RotateCcw className="mx-auto mb-2 h-7 w-7" />
            No matching returns.
          </div>
        )}
      </section>
    </main>
  );
}
