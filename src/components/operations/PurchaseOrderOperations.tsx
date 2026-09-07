"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, Plus, Trash2, X } from "lucide-react";
import { useBranch } from "@/components/dashboard/BranchContext";
import { apiGet, apiPost } from "@/lib/api/client";
import PaginationControls, { type PageMeta } from "./PaginationControls";
type Order = {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number | string;
  discountTotal: number | string;
  taxTotal: number | string;
  total: number | string;
  expectedAt: string | null;
  createdAt: string;
  supplier: { name: string };
  branch: { name: string };
  _count: { items: number; receipts: number };
};
type Supplier = { id: string; code: string; name: string; status?: string };
type Product = {
  id: string;
  sku: string;
  name: string;
  costPrice: number | string;
};
type Line = {
  productId: string;
  quantity: number;
  unitCost: number;
  discount: number;
  tax: number;
};
const blank = (): Line => ({
  productId: "",
  quantity: 1,
  unitCost: 0,
  discount: 0,
  tax: 0,
});
export default function PurchaseOrderOperations() {
  const { branchId, branch } = useBranch();
  const [orders, setOrders] = useState<Order[]>([]),
    [meta, setMeta] = useState<PageMeta>({ page: 1, pageSize: 20, total: 0, pageCount: 0 }),
    [page, setPage] = useState(1), [pageSize, setPageSize] = useState(20),
    [orderNumber, setOrderNumber] = useState(""),
    [filterSupplierId, setFilterSupplierId] = useState(""),
    [minAmount, setMinAmount] = useState(""),
    [maxAmount, setMaxAmount] = useState(""),
    [status, setStatus] = useState(""), [from, setFrom] = useState(""), [to, setTo] = useState(""),
    [suppliers, setSuppliers] = useState<Supplier[]>([]),
    [products, setProducts] = useState<Product[]>([]),
    [open, setOpen] = useState(false),
    [supplierId, setSupplierId] = useState(""),
    [expectedAt, setExpectedAt] = useState(""),
    [notes, setNotes] = useState(""),
    [lines, setLines] = useState<Line[]>([blank()]),
    [message, setMessage] = useState<string | null>(null),
    [saving, setSaving] = useState(false);
  const load = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (branchId) params.set("branchId", branchId);
    if (orderNumber.trim()) params.set("orderNumber", orderNumber.trim());
    if (filterSupplierId) params.set("supplierId", filterSupplierId);
    if (minAmount) params.set("minAmount", minAmount);
    if (maxAmount) params.set("maxAmount", maxAmount);
    if (status) params.set("status", status);
    if (from) params.set("from", `${from}T00:00:00.000Z`);
    if (to) params.set("to", `${to}T23:59:59.999Z`);
    const [o, s, p] = await Promise.all([
      apiGet<{ data: Order[]; meta: PageMeta }>(`/purchasing/orders?${params}`),
      apiGet<{ data: Supplier[] }>("/suppliers?pageSize=100"),
      apiGet<{ data: Product[] }>(
        "/catalog/products?pageSize=100&status=ACTIVE",
      ),
    ]);
    setOrders(o.data);
    setMeta(o.meta);
    setSuppliers(s.data);
    setProducts(p.data);
  }, [branchId, filterSupplierId, from, maxAmount, minAmount, orderNumber, page, pageSize, status, to]);
  useEffect(() => {
    void load().catch((e) =>
      setMessage(
        e instanceof Error ? e.message : "Unable to load purchasing data.",
      ),
    );
  }, [load]);
  useEffect(() => setPage(1), [branchId, filterSupplierId, from, maxAmount, minAmount, orderNumber, pageSize, status, to]);
  function update(i: number, value: Partial<Line>) {
    setLines((current) =>
      current.map((line, index) =>
        index === i ? { ...line, ...value } : line,
      ),
    );
  }
  const totals = useMemo(
    () =>
      lines.reduce(
        (sum, line) => {
          const gross = line.quantity * line.unitCost;
          return {
            subtotal: sum.subtotal + gross,
            discount: sum.discount + line.discount,
            tax: sum.tax + line.tax,
            total: sum.total + gross - line.discount + line.tax,
          };
        },
        { subtotal: 0, discount: 0, tax: 0, total: 0 },
      ),
    [lines],
  );
  function reset() {
    setSupplierId("");
    setExpectedAt("");
    setNotes("");
    setLines([blank()]);
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!branchId)
      return setMessage("Select a branch before creating an order.");
    if (
      lines.some(
        (line) => line.discount > line.quantity * line.unitCost + line.tax,
      )
    )
      return setMessage("A line discount cannot make its total negative.");
    setSaving(true);
    try {
      await apiPost("/purchasing/orders", {
        branchId,
        supplierId,
        expectedAt: expectedAt ? new Date(expectedAt).toISOString() : undefined,
        notes: notes || undefined,
        items: lines,
      });
      setOpen(false);
      reset();
      setMessage("Purchase order created as a draft.");
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to create purchase order.",
      );
    } finally {
      setSaving(false);
    }
  }
  async function approve(id: string) {
    try {
      await apiPost(`/purchasing/orders/${id}/approve`, {});
      setMessage("Purchase order approved.");
      await load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Unable to approve order.");
    }
  }
  const input =
    "mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-[#0E9384]";
  return (
    <main className="space-y-6 bg-[#F8FAFC] p-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#0E9384]">
            Purchasing
          </p>
          <h1 className="text-2xl font-bold">Purchase Orders</h1>
          <p className="text-sm text-slate-500">
            Create, approve and receive supplier stock for{" "}
            {branch?.name ?? "the selected branch"}.
          </p>
        </div>
        <button
          disabled={!branchId}
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[#0E9384] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Create order
        </button>
      </header>
      {!branchId && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Select a branch from the top navigation before creating an order.
        </div>
      )}
      {message && (
        <div className="rounded-xl border border-teal-200 bg-teal-50 p-3 text-sm text-teal-800">
          {message}
        </div>
      )}
      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-slate-800">Filter purchase orders</h2>
            <p className="text-xs text-slate-500">Find orders by supplier, order number, value, status or date.</p>
          </div>
          <button type="button" onClick={() => { setOrderNumber(""); setFilterSupplierId(""); setMinAmount(""); setMaxAmount(""); setStatus(""); setFrom(""); setTo(""); }} className="h-9 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:border-[#0E9384] hover:text-[#0E9384]">Clear filters</button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          <label className="text-xs font-semibold text-slate-600">Order number<input value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="Search PO number" className={input}/></label>
          <label className="text-xs font-semibold text-slate-600">Supplier<select value={filterSupplierId} onChange={(e) => setFilterSupplierId(e.target.value)} className={input}><option value="">All suppliers</option>{suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.code} · {supplier.name}</option>)}</select></label>
          <label className="text-xs font-semibold text-slate-600">Minimum amount<input type="number" min="0" step="0.01" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} placeholder="0.00" className={input}/></label>
          <label className="text-xs font-semibold text-slate-600">Maximum amount<input type="number" min="0" step="0.01" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} placeholder="Any amount" className={input}/></label>
          <label className="text-xs font-semibold text-slate-600">Status<select value={status} onChange={(e) => setStatus(e.target.value)} className={input}><option value="">All statuses</option><option value="DRAFT">Draft</option><option value="SUBMITTED">Submitted</option><option value="APPROVED">Approved</option><option value="PARTIALLY_RECEIVED">Partially received</option><option value="RECEIVED">Received</option><option value="CANCELLED">Cancelled</option></select></label>
          <label className="text-xs font-semibold text-slate-600">From date<input type="date" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} className={input}/></label>
          <label className="text-xs font-semibold text-slate-600">To date<input type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} className={input}/></label>
        </div>
        {minAmount && maxAmount && Number(minAmount) > Number(maxAmount) && <p className="mt-3 text-sm font-medium text-rose-600">Minimum amount cannot be greater than maximum amount.</p>}
      </section>
      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="p-4">Order</th>
              <th className="p-4">Supplier</th>
              <th className="p-4">Branch</th>
              <th className="p-4">Created / Expected</th>
              <th className="p-4">Items</th>
              <th className="p-4">Subtotal</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Tax</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-4">
                  <Link
                    href={`/purchases/${order.id}`}
                    className="font-semibold text-[#0E9384]"
                  >
                    {order.orderNumber}
                  </Link>
                  <small className="block text-slate-500">
                    {order._count.receipts} receipt(s)
                  </small>
                </td>
                <td className="p-4">{order.supplier.name}</td>
                <td className="p-4">{order.branch.name}</td>
                <td className="p-4 text-xs">
                  {new Date(order.createdAt).toLocaleDateString()}
                  <span className="block text-slate-500">
                    {order.expectedAt
                      ? new Date(order.expectedAt).toLocaleDateString()
                      : "No expected date"}
                  </span>
                </td>
                <td className="p-4">{order._count.items}</td>
                <td className="p-4">
                  {Number(order.subtotal).toLocaleString()}
                </td>
                <td className="p-4 text-rose-600">
                  -{Number(order.discountTotal).toLocaleString()}
                </td>
                <td className="p-4">
                  {Number(order.taxTotal).toLocaleString()}
                </td>
                <td className="p-4 font-bold">
                  {Number(order.total).toLocaleString()}
                </td>
                <td className="p-4">
                  <span className="rounded-full bg-teal-50 px-2 py-1 text-xs text-teal-700">
                    {order.status.replaceAll("_", " ")}
                  </span>
                </td>
                <td className="space-x-2 p-4">
                  {["DRAFT", "SUBMITTED"].includes(order.status) && (
                    <button
                      onClick={() => void approve(order.id)}
                      className="font-semibold text-[#0E9384]"
                    >
                      Approve
                    </button>
                  )}
                  <Link
                    href={`/purchases/${order.id}`}
                    className="font-semibold text-slate-600"
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <PaginationControls meta={meta} onPageChange={setPage} onPageSizeChange={setPageSize} />
      </section>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <form
            onSubmit={submit}
            className="max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
              <div>
                <h2 className="text-lg font-bold">Create purchase order</h2>
                <p className="text-xs text-slate-500">Branch: {branch?.name}</p>
              </div>
              <button type="button" onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>
            <div className="space-y-5 p-6">
              <div className="grid gap-4 md:grid-cols-3">
                <label className="text-xs font-semibold">
                  Supplier *
                  <select
                    required
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className={input}
                  >
                    <option value="">Select supplier</option>
                    {suppliers
                      .filter((s) => !s.status || s.status === "ACTIVE")
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.code} · {s.name}
                        </option>
                      ))}
                  </select>
                </label>
                <label className="text-xs font-semibold">
                  Expected delivery date
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-4 h-4 w-4 text-slate-400" />
                    <input
                      type="date"
                      min={new Date().toISOString().slice(0, 10)}
                      value={expectedAt}
                      onChange={(e) => setExpectedAt(e.target.value)}
                      className={`${input} pl-9`}
                    />
                  </div>
                </label>
                <label className="text-xs font-semibold">
                  Order notes
                  <input
                    value={notes}
                    maxLength={1000}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Delivery or supplier instructions"
                    className={input}
                  />
                </label>
              </div>
              <div>
                <div className="mb-3 flex justify-between">
                  <div>
                    <h3 className="font-bold">Order lines</h3>
                    <p className="text-xs text-slate-500">
                      Discount and tax values are amounts per complete line.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLines((c) => [...c, blank()])}
                    className="text-sm font-semibold text-[#0E9384]"
                  >
                    + Add line
                  </button>
                </div>
                <div className="space-y-3">
                  {lines.map((line, index) => {
                    const gross = line.quantity * line.unitCost,
                      lineTotal = gross - line.discount + line.tax;
                    return (
                      <div
                        key={index}
                        className="grid gap-3 rounded-xl border p-3 md:grid-cols-[2fr_100px_130px_120px_120px_130px_40px]"
                      >
                        <label className="text-[11px] font-semibold">
                          Product *
                          <select
                            required
                            value={line.productId}
                            onChange={(e) => {
                              const product = products.find(
                                (p) => p.id === e.target.value,
                              );
                              update(index, {
                                productId: e.target.value,
                                unitCost: Number(product?.costPrice ?? 0),
                              });
                            }}
                            className={input}
                          >
                            <option value="">Select product</option>
                            {products
                              .filter(
                                (p) =>
                                  !lines.some(
                                    (l, i) =>
                                      i !== index && l.productId === p.id,
                                  ),
                              )
                              .map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.sku} · {p.name}
                                </option>
                              ))}
                          </select>
                        </label>
                        <label className="text-[11px] font-semibold">
                          Quantity *
                          <input
                            required
                            type="number"
                            min=".001"
                            step=".001"
                            value={line.quantity}
                            onChange={(e) =>
                              update(index, {
                                quantity: Number(e.target.value),
                              })
                            }
                            className={input}
                          />
                        </label>
                        <label className="text-[11px] font-semibold">
                          Unit cost *
                          <input
                            required
                            type="number"
                            min="0"
                            step=".01"
                            value={line.unitCost}
                            onChange={(e) =>
                              update(index, {
                                unitCost: Number(e.target.value),
                              })
                            }
                            className={input}
                          />
                        </label>
                        <label className="text-[11px] font-semibold">
                          Discount
                          <input
                            type="number"
                            min="0"
                            step=".01"
                            value={line.discount}
                            onChange={(e) =>
                              update(index, {
                                discount: Number(e.target.value),
                              })
                            }
                            className={input}
                          />
                        </label>
                        <label className="text-[11px] font-semibold">
                          Tax
                          <input
                            type="number"
                            min="0"
                            step=".01"
                            value={line.tax}
                            onChange={(e) =>
                              update(index, { tax: Number(e.target.value) })
                            }
                            className={input}
                          />
                        </label>
                        <label className="text-[11px] font-semibold">
                          Line total
                          <span className="mt-1 flex h-10 items-center rounded-xl bg-slate-50 px-3 font-bold">
                            {lineTotal.toLocaleString()}
                          </span>
                        </label>
                        <button
                          type="button"
                          disabled={lines.length === 1}
                          onClick={() =>
                            setLines((c) => c.filter((_, i) => i !== index))
                          }
                          className="mt-5 text-rose-600 disabled:opacity-30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="ml-auto grid max-w-md grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-4 text-sm">
                <span>Subtotal</span>
                <b className="text-right">{totals.subtotal.toLocaleString()}</b>
                <span>Discount</span>
                <b className="text-right text-rose-600">
                  -{totals.discount.toLocaleString()}
                </b>
                <span>Tax</span>
                <b className="text-right">{totals.tax.toLocaleString()}</b>
                <span className="border-t pt-2 text-base font-bold">
                  Order total
                </span>
                <b className="border-t pt-2 text-right text-base">
                  LKR {totals.total.toLocaleString()}
                </b>
              </div>
            </div>
            <div className="sticky bottom-0 flex justify-end gap-3 border-t bg-white px-6 py-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border px-4 py-2"
              >
                Cancel
              </button>
              <button
                disabled={saving || totals.total < 0}
                className="rounded-xl bg-[#0E9384] px-5 py-2 font-semibold text-white disabled:opacity-50"
              >
                {saving ? "Creating..." : "Create draft"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
