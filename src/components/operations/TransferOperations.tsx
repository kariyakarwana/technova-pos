"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, PackageCheck, Plus, Trash2, Truck } from "lucide-react";
import { toast } from "sonner";
import { BackButton } from "@/components/ui/back-button";
import { useBranch } from "@/components/dashboard/BranchContext";
import { apiGet, apiPost } from "@/lib/api/client";
import { useOfflineMode } from "@/components/dashboard/pos/OfflineContext";
import PaginationControls, { type PageMeta } from "./PaginationControls";
import { availableStock, validateTransferLines, type TransferLine } from "./transfer-validation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Transfer = { id: string; transferNumber: string; status: string; createdAt: string; dispatchedAt: string | null; receivedAt: string | null; sourceBranchId: string; destinationBranchId: string; sourceBranch: { id: string; name: string }; destinationBranch: { id: string; name: string }; _count: { items: number } };
type Product = { id: string; sku: string; name: string; trackSerials: boolean; stockLevels: Array<{ quantityOnHand: string | number; quantityReserved: string | number }> };
type Line = TransferLine;
const initialMeta: PageMeta = { page: 1, pageSize: 20, total: 0, pageCount: 0 };
const statusTone: Record<string, string> = { SUBMITTED: "bg-amber-50 text-amber-700", IN_TRANSIT: "bg-blue-50 text-blue-700", RECEIVED: "bg-emerald-50 text-emerald-700", CANCELLED: "bg-rose-50 text-rose-700", DRAFT: "bg-slate-100 text-slate-600" };

