import Link from "next/link";
import ReportSummaryExport from "@/components/reports/ReportSummaryExport";
import { serverApi } from "@/lib/api/server";
import { requirePermission } from "@/lib/auth/session";

type DashboardReport = { period: { from: string; to: string }; sales: { count: number; total: number }; customers: number; lowStockCount: number; credit: { accounts: number; outstanding: number }; returns: { count: number; total: number } };
const money = (value: number) => new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(value);

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
  await requirePermission("reports:view", "/reports");
  const input = await searchParams;
  const query = new URLSearchParams();
  if (input.from) query.set("from", `${input.from}T00:00:00.000Z`);
  if (input.to) query.set("to", `${input.to}T23:59:59.999Z`);
  const report = await serverApi<DashboardReport>(`/reports/dashboard?${query}`);
  const from = input.from ?? report.period.from.slice(0, 10);
  const to = input.to ?? report.period.to.slice(0, 10);
  const cards = [{ label: "Sales", value: report.sales.total, detail: `${report.sales.count} transactions` }, { label: "Outstanding credit", value: report.credit.outstanding, detail: `${report.credit.accounts} agreements` }, { label: "Returns", value: report.returns.total, detail: `${report.returns.count} returns` }, { label: "Customers", value: report.customers, detail: `${report.lowStockCount} low-stock products`, plain: true }];
  return <main className="space-y-6 p-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wider text-[#0E9384]">Business intelligence</p><h1 className="text-2xl font-bold">Reports</h1><p className="text-sm text-slate-500">Organization performance from {from} to {to}.</p></div><ReportSummaryExport rows={cards.map((card) => ({ metric: card.label, value: card.value, detail: card.detail }))}/></div>
    <form className="flex flex-wrap items-end gap-3 rounded-2xl border bg-white p-4"><label className="text-xs font-semibold">From<input name="from" type="date" defaultValue={from} className="mt-1 block h-10 rounded-xl border px-3"/></label><label className="text-xs font-semibold">To<input name="to" type="date" min={from} defaultValue={to} className="mt-1 block h-10 rounded-xl border px-3"/></label><button className="h-10 rounded-xl bg-[#0E9384] px-4 text-sm font-semibold text-white">Apply dates</button></form>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map((card) => <section key={card.label} className="rounded-2xl border bg-white p-5 shadow-sm"><p className="text-xs font-semibold uppercase text-slate-500">{card.label}</p><p className="mt-3 text-2xl font-bold">{card.plain ? card.value : money(card.value)}</p><p className="mt-1 text-xs text-slate-500">{card.detail}</p></section>)}</div>
    <section><div className="mb-3"><h2 className="text-lg font-bold">Report catalogue</h2><p className="text-sm text-slate-500">Open a report to apply its operational filters and export the complete result.</p></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{[
      { href: "/reports/sales", title: "Sales", detail: "Invoices, cashiers, customers and payments" },
      { href: "/reports/purchases", title: "Purchase orders", detail: "Suppliers, values, receipts and statuses" },
      { href: "/reports/inventory", title: "Inventory valuation", detail: "On-hand, reserved, cost and retail values" },
      { href: "/reports/low-stock", title: "Low stock", detail: "Products at or below reorder level" },
      { href: "/reports/stock-movements", title: "Stock movements", detail: "Receipts, sales, returns and adjustments" },
      { href: "/reports/stock-transfers", title: "Stock transfers", detail: "Outgoing, incoming and received quantities" },
      { href: "/reports/returns", title: "Returns & refunds", detail: "Reasons, resolutions and refund values" },
      { href: "/reports/customers", title: "Customers", detail: "Sales, credit and loyalty overview" },
      { href: "/reports/credit-aging", title: "Credit aging", detail: "Outstanding balances and overdue buckets" },
      { href: "/reports/warranties", title: "Warranties", detail: "Policies, serials, status and expiry" },
      { href: "/reports/employees", title: "Employees & access", detail: "Roles, branches, states and last login" },
    ].map((item) => <Link key={item.href} href={item.href} className="rounded-2xl border bg-white p-5 shadow-sm transition hover:border-[#0E9384] hover:shadow-md"><span className="font-semibold text-[#025148]">{item.title} →</span><p className="mt-2 text-xs text-slate-500">{item.detail}</p></Link>)}</div></section></main>;
}
