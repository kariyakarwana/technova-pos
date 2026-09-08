"use client";

import Link from "next/link";
import { PackageCheck, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useBranch } from "@/components/dashboard/BranchContext";
import { apiGet } from "@/lib/api/client";

type PurchaseOrder = {
  id: string;
  orderNumber: string;
  status: string;
  total: number | string;
  createdAt: string;
  supplier: { name: string; code: string };
  branch: { name: string };
  _count: { items: number; receipts: number };
};
type Page = { data: PurchaseOrder[] };

export default function StockReceiptQueue() {
  const { branchId, branch } = useBranch();
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const load = useCallback(async () => {
    if (!branchId) {
      setOrders([]);
      return;
    }
    setLoading(true);
    setError(null);
    const common = `branchId=${encodeURIComponent(branchId)}&pageSize=100`;
    try {
      const [approved, partial] = await Promise.all([
        apiGet<Page>(`/purchasing/orders?${common}&status=APPROVED`),
        apiGet<Page>(`/purchasing/orders?${common}&status=PARTIALLY_RECEIVED`),
      ]);
      setOrders(
        [...approved.data, ...partial.data].sort(
          (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
        ),
      );
      setPage(1);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Unable to load purchase orders ready for receipt.",
      );
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    void load();
  }, [load]);
  const pageCount = Math.max(1, Math.ceil(orders.length / pageSize));
  const visible = useMemo(
    () => orders.slice((page - 1) * pageSize, page * pageSize),
    [orders, page],
  );

  return (
    <main className="min-h-screen space-y-6 bg-[#F8FAFC] p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0E9384]">
            Inventory / Goods receipt
          </p>
          <h1 className="mt-1 text-2xl font-bold">Receive supplier stock</h1>
          <p className="text-sm text-slate-500">
            Open an approved purchase order for{" "}
            {branch?.name ?? "the selected branch"}, verify quantities, and add
            stock to inventory.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </header>
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </div>
      )}
      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="border-b p-5">
          <h2 className="font-bold">Orders ready to receive</h2>
          <p className="text-xs text-slate-500">
            Stock is increased only after receipt confirmation. Serialized items
            can use automatic serial-number generation.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-4">Order</th>
                <th className="p-4">Supplier</th>
                <th className="p-4">Status</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="p-4">
                    <b>{order.orderNumber}</b>
                    <small className="block text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </small>
                  </td>
                  <td className="p-4">
                    {order.supplier.name}
                    <small className="block text-slate-500">
                      {order.supplier.code}
                    </small>
                  </td>
                  <td className="p-4">
                    <span className="rounded-full bg-teal-50 px-2 py-1 text-xs font-semibold text-[#0E9384]">
                      {order.status.replaceAll("_", " ")}
                    </span>
                  </td>
                  <td className="p-4">{order._count.items}</td>
                  <td className="p-4 font-semibold">
                    LKR {Number(order.total).toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/purchases/${order.id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#0E9384] px-3 py-2 text-xs font-semibold text-white"
                    >
                      <PackageCheck className="h-4 w-4" />
                      Receive stock
                    </Link>
                  </td>
                </tr>
              ))}
              {!loading && visible.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-12 text-center text-sm text-slate-400"
                  >
                    No approved purchase orders are waiting at this branch.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t px-5 py-4 text-xs text-slate-500">
          <span>
            Showing {visible.length ? (page - 1) * pageSize + 1 : 0}–
            {Math.min(page * pageSize, orders.length)} of {orders.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
              className="rounded-lg border px-3 py-2 disabled:opacity-40"
            >
              Previous
            </button>
            <span>
              Page {page} of {pageCount}
            </span>
            <button
              type="button"
              disabled={page === pageCount}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-lg border px-3 py-2 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
