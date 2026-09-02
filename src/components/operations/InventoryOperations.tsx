"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Plus, QrCode, Repeat2 } from "lucide-react";
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
    [delta, setDelta] = useState(0),
    [reason, setReason] = useState(""),
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
        quantityDelta: delta,
        reason,
      });
      setMessage("Stock adjustment recorded.");
      setDelta(0);
      setReason("");
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to adjust stock.",
      );
    }
  }
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
          className="h-fit space-y-4 rounded-2xl border bg-white p-5"
        >
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-[#0E9384]" />
            <h2 className="font-bold">Stock adjustment</h2>
          </div>
          <label className="block text-xs font-semibold">
            Non-serialized product
            <select
              required
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="mt-1 h-10 w-full rounded-xl border px-3"
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
          </label>
          <label className="block text-xs font-semibold">
            Quantity change
            <input
              required
              type="number"
              step="0.001"
              value={delta}
              onChange={(e) => setDelta(Number(e.target.value))}
              className="mt-1 h-10 w-full rounded-xl border px-3"
            />
          </label>
          <label className="block text-xs font-semibold">
            Reason
            <textarea
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 min-h-20 w-full rounded-xl border p-3 text-sm"
            />
          </label>
          <button className="w-full rounded-xl bg-[#0E9384] px-4 py-2.5 text-sm font-semibold text-white">
            Record adjustment
          </button>
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
