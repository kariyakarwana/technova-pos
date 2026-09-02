"use client";

import Link from "next/link";
import { ArrowLeft, Banknote, CalendarDays, CircleDollarSign, TriangleAlert, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiPost } from "@/lib/api/client";

type Installment = { id: string; installmentNumber: number; dueDate: string; amountDue: string | number; amountPaid: string | number; status: string };
type Allocation = { id: string; amount: string | number; createdAt: string; payment: { method: string; referenceNumber?: string | null; paidAt?: string | null } };
export type CreditAgreementDetails = { id: string; originalAmount: string | number; outstandingBalance: string | number; dueDate: string; status: string; notes?: string | null; customer: { customerNumber: string; firstName: string; lastName: string; creditLimit: string | number; balance?: string | number; phone?: string | null }; sale: { invoiceNumber: string }; installments: Installment[]; allocations: Allocation[] };

const currency = new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" });

export default function CreditAgreementDetailsClientView({ agreement }: { agreement: CreditAgreementDetails }) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("CASH");
  const [reference, setReference] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const used = Number(agreement.outstandingBalance);
  const limit = Number(agreement.customer.creditLimit || 0);
  const usage = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
  async function repay() {
    const payment = Number(amount);
    if (!Number.isFinite(payment) || payment <= 0) return setMessage("Enter a valid repayment amount.");
    setSaving(true); setMessage("");
    try {
      await apiPost(`/credit/agreements/${agreement.id}/payments`, { amount: payment, method, referenceNumber: reference.trim() || undefined });
      setAmount(""); setReference(""); setMessage("Repayment recorded successfully."); router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to record repayment."); }
    finally { setSaving(false); }
  }
  return <div className="space-y-6 p-6 lg:p-8">
    <Link href="/credit" className="inline-flex items-center text-sm font-semibold text-[#0E9384]"><ArrowLeft className="mr-2 h-4 w-4" />Back to credit management</Link>
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0E9384]">{agreement.sale.invoiceNumber}</p><h1 className="mt-1 text-3xl font-bold text-slate-900">Credit Agreement</h1><p className="mt-2 text-sm text-slate-500">{agreement.customer.firstName} {agreement.customer.lastName} · {agreement.customer.customerNumber}</p></div><Badge className="w-fit bg-blue-50 text-blue-700">{agreement.status}</Badge></header>
    <section className="grid gap-4 md:grid-cols-3"><Summary label="Original credit" value={currency.format(Number(agreement.originalAmount))} icon={CircleDollarSign} /><Summary label="Outstanding" value={currency.format(Number(agreement.outstandingBalance))} icon={Banknote} /><Summary label="Final due date" value={new Date(agreement.dueDate).toLocaleDateString()} icon={CalendarDays} /></section>
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="space-y-6"><Card className="border-slate-200"><CardHeader><CardTitle>Installment schedule</CardTitle></CardHeader><CardContent className="overflow-x-auto"><table className="w-full min-w-[650px] text-sm"><thead className="border-y border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500"><tr><th className="p-3">#</th><th className="p-3">Due date</th><th className="p-3">Due</th><th className="p-3">Paid</th><th className="p-3">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{agreement.installments.map((item) => <tr key={item.id}><td className="p-3 font-semibold">{item.installmentNumber}</td><td className="p-3">{new Date(item.dueDate).toLocaleDateString()}</td><td className="p-3">{currency.format(Number(item.amountDue))}</td><td className="p-3">{currency.format(Number(item.amountPaid))}</td><td className="p-3"><Badge variant="outline">{item.status}</Badge></td></tr>)}</tbody></table></CardContent></Card>
      <Card className="border-slate-200"><CardHeader><CardTitle>Payment history</CardTitle></CardHeader><CardContent className="space-y-3">{agreement.allocations.length === 0 ? <p className="py-8 text-center text-sm text-slate-500">No repayments recorded.</p> : agreement.allocations.map((item) => <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-4"><div><p className="font-semibold">{item.payment.method}</p><p className="text-xs text-slate-500">{item.payment.referenceNumber || "No reference"} · {new Date(item.payment.paidAt || item.createdAt).toLocaleDateString()}</p></div><p className="font-bold text-emerald-700">{currency.format(Number(item.amount))}</p></div>)}</CardContent></Card></div>
      <div className="space-y-6"><Card className="border-slate-200"><CardHeader><CardTitle className="flex items-center gap-2"><UserRound className="h-5 w-5 text-[#0E9384]" />Customer credit limit</CardTitle></CardHeader><CardContent><div className="flex justify-between text-sm"><span>Outstanding usage</span><strong>{usage.toFixed(0)}%</strong></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full ${usage > 80 ? "bg-rose-500" : "bg-[#0E9384]"}`} style={{ width: `${usage}%` }} /></div><div className="mt-3 flex justify-between text-xs text-slate-500"><span>{currency.format(used)} used</span><span>{currency.format(limit)} limit</span></div>{usage > 80 && <p className="mt-4 rounded-lg bg-rose-50 p-3 text-xs text-rose-700"><TriangleAlert className="mr-1 inline h-4 w-4" />Customer is approaching the configured credit limit.</p>}</CardContent></Card>
      <Card className="border-slate-200"><CardHeader><CardTitle>Record repayment</CardTitle></CardHeader><CardContent className="space-y-4"><label className="space-y-2 text-sm font-medium">Amount<Input value={amount} onChange={(event) => setAmount(event.target.value)} type="number" min="0.01" max={Number(agreement.outstandingBalance)} step="0.01" placeholder="0.00" /></label><label className="space-y-2 text-sm font-medium">Payment method<select value={method} onChange={(event) => setMethod(event.target.value)} className="h-10 w-full rounded-md border border-slate-200 bg-white px-3"><option>CASH</option><option>CARD</option><option>BANK_TRANSFER</option></select></label><label className="space-y-2 text-sm font-medium">Reference<Input value={reference} onChange={(event) => setReference(event.target.value)} placeholder="Optional payment reference" /></label>{message && <p className="rounded-lg bg-teal-50 p-3 text-xs text-teal-800">{message}</p>}<Button type="button" onClick={repay} disabled={saving || Number(agreement.outstandingBalance) <= 0} className="w-full bg-[#025148] hover:bg-[#036b5e]">{saving ? "Recording…" : "Record payment"}</Button><p className="text-xs text-slate-500">Payments greater than the outstanding balance will be rejected.</p></CardContent></Card></div>
    </div>
  </div>;
}
function Summary({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Banknote }) { return <Card className="border-slate-200"><CardContent className="flex items-center gap-4 p-5"><div className="rounded-xl bg-teal-50 p-3 text-[#0E9384]"><Icon className="h-5 w-5" /></div><div><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-xl font-bold text-slate-900">{value}</p></div></CardContent></Card>; }
