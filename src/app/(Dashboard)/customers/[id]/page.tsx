import type { Metadata } from "next";
import Link from "next/link";
import { serverApi } from "@/lib/api/server";

export const metadata: Metadata = {
  title: "Customer Profile & Details | TechNova POS",
  description: "View customer profile, personal details, loyalty point balance, purchase history, and reward logs.",
};

interface CustomerProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerProfilePage({
  params,
}: CustomerProfilePageProps) {
  const { id } = await params;
  const customer = await serverApi<{ customerNumber: string; firstName: string; lastName: string | null; phone: string | null; email: string | null; creditLimit: string | number; currentBalance: string | number; status: string; loyaltyAccount: { pointsBalance: string | number; transactions: Array<{ id: string; type: string; points: string | number; createdAt: string }> } | null; creditAgreements: Array<{ id: string; status: string; outstandingBalance: string | number; dueDate: string }>; warranties: Array<{ id: string; status: string; expiresAt: string | null }> }>(`/customers/${id}`);
  return <main className="space-y-6 p-6"><div className="flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-wider text-[#0E9384]">{customer.customerNumber}</p><h1 className="text-2xl font-bold">{customer.firstName} {customer.lastName}</h1><p className="text-sm text-slate-500">{customer.status}</p></div><Link href="/customers" className="rounded-xl border px-4 py-2 text-sm font-semibold">Back</Link></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[{ label: "Phone", value: customer.phone }, { label: "Email", value: customer.email }, { label: "Credit balance", value: Number(customer.currentBalance).toLocaleString() }, { label: "Loyalty points", value: Number(customer.loyaltyAccount?.pointsBalance ?? 0).toLocaleString() }].map((item) => <section key={item.label} className="rounded-2xl border bg-white p-5"><p className="text-xs uppercase text-slate-500">{item.label}</p><p className="mt-2 font-semibold">{item.value ?? "—"}</p></section>)}</div><section className="rounded-2xl border bg-white p-5"><h2 className="mb-4 font-bold">Credit agreements</h2><div className="space-y-3">{customer.creditAgreements.map((agreement) => <Link key={agreement.id} href={`/credit/${agreement.id}`} className="flex justify-between rounded-xl bg-slate-50 p-3 text-sm"><span>{agreement.status}</span><span>{Number(agreement.outstandingBalance).toLocaleString()} due · {new Date(agreement.dueDate).toLocaleDateString()}</span></Link>)}{customer.creditAgreements.length === 0 && <p className="text-sm text-slate-500">No credit agreements.</p>}</div></section><section className="rounded-2xl border bg-white p-5"><h2 className="mb-4 font-bold">Warranty registrations</h2><p className="text-sm text-slate-500">{customer.warranties.length} registered product warranties</p></section></main>;
}
