"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Minus, Plus, QrCode, Repeat2, Search } from "lucide-react";
import { useBranch } from "@/components/dashboard/BranchContext";
import { apiGet, apiPost } from "@/lib/api/client";
import PaginationControls, { type PageMeta } from "./PaginationControls";

type Stock = {
  id: string;
  quantityOnHand: string | number;
  quantityReserved: string | number;
  product: {
    id: string;
    sku: string;
    name: string;
    reorderLevel: string | number;
    trackSerials: boolean;
  };
  branch: { name: string };
};
type Movement = {
  id: string;
  type: string;
  quantity: string | number;
  reason: string | null;
  createdAt: string;
  product: { sku: string; name: string };
};
export default function InventoryOperations() {
  const { branchId, branch } = useBranch();
  const [stock, setStock] = useState<Stock[]>([]),
    [movements, setMovements] = useState<Movement[]>([]),
    [stockMeta, setStockMeta] = useState<PageMeta>({ page: 1, pageSize: 20, total: 0, pageCount: 0 }), [movementMeta, setMovementMeta] = useState<PageMeta>({ page: 1, pageSize: 20, total: 0, pageCount: 0 }),
    [stockPage, setStockPage] = useState(1), [movementPage, setMovementPage] = useState(1), [search, setSearch] = useState(""),
    [selected, setSelected] = useState(""),
    [direction, setDirection] = useState<"IN" | "OUT">("IN"),
    [quantity, setQuantity] = useState(1),
    [reason, setReason] = useState(""),
    [otherReason, setOtherReason] = useState(""),
    [message, setMessage] = useState<string | null>(null);
  const load = useCallback(async () => {
    if (!branchId) return;
    const common = `branchId=${encodeURIComponent(branchId)}&pageSize=20${search ? `&search=${encodeURIComponent(search)}` : ""}`;
    const [levels, history] = await Promise.all([
      apiGet<{ data: Stock[]; meta: PageMeta }>(`/inventory/stock?${common}&page=${stockPage}`),
      apiGet<{ data: Movement[]; meta: PageMeta }>(`/inventory/movements?${common}&page=${movementPage}`),
    ]);
    setStock(levels.data);
    setMovements(history.data);
    setStockMeta(levels.meta); setMovementMeta(history.meta);
  }, [branchId, movementPage, search, stockPage]);
  useEffect(() => {
    void load().catch((error) => setMessage(error.message));
  }, [load]);
  useEffect(() => { setStockPage(1); setMovementPage(1); }, [branchId, search]);
  async function adjust(event: React.FormEvent) {
    event.preventDefault();
    if (!branchId) return;
    try {
      await apiPost("/inventory/adjustments", {
        branchId,
        productId: selected,
        quantityDelta: direction === "IN" ? quantity : -quantity,
        reason: reason === "Other" ? otherReason.trim() : reason,
      });
      setMessage("Stock adjustment recorded.");
      setQuantity(1);
      setReason("");
      setOtherReason("");
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to adjust stock.",
      );
    }
  }
  const selectedStock = stock.find((item) => item.product.id === selected);
  const currentBalance = Number(selectedStock?.quantityOnHand ?? 0);
  const resultingBalance = direction === "IN" ? currentBalance + quantity : currentBalance - quantity;
  const reasonOptions = direction === "IN" ? ["Stock count correction", "Previously unrecorded stock", "Customer return restock", "Other"] : ["Damaged goods", "Expired goods", "Stock count correction", "Lost or stolen", "Internal use", "Other"];
  return (
    <main className="space-y-6 p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#0E9384]">
            {branch?.name ?? "Inventory"}
          </p>
          <h1 className="text-2xl font-bold">Inventory Control</h1>
          <p className="text-sm text-slate-500">
            Live stock, reservations and movement history.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/inventory/serialized"
            className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold"
          >
            <QrCode className="h-4 w-4" />
            Serialized units
          </Link>
          <Link
            href="/inventory/transfer"
            className="flex items-center gap-2 rounded-xl bg-[#0E9384] px-4 py-2 text-sm font-semibold text-white"
          >
            <Repeat2 className="h-4 w-4" />
            Transfers
          </Link>
        </div>
      </div>
      {message && (
        <div className="rounded-xl border border-teal-200 bg-teal-50 p-3 text-sm text-teal-800">
          {message}
        </div>
      )}
      <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Filter by product name or SKU" className="h-10 w-full rounded-xl border bg-white px-3 text-sm" />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="overflow-x-auto rounded-2xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">On hand</th>
                <th className="px-4 py-3">Reserved</th>
                <th className="px-4 py-3">Available</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stock.map((item) => {
                const onHand = Number(item.quantityOnHand),
                  reserved = Number(item.quantityReserved),
                  low = onHand <= Number(item.product.reorderLevel);
                return (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{item.product.name}</p>
                      <p className="text-xs text-slate-500">
                        {item.product.sku}
                        {item.product.trackSerials ? " · Serialized" : ""}
                      </p>
                    </td>
                    <td className="px-4 py-3">{onHand}</td>
                    <td className="px-4 py-3">{reserved}</td>
                    <td className="px-4 py-3 font-semibold">
                      {onHand - reserved}
                    </td>
                    <td
                      className={`px-4 py-3 font-semibold ${low ? "text-rose-600" : "text-emerald-600"}`}
                    >
                      {low ? "Low stock" : "Healthy"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <PaginationControls meta={stockMeta} onPageChange={setStockPage} />
        </section>
        <form
          onSubmit={adjust}
          className="h-fit overflow-hidden rounded-2xl border bg-white shadow-sm"
        >
          <div className="border-b bg-slate-50 px-5 py-4">
            <h2 className="font-bold">Adjust stock</h2>
            <p className="mt-1 text-xs text-slate-500">Correct physical stock without using negative numbers.</p>
          </div>
          <div className="space-y-4 p-5">
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => { setDirection("IN"); setReason(""); }} className={`flex items-center justify-center gap-2 rounded-xl border-2 px-3 py-3 text-sm font-bold transition ${direction === "IN" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-500"}`}><Plus className="h-5 w-5"/>Increase stock</button>
            <button type="button" onClick={() => { setDirection("OUT"); setReason(""); }} className={`flex items-center justify-center gap-2 rounded-xl border-2 px-3 py-3 text-sm font-bold transition ${direction === "OUT" ? "border-rose-500 bg-rose-50 text-rose-700" : "border-slate-200 text-slate-500"}`}><Minus className="h-5 w-5"/>Decrease stock</button>
          </div>
          <label className="block text-xs font-semibold">
            Product
            <div className="relative mt-1"><Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400"/>
            <select
              required
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="h-10 w-full appearance-none rounded-xl border py-0 pl-9 pr-3"
            >
              <option value="">Select product</option>
              {stock
                .filter((item) => !item.product.trackSerials)
                .map((item) => (
                  <option key={item.product.id} value={item.product.id}>
                    {item.product.sku} · {item.product.name}
                  </option>
                ))}
            </select>
            </div>
          </label>
          {selectedStock && <div className="rounded-xl border border-teal-100 bg-teal-50 p-3"><p className="text-xs text-slate-500">Selected product</p><p className="font-semibold">{selectedStock.product.name}</p><div className="mt-2 flex justify-between text-xs"><span>Current stock <b>{currentBalance}</b></span><span>Available <b>{currentBalance - Number(selectedStock.quantityReserved)}</b></span></div></div>}
          <label className="block text-xs font-semibold">Quantity to {direction === "IN" ? "add" : "remove"}<div className="mt-1 flex items-center rounded-xl border bg-white"><button type="button" onClick={() => setQuantity((value) => Math.max(0.001, value - 1))} className="h-10 w-11 border-r text-lg font-bold text-slate-500">−</button><input required type="number" min="0.001" max={direction === "OUT" ? currentBalance : undefined} step="0.001" value={quantity} onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))} className="h-10 min-w-0 flex-1 text-center font-bold outline-none"/><button type="button" onClick={() => setQuantity((value) => value + 1)} className="h-10 w-11 border-l text-lg font-bold text-slate-500">+</button></div></label>
          <label className="block text-xs font-semibold">
            Reason for adjustment
            <select
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 h-10 w-full rounded-xl border px-3 text-sm"
            ><option value="">Select a reason</option>{reasonOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select>
          </label>
          {reason === "Other" && <label className="block text-xs font-semibold">Explain the reason<textarea required value={otherReason} onChange={(event) => setOtherReason(event.target.value)} className="mt-1 min-h-20 w-full rounded-xl border p-3 text-sm" placeholder="Provide enough detail for the inventory audit trail."/></label>}
          <div className={`rounded-xl p-4 text-white ${direction === "IN" ? "bg-gradient-to-br from-[#087F6F] to-[#0E9384]" : "bg-gradient-to-br from-[#B42318] to-[#D92D20]"}`}><p className="text-[10px] uppercase tracking-wider text-white/70">Impact preview</p><div className="mt-2 flex items-end justify-between"><div><p className="text-xs text-white/70">Current</p><p className="text-xl font-bold">{currentBalance}</p></div><p className="pb-1 text-lg font-bold">{direction === "IN" ? "+" : "−"}{quantity || 0}</p><div className="text-right"><p className="text-xs text-white/70">New balance</p><p className="text-2xl font-bold">{resultingBalance}</p></div></div></div>
          {direction === "OUT" && resultingBalance < 0 && <p className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700">You cannot remove more than the current stock.</p>}
          <button disabled={!selected || !reason || (reason === "Other" && !otherReason.trim()) || quantity <= 0 || resultingBalance < 0} className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 ${direction === "IN" ? "bg-[#0E9384]" : "bg-rose-600"}`}>
            {direction === "IN" ? `Add ${quantity || 0} to stock` : `Remove ${quantity || 0} from stock`}
          </button>
          </div>
        </form>
      </div>
      <section className="overflow-x-auto rounded-2xl border bg-white">
        <div className="border-b px-5 py-4 font-bold">Recent movements</div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {movements.map((movement) => (
              <tr key={movement.id}>
                <td className="px-4 py-3">
                  {new Date(movement.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3">{movement.product.name}</td>
                <td className="px-4 py-3">
                  {movement.type.replaceAll("_", " ")}
                </td>
                <td className="px-4 py-3">{Number(movement.quantity)}</td>
                <td className="px-4 py-3">{movement.reason ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <PaginationControls meta={movementMeta} onPageChange={setMovementPage} />
      </section>
    </main>
  );
}
