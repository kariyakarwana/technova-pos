import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { serverApi } from "@/lib/api/server";
import { requirePermission } from "@/lib/auth/session";

type AuditEvent = {
  id: string;
  action: string;
  outcome: string;
  createdAt: string;
  userAgent: string | null;
  user: { name: string | null; email: string } | null;
};
type Params = {
  page?: string;
  search?: string;
  action?: string;
  outcome?: string;
  from?: string;
  to?: string;
};

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  await requirePermission("audit:view", "/audit-log");
  const rawFilters = await searchParams;
  const filters: Params = {
    ...rawFilters,
    outcome: rawFilters.outcome === "all" ? undefined : rawFilters.outcome,
  };
  const page = Math.max(1, Number(filters.page) || 1);
  const query = new URLSearchParams({ page: String(page), pageSize: "20" });
  for (const key of ["search", "action", "outcome"] as const)
    if (filters[key]) query.set(key, filters[key]!);
  if (filters.from) query.set("from", `${filters.from}T00:00:00.000Z`);
  if (filters.to) query.set("to", `${filters.to}T23:59:59.999Z`);
  const result = await serverApi<{
    data: AuditEvent[];
    meta: { total: number; page: number; pageCount: number };
  }>(`/audit-events?${query}`);
  const pageLink = (next: number) => {
    const params = new URLSearchParams(
      Object.entries(filters).filter(([, value]) =>
        Boolean(value),
      ) as string[][],
    );
    params.set("page", String(next));
    return `/audit-log?${params}`;
  };
  return (
    <main className="space-y-6 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#0E9384]">
          Administration
        </p>
        <h1 className="text-2xl font-bold">Audit Log</h1>
        <p className="text-sm text-slate-500">
          Review security and business changes across the organization.
        </p>
      </div>
      <form className="grid gap-3 rounded-2xl border bg-white p-4 sm:grid-cols-2 xl:grid-cols-6">
        <input
          name="search"
          defaultValue={filters.search}
          placeholder="Action or user"
          className="h-10 rounded-xl border px-3 text-sm"
        />
        <input
          name="action"
          defaultValue={filters.action}
          placeholder="Exact action"
          className="h-10 rounded-xl border px-3 text-sm"
        />
        <Select name="outcome" defaultValue={filters.outcome || "all"}>
          <SelectTrigger className="h-10 data-[size=default]:h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal text-slate-700 shadow-none focus-visible:border-[#0E9384] focus-visible:ring-0 cursor-pointer">
            <SelectValue placeholder="All outcomes" />
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
              All outcomes
            </SelectItem>
            <SelectItem
              value="SUCCESS"
              className="cursor-pointer text-sm text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
            >
              Success
            </SelectItem>
            <SelectItem
              value="FAILURE"
              className="cursor-pointer text-sm text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
            >
              Failure
            </SelectItem>
          </SelectContent>
        </Select>
        <input
          name="from"
          type="date"
          defaultValue={filters.from}
          className="h-10 rounded-xl border px-3"
        />
        <input
          name="to"
          type="date"
          defaultValue={filters.to}
          className="h-10 rounded-xl border px-3"
        />
        <button className="h-10 rounded-xl bg-[#0E9384] px-4 font-semibold text-white">
          Apply
        </button>
        <Link
          href="/audit-log"
          className="h-10 rounded-xl border px-4 text-center text-sm font-semibold leading-10 text-slate-700 hover:bg-slate-50 sm:col-span-2 xl:col-span-6"
        >
          Clear filters
        </Link>
      </form>
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4 text-sm font-semibold">
          {result.meta.total} recorded events
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Time</th>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Action</th>
                <th className="px-5 py-3">Outcome</th>
                <th className="px-5 py-3">Context</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {result.data.map((event) => (
                <tr key={event.id}>
                  <td className="whitespace-nowrap px-5 py-3 text-slate-500">
                    {new Date(event.createdAt).toLocaleString()}
                  </td>
                  <td className="px-5 py-3">
                    {event.user?.name ?? event.user?.email ?? "System"}
                  </td>
                  <td className="px-5 py-3 font-medium">
                    {event.action.replaceAll("_", " ")}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${event.outcome === "SUCCESS" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
                    >
                      {event.outcome}
                    </span>
                  </td>
                  <td className="max-w-xs truncate px-5 py-3 text-slate-500">
                    {event.userAgent ?? "Server operation"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between border-t p-4 text-sm">
          <span>
            Page {result.meta.page} of {Math.max(1, result.meta.pageCount)}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={pageLink(page - 1)}
                className="rounded-lg border px-3 py-1.5"
              >
                Previous
              </Link>
            )}
            {page < result.meta.pageCount && (
              <Link
                href={pageLink(page + 1)}
                className="rounded-lg border px-3 py-1.5"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
