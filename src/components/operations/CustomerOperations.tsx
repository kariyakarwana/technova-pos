"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { apiGet, apiPatch, apiPost } from "@/lib/api/client";
import PaginationControls, { type PageMeta } from "./PaginationControls";
type Customer = {
  id: string;
  customerNumber: string;
  firstName: string;
  lastName: string | null;
  phone: string | null;
  email: string | null;
  creditLimit: string | number;
  currentBalance: string | number;
  status: string;
  loyaltyAccount: { pointsBalance: string | number } | null;
};
const blank = {
  customerNumber: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  creditLimit: 0,
};
export default function CustomerOperations() {
  const [customers, setCustomers] = useState<Customer[]>([]),
    [meta, setMeta] = useState<PageMeta>({ page: 1, pageSize: 20, total: 0, pageCount: 0 }),
    [page, setPage] = useState(1),
    [pageSize, setPageSize] = useState(20),
    [search, setSearch] = useState(""),
    [status, setStatus] = useState(""),
    [form, setForm] = useState(blank),
    [editing, setEditing] = useState<Customer | null>(null),
    [open, setOpen] = useState(false),
    [message, setMessage] = useState<string | null>(null);
  const load = useCallback(
    () =>
      apiGet<{ data: Customer[]; meta: PageMeta }>(
        `/customers?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}${status ? `&status=${status}` : ""}`,
      ).then((result) => { setCustomers(result.data); setMeta(result.meta); }),
    [page, pageSize, search, status],
  );
  useEffect(() => {
    const timer = setTimeout(() => void load(), 250);
    return () => clearTimeout(timer);
  }, [load]);
  useEffect(() => setPage(1), [search, status, pageSize]);
  function edit(customer: Customer) {
    setEditing(customer);
    setForm({
      customerNumber: customer.customerNumber,
      firstName: customer.firstName,
      lastName: customer.lastName ?? "",
      phone: customer.phone ?? "",
      email: customer.email ?? "",
      creditLimit: Number(customer.creditLimit),
    });
    setOpen(true);
  }
  async function save(event: React.FormEvent) {
    event.preventDefault();
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName || undefined,
      phone: form.phone || undefined,
      email: form.email || undefined,
      creditLimit: form.creditLimit,
    };
    try {
      if (editing) await apiPatch(`/customers/${editing.id}`, payload);
      else
        await apiPost("/customers", {
          ...payload,
          customerNumber: form.customerNumber,
        });
      setOpen(false);
      setEditing(null);
      setForm(blank);
      setMessage("Customer saved successfully.");
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to save customer.",
      );
    }
  }
  async function toggle(customer: Customer) {
    await apiPatch(`/customers/${customer.id}`, {
      status: customer.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
    });
    await load();
  }
  return (
    <main className="space-y-6 p-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#0E9384]">
            CRM
          </p>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-sm text-slate-500">
            Customer profiles, loyalty and credit exposure.
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setForm(blank);
            setOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-[#0E9384] px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Add customer
        </button>
      </div>
      {message && (
        <div className="rounded-xl border border-teal-200 bg-teal-50 p-3 text-sm text-teal-800">
          {message}
        </div>
      )}
      <div className="rounded-2xl border bg-white p-4">
        <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_180px]">
          <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search number, name or phone"
            className="h-10 w-full rounded-xl border pl-10 pr-3 text-sm"
          />
          </div>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 rounded-xl border px-3 text-sm"><option value="">All statuses</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Credit</th>
                <th className="px-4 py-3">Loyalty</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-4 py-3">
                    <p className="font-semibold">
                      {customer.firstName} {customer.lastName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {customer.customerNumber}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p>{customer.phone ?? "—"}</p>
                    <p className="text-xs text-slate-500">
                      {customer.email ?? "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p>
                      {Number(customer.currentBalance).toLocaleString()} due
                    </p>
                    <p className="text-xs text-slate-500">
                      Limit {Number(customer.creditLimit).toLocaleString()}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    {Number(customer.loyaltyAccount?.pointsBalance ?? 0)} pts
                  </td>
                  <td className="px-4 py-3">{customer.status}</td>
                  <td className="space-x-3 px-4 py-3 text-right">
                    <Link
                      href={`/customers/${customer.id}`}
                      className="font-semibold text-[#0E9384]"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => edit(customer)}
                      className="font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggle(customer)}
                      className="font-semibold text-rose-600"
                    >
                      {customer.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationControls meta={meta} onPageChange={setPage} onPageSizeChange={setPageSize} />
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <form
            onSubmit={save}
            className="w-full max-w-xl space-y-4 rounded-2xl bg-white p-6"
          >
            <h2 className="text-lg font-bold">
              {editing ? "Edit customer" : "Add customer"}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {!editing && (
                <label className="text-xs font-semibold">
                  Customer number
                  <input
                    required
                    value={form.customerNumber}
                    onChange={(e) =>
                      setForm({ ...form, customerNumber: e.target.value })
                    }
                    className="mt-1 h-10 w-full rounded-xl border px-3"
                  />
                </label>
              )}
              <label className="text-xs font-semibold">
                First name
                <input
                  required
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  className="mt-1 h-10 w-full rounded-xl border px-3"
                />
              </label>
              <label className="text-xs font-semibold">
                Last name
                <input
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  className="mt-1 h-10 w-full rounded-xl border px-3"
                />
              </label>
              <label className="text-xs font-semibold">
                Phone
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1 h-10 w-full rounded-xl border px-3"
                />
              </label>
              <label className="text-xs font-semibold">
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 h-10 w-full rounded-xl border px-3"
                />
              </label>
              <label className="text-xs font-semibold">
                Credit limit
                <input
                  type="number"
                  min="0"
                  value={form.creditLimit}
                  onChange={(e) =>
                    setForm({ ...form, creditLimit: Number(e.target.value) })
                  }
                  className="mt-1 h-10 w-full rounded-xl border px-3"
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
                Save customer
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
