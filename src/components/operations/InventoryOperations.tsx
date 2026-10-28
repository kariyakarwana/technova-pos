"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Minus, Plus, QrCode, Repeat2, Search } from "lucide-react";
import { toast } from "sonner";
import { useBranch } from "@/components/dashboard/BranchContext";
import { apiGet, apiPost } from "@/lib/api/client";
import PaginationControls, { type PageMeta } from "./PaginationControls";
import { calculateBalance, formatQuantity, normalizeQuantity, stepQuantity } from "./inventory-quantity";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
type Product = {
  id: string;
  sku: string;
  name: string;
  trackSerials: boolean;
  stockLevels: Array<{ quantityOnHand: string | number; quantityReserved: string | number }>;
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
    [products, setProducts] = useState<Product[]>([]),
    [productsLoading, setProductsLoading] = useState(false),
    [movements, setMovements] = useState<Movement[]>([]),
    [stockMeta, setStockMeta] = useState<PageMeta>({ page: 1, pageSize: 20, total: 0, pageCount: 0 }), [movementMeta, setMovementMeta] = useState<PageMeta>({ page: 1, pageSize: 20, total: 0, pageCount: 0 }),
    [stockPage, setStockPage] = useState(1), [movementPage, setMovementPage] = useState(1), [search, setSearch] = useState(""),
    [selected, setSelected] = useState(""),
    [direction, setDirection] = useState<"IN" | "OUT">("IN"),
    [quantity, setQuantity] = useState(1),
    [reason, setReason] = useState(""),
    [otherReason, setOtherReason] = useState("");
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
  const loadProducts = useCallback(async () => {
    if (!branchId) {
      setProducts([]);
      return;
    }
    setProductsLoading(true);
    try {
      const all: Product[] = [];
      let page = 1;
      let pageCount = 1;
      do {
        const result = await apiGet<{ data: Product[]; meta: PageMeta }>(
          `/catalog/products?branchId=${encodeURIComponent(branchId)}&status=ACTIVE&pageSize=100&page=${page}`,
        );
        all.push(...result.data);
        pageCount = result.meta.pageCount;
        page += 1;
      } while (page <= pageCount);
      setProducts(all.filter((product) => !product.trackSerials));
    } finally {
      setProductsLoading(false);
    }
  }, [branchId]);
  useEffect(() => {
    void load().catch((error) => toast.error(error.message, { duration: 8000 }));
  }, [load]);
  useEffect(() => {
    setSelected("");
    setProducts([]);
    void loadProducts().catch((error) => toast.error(error instanceof Error ? error.message : "Unable to load adjustment products.", { duration: 8000 }));
  }, [loadProducts]);
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
      toast.success("Stock adjustment recorded.", { duration: 5000 });
      setSelected("");
      setQuantity(1);
      setReason("");
      setOtherReason("");
      try {
        await Promise.all([load(), loadProducts()]);
      } catch {
        toast.warning("Stock adjustment recorded, but the inventory could not refresh. Reload the page to see the latest balance.", { duration: 5000 });
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to adjust stock.",
        { duration: 8000 },
      );
    }
  }
  const selectedProduct = products.find((item) => item.id === selected);
  const currentBalance = Number(selectedProduct?.stockLevels[0]?.quantityOnHand ?? 0);
  const reservedBalance = Number(selectedProduct?.stockLevels[0]?.quantityReserved ?? 0);
  const resultingBalance = calculateBalance(currentBalance, quantity, direction);
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
          <div className="space-y-1">
            <label className="block text-xs font-semibold">Product</label>
            <div className="relative mt-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10"/>
              <Select
                value={selected || "none"}
                onValueChange={(val) => setSelected(val === "none" ? "" : val)}
              >
                <SelectTrigger className="h-10 data-[size=default]:h-10 w-full rounded-xl border pl-9 pr-3 text-xs bg-white">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectItem value="none" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Select product</SelectItem>
                  {products.map((item) => (
                      <SelectItem
                        key={item.id}
                        value={item.id}
                        className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer"
                      >
                        {item.sku} · {item.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            {productsLoading ? <p className="text-xs text-slate-500">Loading products…</p> : !products.length && <p className="text-xs text-slate-500">No non-serialized products available. Manage serialized stock under Serialized units.</p>}
          </div>
          {selectedProduct && <div className="rounded-xl border border-teal-100 bg-teal-50 p-3"><p className="text-xs text-slate-500">Selected product</p><p className="font-semibold">{selectedProduct.name}</p><div className="mt-2 flex justify-between text-xs"><span>Current stock <b>{formatQuantity(currentBalance)}</b></span><span>Available <b>{formatQuantity(currentBalance - reservedBalance)}</b></span></div></div>}
          <label className="block text-xs font-semibold">Quantity to {direction === "IN" ? "add" : "remove"}<div className="mt-1 flex items-center rounded-xl border bg-white"><button type="button" onClick={() => setQuantity((value) => stepQuantity(value, -1))} className="h-10 w-11 border-r text-lg font-bold text-slate-500">−</button><input required type="number" min="0.001" max={direction === "OUT" ? currentBalance : undefined} step="0.001" value={quantity} onChange={(e) => setQuantity(normalizeQuantity(Number(e.target.value)))} className="h-10 min-w-0 flex-1 text-center font-bold outline-none"/><button type="button" onClick={() => setQuantity((value) => stepQuantity(value, 1))} className="h-10 w-11 border-l text-lg font-bold text-slate-500">+</button></div></label>
          <div className="space-y-1">
            <label className="block text-xs font-semibold">Reason for adjustment</label>
            <Select
              value={reason || "none"}
              onValueChange={(val) => setReason(val === "none" ? "" : val)}
            >
              <SelectTrigger className="mt-1 h-10 data-[size=default]:h-10 w-full rounded-xl border px-3 text-sm bg-white">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value="none" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Select a reason</SelectItem>
                {reasonOptions.map((item) => (
                  <SelectItem
                    key={item}
                    value={item}
                    className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer"
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {reason === "Other" && <label className="block text-xs font-semibold">Explain the reason<textarea required value={otherReason} onChange={(event) => setOtherReason(event.target.value)} className="mt-1 min-h-20 w-full rounded-xl border p-3 text-sm" placeholder="Provide enough detail for the inventory audit trail."/></label>}
          <div className={`rounded-xl p-4 text-white ${direction === "IN" ? "bg-gradient-to-br from-[#087F6F] to-[#0E9384]" : "bg-gradient-to-br from-[#B42318] to-[#D92D20]"}`}><p className="text-[10px] uppercase tracking-wider text-white/70">Impact preview</p><div className="mt-2 grid grid-cols-3 items-end gap-2 tabular-nums"><div className="min-w-0"><p className="text-xs text-white/70">Current</p><p className="break-words text-lg font-bold">{formatQuantity(currentBalance)}</p></div><p className="min-w-0 break-words pb-1 text-center text-base font-bold">{direction === "IN" ? "+" : "−"}{formatQuantity(quantity)}</p><div className="min-w-0 text-right"><p className="text-xs text-white/70">New balance</p><p className="break-words text-lg font-bold">{formatQuantity(resultingBalance)}</p></div></div></div>
          {direction === "OUT" && resultingBalance < 0 && <p className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700">You cannot remove more than the current stock.</p>}
          <button disabled={!selected || !reason || (reason === "Other" && !otherReason.trim()) || quantity <= 0 || resultingBalance < 0} className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 ${direction === "IN" ? "bg-[#0E9384]" : "bg-rose-600"}`}>
            {direction === "IN" ? `Add ${formatQuantity(quantity)} to stock` : `Remove ${formatQuantity(quantity)} from stock`}
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
