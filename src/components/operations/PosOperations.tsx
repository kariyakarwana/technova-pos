"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Barcode,
  CreditCard,
  Grid2X2,
  Landmark,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  UserPlus,
  Wallet,
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
  loyaltyAccount: { pointsBalance: number | string } | null;
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
    if (credit && !customerId)
      return setMessage("Select a registered customer for a credit purchase.");
    if (credit && !dueDate)
      return setMessage("Select the credit payment due date.");
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
  const paymentOptions = [{ value: "CASH", label: "Cash", icon: Wallet }, { value: "CARD", label: "Card", icon: CreditCard }, { value: "BANK_TRANSFER", label: "Transfer", icon: Landmark }, { value: "STORE_CREDIT", label: "Credit", icon: Wallet }];
  return <main className="min-h-[calc(100vh-64px)] bg-[#F8FAFC] p-3 lg:p-4">
    <header className="mb-3 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold text-[#0E9384]">Welcome, Cashier</p><h1 className="text-xl font-bold text-slate-900">Point of Sale</h1><p className="text-xs text-slate-500">{branch?.name ?? "Select a branch"}{isOffline ? " · Offline mode" : " · Connected"}</p></div><Link href="/sales" className="rounded-lg bg-[#0E9384] px-4 py-2 text-xs font-semibold text-white">View all orders</Link></header>
    <div className="grid gap-3 xl:grid-cols-[92px_minmax(0,1fr)_390px]">
      <aside className="hidden max-h-[calc(100vh-145px)] overflow-y-auto rounded-xl border bg-white p-2 xl:block"><p className="mb-2 text-center text-xs font-bold">Categories</p>{categories.map((item) => <button type="button" key={item} onClick={() => setCategory(item)} className={`mb-2 flex h-[72px] w-full flex-col items-center justify-center gap-1 rounded-xl border text-[10px] font-semibold transition ${category === item ? "border-2 border-[#0E9384] bg-teal-50 text-[#0E9384]" : "border-slate-200 bg-white hover:border-teal-300"}`}>{item === "ALL" ? <Grid2X2 className="h-5 w-5"/> : <Package className="h-5 w-5"/>}<span className="line-clamp-2">{item === "ALL" ? "All" : item}</span></button>)}</aside>
      <section className="min-w-0 space-y-3"><div className="grid gap-2 sm:grid-cols-2"><form onSubmit={scan} className="relative"><Barcode className="absolute left-3 top-2.5 h-4 w-4 text-[#0E9384]"/><input ref={barcodeRef} autoFocus value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder="Scan barcode or enter SKU" className="h-9 w-full rounded-lg border-2 border-teal-200 bg-white pl-9 pr-3 text-xs outline-none focus:border-[#0E9384]"/></form><div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search product" className="h-9 w-full rounded-lg border bg-white pl-9 pr-3 text-xs"/></div></div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-9 w-full rounded-lg border bg-white px-3 text-xs xl:hidden">{categories.map((item) => <option key={item} value={item}>{item === "ALL" ? "All categories" : item}</option>)}</select>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5">{filtered.map((product) => { const stock = available(product); return <button type="button" key={product.id} disabled={stock <= 0} onClick={() => add(product)} className="group overflow-hidden rounded-xl border bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#0E9384] disabled:opacity-45"><div className="relative aspect-[4/3] bg-slate-100">{product.images[0]?.url ? <Image src={product.images[0].url} alt={product.name} fill unoptimized className="object-cover"/> : <div className="flex h-full items-center justify-center"><Package className="h-7 w-7 text-slate-300"/></div>}<span className={`absolute right-1.5 top-1.5 h-2 w-2 rounded-full ${stock > 0 ? "bg-emerald-500" : "bg-rose-500"}`}/></div><div className="p-2"><p className="truncate text-xs font-semibold">{product.name}</p><div className="mt-1 flex items-center justify-between gap-1"><span className="text-[10px] font-bold text-[#0E9384]">LKR {Number(product.sellingPrice).toLocaleString()}</span><span className="text-[9px] text-rose-500">{stock} pcs</span></div></div></button>; })}</div>{!filtered.length && <div className="rounded-xl border bg-white p-10 text-center text-sm text-slate-500">No products match this search.</div>}
      </section>
      <aside className="h-fit overflow-hidden rounded-xl border bg-white shadow-sm xl:sticky xl:top-3"><div className="flex items-center justify-between border-b px-3 py-2"><div><h2 className="text-xs font-bold">Order List</h2><p className="text-[10px] text-slate-400">{cart.length} item lines</p></div><button type="button" onClick={() => setCart([])} title="Clear order" className="rounded p-1 text-rose-500 hover:bg-rose-50"><Trash2 className="h-4 w-4"/></button></div>
        <div className="space-y-2 border-b p-3"><div className="flex gap-2"><select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="h-8 min-w-0 flex-1 rounded-lg border px-2 text-xs"><option value="">Walk-in customer</option>{customers.map((item) => <option key={item.id} value={item.id}>{item.customerNumber} · {item.firstName} {item.lastName}</option>)}</select><Link href="/customers" title="Add customer" className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0E9384] text-white"><UserPlus className="h-4 w-4"/></Link></div>{customer && <div className="grid grid-cols-2 gap-2 rounded-lg bg-teal-50 p-2 text-[10px]"><span>Store credit<b className="block">LKR {Number(customer.storeCreditAccount?.balance ?? 0).toLocaleString()}</b></span><span>Star points<b className="block">{Number(customer.loyaltyAccount?.pointsBalance ?? 0).toLocaleString()}</b></span></div>}</div>
        <div className="grid grid-cols-[1fr_70px_54px_70px_24px] border-b bg-slate-50 px-3 py-2 text-[9px] font-semibold uppercase text-slate-500"><span>Product</span><span className="text-center">Price</span><span className="text-center">Qty</span><span className="text-right">Subtotal</span><span/></div><div className="max-h-[260px] min-h-[150px] overflow-y-auto">{cart.length ? cart.map((line, index) => <div key={`${line.product.id}-${index}`} className="grid grid-cols-[1fr_70px_54px_70px_24px] items-center border-b px-3 py-2 text-[10px]"><div className="min-w-0 pr-1"><p className="truncate font-semibold">{line.product.name}</p><p className="text-[9px] text-slate-400">Stock: {available(line.product)}</p>{line.product.trackSerials && <input value={line.serialNumber} onChange={(e) => setCart((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, serialNumber: e.target.value } : item))} placeholder="Serial number" className="mt-1 h-6 w-full rounded border px-1 text-[9px]"/>}</div><span className="text-center">{Number(line.product.sellingPrice).toLocaleString()}</span><div className="flex items-center justify-center gap-1">{!line.product.trackSerials && <><button type="button" onClick={() => setCart((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item))}><Minus className="h-3 w-3"/></button><b>{line.quantity}</b><button type="button" onClick={() => setCart((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, quantity: Math.min(available(item.product), item.quantity + 1) } : item))}><Plus className="h-3 w-3"/></button></>}</div><b className="text-right">{(Number(line.product.sellingPrice) * line.quantity).toLocaleString()}</b><button type="button" onClick={() => setCart((current) => current.filter((_, itemIndex) => itemIndex !== index))}><Trash2 className="h-3 w-3 text-rose-400"/></button></div>) : <div className="flex min-h-[150px] flex-col items-center justify-center text-slate-300"><ShoppingCart className="h-7 w-7"/><p className="mt-2 text-xs">Select products to add</p></div>}</div>
        <div className="space-y-1 border-t p-3 text-[11px]"><p className="flex justify-between"><span>Sub total</span><b>LKR {quote.subtotal.toLocaleString()}</b></p><p className="flex justify-between text-emerald-700"><span>Discount</span><b>- LKR {quote.discountTotal.toLocaleString()}</b></p><p className="flex justify-between"><span>Tax</span><b>LKR {quote.taxTotal.toLocaleString()}</b></p><p className="mt-2 flex justify-between border-t pt-2 text-sm"><span className="font-bold">Grand Total</span><b>LKR {quote.total.toLocaleString()}</b></p></div>
        <div className="border-t p-3"><p className="mb-2 text-[10px] font-semibold">Select payment</p><div className="grid grid-cols-4 gap-1.5">{paymentOptions.map(({ value, label, icon: Icon }) => <button type="button" key={value} onClick={() => setPaymentMethod(value)} className={`flex flex-col items-center gap-1 rounded-lg border py-2 text-[9px] font-semibold ${paymentMethod === value ? "border-2 border-[#0E9384] bg-teal-50 text-[#0E9384]" : "border-slate-200"}`}><Icon className="h-4 w-4"/>{label}</button>)}</div><label className="mt-2 block text-[10px] font-semibold">Amount paid<input type="number" min="0" value={paid} onChange={(e) => setPaid(Number(e.target.value))} className="mt-1 h-8 w-full rounded-lg border px-2 text-xs"/></label><label className="mt-2 flex items-center gap-2 text-[10px]"><input type="checkbox" checked={credit} onChange={(e) => setCredit(e.target.checked)}/>Customer credit purchase</label>{credit && <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="mt-2 h-8 w-full rounded-lg border px-2 text-xs"/>}{message && <p className="mt-2 rounded-lg bg-slate-50 p-2 text-[10px] text-slate-700">{message}</p>}<button type="button" onClick={() => void checkout()} disabled={!cart.length || (!isOffline && quote.total <= 0)} className="mt-3 w-full rounded-lg bg-[#0E9384] py-2.5 text-xs font-bold text-white disabled:opacity-40">{isOffline ? `Save offline sale · LKR ${quote.total.toLocaleString()}` : `Pay · LKR ${quote.total.toLocaleString()}`}</button>{receipt && <div className="mt-2 rounded-lg bg-emerald-50 p-2 text-[10px] text-emerald-800"><b>{receipt.invoiceNumber}</b><br/>{receipt.receiptNumber}</div>}</div>
      </aside>
    </div>
  </main>;
}