export default function TransferOperations() {
  const { branches, branchId, branch } = useBranch();
  const { isOffline, isChecking, retryConnection } = useOfflineMode();
  const [transfers, setTransfers] = useState<Transfer[]>([]), [products, setProducts] = useState<Product[]>([]), [meta, setMeta] = useState<PageMeta>(initialMeta);
  const [page, setPage] = useState(1), [pageSize, setPageSize] = useState(20), [direction, setDirection] = useState("ALL"), [status, setStatus] = useState("");
  const [open, setOpen] = useState(false), [destination, setDestination] = useState(""), [lines, setLines] = useState<Line[]>([{ productId: "", quantity: 1 }]), [notes, setNotes] = useState("");
  const [catalogLoaded, setCatalogLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const stockError = lines.some((line) => {
    const product = products.find((item) => item.id === line.productId);
    return product && line.quantity > availableStock(product);
  });
  const resetForm = () => {
    setDestination("");
    setLines([{ productId: "", quantity: 1 }]);
    setNotes("");
  };
  const closeForm = () => {
    resetForm();
    setOpen(false);
  };
  const load = useCallback(async () => {
    setCatalogLoaded(false);
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize), direction });
    if (branchId) params.set("branchId", branchId); if (status) params.set("status", status);
    const [transferResult, productResult] = await Promise.all([apiGet<{ data: Transfer[]; meta: PageMeta }>(`/inventory/transfers?${params}`), branchId ? apiGet<{ data: Product[] }>(`/catalog/products?pageSize=100&status=ACTIVE&branchId=${encodeURIComponent(branchId)}`) : Promise.resolve({ data: [] })]);
    setTransfers(transferResult.data); setMeta(transferResult.meta); setProducts(productResult.data);
    setCatalogLoaded(Boolean(branchId));
  }, [branchId, direction, page, pageSize, status]);

  useEffect(() => {
    if (isOffline) {
      setCatalogLoaded(false);
      return;
    }
    void load().catch((error) => {
      setCatalogLoaded(false);
      toast.error(error instanceof Error ? error.message : "Unable to load transfers.", { duration: 8000 });
    });
  }, [isOffline, load]);
  useEffect(() => setPage(1), [branchId, direction, pageSize, status]);
  const counts = useMemo(() => ({ transit: transfers.filter((item) => item.status === "IN_TRANSIT").length, incoming: transfers.filter((item) => item.destinationBranchId === branchId && item.status !== "RECEIVED").length, received: transfers.filter((item) => item.status === "RECEIVED").length }), [branchId, transfers]);
  async function create(event: React.FormEvent) {
    event.preventDefault();
    if (!branchId || isSubmitting) return;
    if (!destination) {
      toast.error("Select a destination branch.", { duration: 8000 });
      return;
    }
    const validationError = validateTransferLines(lines, products);
    if (validationError) {
      toast.error(validationError, { duration: 8000 });
      return;
    }
    if (isOffline || !navigator.onLine || !catalogLoaded) {
      toast.error("Disconnected from TechNova API. Reconnect before submitting a transfer.", { duration: 8000 });
      return;
    }
    setIsSubmitting(true);
    try {
      if (!(await retryConnection())) {
        toast.error("Disconnected from TechNova API. Reconnect before submitting a transfer.", { duration: 8000 });
        return;
      }
      await apiPost("/inventory/transfers", {
        sourceBranchId: branchId,
        destinationBranchId: destination,
        notes: notes || undefined,
        items: lines,
      });
      closeForm();
      toast.success("Transfer submitted. Dispatch it when the goods leave the source branch.", { duration: 5000 });
      try {
        await load();
      } catch {
        toast.warning("Transfer submitted, but the list could not refresh. Reconnect and reload the page to see it.", { duration: 5000 });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create transfer.", { duration: 8000 });
    } finally {
      setIsSubmitting(false);
    }
  }
  return <main className="space-y-5 bg-[#F8FAFC] p-6">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wider text-[#0E9384]">Inventory · {branch?.name ?? "Select branch"}</p><h1 className="text-2xl font-bold">Stock Transfers</h1><p className="text-sm text-slate-500">Track outgoing and incoming goods from submission through destination receipt.</p></div><div className="flex items-center gap-3"><button disabled={!branchId} onClick={() => setOpen(true)} className="flex items-center gap-2 rounded-xl bg-[#0E9384] px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"><Plus className="h-4 w-4"/>Create transfer</button><BackButton href="/inventory" label="Back to Inventory" /></div></div>
    <div className="grid gap-3 sm:grid-cols-3">{[["In transit", counts.transit, Truck], ["Incoming action", counts.incoming, ArrowDownToLine], ["Received on page", counts.received, PackageCheck]].map(([label, value, Icon]) => { const CardIcon = Icon as typeof Truck; return <article key={String(label)} className="rounded-2xl border bg-white p-4"><CardIcon className="h-5 w-5 text-[#0E9384]"/><p className="mt-3 text-xs text-slate-500">{String(label)}</p><p className="text-2xl font-bold">{String(value)}</p></article>; })}</div>
    <section className="overflow-hidden rounded-2xl border bg-white"><div className="flex flex-wrap items-center justify-between gap-3 border-b p-4"><div className="flex gap-2">{[["ALL", "All"], ["OUTGOING", "Outgoing"], ["INCOMING", "Incoming"]].map(([value, label]) => <button type="button" key={value} onClick={() => setDirection(value)} className={`rounded-lg px-3 py-2 text-xs font-semibold ${direction === value ? "bg-[#025148] text-white" : "border text-slate-600"}`}>{label}</button>)}</div><Select value={status || "all"} onValueChange={(val) => setStatus(val === "all" ? "" : val)}><SelectTrigger className="h-9 data-[size=default]:h-9 w-40 rounded-lg border px-3 text-xs bg-white"><SelectValue placeholder="All statuses" /></SelectTrigger><SelectContent className="max-h-72"><SelectItem value="all" className="text-xs hover:bg-[#F4FBF9] hover:text-[#0E9384] cursor-pointer">All statuses</SelectItem><SelectItem value="SUBMITTED" className="text-xs hover:bg-[#F4FBF9] hover:text-[#0E9384] cursor-pointer">Awaiting dispatch</SelectItem><SelectItem value="IN_TRANSIT" className="text-xs hover:bg-[#F4FBF9] hover:text-[#0E9384] cursor-pointer">In transit</SelectItem><SelectItem value="RECEIVED" className="text-xs hover:bg-[#F4FBF9] hover:text-[#0E9384] cursor-pointer">Received</SelectItem><SelectItem value="CANCELLED" className="text-xs hover:bg-[#F4FBF9] hover:text-[#0E9384] cursor-pointer">Cancelled</SelectItem></SelectContent></Select></div>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-4">Transfer</th><th className="p-4">Direction</th><th className="p-4">Route</th><th className="p-4">Items</th><th className="p-4">Status</th><th className="p-4">Last update</th><th className="p-4 text-right">Action</th></tr></thead><tbody>{transfers.map((transfer) => { const incoming = transfer.destinationBranchId === branchId; const activity = transfer.receivedAt ?? transfer.dispatchedAt ?? transfer.createdAt; return <tr key={transfer.id} className="border-t hover:bg-teal-50/30"><td className="p-4 font-semibold text-[#0E9384]">{transfer.transferNumber}</td><td className="p-4"><span className={`inline-flex items-center gap-1 text-xs font-semibold ${incoming ? "text-blue-700" : "text-amber-700"}`}>{incoming ? <ArrowDownToLine className="h-4 w-4"/> : <ArrowUpFromLine className="h-4 w-4"/>}{incoming ? "Incoming" : "Outgoing"}</span></td><td className="p-4">{transfer.sourceBranch.name} → {transfer.destinationBranch.name}</td><td className="p-4">{transfer._count.items}</td><td className="p-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone[transfer.status] ?? statusTone.DRAFT}`}>{transfer.status.replaceAll("_", " ")}</span></td><td className="p-4 text-xs text-slate-500">{new Date(activity).toLocaleString()}</td><td className="p-4 text-right"><Link href={`/inventory/transfer/${transfer.id}`} className="font-semibold text-[#0E9384]">View & update</Link></td></tr>; })}</tbody></table>{!transfers.length && <p className="p-8 text-center text-sm text-slate-500">No transfers match this view.</p>}</div><PaginationControls meta={meta} onPageChange={setPage} onPageSizeChange={setPageSize}/>
    </section>
    {open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
        <form onSubmit={create} className="max-h-[90vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-2xl bg-white p-6">
          <div><h2 className="text-lg font-bold">Create stock transfer</h2><p className="text-xs text-slate-500">Source: {branch?.name}</p></div>
          {(isOffline || !catalogLoaded) && (
            <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              Disconnected from TechNova API. Transfers require a connection. Reconnect before submitting.
              <button type="button" className="ml-2 font-semibold underline" onClick={() => { void retryConnection().then((online) => { if (online) void load().catch(() => toast.error("Unable to load current stock. Try again.", { duration: 8000 })); }); }}>Retry connection</button>
            </div>
          )}
          <label className="block text-sm font-semibold">Destination branch
            <Select value={destination || "none"} onValueChange={(val) => setDestination(val === "none" ? "" : val)}>
              <SelectTrigger className="mt-1 h-10 data-[size=default]:h-10 w-full rounded-xl border bg-white px-3 text-sm"><SelectValue placeholder="Select branch" /></SelectTrigger>
              <SelectContent className="z-50 max-h-72"><SelectItem value="none">Select branch</SelectItem>{branches.filter((item) => item.id !== branchId).map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent>
            </Select>
          </label>
          <div className="space-y-2">
            <div className="flex justify-between"><p className="text-sm font-semibold">Transfer items</p><button type="button" onClick={() => setLines((current) => [...current, { productId: "", quantity: 1 }])} className="text-xs font-semibold text-[#0E9384]">+ Add item</button></div>
            {lines.map((line, index) => {
              const product = products.find((item) => item.id === line.productId);
              const available = product ? availableStock(product) : 0;
              const exceedsStock = Boolean(product && line.quantity > available);
              return <div key={index} className="grid grid-cols-[minmax(0,1fr)_120px_36px] items-end gap-2 rounded-xl border p-3">
                <div className="min-w-0">
                  <span className="block text-xs font-semibold leading-5 text-slate-700">Product</span>
                  <Select value={line.productId || "none"} onValueChange={(val) => setLines((current) => current.map((item, position) => position === index ? { ...item, productId: val === "none" ? "" : val } : item))}>
                    <SelectTrigger aria-label="Product" className="mt-1 h-10 data-[size=default]:h-10 w-full min-w-0 rounded-lg border bg-white px-3 text-sm"><SelectValue placeholder="Select product" /></SelectTrigger>
                    <SelectContent className="z-50 max-h-72"><SelectItem value="none">Select product</SelectItem>{products.map((item) => <SelectItem key={item.id} value={item.id}>{item.sku} · {item.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <label className="block text-xs font-semibold leading-5 text-slate-700">Quantity
                  <input required type="number" min="1" max={product ? Math.floor(available) : undefined} step="1" value={line.quantity} onChange={(event) => setLines((current) => current.map((item, position) => position === index ? { ...item, quantity: Number(event.target.value) } : item))} aria-invalid={exceedsStock || !Number.isInteger(line.quantity)} className="mt-1 h-10 w-full rounded-lg border px-2 text-sm" />
                </label>
                <button type="button" aria-label="Remove item" disabled={lines.length === 1} onClick={() => setLines((current) => current.filter((_, position) => position !== index))} className="self-end py-3 text-rose-600 disabled:opacity-30"><Trash2 className="h-4 w-4" /></button>
                {product && <p className={`col-span-3 text-xs ${exceedsStock ? "text-rose-700" : "text-slate-500"}`}>{exceedsStock ? "Quantity cannot exceed available stock at source. " : ""}Available at source: {available}{product.trackSerials ? " · serial numbers will be selected during dispatch" : ""}</p>}
              </div>;
            })}
          </div>
          <label className="block text-sm font-semibold">Transfer reason <span className="font-normal text-slate-400">(optional)</span><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Example: Replenish low stock at another branch" maxLength={500} className="mt-1 min-h-20 w-full rounded-xl border p-3" /><span className="mt-1 block text-xs font-normal text-slate-500">Shown in source and destination movement history.</span></label>
          <div className="flex justify-end gap-3"><button type="button" onClick={closeForm} className="rounded-xl border px-4 py-2">Cancel</button><button disabled={isOffline || isChecking || !catalogLoaded || isSubmitting || stockError} className="rounded-xl bg-[#0E9384] px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? "Submitting..." : "Create & submit"}</button></div>
        </form>
      </div>
    )}
  </main>;
}
