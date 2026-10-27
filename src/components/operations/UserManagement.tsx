"use client";

import { useCallback, useEffect, useState } from "react";
import { Mail, MessageCircle, Search, UserPlus } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api/client";
import PaginationControls, { type PageMeta } from "./PaginationControls";

type Page<T> = { data: T[]; meta: PageMeta };
type Role = { id: string; name: string };
type Branch = { id: string; code: string; name: string };
type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
type User = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  status: UserStatus;
  lastLoginAt: string | null;
  roles: { role: Role }[];
  branchAssignments: { isDefault: boolean; branch: Branch }[];
};
const emptyForm = {
  name: "",
  email: "",
  phone: "",
  roleIds: [] as string[],
  branchIds: [] as string[],
  status: "ACTIVE" as UserStatus,
  defaultBranchId: "",
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [meta, setMeta] = useState<PageMeta>({
    page: 1,
    pageSize: 20,
    total: 0,
    pageCount: 0,
  });
  const [page, setPage] = useState(1),
    [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState(""),
    [branchFilter, setBranchFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState(""),
    [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<User | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadUsers = useCallback(async () => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });
    if (search.trim()) params.set("search", search.trim());
    if (branchFilter) params.set("branchId", branchFilter);
    if (roleFilter) params.set("roleId", roleFilter);
    if (statusFilter) params.set("status", statusFilter);
    const result = await apiGet<Page<User>>(`/users?${params}`);
    setUsers(result.data);
    setMeta(result.meta);
  }, [branchFilter, page, pageSize, roleFilter, search, statusFilter]);

  useEffect(() => {
    void Promise.all([
      apiGet<Role[]>("/roles"),
      apiGet<Page<Branch>>("/branches?pageSize=100"),
    ])
      .then(([roleResult, branchResult]) => {
        setRoles(roleResult);
        setBranches(branchResult.data);
      })
      .catch((error) =>
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to load employee options.",
          { duration: 8000 },
        ),
      );
  }, []);
  useEffect(() => {
    void loadUsers().catch((error) =>
      toast.error(
        error instanceof Error ? error.message : "Unable to load employees.",
        { duration: 8000 },
      ),
    );
  }, [loadUsers]);
  useEffect(
    () => setPage(1),
    [branchFilter, pageSize, roleFilter, search, statusFilter],
  );

  function toggle(field: "roleIds" | "branchIds", id: string) {
    setForm((current) => ({
      ...current,
      [field]: current[field].includes(id)
        ? current[field].filter((value) => value !== id)
        : [...current[field], id],
    }));
  }
  function edit(user: User) {
    const branchIds = user.branchAssignments.map(({ branch }) => branch.id);
    setSelected(user);
    setForm({
      name: user.name ?? "",
      email: user.email,
      phone: user.phone ?? "",
      roleIds: user.roles.map(({ role }) => role.id),
      branchIds,
      status: user.status,
      defaultBranchId:
        user.branchAssignments.find(({ isDefault }) => isDefault)?.branch.id ??
        branchIds[0] ??
        "",
    });
  }
  function resetForm() {
    setSelected(null);
    setForm(emptyForm);
  }
  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!form.roleIds.length || !form.branchIds.length) {
      toast.error(
        "Select at least one role and one branch for the employee.",
        { duration: 8000 },
      );
      return;
    }
    setSaving(true);
    try {
      if (selected) {
        await apiPatch(`/users/${selected.id}/access`, {
          name: form.name,
          phone: form.phone,
          status: form.status,
          roleIds: form.roleIds,
          branchIds: form.branchIds,
          defaultBranchId: form.defaultBranchId || form.branchIds[0],
        });
        toast.success("Employee access updated. Existing sessions were revoked.", { duration: 5000 });
      } else {
        const created = await apiPost<{ whatsappQueued: boolean }>("/users", {
          name: form.name,
          email: form.email,
          phone: form.phone,
          roleIds: form.roleIds,
          branchIds: form.branchIds,
        });
        toast.success(
          created.whatsappQueued
            ? `Employee account created. The temporary password was emailed to ${form.email}, and a WhatsApp welcome was queued for ${form.phone}.`
            : `Employee account created and emailed to ${form.email}. The WhatsApp message could not be queued; check the WhatsApp configuration and notification template.`,
          { duration: 5000 },
        );
      }
      resetForm();
      await loadUsers();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save employee.",
        { duration: 8000 },
      );
    } finally {
      setSaving(false);
    }
  }
  async function changeState(user: User) {
    const nextStatus: UserStatus =
      user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    if (
      !window.confirm(
        `${nextStatus === "ACTIVE" ? "Activate" : "Deactivate"} ${user.name || user.email}?`,
      )
    )
      return;
    try {
      await apiPatch(`/users/${user.id}/access`, { status: nextStatus });
      toast.success(
        `Employee ${nextStatus === "ACTIVE" ? "activated" : "deactivated"} successfully.`,
        { duration: 5000 },
      );
      await loadUsers();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update employee state.",
        { duration: 8000 },
      );
    }
  }
  async function remove(user: User) {
    if (
      !window.confirm(
        `Permanently delete ${user.name || user.email}? This cannot be undone.`,
      )
    )
      return;
    try {
      await apiDelete(`/users/${user.id}`);
      toast.success("Employee deleted successfully.", { duration: 5000 });
      if (selected?.id === user.id) resetForm();
      await loadUsers();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete employee.",
        { duration: 8000 },
      );
    }
  }
  const input =
    "mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-[#0E9384]";

  return (
    <main className="space-y-6 bg-[#F8FAFC] p-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#0E9384]">
          Administration
        </p>
        <h1 className="text-2xl font-bold">Employees & Access</h1>
        <p className="text-sm text-slate-500">
          Create staff accounts and control their roles, branches and account
          status.
        </p>
      </header>
      <div className="grid gap-6 xl:grid-cols-[400px_1fr]">
        <form
          onSubmit={save}
          className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold">
                {selected ? "Edit employee" : "Create employee"}
              </h2>
              {!selected && (
                <p className="mt-1 text-xs text-slate-500">
                  A secure temporary password will be emailed and a WhatsApp
                  welcome will be queued automatically.
                </p>
              )}
            </div>
            {selected && (
              <button
                type="button"
                onClick={resetForm}
                className="text-sm font-semibold text-[#0E9384]"
              >
                New employee
              </button>
            )}
          </div>
          <label className="block text-xs font-semibold">
            Full name *
            <input
              required
              minLength={2}
              maxLength={120}
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              className={input}
            />
          </label>
          <label className="block text-xs font-semibold">
            Email *
            <input
              required
              type="email"
              disabled={Boolean(selected)}
              value={form.email}
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
              className={`${input} disabled:bg-slate-50`}
            />
          </label>
          <label className="block text-xs font-semibold">
            Phone number *
            <input
              required
              type="tel"
              inputMode="tel"
              maxLength={30}
              pattern="\+?[0-9]{8,15}"
              placeholder="+94771234567"
              value={form.phone}
              onChange={(event) =>
                setForm({ ...form, phone: event.target.value })
              }
              className={input}
            />
          </label>
          {!selected && (
            <div className="flex gap-3 rounded-xl border border-teal-100 bg-teal-50 p-3 text-xs text-teal-800">
              <div className="flex shrink-0 gap-1">
                <Mail className="h-5 w-5" />
                <MessageCircle className="h-5 w-5" />
              </div>
              <p>
                Email carries the temporary password. WhatsApp confirms the
                account and sign-in link without exposing the password. If email
                delivery fails, the account is not created.
              </p>
            </div>
          )}
          {selected && (
            <label className="block text-xs font-semibold">
              Status
              <Select
                value={form.status}
                onValueChange={(val) =>
                  setForm({ ...form, status: val as UserStatus })
                }
              >
                <SelectTrigger className="mt-1 h-10 data-[size=default]:h-10 w-full rounded-xl border border-slate-200 bg-white px-3 font-normal text-xs text-slate-800 shadow-none focus-visible:border-[#0E9384] focus-visible:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </label>
          )}
          <fieldset>
            <legend className="text-xs font-semibold">Roles *</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {roles.map((role) => (
                <label
                  key={role.id}
                  className="flex items-center gap-2 rounded-lg border p-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={form.roleIds.includes(role.id)}
                    onChange={() => toggle("roleIds", role.id)}
                  />
                  {role.name.replaceAll("_", " ")}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-xs font-semibold">
              Assigned branches *
            </legend>
            <div className="mt-2 max-h-40 space-y-2 overflow-auto">
              {branches.map((branch) => (
                <label
                  key={branch.id}
                  className="flex items-center gap-2 rounded-lg border p-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={form.branchIds.includes(branch.id)}
                    onChange={() => toggle("branchIds", branch.id)}
                  />
                  {branch.code} — {branch.name}
                </label>
              ))}
            </div>
          </fieldset>
          {selected && form.branchIds.length > 0 && (
            <label className="block text-xs font-semibold">
              Default branch
              <Select
                value={form.defaultBranchId || undefined}
                onValueChange={(val) =>
                  setForm({ ...form, defaultBranchId: val })
                }
              >
                <SelectTrigger className="mt-1 h-10 data-[size=default]:h-10 w-full rounded-xl border border-slate-200 bg-white px-3 font-normal text-xs text-slate-800 shadow-none focus-visible:border-[#0E9384] focus-visible:ring-0">
                  <SelectValue placeholder="Select default branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches
                    .filter(({ id }) => form.branchIds.includes(id))
                    .map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </label>
          )}
          <button
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0E9384] px-4 py-2.5 font-semibold text-white disabled:opacity-50"
          >
            <UserPlus className="h-4 w-4" />
            {saving
              ? "Saving..."
              : selected
                ? "Update employee"
                : "Create and send welcome"}
          </button>
        </form>
        <section className="min-w-0 overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-b p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-bold">Staff accounts ({meta.total})</h2>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setBranchFilter("");
                  setRoleFilter("");
                  setStatusFilter("");
                }}
                className="text-sm font-semibold text-[#0E9384]"
              >
                Clear filters
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <label className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, email or phone"
                  className="h-10 w-full rounded-xl border pl-9 pr-3 text-sm"
                />
              </label>
              <Select
                value={branchFilter || "all"}
                onValueChange={(v) => setBranchFilter(v === "all" ? "" : v)}
              >
                <SelectTrigger
                  aria-label="Filter by branch"
                  className="h-10 data-[size=default]:h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal text-slate-700 shadow-none focus-visible:border-[#0E9384] focus-visible:ring-0 cursor-pointer"
                >
                  <SelectValue placeholder="All branches" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  sideOffset={4}
                  className="w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] max-h-72 rounded-xl border border-slate-200 bg-white p-1 shadow-lg ring-0"
                >
                  <SelectItem
                    value="all"
                    className="cursor-pointer text-sm text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
                  >
                    All branches
                  </SelectItem>
                  {branches.map((branch) => (
                    <SelectItem
                      key={branch.id}
                      value={branch.id}
                      className="cursor-pointer text-sm text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
                    >
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={roleFilter || "all"}
                onValueChange={(v) => setRoleFilter(v === "all" ? "" : v)}
              >
                <SelectTrigger
                  aria-label="Filter by role"
                  className="h-10 data-[size=default]:h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal text-slate-700 shadow-none focus-visible:border-[#0E9384] focus-visible:ring-0 cursor-pointer"
                >
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  sideOffset={4}
                  className="w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] max-h-72 rounded-xl border border-slate-200 bg-white p-1 shadow-lg ring-0"
                >
                  <SelectItem
                    value="all"
                    className="cursor-pointer text-sm text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
                  >
                    All roles
                  </SelectItem>
                  {roles.map((role) => (
                    <SelectItem
                      key={role.id}
                      value={role.id}
                      className="cursor-pointer text-sm text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
                    >
                      {role.name.replaceAll("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={statusFilter || "all"}
                onValueChange={(v) => setStatusFilter(v === "all" ? "" : v)}
              >
                <SelectTrigger
                  aria-label="Filter by state"
                  className="h-10 data-[size=default]:h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal text-slate-700 shadow-none focus-visible:border-[#0E9384] focus-visible:ring-0 cursor-pointer"
                >
                  <SelectValue placeholder="All states" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  sideOffset={4}
                  className="w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] max-h-72 rounded-xl border border-slate-200 bg-white p-1 shadow-lg ring-0"
                >
                  <SelectItem
                    value="all"
                    className="cursor-pointer text-sm text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
                  >
                    All states
                  </SelectItem>
                  <SelectItem
                    value="ACTIVE"
                    className="cursor-pointer text-sm text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
                  >
                    Active
                  </SelectItem>
                  <SelectItem
                    value="INACTIVE"
                    className="cursor-pointer text-sm text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
                  >
                    Inactive
                  </SelectItem>
                  <SelectItem
                    value="SUSPENDED"
                    className="cursor-pointer text-sm text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
                  >
                    Suspended
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="p-4">Employee</th>
                  <th className="p-4">Roles</th>
                  <th className="p-4">Branches</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Last login</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t hover:bg-teal-50/30">
                    <td className="p-4">
                      <p className="font-semibold">
                        {user.name || "Unnamed employee"}
                      </p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                      <p className="text-xs text-slate-500">
                        {user.phone || "No phone number"}
                      </p>
                    </td>
                    <td className="p-4">
                      {user.roles
                        .map(({ role }) => role.name.replaceAll("_", " "))
                        .join(", ") || "—"}
                    </td>
                    <td className="p-4">
                      {user.branchAssignments
                        .map(
                          ({ branch, isDefault }) =>
                            `${branch.code}${isDefault ? " ★" : ""}`,
                        )
                        .join(", ") || "—"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${user.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs">
                      {user.lastLoginAt
                        ? new Date(user.lastLoginAt).toLocaleString()
                        : "Never"}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => edit(user)}
                          className="font-semibold text-[#0E9384]"
                        >
                          Manage
                        </button>
                        <button
                          onClick={() => void changeState(user)}
                          className={`font-semibold ${user.status === "ACTIVE" ? "text-amber-600" : "text-emerald-600"}`}
                        >
                          {user.status === "ACTIVE" ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => void remove(user)}
                          className="font-semibold text-rose-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!users.length && (
              <p className="p-8 text-center text-sm text-slate-500">
                No employees match these filters.
              </p>
            )}
          </div>
          <PaginationControls
            meta={meta}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </section>
      </div>
    </main>
  );
}
