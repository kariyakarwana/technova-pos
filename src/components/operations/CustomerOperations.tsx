"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  loyaltyAccount: { points: string | number } | null;
  user?: { status: string; lastLoginAt: string | null } | null;
};
const blank = {
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
    [formError, setFormError] = useState<string | null>(null),
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
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(null), 5_000);
    return () => window.clearTimeout(timer);
  }, [message]);
  function edit(customer: Customer) {
    setFormError(null);
    setEditing(customer);
    setForm({
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
    setFormError(null);
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName || undefined,
      phone: form.phone.trim(),
      email: form.email.trim().toLowerCase(),
      creditLimit: form.creditLimit,
    };
    try {
      if (editing) {
        await apiPatch(`/customers/${editing.id}`, payload);
        setMessage("Customer updated successfully.");
      } else {
        const created = await apiPost<
          Customer & {
            welcomeNotifications: {
              emailQueued: boolean;
              whatsappQueued: boolean;
            };
            credentialsCreated: boolean;
            temporaryPasswordSent: boolean;
          }
        >("/customers", payload);
        const channels = [
          created.welcomeNotifications.emailQueued ? "email" : null,
          created.welcomeNotifications.whatsappQueued ? "WhatsApp" : null,
        ].filter(Boolean);
        setMessage(
          `Customer ${created.customerNumber} and mobile login created successfully.${
            channels.length
              ? ` Temporary credentials queued by ${channels.join(" and ")}.`
              : " Credentials could not be queued; check notification delivery settings."
          }`,
        );
      }
      setOpen(false);
      setEditing(null);
      setForm(blank);
      await load();
    } catch (error) {
      setFormError(
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
            setFormError(null);
            setOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-[#0E9384] px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Add customer
        </button>
      </div>
      {message && (
        <div role="status" className="flex items-start justify-between gap-3 rounded-xl border border-teal-200 bg-teal-50 p-3 text-sm text-teal-800">
          <span>{message}</span>
          <button type="button" onClick={() => setMessage(null)} aria-label="Dismiss message" className="shrink-0 rounded p-1 hover:bg-teal-100"><X className="h-4 w-4" /></button>
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
          <Select
            value={status || "all"}
            onValueChange={(v) => setStatus(v === "all" ? "" : v)}
          >
            <SelectTrigger className="h-10 data-[size=default]:h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal text-slate-700 shadow-none focus-visible:border-[#0E9384] focus-visible:ring-0 cursor-pointer">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={4}
              className="w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] rounded-xl border border-slate-200 bg-white p-1 shadow-lg ring-0"
            >
              <SelectItem
                value="all"
                className="cursor-pointer text-sm text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
              >
                All statuses
              </SelectItem>
              <SelectItem
                value="ACTIVE"
                className="cursor-pointer text-sm text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
              >
                ACTIVE
              </SelectItem>
              <SelectItem
                value="INACTIVE"
                className="cursor-pointer text-sm text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
              >
                INACTIVE
              </SelectItem>
            </SelectContent>
          </Select>
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
                    <p className="max-w-64 truncate font-semibold" title={`${customer.firstName} ${customer.lastName ?? ""}`}>
                      {customer.firstName} {customer.lastName}
                    </p>
                    <p className="max-w-64 break-all text-xs text-slate-500">
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
                      {Number(customer.currentBalance ?? 0).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} due
                    </p>
                    <p className="text-xs text-slate-500">
                      Limit {Number(customer.creditLimit ?? 0).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    {Number(customer.loyaltyAccount?.points ?? 0)} pts
                  </td>
                  <td className="px-4 py-3">{customer.status === "ACTIVE" ? "Active" : customer.status === "INACTIVE" ? "Inactive" : customer.status}</td>
                  <td className="min-w-64 px-4 py-3 text-right">
                    <div className="grid grid-cols-[48px_48px_90px] items-center justify-end gap-3">
                    <Link
                      href={`/customers/${customer.id}`}
                      className="text-center font-semibold text-[#0E9384]"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => edit(customer)}
                      className="text-center font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggle(customer)}
                      className="text-center font-semibold text-rose-600"
                    >
                      {customer.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </button>
                    </div>
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
            {formError && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{formError}</div>}
            <div className="grid gap-4 sm:grid-cols-2">
              {!editing && (
                <div className="rounded-xl border border-teal-200 bg-teal-50 p-3 text-xs text-teal-800 sm:col-span-2">
                  <p className="font-semibold">Customer number and mobile login</p>
                  <p className="mt-1 leading-5">
                    The customer number and a one-time password are generated automatically. Credentials are sent to the customer by Gmail and WhatsApp, and the customer must change the password after signing in.
                  </p>
                </div>
              )}
              <label className="text-xs font-semibold">
                First name
                <input
                  required
                  maxLength={100}
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
                  maxLength={100}
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  className="mt-1 h-10 w-full rounded-xl border px-3"
                />
              </label>
              <label className="text-xs font-semibold">
                Phone <span className="text-rose-600">*</span>
                <input
                  required
                  type="tel"
                  pattern="\+[1-9][0-9]{7,14}"
                  maxLength={16}
                  title="Use international format with a country code, for example +94771234567."
                  placeholder="+94771234567"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1 h-10 w-full rounded-xl border px-3"
                />
              </label>
              <label className="text-xs font-semibold">
                Email <span className="text-rose-600">*</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 h-10 w-full rounded-xl border px-3"
                />
                <span className="mt-1 block font-normal text-slate-500">
                  Used to deliver the temporary password.
                </span>
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
