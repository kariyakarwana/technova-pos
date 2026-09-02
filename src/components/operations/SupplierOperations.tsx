"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Plus, RefreshCw, Search, X } from "lucide-react";
import { apiGet, apiPatch, apiPost } from "@/lib/api/client";

type Supplier = {
  id: string;
  code: string;
  name: string;
  contactName: string | null;
  phone: string | null;
  email: string | null;
  status: string;
};
const emptyForm = { code: "", name: "", contactName: "", phone: "", email: "" };

export default function SupplierOperations() {
  const [items, setItems] = useState<Supplier[]>([]),
    [query, setQuery] = useState(""),
    [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<Supplier | null>(null),
    [open, setOpen] = useState(false),
    [message, setMessage] = useState<string | null>(null);
  const load = useCallback(
    () =>
      apiGet<{ data: Supplier[] }>("/suppliers?pageSize=100")
        .then((result) => setItems(result.data))
        .catch((error) => setMessage(error.message)),
    [],
  );
  useEffect(() => {
    void load();
  }, [load]);
  function startEdit(item: Supplier) {
    setEditing(item);
    setForm({
      code: item.code,
      name: item.name,
      contactName: item.contactName ?? "",
      phone: item.phone ?? "",
      email: item.email ?? "",
    });
    setOpen(true);
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    try {
      const payload = {
        name: form.name,
        contactName: form.contactName || undefined,
        phone: form.phone || undefined,
        email: form.email || undefined,
      };
      if (editing) await apiPatch(`/suppliers/${editing.id}`, payload);
      else await apiPost("/suppliers", { ...payload, code: form.code });
      setOpen(false);
      setEditing(null);
      setForm(emptyForm);
      setMessage("Supplier saved successfully.");
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to save supplier.",
      );
    }
  }
  async function toggle(item: Supplier) {
    await apiPatch(`/suppliers/${item.id}`, {
      status: item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
    });
    await load();
  }
  const filtered = items.filter((item) =>
    `${item.code} ${item.name} ${item.contactName ?? ""} ${item.email ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <main className="space-y-6 p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#0E9384]">
            Purchasing
          </p>
          <h1 className="text-2xl font-bold">Supplier Management</h1>
          <p className="text-sm text-slate-500">
            Maintain the approved vendor directory used by purchase orders.
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setForm(emptyForm);
            setOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-[#0E9384] px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Add supplier
        </button>
      </div>
      {message && (
        <div className="rounded-xl border border-teal-200 bg-teal-50 p-3 text-sm text-teal-800">
          {message}
        </div>
      )}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search suppliers"
              className="h-10 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-sm"
            />
          </div>
          <button
            onClick={load}
            aria-label="Refresh"
            className="rounded-xl border border-slate-200 p-2.5"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Supplier</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-mono text-xs">{item.code}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      {item.email ?? "No email"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p>{item.contactName ?? "—"}</p>
                    <p className="text-xs text-slate-500">
                      {item.phone ?? "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3">{item.status}</td>
                  <td className="space-x-3 px-4 py-3 text-right">
                    <Link
                      href={`/suppliers/${item.id}`}
                      className="font-semibold text-[#0E9384]"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => startEdit(item)}
                      className="font-semibold text-slate-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggle(item)}
                      className="font-semibold text-rose-600"
                    >
                      {item.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <form
            onSubmit={submit}
            className="w-full max-w-xl space-y-4 rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">
                {editing ? "Edit supplier" : "Add supplier"}
              </h2>
              <button type="button" onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {!editing && (
                <label className="text-xs font-semibold">
                  Supplier code
                  <input
                    required
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="mt-1 h-10 w-full rounded-xl border px-3 text-sm"
                  />
                </label>
              )}
              <label className="text-xs font-semibold">
                Company name
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 h-10 w-full rounded-xl border px-3 text-sm"
                />
              </label>
              <label className="text-xs font-semibold">
                Contact person
                <input
                  value={form.contactName}
                  onChange={(e) =>
                    setForm({ ...form, contactName: e.target.value })
                  }
                  className="mt-1 h-10 w-full rounded-xl border px-3 text-sm"
                />
              </label>
              <label className="text-xs font-semibold">
                Phone
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1 h-10 w-full rounded-xl border px-3 text-sm"
                />
              </label>
              <label className="text-xs font-semibold sm:col-span-2">
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 h-10 w-full rounded-xl border px-3 text-sm"
                />
              </label>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border px-4 py-2"
              >
                Cancel
              </button>
              <button className="rounded-xl bg-[#0E9384] px-4 py-2 font-semibold text-white">
                Save supplier
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
