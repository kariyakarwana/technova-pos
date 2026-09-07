"use client";

import Link from "next/link";
import { useState } from "react";
import { BellRing, CheckCheck } from "lucide-react";
import { apiPatch } from "@/lib/api/client";

export type SupplierNotification = { id: string; title: string; message: string; actionUrl: string | null; readAt: string | null; createdAt: string };

export default function SupplierNotificationsClient({ initial, loadError }: { initial: SupplierNotification[]; loadError?: string }) {
  const [items, setItems] = useState(initial);
  if (loadError && initial.length === 0) return <main className="p-6 lg:p-8"><div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800"><h1 className="font-bold">Notifications are temporarily unavailable</h1><p className="mt-1">{loadError}</p></div></main>;
  async function read(id: string) {
    await apiPatch(`/notifications/in-app/${id}/read`, {});
    setItems((current) => current.map((item) => item.id === id ? { ...item, readAt: new Date().toISOString() } : item));
  }
  async function readAll() {
    await apiPatch("/notifications/in-app/read-all", {});
    setItems((current) => current.map((item) => ({ ...item, readAt: item.readAt ?? new Date().toISOString() })));
  }
  return <main className="space-y-6 p-6 lg:p-8"><header className="flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-wider text-[#0E9384]">Supplier portal</p><h1 className="text-2xl font-bold">Notifications</h1></div><button onClick={() => void readAll()} className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-semibold"><CheckCheck className="h-4 w-4" />Mark all read</button></header><section className="space-y-3">{items.length === 0 ? <div className="rounded-2xl border border-dashed bg-white p-12 text-center text-sm text-slate-500">No notifications yet.</div> : items.map((item) => <article key={item.id} className={`rounded-2xl border p-5 ${item.readAt ? "bg-white" : "border-teal-200 bg-teal-50"}`}><div className="flex gap-3"><BellRing className="mt-0.5 h-5 w-5 text-[#0E9384]" /><div className="flex-1"><div className="flex flex-wrap justify-between gap-2"><h2 className="font-bold">{item.title}</h2><time className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</time></div><p className="mt-1 text-sm text-slate-600">{item.message}</p><div className="mt-3 flex gap-2">{item.actionUrl && <Link href={item.actionUrl} onClick={() => void read(item.id)} className="rounded-lg bg-[#0E9384] px-3 py-2 text-xs font-semibold text-white">Open order</Link>}{!item.readAt && <button onClick={() => void read(item.id)} className="rounded-lg border bg-white px-3 py-2 text-xs font-semibold">Mark read</button>}</div></div></div></article>)}</section></main>;
}
