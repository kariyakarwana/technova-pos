"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarClock, FileBadge, Plus, Printer, QrCode, Search, ShieldCheck, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export type WarrantyPolicy = { id: string; name: string; durationMonths: number; terms?: string | null; status: string; product: { id: string; sku: string; name: string } };

export default function WarrantyDashboardClientView({ policies, loadError }: { policies: WarrantyPolicy[]; loadError?: string }) {
  const [query, setQuery] = useState("");
  const visible = useMemo(() => policies.filter((policy) => `${policy.name} ${policy.product.name} ${policy.product.sku}`.toLowerCase().includes(query.toLowerCase())), [policies, query]);
  return <div className="space-y-6 p-6 lg:p-8">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0E9384]">Serialized protection</p><h1 className="mt-1 text-3xl font-bold text-slate-900">QR & Warranty</h1><p className="mt-2 text-sm text-slate-500">Manage policies, scan serialized products and prepare customer warranty journeys.</p></div><div className="flex gap-2"><Button asChild variant="outline"><Link href="/qr-scanner"><QrCode className="mr-2 h-4 w-4" />Open scanner</Link></Button><Button className="bg-[#025148] hover:bg-[#036b5e]"><Plus className="mr-2 h-4 w-4" />New policy</Button></div></header>
    {loadError && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"><TriangleAlert className="mr-2 inline h-4 w-4" />{loadError}</div>}
    <section className="grid gap-4 md:grid-cols-3"><Metric label="Warranty policies" value={policies.length} icon={FileBadge} /><Metric label="Active policies" value={policies.filter((item) => item.status === "ACTIVE").length} icon={ShieldCheck} /><Metric label="Products covered" value={new Set(policies.map((item) => item.product.id)).size} icon={CalendarClock} /></section>
    <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
      <Card className="border-slate-200"><CardHeader><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><CardTitle>Warranty policies</CardTitle><p className="mt-1 text-sm text-slate-500">Coverage rules assigned to catalog products.</p></div><div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="Search policy or SKU" /></div></div></CardHeader><CardContent className="space-y-3">{visible.length === 0 ? <p className="rounded-xl border border-dashed border-slate-300 py-14 text-center text-sm text-slate-500">No warranty policies found.</p> : visible.map((policy) => <div key={policy.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between"><div><div className="flex flex-wrap items-center gap-2"><p className="font-semibold text-slate-900">{policy.name}</p><Badge className="bg-teal-50 text-teal-700">{policy.status}</Badge></div><p className="mt-1 text-sm text-slate-500">{policy.product.name} · {policy.product.sku}</p><p className="mt-2 text-sm text-slate-600">{policy.durationMonths} months · {policy.terms || "Standard manufacturer coverage"}</p></div><Button variant="outline">Edit</Button></div>)}</CardContent></Card>
      <div className="space-y-4"><Card className="border-slate-200 bg-gradient-to-br from-[#025148] to-[#0E9384] text-white"><CardContent className="p-6"><QrCode className="h-9 w-9" /><h2 className="mt-5 text-xl font-bold">Scan a product QR</h2><p className="mt-2 text-sm text-white/80">Look up safe product information and verify serialized-unit warranty status.</p><Button asChild className="mt-5 w-full bg-white text-[#025148] hover:bg-slate-100"><Link href="/qr-scanner">Start scanning</Link></Button></CardContent></Card><Card className="border-slate-200"><CardContent className="p-6"><Printer className="h-6 w-6 text-[#0E9384]" /><h2 className="mt-3 font-bold text-slate-900">QR labels</h2><p className="mt-2 text-sm text-slate-500">Label preview and batch printing become available after serialized inventory is received.</p><Button variant="outline" className="mt-4 w-full">Open label queue</Button></CardContent></Card></div>
    </div>
  </div>;
}
function Metric({ label, value, icon: Icon }: { label: string; value: number; icon: typeof FileBadge }) { return <Card className="border-slate-200"><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold text-slate-900">{value}</p></div><div className="rounded-xl bg-teal-50 p-3 text-[#0E9384]"><Icon className="h-5 w-5" /></div></CardContent></Card>; }
