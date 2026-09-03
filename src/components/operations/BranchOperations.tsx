"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Pencil, Plus, Search, X } from "lucide-react";
import { apiGet, apiPatch, apiPost } from "@/lib/api/client";
import PaginationControls, { type PageMeta } from "./PaginationControls";

type Branch = { id: string; code: string; name: string; phone: string | null; email: string | null; address: Record<string, string> | null; status: "ACTIVE" | "INACTIVE" };
type Page<T> = { data: T[] };
type Form = { code: string; name: string; phone: string; email: string; street: string; city: string; country: string };
const emptyForm: Form = { code: "", name: "", phone: "", email: "", street: "", city: "", country: "Sri Lanka" };
function FieldError({ message }: { message?: string }) { return message ? <span className="mt-1 block text-[11px] font-medium text-rose-600">{message}</span> : null; }

export default function BranchOperations() {
  const router = useRouter();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [editing, setEditing] = useState<Branch | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Form>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [messageKind, setMessageKind] = useState<"success" | "error">("success");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1), [pageSize, setPageSize] = useState(20);

  async function load() { try { setBranches((await apiGet<Page<Branch>>("/branches?pageSize=100")).data); } catch (error) { setMessageKind("error"); setMessage(error instanceof Error ? error.message : "Unable to load branches."); } }
  useEffect(() => { void load(); }, []);
  const visible = useMemo(() => branches.filter((branch) => `${branch.code} ${branch.name} ${branch.phone ?? ""} ${branch.email ?? ""} ${branch.address?.city ?? ""}`.toLowerCase().includes(search.toLowerCase())), [branches, search]);
  const pageCount = Math.ceil(visible.length / pageSize);
  const rows = visible.slice((page - 1) * pageSize, page * pageSize);
  const meta: PageMeta = { page, pageSize, total: visible.length, pageCount };
  useEffect(() => setPage(1), [search, pageSize]);

  function update(field: keyof Form, value: string) {
    setForm((current) => ({ ...current, [field]: field === "code" ? value.toUpperCase() : value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }
  function validate() {
    const next: Partial<Record<keyof Form, string>> = {};
    if (form.code.trim().length < 2) next.code = "Enter a branch code with at least 2 characters.";
    if (form.name.trim().length < 2) next.name = "Enter the branch name.";
    if (!form.phone.trim()) next.phone = "Enter the branch contact number.";
    else if (!/^[+\d][\d\s()-]{6,29}$/.test(form.phone.trim())) next.phone = "Enter a valid phone number.";
    if (!form.email.trim()) next.email = "Enter the branch email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (!form.street.trim()) next.street = "Enter the street address.";
    if (!form.city.trim()) next.city = "Enter the city.";
    if (!form.country.trim()) next.country = "Enter the country.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }
  function beginAdd() { setEditing(null); setForm(emptyForm); setErrors({}); setMessage(null); setShowForm(true); }
  function beginEdit(branch: Branch) { setEditing(branch); setForm({ code: branch.code, name: branch.name, phone: branch.phone ?? "", email: branch.email ?? "", street: branch.address?.street ?? "", city: branch.address?.city ?? "", country: branch.address?.country ?? "Sri Lanka" }); setErrors({}); setMessage(null); setShowForm(true); }
  function closeForm() { setShowForm(false); setEditing(null); setForm(emptyForm); setErrors({}); }
  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) { setMessageKind("error"); setMessage("Please correct the highlighted fields before saving the branch."); return; }
    setSaving(true); setMessage(null);
    const body = { code: form.code.trim(), name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(), address: { street: form.street.trim(), city: form.city.trim(), country: form.country.trim() } };
    try {
      if (editing) await apiPatch(`/branches/${editing.id}`, body); else await apiPost("/branches", body);
      closeForm(); setMessageKind("success"); setMessage(editing ? "Branch updated successfully." : "Branch created successfully."); await load(); router.refresh();
    } catch (error) { setMessageKind("error"); setMessage(error instanceof Error ? error.message : "Unable to save branch."); }
    finally { setSaving(false); }
  }
  async function toggle(branch: Branch) { try { await apiPatch(`/branches/${branch.id}`, { status: branch.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }); await load(); router.refresh(); } catch (error) { setMessageKind("error"); setMessage(error instanceof Error ? error.message : "Unable to update branch."); } }
  const fieldClass = (field: keyof Form) => `mt-1 h-10 w-full rounded-xl border px-3 outline-none transition focus:ring-2 focus:ring-[#0E9384]/10 ${errors[field] ? "border-rose-400 bg-rose-50/40" : "border-slate-200 focus:border-[#0E9384]"}`;

  return <main className="space-y-5 bg-[#F8FAFC] p-6">
    <header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wider text-[#0E9384]">Organization</p><h1 className="text-2xl font-bold">Branch Management</h1><p className="text-sm text-slate-500">Configure locations used by staff, stock, purchasing and POS.</p></div>{!showForm && <button type="button" onClick={beginAdd} className="inline-flex items-center gap-2 rounded-xl bg-[#0E9384] px-4 py-2.5 text-sm font-semibold text-white"><Plus className="h-4 w-4"/>Add branch</button>}</header>
    {message && <div role="alert" className={`rounded-xl border p-3 text-sm ${messageKind === "error" ? "border-rose-200 bg-rose-50 text-rose-700" : "border-teal-200 bg-teal-50 text-teal-800"}`}>{message}</div>}
    {showForm ? <form noValidate onSubmit={save} className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b px-5 py-4"><div className="flex items-center gap-3"><span className="rounded-xl bg-teal-50 p-2 text-[#0E9384]"><Building2 className="h-5 w-5"/></span><div><h2 className="font-bold">{editing ? "Update branch" : "Add new branch"}</h2><p className="text-xs text-slate-500">Fields marked with * are required.</p></div></div><button type="button" onClick={closeForm} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5"/></button></div>
      <div className="grid gap-5 p-5 md:grid-cols-2">
        <label className="text-xs font-semibold">Branch code *<input autoFocus required disabled={Boolean(editing)} value={form.code} onChange={(event) => update("code", event.target.value)} placeholder="e.g. COL-01" className={`${fieldClass("code")} disabled:bg-slate-50`}/><FieldError message={errors.code}/></label>
        <label className="text-xs font-semibold">Branch name *<input required value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="e.g. Colombo Main Branch" className={fieldClass("name")}/><FieldError message={errors.name}/></label>
        <label className="text-xs font-semibold">Phone number *<input required type="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="+94 77 123 4567" className={fieldClass("phone")}/><FieldError message={errors.phone}/></label>
        <label className="text-xs font-semibold">Email address *<input required type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="branch@technova.lk" className={fieldClass("email")}/><FieldError message={errors.email}/></label>
        <label className="text-xs font-semibold md:col-span-2">Street address *<input required value={form.street} onChange={(event) => update("street", event.target.value)} placeholder="Building number and street" className={fieldClass("street")}/><FieldError message={errors.street}/></label>
        <label className="text-xs font-semibold">City *<input required value={form.city} onChange={(event) => update("city", event.target.value)} placeholder="Colombo" className={fieldClass("city")}/><FieldError message={errors.city}/></label>
        <label className="text-xs font-semibold">Country *<input required value={form.country} onChange={(event) => update("country", event.target.value)} className={fieldClass("country")}/><FieldError message={errors.country}/></label>
      </div>
      <div className="flex justify-end gap-3 border-t bg-slate-50 px-5 py-4"><button type="button" onClick={closeForm} className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold">Cancel</button><button disabled={saving} className="rounded-xl bg-[#0E9384] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving branch…" : editing ? "Update branch" : "Add branch"}</button></div>
    </form> : <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4"><div><h2 className="font-bold">Organization branches</h2><p className="text-xs text-slate-500">{visible.length} matching locations</p></div><div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400"/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search code, name or city" className="h-10 w-64 rounded-xl border pl-9 pr-3 text-sm"/></div></div>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-4">Branch</th><th className="p-4">Contact</th><th className="p-4">Address</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead><tbody>{rows.map((branch) => <tr key={branch.id} className="border-t hover:bg-teal-50/30"><td className="p-4"><p className="font-semibold">{branch.name}</p><p className="text-xs text-[#0E9384]">{branch.code}</p></td><td className="p-4"><p>{branch.phone || "—"}</p><p className="text-xs text-slate-500">{branch.email || "—"}</p></td><td className="p-4">{[branch.address?.street, branch.address?.city, branch.address?.country].filter(Boolean).join(", ") || "—"}</td><td className="p-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${branch.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{branch.status}</span></td><td className="space-x-3 whitespace-nowrap p-4 text-right"><button type="button" onClick={() => beginEdit(branch)} className="inline-flex items-center gap-1 font-semibold text-[#0E9384]"><Pencil className="h-3.5 w-3.5"/>Edit</button><button type="button" onClick={() => void toggle(branch)} className="font-semibold text-slate-600">{branch.status === "ACTIVE" ? "Deactivate" : "Activate"}</button></td></tr>)}</tbody></table>{!rows.length && <p className="p-8 text-center text-sm text-slate-500">No branches match your search.</p>}</div>
      <PaginationControls meta={meta} onPageChange={setPage} onPageSizeChange={setPageSize}/>
    </section>}
  </main>;
}
