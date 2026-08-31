"use client";

import { useMemo, useState } from "react";
import {
  BellRing,
  CheckCircle2,
  Clock3,
  MessageSquareText,
  RefreshCw,
  Search,
  TriangleAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export type NotificationTemplate = {
  id: string;
  eventType: string;
  channel: string;
  name: string;
  bodyTemplate: string;
  status: string;
};

export type OutboxItem = {
  id: string;
  channel: string;
  recipient: string;
  body: string;
  status: string;
  attemptCount: number;
  lastError?: string | null;
  createdAt: string;
};

type Props = {
  templates: NotificationTemplate[];
  outbox: OutboxItem[];
  loadError?: string;
};

const statusClasses: Record<string, string> = {
  SENT: "border-emerald-200 bg-emerald-50 text-emerald-700",
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  PROCESSING: "border-blue-200 bg-blue-50 text-blue-700",
  FAILED: "border-rose-200 bg-rose-50 text-rose-700",
  DEAD_LETTER: "border-slate-300 bg-slate-100 text-slate-700",
};

export default function NotificationAdminClientView({
  templates,
  outbox,
  loadError,
}: Props) {
  const [tab, setTab] = useState<"templates" | "outbox" | "preferences">(
    "templates",
  );
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");

  const visibleOutbox = useMemo(
    () =>
      outbox.filter((item) => {
        const matchesText = `${item.recipient} ${item.body}`
          .toLowerCase()
          .includes(query.toLowerCase());
        return matchesText && (status === "ALL" || item.status === status);
      }),
    [outbox, query, status],
  );

  const delivered = outbox.filter((item) => item.status === "SENT").length;
  const failed = outbox.filter((item) =>
    ["FAILED", "DEAD_LETTER"].includes(item.status),
  ).length;

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0E9384]">
            Communication centre
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Notification Administration
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage templates, customer preferences and delivery attempts.
          </p>
        </div>
        <Button className="bg-[#025148] hover:bg-[#036b5e]">
          <MessageSquareText className="mr-2 h-4 w-4" /> New template
        </Button>
      </header>

      {loadError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <TriangleAlert className="mr-2 inline h-4 w-4" /> {loadError}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Templates" value={templates.length} icon={BellRing} tone="bg-teal-50 text-[#0E9384]" />
        <Metric label="Queued" value={Math.max(0, outbox.length - delivered - failed)} icon={Clock3} tone="bg-amber-50 text-amber-700" />
        <Metric label="Delivered" value={delivered} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-700" />
        <Metric label="Needs attention" value={failed} icon={TriangleAlert} tone="bg-rose-50 text-rose-700" />
      </section>

      <div className="flex flex-wrap gap-2 border-b border-slate-200">
        {(["templates", "outbox", "preferences"] as const).map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`border-b-2 px-4 py-3 text-sm font-semibold capitalize ${
              tab === item
                ? "border-[#0E9384] text-[#025148]"
                : "border-transparent text-slate-500"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "templates" && (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Message templates</CardTitle>
            <p className="text-sm text-slate-500">
              Reusable Email and WhatsApp messages triggered by business events.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {templates.length === 0 ? (
              <Empty text="No notification templates are configured." />
            ) : (
              templates.map((template) => (
                <div key={template.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-900">{template.name}</p>
                      <Badge variant="outline">{template.channel}</Badge>
                      <Badge className="bg-teal-50 text-teal-700">{template.status}</Badge>
                    </div>
                    <p className="mt-1 text-xs font-semibold text-slate-400">{template.eventType}</p>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">{template.bodyTemplate}</p>
                  </div>
                  <Button variant="outline">Edit template</Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {tab === "outbox" && (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Delivery outbox</CardTitle>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search recipient or message" className="pl-9" />
              </div>
              <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm">
                {["ALL", "PENDING", "PROCESSING", "SENT", "FAILED", "DEAD_LETTER"].map((value) => <option key={value}>{value}</option>)}
              </select>
              <Button variant="outline"><RefreshCw className="mr-2 h-4 w-4" />Process pending</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {visibleOutbox.length === 0 ? <Empty text="No delivery records match the filters." /> : visibleOutbox.map((item) => (
              <div key={item.id} className="grid gap-3 rounded-xl border border-slate-200 p-4 lg:grid-cols-[1fr_190px_140px]">
                <div><p className="font-semibold text-slate-900">{item.recipient}</p><p className="mt-1 line-clamp-2 text-sm text-slate-600">{item.body}</p>{item.lastError && <p className="mt-2 text-xs text-rose-600">{item.lastError}</p>}</div>
                <div className="text-sm text-slate-500"><p>{item.channel}</p><p>{new Date(item.createdAt).toLocaleString()}</p><p>{item.attemptCount} attempt(s)</p></div>
                <Badge variant="outline" className={`h-fit justify-center ${statusClasses[item.status] ?? ""}`}>{item.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {tab === "preferences" && (
        <Card className="max-w-3xl border-slate-200">
          <CardHeader><CardTitle>Customer notification preference</CardTitle><p className="text-sm text-slate-500">Control an event channel for an individual customer.</p></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Customer ID" placeholder="Customer ID" />
            <Field label="Event type" placeholder="SALE_COMPLETED" />
            <label className="space-y-2 text-sm font-medium text-slate-700">Channel<select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3"><option>WHATSAPP</option><option>EMAIL</option></select></label>
            <label className="flex items-center gap-3 self-end rounded-lg border border-slate-200 p-3 text-sm"><input type="checkbox" defaultChecked className="h-4 w-4 accent-[#0E9384]" />Enabled</label>
            <Button className="bg-[#025148] sm:col-span-2 sm:w-fit">Save preference</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Metric({ label, value, icon: Icon, tone }: { label: string; value: number; icon: typeof BellRing; tone: string }) {
  return <Card className="border-slate-200 shadow-sm"><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold text-slate-900">{value}</p></div><div className={`rounded-xl p-3 ${tone}`}><Icon className="h-5 w-5" /></div></CardContent></Card>;
}
function Field({ label, placeholder }: { label: string; placeholder: string }) { return <label className="space-y-2 text-sm font-medium text-slate-700">{label}<Input placeholder={placeholder} /></label>; }
function Empty({ text }: { text: string }) { return <div className="rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center text-sm text-slate-500">{text}</div>; }
