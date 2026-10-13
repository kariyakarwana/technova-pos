"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api/client";

type Rule = {
  id: string;
  name: string;
  type: string;
  value: string | number;
  minimumQuantity: string | number;
  maximumQuantity: string | number | null;
  priority: number;
  stackable: boolean;
  status: string;
  startsAt: string | null;
  product: { id: string; sku: string; name: string } | null;
};
type Product = { id: string; sku: string; name: string };

const emptyRuleForm = () => ({
  productId: "",
  name: "",
  type: "PERCENTAGE",
  value: "",
  minimumQuantity: "",
  maximumQuantity: "",
  startsAt: "",
  priority: 10,
  stackable: false,
});

export default function DiscountsPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState(emptyRuleForm);
  const [now, setNow] = useState(() => Date.now());

  const load = useCallback(async () => {
    const [discounts, catalog] = await Promise.all([
      apiGet<Rule[]>("/discounts"),
      apiGet<{ data: Product[] }>("/catalog/products?pageSize=100&status=ACTIVE"),
    ]);
    setRules(discounts);
    setProducts(catalog.data);
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  function openNewRule() {
    setForm(emptyRuleForm());
    setEditingId(null);
    setOpen(true);
  }

  function isUpcoming(rule: Rule) {
    return Boolean(rule.startsAt && new Date(rule.startsAt).getTime() > now);
  }

  function openEditRule(rule: Rule) {
    if (!isUpcoming(rule)) return;
    const start = rule.startsAt ? new Date(rule.startsAt) : null;
    const localStart = start
      ? new Date(start.getTime() - start.getTimezoneOffset() * 60_000).toISOString().slice(0, 16)
      : "";
    setForm({
      productId: rule.product?.id ?? "",
      name: rule.name,
      type: rule.type,
      value: String(rule.value),
      minimumQuantity: String(rule.minimumQuantity),
      maximumQuantity: rule.maximumQuantity === null ? "" : String(rule.maximumQuantity),
      startsAt: localStart,
      priority: rule.priority,
      stackable: rule.stackable,
    });
    setEditingId(rule.id);
    setOpen(true);
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    try {
      const payload = {
        ...form,
        productId: form.productId || (editingId ? null : undefined),
        value: Number(form.value),
        minimumQuantity: Number(form.minimumQuantity),
        maximumQuantity: form.maximumQuantity ? Number(form.maximumQuantity) : (editingId ? null : undefined),
        startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : undefined,
      };
      if (editingId) await apiPatch(`/discounts/${editingId}`, payload);
      else await apiPost("/discounts", payload);
      setOpen(false);
      setMessage(editingId ? "Discount rule updated." : "Discount rule created.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create discount.");
    }
  }

  async function toggle(rule: Rule) {
    try {
      const disabling = rule.status === "ACTIVE";
      await apiPatch(`/discounts/${rule.id}`, { status: disabling ? "INACTIVE" : "ACTIVE" });
      setMessage(disabling ? "Discount rule disabled." : "Discount rule enabled.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to change discount rule status.");
    }
  }

  async function remove(rule: Rule) {
    if (!isUpcoming(rule) || !window.confirm(`Permanently delete the scheduled rule “${rule.name}”?`)) return;
    try {
      await apiDelete(`/discounts/${rule.id}`);
      setMessage("Discount rule deleted.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to delete discount rule.");
    }
  }

  return <main className="space-y-6 p-6">
    <div className="flex items-end justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#0E9384]">Sales configuration</p>
        <h1 className="text-2xl font-bold">Bulk Discounts</h1>
        <p className="text-sm text-slate-500">Quantity-based rules applied automatically during checkout.</p>
      </div>
      <button onClick={openNewRule} className="flex items-center gap-2 rounded-xl bg-[#0E9384] px-4 py-2 font-semibold text-white"><Plus className="h-4 w-4" />New rule</button>
    </div>
    {message && <div className="rounded-xl border border-teal-200 bg-teal-50 p-3 text-sm text-teal-800">{message}</div>}
    <div className="overflow-x-auto rounded-2xl border bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50"><tr><th className="px-4 py-3">Rule</th><th className="px-4 py-3">Product</th><th className="px-4 py-3">Quantity</th><th className="px-4 py-3">Discount</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr></thead>
        <tbody className="divide-y">{rules.map((rule) => <tr key={rule.id}>
          <td className="px-4 py-3 font-semibold">{rule.name}</td>
          <td className="px-4 py-3">{rule.product ? `${rule.product.sku} · ${rule.product.name}` : "All products"}</td>
          <td className="px-4 py-3">{Number(rule.minimumQuantity)}{rule.maximumQuantity ? `–${Number(rule.maximumQuantity)}` : "+"}</td>
          <td className="px-4 py-3">{Number(rule.value)}{rule.type === "PERCENTAGE" ? "%" : " fixed"}</td>
          <td className="px-4 py-3">{rule.status === "ACTIVE" && isUpcoming(rule) ? "SCHEDULED" : rule.status}</td>
          <td className="px-4 py-3 text-right"><div className="flex justify-end gap-3">
            {isUpcoming(rule) && <><button onClick={() => openEditRule(rule)} className="font-semibold text-[#0E9384]">Edit</button><button onClick={() => void remove(rule)} className="font-semibold text-red-600">Delete</button></>}
            <button onClick={() => void toggle(rule)} className="font-semibold text-[#0E9384]">{rule.status === "ACTIVE" ? "Disable" : "Enable"}</button>
          </div></td>
        </tr>)}</tbody>
      </table>
    </div>
    {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <form onSubmit={save} className="w-full max-w-xl space-y-4 rounded-2xl bg-white p-6">
        <h2 className="text-lg font-bold">{editingId ? "Edit discount rule" : "Create discount rule"}</h2>
        <label className="block text-xs font-semibold">Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 h-10 w-full rounded-xl border px-3" /></label>
        <label className="block text-xs font-semibold">Product<select value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} className="mt-1 h-10 w-full rounded-xl border px-3"><option value="">All products</option>{products.map((product) => <option key={product.id} value={product.id}>{product.sku} · {product.name}</option>)}</select></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold">Type<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="mt-1 h-10 w-full rounded-xl border px-3"><option value="PERCENTAGE">Percentage</option><option value="FIXED_AMOUNT">Fixed amount</option></select></label>
          <label className="text-xs font-semibold">Value<input required type="number" min="0" step="0.01" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="mt-1 h-10 w-full rounded-xl border px-3" /></label>
          <label className="text-xs font-semibold">Minimum quantity<input required type="number" min="1" value={form.minimumQuantity} onChange={(e) => setForm({ ...form, minimumQuantity: e.target.value })} className="mt-1 h-10 w-full rounded-xl border px-3" /></label>
          <label className="text-xs font-semibold">Maximum quantity<input type="number" min="1" value={form.maximumQuantity} onChange={(e) => setForm({ ...form, maximumQuantity: e.target.value })} className="mt-1 h-10 w-full rounded-xl border px-3" /></label>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.stackable} onChange={(e) => setForm({ ...form, stackable: e.target.checked })} />Allow stacking with other rules</label>
        <label className="block text-xs font-semibold">Start date and time ({editingId ? "required" : "optional; blank starts immediately"})<input required={Boolean(editingId)} type="datetime-local" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} className="mt-1 h-10 w-full rounded-xl border px-3" /></label>
        <div className="flex justify-end gap-3"><button type="button" onClick={() => setOpen(false)} className="rounded-xl border px-4 py-2">Cancel</button><button className="rounded-xl bg-[#0E9384] px-4 py-2 font-semibold text-white">{editingId ? "Save changes" : "Create rule"}</button></div>
      </form>
    </div>}
  </main>;
}
