"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarClock, FileBadge, Plus, Printer, QrCode, Search, ShieldCheck, TriangleAlert } from "lucide-react";
import { apiPatch, apiPost } from "@/lib/api/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export type WarrantyPolicy = { id: string; name: string; durationMonths: number; terms?: string | null; status: string; product: { id: string; sku: string; name: string } };
type Product = { id: string; sku: string; name: string };
const empty = { productId: "", name: "", durationMonths: 12, terms: "", status: "ACTIVE" };

export default function WarrantyDashboardClientView({ policies: initial, products, loadError }: { policies: WarrantyPolicy[]; products: Product[]; loadError?: string }) {
  const [policies, setPolicies] = useState(initial), [query, setQuery] = useState(""), [editing, setEditing] = useState<WarrantyPolicy | null>(null), [open, setOpen] = useState(false), [form, setForm] = useState(empty), [message, setMessage] = useState(""), [saving, setSaving] = useState(false);
  const visible = useMemo(() => policies.filter((policy) => `${policy.name} ${policy.product.name} ${policy.product.sku}`.toLowerCase().includes(query.toLowerCase())), [policies, query]);
  function create() { setEditing(null); setForm(empty); setOpen(true); }
  function edit(policy: WarrantyPolicy) { setEditing(policy); setForm({ productId: policy.product.id, name: policy.name, durationMonths: policy.durationMonths, terms: policy.terms ?? "", status: policy.status }); setOpen(true); }
  async function save(event: React.FormEvent) {
    event.preventDefault(); setSaving(true); setMessage("");
    try {
      if (editing) {
        await apiPatch(`/warranties/policies/${editing.id}`, { name: form.name, durationMonths: form.durationMonths, terms: form.terms || undefined, status: form.status });
        setPolicies((rows) => rows.map((row) => row.id === editing.id ? { ...row, name: form.name, durationMonths: form.durationMonths, terms: form.terms || null, status: form.status } : row));
      } else {
        const created = await apiPost<Omit<WarrantyPolicy, "product">>("/warranties/policies", { productId: form.productId, name: form.name, durationMonths: form.durationMonths, terms: form.terms || undefined });
        const product = products.find((item) => item.id === form.productId)!;
        setPolicies((rows) => [...rows, { ...created, product }]);
      }
      setOpen(false); setMessage("Warranty policy saved successfully.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to save warranty policy."); }
    finally { setSaving(false); }
  }
  return <div className="space-y-6 p-6 lg:p-8">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0E9384]">Serialized protection</p><h1 className="mt-1 text-3xl font-bold text-slate-900">QR & Warranty</h1><p className="mt-2 text-sm text-slate-500">Manage policies, scan serialized products and prepare customer warranty journeys.</p></div><div className="flex gap-2"><Button asChild variant="outline"><Link href="/qr-scanner"><QrCode className="mr-2 h-4 w-4" />Open scanner</Link></Button><Button onClick={create} className="bg-[#025148] hover:bg-[#036b5e]"><Plus className="mr-2 h-4 w-4" />New policy</Button></div></header>
    {(loadError || message) && <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-800">{loadError && <TriangleAlert className="mr-2 inline h-4 w-4" />}{loadError || message}</div>}
    <section className="grid gap-4 md:grid-cols-3"><Metric label="Warranty policies" value={policies.length} icon={FileBadge} /><Metric label="Active policies" value={policies.filter((item) => item.status === "ACTIVE").length} icon={ShieldCheck} /><Metric label="Products covered" value={new Set(policies.map((item) => item.product.id)).size} icon={CalendarClock} /></section>
    <div className="grid gap-6 xl:grid-cols-[1fr_300px]"><Card className="border-slate-200"><CardHeader><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><CardTitle>Warranty policies</CardTitle><div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="Search policy or SKU" /></div></div></CardHeader><CardContent className="space-y-3">{visible.map((policy) => <div key={policy.id} className="flex flex-col gap-3 rounded-xl border p-4 md:flex-row md:items-center md:justify-between"><div><div className="flex gap-2"><p className="font-semibold">{policy.name}</p><Badge className="bg-teal-50 text-teal-700">{policy.status}</Badge></div><p className="text-sm text-slate-500">{policy.product.name} · {policy.product.sku}</p><p className="mt-2 text-sm">{policy.durationMonths} months · {policy.terms || "Standard coverage"}</p></div><Button onClick={() => edit(policy)} variant="outline">Edit</Button></div>)}{!visible.length && <p className="py-14 text-center text-sm text-slate-500">No warranty policies found.</p>}</CardContent></Card><div className="space-y-4"><Card className="bg-gradient-to-br from-[#025148] to-[#0E9384] text-white"><CardContent className="p-6"><QrCode className="h-9 w-9" /><h2 className="mt-5 text-xl font-bold">Scan a product QR</h2><Button asChild className="mt-5 w-full bg-white text-[#025148]"><Link href="/qr-scanner">Start scanning</Link></Button></CardContent></Card><Card><CardContent className="p-6"><Printer className="h-6 w-6 text-[#0E9384]" /><h2 className="mt-3 font-bold">QR labels</h2><p className="mt-2 text-sm text-slate-500">Labels are available from received purchase-order details.</p><Button asChild variant="outline" className="mt-4 w-full"><Link href="/purchases">Open purchases</Link></Button></CardContent></Card></div></div>
    {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><form onSubmit={save} className="w-full max-w-xl space-y-4 rounded-2xl bg-white p-6"><h2 className="text-lg font-bold">{editing ? "Edit warranty policy" : "New warranty policy"}</h2>{!editing && <label className="block text-xs font-semibold">Product<select required value={form.productId} onChange={(event) => setForm({ ...form, productId: event.target.value })} className="mt-1 h-10 w-full rounded-xl border px-3"><option value="">Select product</option>{products.map((product) => <option key={product.id} value={product.id}>{product.sku} · {product.name}</option>)}</select></label>}<label className="block text-xs font-semibold">Policy name<Input required minLength={2} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1" /></label><label className="block text-xs font-semibold">Duration in months<Input required type="number" min="1" value={form.durationMonths} onChange={(event) => setForm({ ...form, durationMonths: Number(event.target.value) })} className="mt-1" /></label><label className="block text-xs font-semibold">Terms<textarea value={form.terms} onChange={(event) => setForm({ ...form, terms: event.target.value })} className="mt-1 min-h-24 w-full rounded-xl border p-3" /></label>{editing && <label className="block text-xs font-semibold">Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="mt-1 h-10 w-full rounded-xl border px-3"><option>ACTIVE</option><option>INACTIVE</option></select></label>}<div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button disabled={saving} className="bg-[#025148]">{saving ? "Saving…" : "Save policy"}</Button></div></form></div>}
  </div>;
}
function Metric({ label, value, icon: Icon }: { label: string; value: number; icon: typeof FileBadge }) { return <Card><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div><Icon className="h-5 w-5 text-[#0E9384]" /></CardContent></Card>; }
