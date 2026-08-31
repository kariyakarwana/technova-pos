"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AlertCircle, Banknote, CalendarClock, CheckCircle2, Search, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export type CreditAgreement = {
  id: string;
  originalAmount: string | number;
  outstandingBalance: string | number;
  dueDate: string;
  status: string;
  customer: { customerNumber: string; firstName: string; lastName: string };
  sale: { invoiceNumber: string };
  installments: Array<{ id: string; status: string }>;
};

type Props = { agreements: CreditAgreement[]; loadError?: string };

const currency = new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 2 });
const statusTone: Record<string, string> = {
  ACTIVE: "border-blue-200 bg-blue-50 text-blue-700",
  OVERDUE: "border-rose-200 bg-rose-50 text-rose-700",
  PAID: "border-emerald-200 bg-emerald-50 text-emerald-700",
  CANCELLED: "border-slate-200 bg-slate-100 text-slate-600",
};

export default function CreditManagementClientView({ agreements, loadError }: Props) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const visible = useMemo(() => agreements.filter((agreement) => {
    const customer = `${agreement.customer.firstName} ${agreement.customer.lastName} ${agreement.customer.customerNumber} ${agreement.sale.invoiceNumber}`.toLowerCase();
    return customer.includes(query.toLowerCase()) && (status === "ALL" || agreement.status === status);
  }), [agreements, query, status]);
  const outstanding = agreements.reduce((sum, item) => sum + Number(item.outstandingBalance), 0);
  const overdue = agreements.filter((item) => item.status === "OVERDUE");

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <header><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0E9384]">Receivables</p><h1 className="mt-1 text-3xl font-bold text-slate-900">Credit Management</h1><p className="mt-2 text-sm text-slate-500">Monitor customer credit, upcoming installments and repayments.</p></header>
      {loadError && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"><AlertCircle className="mr-2 inline h-4 w-4" />{loadError}</div>}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Outstanding" value={currency.format(outstanding)} icon={Banknote} tone="bg-teal-50 text-[#0E9384]" />
        <Metric label="Active agreements" value={String(agreements.filter((item) => item.status === "ACTIVE").length)} icon={Users} tone="bg-blue-50 text-blue-700" />
        <Metric label="Overdue" value={String(overdue.length)} icon={AlertCircle} tone="bg-rose-50 text-rose-700" />
        <Metric label="Fully paid" value={String(agreements.filter((item) => item.status === "PAID").length)} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-700" />
      </section>
      <Card className="border-slate-200">
        <CardContent className="p-5">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search customer or invoice" className="pl-9" /></div><select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm"><option>ALL</option><option>ACTIVE</option><option>OVERDUE</option><option>PAID</option><option>CANCELLED</option></select></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm"><thead className="border-y border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Invoice</th><th className="px-4 py-3">Original</th><th className="px-4 py-3">Outstanding</th><th className="px-4 py-3">Due date</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{visible.map((agreement) => <tr key={agreement.id} className="hover:bg-slate-50"><td className="px-4 py-4"><p className="font-semibold text-slate-900">{agreement.customer.firstName} {agreement.customer.lastName}</p><p className="text-xs text-slate-400">{agreement.customer.customerNumber}</p></td><td className="px-4 py-4 text-slate-600">{agreement.sale.invoiceNumber}</td><td className="px-4 py-4">{currency.format(Number(agreement.originalAmount))}</td><td className="px-4 py-4 font-semibold text-slate-900">{currency.format(Number(agreement.outstandingBalance))}</td><td className="px-4 py-4"><CalendarClock className="mr-2 inline h-4 w-4 text-slate-400" />{new Date(agreement.dueDate).toLocaleDateString()}</td><td className="px-4 py-4"><Badge variant="outline" className={statusTone[agreement.status]}>{agreement.status}</Badge></td><td className="px-4 py-4 text-right"><Link href={`/credit/${agreement.id}`} className="font-semibold text-[#0E9384] hover:underline">View details</Link></td></tr>)}</tbody></table>
            {visible.length === 0 && <div className="py-14 text-center text-sm text-slate-500">No credit agreements match your filters.</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value, icon: Icon, tone }: { label: string; value: string; icon: typeof Banknote; tone: string }) { return <Card className="border-slate-200"><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-xl font-bold text-slate-900">{value}</p></div><div className={`rounded-xl p-3 ${tone}`}><Icon className="h-5 w-5" /></div></CardContent></Card>; }
