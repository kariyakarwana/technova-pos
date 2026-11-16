"use client";

import Link from "next/link";
import { useState } from "react";
import { BellRing, CheckCheck } from "lucide-react";
import { apiPatch } from "@/lib/api/client";

export type SupplierNotification = {
  id: string;
  title: string;
  message: string;
  actionUrl: string | null;
  readAt: string | null;
  createdAt: string;
};

export default function SupplierNotificationsClient({
  initial,
  loadError,
}: {
  initial: SupplierNotification[];
  loadError?: string;
}) {
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");

  if (loadError && initial.length === 0)
    return (
      <main className="p-6 lg:p-8">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
          <h1 className="font-bold">
            Notifications are temporarily unavailable
          </h1>
          <p className="mt-1">{loadError}</p>
        </div>
      </main>
    );

  async function read(id: string) {
    try {
      await apiPatch(`/notifications/in-app/${id}/read`, {});
      setItems((current) =>
        current.map((item) =>
          item.id === id ? { ...item, readAt: new Date().toISOString() } : item,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function readAll() {
    try {
      await apiPatch("/notifications/in-app/read-all", {});
      setItems((current) =>
        current.map((item) => ({
          ...item,
          readAt: item.readAt ?? new Date().toISOString(),
        })),
      );
    } catch (err) {
      console.error(err);
    }
  }

  const unreadCount = items.filter((item) => !item.readAt).length;
  const filteredItems =
    filter === "UNREAD" ? items.filter((item) => !item.readAt) : items;

  function getActionLabel(url: string) {
    if (url.includes("billing")) return "View billing";
    if (url.includes("order") || url.includes("purchases")) return "Open order";
    return "View details";
  }

  return (
    <main className="space-y-6 p-6 lg:p-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View system alerts, order updates and billing reminders
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl border bg-slate-100 p-0.5">
            <button
              type="button"
              onClick={() => setFilter("ALL")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filter === "ALL"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({items.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("UNREAD")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filter === "UNREAD"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
          <button
            type="button"
            onClick={() => void readAll()}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-semibold transition hover:bg-slate-50 disabled:opacity-50"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </button>
        </div>
      </header>
      <section className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-white p-12 text-center text-sm text-slate-500">
            {filter === "UNREAD"
              ? "No unread notifications."
              : "No notifications yet."}
          </div>
        ) : (
          filteredItems.map((item) => (
            <article
              key={item.id}
              className={`rounded-2xl border p-5 transition ${
                item.readAt ? "bg-white border-slate-200" : "border-teal-200 bg-teal-50"
              }`}
            >
              <div className="flex gap-3">
                <BellRing className="mt-0.5 h-5 w-5 shrink-0 text-[#0E9384]" />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-[#1D2939]">{item.title}</h2>
                      {!item.readAt && (
                        <span className="h-2 w-2 rounded-full bg-[#0E9384]" title="Unread" />
                      )}
                    </div>
                    <time className="text-xs text-slate-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </time>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{item.message}</p>
                  <div className="mt-3 flex items-center gap-2">
                    {item.actionUrl && (
                      <Link
                        href={item.actionUrl}
                        onClick={() => void read(item.id)}
                        className="rounded-lg bg-[#0E9384] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#004532]"
                      >
                        {getActionLabel(item.actionUrl)}
                      </Link>
                    )}
                    {!item.readAt ? (
                      <button
                        type="button"
                        onClick={() => void read(item.id)}
                        className="rounded-lg border border-[#0E9384] bg-white px-3 py-1.5 text-xs font-semibold text-[#0E9384] transition hover:bg-[#EEFFFD]"
                      >
                        Mark read
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
                        <CheckCheck className="h-3.5 w-3.5 text-slate-400" />
                        Read
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
