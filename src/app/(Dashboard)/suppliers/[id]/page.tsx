import type { Metadata } from "next";
import Link from "next/link";
import { serverApi } from "@/lib/api/server";

export const metadata: Metadata = {
  title: "Supplier Profile & Details | TechNova POS",
  description: "View supplier performance metrics, lead times, reliability score, and AI inventory insights.",
};

interface SupplierProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function SupplierProfilePage({
  params,
}: SupplierProfilePageProps) {
  const { id } = await params;
  const supplier = await serverApi<{ id: string; code: string; name: string; contactName: string | null; phone: string | null; email: string | null; status: string; address: Record<string, string> | null; purchaseOrders: Array<{ id: string; orderNumber: string; status: string; total: string | number; createdAt: string }> }>(`/suppliers/${id}`);
  return <main className="space-y-6 p-6"><div className="flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-wider text-[#0E9384]">Supplier {supplier.code}</p><h1 className="text-2xl font-bold">{supplier.name}</h1><p className="text-sm text-slate-500">{supplier.status}</p></div><Link href="/suppliers/management" className="rounded-xl border px-4 py-2 text-sm font-semibold">Back to suppliers</Link></div><div className="grid gap-4 md:grid-cols-3">{[{ label: "Contact", value: supplier.contactName }, { label: "Email", value: supplier.email }, { label: "Phone", value: supplier.phone }].map((item) => <section key={item.label} className="rounded-2xl border bg-white p-5"><p className="text-xs uppercase text-slate-500">{item.label}</p><p className="mt-2 font-semibold">{item.value ?? "Not provided"}</p></section>)}</div><section className="rounded-2xl border bg-white p-5"><h2 className="mb-4 font-bold">Recent purchase orders</h2><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50"><tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Created</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Status</th></tr></thead><tbody className="divide-y">{supplier.purchaseOrders.map((order) => <tr key={order.id}><td className="px-4 py-3"><Link href={`/purchases/${order.id}`} className="font-semibold text-[#0E9384]">{order.orderNumber}</Link></td><td className="px-4 py-3">{new Date(order.createdAt).toLocaleDateString()}</td><td className="px-4 py-3">{Number(order.total).toLocaleString()}</td><td className="px-4 py-3">{order.status}</td></tr>)}</tbody></table></div></section></main>;
}
