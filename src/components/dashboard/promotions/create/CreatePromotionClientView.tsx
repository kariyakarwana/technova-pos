"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, MessageCircle, PackageSearch } from "lucide-react";
import { apiGet, apiPost } from "@/lib/api/client";
import CreatePromotionHeader from "./CreatePromotionHeader";

type Product = { id: string; sku: string; name: string };
type ProductsResponse = { data: Product[] };

const inputClass = "mt-1 h-10 w-full rounded-xl border border-[var(--brand-stroke)] bg-white px-3 text-sm outline-none focus:border-[var(--brand-green)]";

export default function CreatePromotionClientView() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState(""); const [code, setCode] = useState(""); const [description, setDescription] = useState("");
  const [productId, setProductId] = useState(""); const [type, setType] = useState("PERCENTAGE"); const [value, setValue] = useState("");
  const [minimumQuantity, setMinimumQuantity] = useState("1"); const [maximumQuantity, setMaximumQuantity] = useState(""); const [priority, setPriority] = useState("0");
  const [startsAt, setStartsAt] = useState(""); const [endsAt, setEndsAt] = useState("");
  const [notifyEmail, setNotifyEmail] = useState(true); const [notifyWhatsapp, setNotifyWhatsapp] = useState(true);
  const [submitting, setSubmitting] = useState(false); const [error, setError] = useState("");

  useEffect(() => { apiGet<ProductsResponse>("/catalog/products?pageSize=100&status=ACTIVE").then((result) => setProducts(result.data)).catch(() => setProducts([])); }, []);

  async function submit(event: FormEvent) {
    event.preventDefault(); setError("");
    if (!name.trim() || !value || !startsAt) { setError("Promotion name, discount value, and start date are required."); return; }
    if (Number(value) <= 0 || Number(minimumQuantity) < 1) { setError("Enter a valid discount value and minimum quantity."); return; }
    if (endsAt && new Date(endsAt) <= new Date(startsAt)) { setError("End date must be after the start date."); return; }
    setSubmitting(true);
    try {
      const created = await apiPost<{ id: string }>("/discounts", {
        name: name.trim(), code: code.trim() || undefined, description: description.trim() || undefined,
        productId: productId || undefined, type, value: Number(value), minimumQuantity: Number(minimumQuantity),
        maximumQuantity: maximumQuantity ? Number(maximumQuantity) : undefined, priority: Number(priority || 0),
        startsAt: new Date(startsAt).toISOString(), endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
        notifyEmail, notifyWhatsapp,
      });
      router.push(`/promotions/${created.id}`); router.refresh();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to create promotion."); }
    finally { setSubmitting(false); }
  }

  return <main className="min-h-screen space-y-6 bg-[var(--brand-app-bg)] p-6"><CreatePromotionHeader />
    <form onSubmit={submit} className="space-y-6">
      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      <section className="rounded-2xl border border-[var(--brand-stroke)] bg-white p-6 shadow-xs"><h2 className="text-base font-bold">Promotion information</h2><p className="mt-1 text-xs text-slate-500">Create a campaign reference customers and staff can clearly identify.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2"><label className="text-xs font-semibold">Promotion name <span className="text-rose-500">*</span><input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="September electronics sale" /></label><label className="text-xs font-semibold">Promotion code<input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className={inputClass} placeholder="Auto-generated when empty" /></label><label className="text-xs font-semibold md:col-span-2">Customer-facing description<textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 w-full rounded-xl border border-[var(--brand-stroke)] p-3 text-sm outline-none focus:border-[var(--brand-green)]" placeholder="Explain the offer and any important conditions." /></label></div>
      </section>
      <section className="rounded-2xl border border-[var(--brand-stroke)] bg-white p-6 shadow-xs"><div className="flex items-center gap-2"><PackageSearch className="h-5 w-5 text-[var(--brand-green)]" /><h2 className="text-base font-bold">Discount rules</h2></div><p className="mt-1 text-xs text-slate-500">The POS applies the best eligible active promotion automatically.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3"><label className="text-xs font-semibold md:col-span-2">Product<select value={productId} onChange={(e) => setProductId(e.target.value)} className={inputClass}><option value="">All products</option>{products.map((p) => <option key={p.id} value={p.id}>{p.sku} · {p.name}</option>)}</select></label><label className="text-xs font-semibold">Discount type<select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}><option value="PERCENTAGE">Percentage off</option><option value="FIXED_AMOUNT">Fixed amount off</option><option value="PRICE_OVERRIDE">Special selling price</option></select></label><label className="text-xs font-semibold">{type === "PERCENTAGE" ? "Discount percentage" : type === "FIXED_AMOUNT" ? "Discount amount (LKR)" : "Special price (LKR)"} <span className="text-rose-500">*</span><input type="number" min="0.01" step="0.01" value={value} onChange={(e) => setValue(e.target.value)} className={inputClass} /></label><label className="text-xs font-semibold">Minimum quantity<input type="number" min="1" step="1" value={minimumQuantity} onChange={(e) => setMinimumQuantity(e.target.value)} className={inputClass} /></label><label className="text-xs font-semibold">Maximum quantity<input type="number" min="1" step="1" value={maximumQuantity} onChange={(e) => setMaximumQuantity(e.target.value)} className={inputClass} placeholder="No maximum" /></label><label className="text-xs font-semibold">Priority<input type="number" value={priority} onChange={(e) => setPriority(e.target.value)} className={inputClass} /><span className="mt-1 block font-normal text-slate-500">Higher priority wins when offers are equal.</span></label><label className="text-xs font-semibold">Starts at <span className="text-rose-500">*</span><input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className={inputClass} /></label><label className="text-xs font-semibold">Ends at<input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} className={inputClass} /></label></div>
      </section>
      <section className="rounded-2xl border border-[var(--brand-stroke)] bg-white p-6 shadow-xs"><h2 className="text-base font-bold">Customer announcement</h2><p className="mt-1 text-xs text-slate-500">At the start time, one welcome-style promotion message is queued for each active customer with a valid contact and allowed notification preference.</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${notifyEmail ? "border-[var(--brand-green)] bg-emerald-50" : "border-[var(--brand-stroke)]"}`}><input type="checkbox" checked={notifyEmail} onChange={(e) => setNotifyEmail(e.target.checked)} className="h-4 w-4 accent-[var(--brand-green)]" /><Mail className="h-5 w-5 text-[var(--brand-green)]" /><span><strong className="block text-sm">Send by email</strong><small className="text-slate-500">Uses the customer email address</small></span></label><label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${notifyWhatsapp ? "border-[var(--brand-green)] bg-emerald-50" : "border-[var(--brand-stroke)]"}`}><input type="checkbox" checked={notifyWhatsapp} onChange={(e) => setNotifyWhatsapp(e.target.checked)} className="h-4 w-4 accent-[var(--brand-green)]" /><MessageCircle className="h-5 w-5 text-[var(--brand-green)]" /><span><strong className="block text-sm">Send by WhatsApp</strong><small className="text-slate-500">Uses the customer phone number</small></span></label></div></section>
      <div className="flex justify-end gap-3"><button type="button" onClick={() => router.push("/promotions")} className="h-10 rounded-xl border px-5 text-sm font-semibold">Cancel</button><button disabled={submitting} className="h-10 rounded-xl bg-[var(--brand-green)] px-5 text-sm font-bold text-white disabled:opacity-50">{submitting ? "Creating…" : "Create promotion"}</button></div>
    </form>
  </main>;
}
