"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronDown, ChevronUp, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { apiGet } from "@/lib/api/client";
import { useOfflineMode } from "@/components/dashboard/pos/OfflineContext";
import { OFFLINE_QUEUE_CHANGED, claimLegacySales, queuedSales, type OfflineSale } from "@/components/dashboard/pos/offlineSales";

type Operation = { id: string; clientOperationId: string; operationType: string; status: string; errorCode: string | null; errorMessage: string | null; response: unknown; payload?: { customerId?: string; items?: Array<unknown>; payments?: Array<{ amount: number }> } };
type Batch = { id: string; clientBatchId: string; deviceId: string; status: string; receivedAt: string; operations: Operation[] };
type Result = { data: Batch[]; meta: { page: number; total: number; pageCount: number } };

export default function OfflineSyncPage() {
  const { userId, isOffline, isChecking, isSyncing, queued, legacyQueued, syncRevision, syncMessage, retryConnection, syncNow } = useOfflineMode();
  const [result, setResult] = useState<Result>({ data: [], meta: { page: 1, total: 0, pageCount: 0 } });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState<OfflineSale[]>([]);

  const refreshLocal = useCallback(() => {
    try { setPending(queuedSales(userId).pending); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Unable to read saved sales."); }
  }, [userId]);
  const load = useCallback(async (target: number) => {
    if (isOffline) return;
    setLoading(true);
    try {
      setResult(await apiGet<Result>(`/offline-sync/batches?page=${target}&pageSize=20`));
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load batches.");
    } finally { setLoading(false); }
  }, [isOffline]);

  useEffect(() => {
    refreshLocal();
    window.addEventListener(OFFLINE_QUEUE_CHANGED, refreshLocal);
    window.addEventListener("storage", refreshLocal);
    return () => {
      window.removeEventListener(OFFLINE_QUEUE_CHANGED, refreshLocal);
      window.removeEventListener("storage", refreshLocal);
    };
  }, [refreshLocal]);
  useEffect(() => { void load(page); }, [load, page, syncRevision]);

  async function inspect(batch: Batch) {
    if (expanded === batch.id) { setExpanded(""); return; }
    try {
      const detail = await apiGet<Batch>(`/offline-sync/batches/${batch.id}`);
      setResult((current) => ({ ...current, data: current.data.map((row) => row.id === detail.id ? detail : row) }));
      setExpanded(batch.id);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to load batch details."); }
  }

  return <main className="space-y-6 p-6">
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-semibold uppercase text-[#0E9384]">Resilient POS</p><h1 className="text-2xl font-bold">Offline Synchronization</h1><p className="text-sm text-slate-500">Queued sales synchronize automatically when the API reconnects. Review applied and rejected sales below.</p></div>
      <div className="flex gap-2">
        {queued > 0 && <button type="button" onClick={() => void syncNow()} disabled={isOffline || isSyncing} className="rounded-xl bg-[#0E9384] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{isSyncing ? "Synchronizing…" : `Synchronize ${queued}`}</button>}
        <button type="button" onClick={async () => { if (await retryConnection()) await load(page); refreshLocal(); }} disabled={isChecking} className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold"><RefreshCw className={`h-4 w-4 ${isChecking ? "animate-spin" : ""}`} />Refresh</button>
      </div>
    </header>
    {(message || syncMessage) && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">{message || syncMessage}</p>}
    {legacyQueued > 0 && <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"><p>{legacyQueued} sale(s) were saved by the previous offline version without an account identifier. They were not automatically submitted under this account.</p><button type="button" className="mt-2 font-semibold underline" onClick={() => { if (window.confirm("Only continue if you created these older sales on this device. They will be linked to your account and submitted when connected. Continue?")) { claimLegacySales(userId); refreshLocal(); if (!isOffline) void syncNow(); } }}>I created these sales — link them to my account</button></div>}
    <div className={`flex items-center gap-3 rounded-2xl border p-4 ${isOffline ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-800"}`}>
      {isOffline ? <WifiOff /> : <Wifi />}<div><p className="font-semibold">{isOffline ? "This device is offline" : "Connected to TechNova API"}</p><p className="text-xs">{queued} sale(s) waiting on this device. {isOffline ? "Server history is unavailable until reconnecting." : "Automatic synchronization is enabled."}</p></div>
    </div>
    <section className="rounded-2xl border bg-white p-4">
      <h2 className="font-semibold">Waiting on this device ({pending.length})</h2>
      {!pending.length ? <p className="mt-3 text-sm text-slate-500">No sales are waiting for synchronization.</p> : <div className="mt-3 space-y-2">{pending.map((sale) => <article key={sale.clientOperationId} className="flex flex-wrap justify-between gap-2 rounded-xl border p-3 text-sm"><div><p className="font-semibold">{sale.summary?.customer ?? (sale.payload.customerId ? `Customer ${sale.payload.customerId}` : "Walk-in Customer")}</p><p className="text-xs text-slate-500">{new Date(sale.clientTimestamp).toLocaleString()} · {sale.summary?.items ?? sale.payload.items.length} item(s)</p><p className="font-mono text-[11px] text-slate-400">{sale.clientOperationId}</p></div><div className="text-right"><p className="font-semibold">{sale.summary ? `LKR ${sale.summary.total.toLocaleString()}` : "Amount unavailable"}</p><p className="text-xs text-amber-700">Pending server confirmation</p></div></article>)}</div>}
    </section>
    <section className="overflow-hidden rounded-2xl border bg-white"><h2 className="p-4 font-semibold">Server batch history</h2><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-4">Received</th><th className="p-4">Device</th><th className="p-4">Batch</th><th className="p-4">Operations</th><th className="p-4">Status</th><th /></tr></thead><tbody>{result.data.map((batch) => <BatchRows key={batch.id} batch={batch} open={expanded === batch.id} onToggle={() => void inspect(batch)} />)}</tbody></table></div>{loading && <p className="p-8 text-center">Loading…</p>}{!loading && !result.data.length && <p className="p-8 text-center text-sm text-slate-500">No batches yet.</p>}<div className="flex justify-between border-t p-4 text-sm"><span>{result.meta.total} batches</span><div className="flex gap-2"><button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="rounded-lg border px-3 py-1 disabled:opacity-40">Previous</button><span>{page} / {Math.max(1, result.meta.pageCount)}</span><button type="button" disabled={page >= result.meta.pageCount} onClick={() => setPage((value) => value + 1)} className="rounded-lg border px-3 py-1 disabled:opacity-40">Next</button></div></div></section>
  </main>;
}

function BatchRows({ batch, open, onToggle }: { batch: Batch; open: boolean; onToggle: () => void }) {
  return <><tr className="border-t"><td className="p-4">{new Date(batch.receivedAt).toLocaleString()}</td><td className="p-4">{batch.deviceId}</td><td className="p-4 font-mono text-xs">{batch.clientBatchId}</td><td className="p-4">{batch.operations.length}</td><td className="p-4 font-semibold">{batch.status.replaceAll("_", " ")}</td><td className="p-4"><button type="button" onClick={onToggle} className="text-[#0E9384]" aria-label="Show batch details">{open ? <ChevronUp /> : <ChevronDown />}</button></td></tr>{open && <tr><td colSpan={6} className="bg-slate-50 p-5"><div className="space-y-3">{batch.operations.map((operation) => <article key={operation.id} className="rounded-xl border bg-white p-4"><div className="flex justify-between"><div><p className="font-semibold">{operation.operationType}</p><p className="font-mono text-xs text-slate-500">{operation.clientOperationId}</p></div><strong className={operation.status === "APPLIED" ? "text-emerald-700" : "text-rose-700"}>{operation.status}</strong></div><p className="mt-2 text-xs text-slate-600">{operation.payload?.customerId ? `Registered customer: ${operation.payload.customerId}` : "Walk-in customer"} · {operation.payload?.items?.length ?? 0} item(s) · Cash received: LKR {(operation.payload?.payments ?? []).reduce((sum, payment) => sum + Number(payment.amount || 0), 0).toLocaleString()}</p>{operation.errorMessage && <p className="mt-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{operation.errorCode}: {operation.errorMessage}</p>}{operation.response != null && <pre className="mt-3 max-h-40 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-white">{JSON.stringify(operation.response, null, 2)}</pre>}</article>)}</div></td></tr>}</>;
}
