"use client";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Barcode,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useBranch } from "@/components/dashboard/BranchContext";
import { useOfflineMode } from "@/components/dashboard/pos/OfflineContext";
import { apiGet, apiPost } from "@/lib/api/client";
type Product = {
  id: string;
  sku: string;
  barcode: string | null;
  name: string;
  sellingPrice: number | string;
  images: Array<{ url: string }>;
  trackSerials: boolean;
  category: { name: string } | null;
  stockLevels: Array<{
    quantityOnHand: number | string;
    quantityReserved: number | string;
  }>;
};
type Customer = {
  id: string;
  customerNumber: string;
  firstName: string;
  lastName: string | null;
  storeCreditAccount: { balance: number | string } | null;
  loyaltyAccount: { points: number } | null;
};
type Line = { product: Product; quantity: number; serialNumber: string };
type Quote = {
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;
};
const emptyQuote = { subtotal: 0, discountTotal: 0, taxTotal: 0, total: 0 };
export default function PosOperations() {
  const { branchId, branch } = useBranch();
  const { isOffline } = useOfflineMode();
  const [products, setProducts] = useState<Product[]>([]),
    [customers, setCustomers] = useState<Customer[]>([]),
    [cart, setCart] = useState<Line[]>([]),
    [search, setSearch] = useState(""),
    [barcode, setBarcode] = useState(""),
    [category, setCategory] = useState("ALL"),
    [customerId, setCustomerId] = useState(""),
    [paymentMethod, setPaymentMethod] = useState("CASH"),
    [paid, setPaid] = useState(0),
    [credit, setCredit] = useState(false),
    [dueDate, setDueDate] = useState(""),
    [quote, setQuote] = useState<Quote>(emptyQuote),
    [message, setMessage] = useState<string | null>(null),
    [receipt, setReceipt] = useState<{
      invoiceNumber: string;
      receiptNumber: string;
      total: number;
    } | null>(null);
  const barcodeRef = useRef<HTMLInputElement>(null);
  const load = useCallback(async () => {
    if (!branchId) return;
    try {
      const [p, c] = await Promise.all([
        apiGet<{ data: Product[] }>(
          `/catalog/products?pageSize=100&status=ACTIVE&branchId=${encodeURIComponent(branchId)}`,
        ),
        apiGet<{ data: Customer[] }>("/customers?pageSize=100"),
      ]);
      setProducts(p.data);
      setCustomers(c.data);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Unable to load POS data.");
    }
  }, [branchId]);
  useEffect(() => {
    void load();
  }, [load]);
  const available = (p: Product) =>
    Number(p.stockLevels[0]?.quantityOnHand ?? 0) -
    Number(p.stockLevels[0]?.quantityReserved ?? 0);
  function add(product: Product) {
    if (available(product) <= 0)
      return setMessage(`${product.name} is out of stock.`);
    setMessage(null);
    if (product.trackSerials)
      setCart((c) => [...c, { product, quantity: 1, serialNumber: "" }]);
    else
      setCart((c) => {
        const found = c.find((x) => x.product.id === product.id);
        return found
          ? c.map((x) =>
              x === found
                ? {
                    ...x,
                    quantity: Math.min(x.quantity + 1, available(product)),
                  }
                : x,
            )
          : [...c, { product, quantity: 1, serialNumber: "" }];
      });
  }
  function scan(e: React.FormEvent) {
    e.preventDefault();
    const value = barcode.trim();
    const product = products.find(
      (p) =>
        p.barcode?.toLowerCase() === value.toLowerCase() ||
        p.sku.toLowerCase() === value.toLowerCase(),
    );
    if (product) {
      add(product);
      setBarcode("");
      barcodeRef.current?.focus();
    } else setMessage(`No active product matches barcode “${value}”.`);
  }
  const items = useMemo(
    () =>
      cart.map((x) => ({
        productId: x.product.id,
        quantity: x.quantity,
        serialNumber: x.product.trackSerials ? x.serialNumber : undefined,
      })),
    [cart],
  );
  useEffect(() => {
    if (!items.length || isOffline) {
      setQuote(emptyQuote);
      return;
    }
    const timer = setTimeout(
      () =>
        void apiPost<Quote>("/sales/quote", { items })
          .then((q) => {
            setQuote(q);
            setPaid(q.total);
          })
          .catch((e) =>
            setMessage(e instanceof Error ? e.message : "Quote failed."),
          ),
      200,
    );
    return () => clearTimeout(timer);
  }, [items, isOffline]);
  const categories = [
    "ALL",
    ...Array.from(
      new Set(products.map((p) => p.category?.name ?? "Uncategorized")),
    ),
  ];
  const filtered = products.filter(
    (p) =>
      (category === "ALL" ||
        (p.category?.name ?? "Uncategorized") === category) &&
      `${p.sku} ${p.barcode ?? ""} ${p.name}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const customer = customers.find((c) => c.id === customerId);
  async function checkout() {
    if (!branchId || !cart.length) return;
    if (paymentMethod === "STORE_CREDIT" && !customerId)
      return setMessage("Select a registered customer to use store credit.");
    if (cart.some((x) => x.product.trackSerials && !x.serialNumber.trim()))
      return setMessage(
        "Enter the serial number for every serialized product.",
      );
    const payload = {
      branchId,
      customerId: customerId || undefined,
      items,
      payments: paid > 0 ? [{ method: paymentMethod, amount: paid }] : [],
      credit: credit
        ? {
            dueDate: new Date(dueDate).toISOString(),
            notes: "POS credit checkout",
          }
        : undefined,
    };
    if (isOffline) {
      const queue = JSON.parse(
        localStorage.getItem("technova_pos_queue") ?? "[]",
      ) as unknown[];
      queue.push({
        clientOperationId: crypto.randomUUID(),
        operationType: "SALE_CREATE",
        clientTimestamp: new Date().toISOString(),
        payload,
      });
      localStorage.setItem("technova_pos_queue", JSON.stringify(queue));
      setCart([]);
      return setMessage("Sale stored locally for replay-safe synchronization.");
    }
    try {
      const result = await apiPost<{
        invoiceNumber: string;
        receiptNumber: string;
        total: number;
      }>("/sales", payload);
      setReceipt(result);
      setCart([]);
      setQuote(emptyQuote);
      setMessage("Sale completed successfully.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Checkout failed.");
    }
  }
  return (
    <main className="grid min-h-[calc(100vh-64px)] gap-4 bg-[#F8FAFC] p-5 xl:grid-cols-[180px_1fr_410px]">
      <aside className="hidden rounded-2xl border bg-white p-3 xl:block">
        <p className="px-2 py-3 text-xs font-bold uppercase text-slate-400">
          Categories
        </p>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`mb-2 w-full rounded-xl px-3 py-3 text-left text-sm ${category === c ? "bg-[#025148] font-semibold text-white" : "hover:bg-teal-50"}`}
          >
            {c === "ALL" ? "All products" : c}
          </button>
        ))}
      </aside>
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[#0E9384]">
              {branch?.name ?? "Select branch"}
              {isOffline ? " · Offline mode" : ""}
            </p>
            <h1 className="text-2xl font-bold">Point of Sale</h1>
          </div>
          <span className="text-xs text-slate-500">
            Click, search, or scan a barcode
          </span>
        </div>
        <form onSubmit={scan} className="relative">
          <Barcode className="absolute left-3 top-3 h-5 w-5 text-[#0E9384]" />
          <input
            ref={barcodeRef}
            autoFocus
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Scan barcode and press Enter"
            className="h-11 w-full rounded-xl border-2 border-[#0E9384]/40 bg-white pl-11 pr-3 outline-none focus:border-[#0E9384]"
          />
        </form>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product name, SKU or barcode"
            className="h-10 w-full rounded-xl border bg-white pl-10 pr-3"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((p) => (
            <button
              key={p.id}
              disabled={available(p) <= 0}
              onClick={() => add(p)}
              className="overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#0E9384] disabled:opacity-50"
            >
              <div className="relative aspect-[4/3] bg-slate-100">
                {p.images[0]?.url ? (
                  <Image
                    src={p.images[0].url}
                    alt={p.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ShoppingCart className="h-8 w-8 text-slate-300" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="truncate font-semibold">{p.name}</p>
                <p className="text-xs text-slate-500">
                  {p.sku} · {available(p)} available
                </p>
                <p className="mt-2 font-bold text-[#0E9384]">
                  LKR {Number(p.sellingPrice).toLocaleString()}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>
      <aside className="h-fit space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex justify-between">
          <h2 className="flex gap-2 font-bold">
            <ShoppingCart className="h-5 w-5" />
            Current sale
          </h2>
          <button onClick={() => setCart([])} className="text-xs text-rose-600">
            Clear
          </button>
        </div>
        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="h-10 w-full rounded-xl border px-3"
        >
          <option value="">Walk-in customer</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.customerNumber} · {c.firstName} {c.lastName}
            </option>
          ))}
        </select>
        {customer && (
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-teal-50 p-3 text-xs">
            <span>
              Store credit{" "}
              <b className="block">
                LKR{" "}
                {Number(
                  customer.storeCreditAccount?.balance ?? 0,
                ).toLocaleString()}
              </b>
            </span>
            <span>
              Star points{" "}
              <b className="block">{customer.loyaltyAccount?.points ?? 0}</b>
            </span>
          </div>
        )}
        <div className="max-h-[38vh] space-y-2 overflow-auto">
          {cart.map((line, i) => (
            <div
              key={`${line.product.id}-${i}`}
              className="rounded-xl border p-3"
            >
              <div className="flex justify-between">
                <span>
                  <b>{line.product.name}</b>
                  <small className="block text-slate-500">
                    LKR {Number(line.product.sellingPrice).toLocaleString()}
                  </small>
                </span>
                <button
                  onClick={() => setCart((c) => c.filter((_, x) => x !== i))}
                >
                  <Trash2 className="h-4 w-4 text-rose-500" />
                </button>
              </div>
              {line.product.trackSerials ? (
                <input
                  value={line.serialNumber}
                  onChange={(e) =>
                    setCart((c) =>
                      c.map((x, n) =>
                        n === i ? { ...x, serialNumber: e.target.value } : x,
                      ),
                    )
                  }
                  placeholder="Serial number"
                  className="mt-2 h-9 w-full rounded-lg border px-2"
                />
              ) : (
                <div className="mt-2 flex items-center gap-3">
                  <button
                    onClick={() =>
                      setCart((c) =>
                        c.map((x, n) =>
                          n === i
                            ? { ...x, quantity: Math.max(1, x.quantity - 1) }
                            : x,
                        ),
                      )
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <b>{line.quantity}</b>
                  <button
                    onClick={() =>
                      setCart((c) =>
                        c.map((x, n) =>
                          n === i
                            ? {
                                ...x,
                                quantity: Math.min(
                                  available(x.product),
                                  x.quantity + 1,
                                ),
                              }
                            : x,
                        ),
                      )
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="space-y-2 border-t pt-3 text-sm">
          <p className="flex justify-between">
            <span>Subtotal</span>
            <span>{quote.subtotal.toLocaleString()}</span>
          </p>
          <p className="flex justify-between text-emerald-700">
            <span>Discount</span>
            <span>-{quote.discountTotal.toLocaleString()}</span>
          </p>
          <p className="flex justify-between">
            <span>Tax</span>
            <span>{quote.taxTotal.toLocaleString()}</span>
          </p>
          <p className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>LKR {quote.total.toLocaleString()}</span>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="h-10 rounded-xl border px-2"
          >
            <option value="CASH">Cash</option>
            <option value="CARD">Card</option>
            <option value="BANK_TRANSFER">Bank transfer</option>
            <option value="STORE_CREDIT">Store credit</option>
          </select>
          <input
            type="number"
            min="0"
            value={paid}
            onChange={(e) => setPaid(Number(e.target.value))}
            className="h-10 rounded-xl border px-3"
          />
        </div>
        <label className="flex gap-2 text-sm">
          <input
            type="checkbox"
            checked={credit}
            onChange={(e) => setCredit(e.target.checked)}
          />
          Customer credit purchase
        </label>
        {credit && (
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="h-10 w-full rounded-xl border px-3"
          />
        )}
        {message && (
          <p className="rounded-xl bg-slate-50 p-3 text-sm">{message}</p>
        )}
        <button
          onClick={() => void checkout()}
          disabled={!cart.length || (!isOffline && quote.total <= 0)}
          className="w-full rounded-xl bg-[#0E9384] py-3 font-bold text-white disabled:opacity-50"
        >
          {isOffline ? "Save offline sale" : "Complete sale"}
        </button>
        {receipt && (
          <p className="rounded-xl bg-emerald-50 p-3 text-sm">
            <b>{receipt.invoiceNumber}</b>
            <br />
            {receipt.receiptNumber}
          </p>
        )}
      </aside>
    </main>
  );
}
