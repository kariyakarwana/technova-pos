"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  BellRing,
  CheckCircle2,
  Clock3,
  Mail,
  MessageCircle,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Send,
  TriangleAlert,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PaginationControls, {
  type PageMeta,
} from "@/components/operations/PaginationControls";
import { apiGet, apiPatch, apiPost } from "@/lib/api/client";
import type { ProviderStatus } from "@/app/(Dashboard)/notifications/page";

export type NotificationTemplate = {
  id: string;
  eventType: string;
  channel: "EMAIL" | "WHATSAPP";
  name: string;
  subjectTemplate: string | null;
  bodyTemplate: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
};

export type OutboxItem = {
  id: string;
  channel: string;
  recipient: string;
  subject?: string | null;
  body: string;
  status: string;
  attemptCount: number;
  lastError?: string | null;
  createdAt: string;
};

export type TemplateCatalogItem = {
  eventType: string;
  label: string;
  audience: string;
  description: string;
  variables: Array<[string, string, string]>;
  suggestions: Record<
    "EMAIL" | "WHATSAPP",
    { name: string; subjectTemplate?: string; bodyTemplate: string }
  >;
};

export type OutboxPage = {
  data: OutboxItem[];
  meta: PageMeta;
  summary: Record<string, number>;
};

type CustomerResult = {
  id: string;
  customerNumber: string;
  firstName: string;
  lastName: string | null;
  phone: string | null;
  email: string | null;
};

type TemplateDraft = {
  id?: string;
  eventType: string;
  channel: "EMAIL" | "WHATSAPP";
  name: string;
  subjectTemplate: string;
  bodyTemplate: string;
  status: "ACTIVE" | "INACTIVE";
};

type Props = {
  templates: NotificationTemplate[];
  catalog: TemplateCatalogItem[];
  outboxPage: OutboxPage;
  loadError?: string;
  providerStatus?: ProviderStatus;
};

const statusClasses: Record<string, string> = {
  SENT: "border-emerald-200 bg-emerald-50 text-emerald-700",
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  PROCESSING: "border-blue-200 bg-blue-50 text-blue-700",
  FAILED: "border-rose-200 bg-rose-50 text-rose-700",
  DEAD_LETTER: "border-slate-300 bg-slate-100 text-slate-700",
};

const emptyMeta: PageMeta = { page: 1, pageSize: 20, total: 0, pageCount: 0 };

export default function NotificationAdminClientView({
  templates,
  catalog,
  outboxPage,
  loadError,
  providerStatus,
}: Props) {
  const [tab, setTab] = useState<"templates" | "outbox" | "preferences">(
    "templates",
  );
  const [notice, setNotice] = useState<string | null>(null);
  const [templateRows, setTemplateRows] = useState(templates);
  const [templateQuery, setTemplateQuery] = useState("");
  const [templateChannel, setTemplateChannel] = useState("ALL");
  const [templateStatus, setTemplateStatus] = useState("ALL");
  const [draft, setDraft] = useState<TemplateDraft | null>(null);
  const [saving, setSaving] = useState(false);

  const [outboxRows, setOutboxRows] = useState(outboxPage.data);
  const [outboxMeta, setOutboxMeta] = useState(outboxPage.meta ?? emptyMeta);
  const [outboxSummary, setOutboxSummary] = useState(outboxPage.summary ?? {});
  const [outboxQuery, setOutboxQuery] = useState("");
  const [outboxStatus, setOutboxStatus] = useState("ALL");
  const [outboxChannel, setOutboxChannel] = useState("ALL");
  const [outboxPageNumber, setOutboxPageNumber] = useState(1);
  const [outboxPageSize, setOutboxPageSize] = useState(20);
  const [outboxLoading, setOutboxLoading] = useState(false);

  const [customerSearch, setCustomerSearch] = useState("");
  const [customerResults, setCustomerResults] = useState<CustomerResult[]>([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerResult | null>(null);
  const [preference, setPreference] = useState({
    eventType: catalog[0]?.eventType ?? "CUSTOMER_WELCOME",
    channel: "WHATSAPP" as "WHATSAPP" | "EMAIL",
    enabled: true,
  });

  const filteredTemplates = useMemo(() => {
    const query = templateQuery.trim().toLowerCase();
    return templateRows.filter(
      (item) =>
        (!query ||
          `${item.name} ${item.eventType} ${item.bodyTemplate}`
            .toLowerCase()
            .includes(query)) &&
        (templateChannel === "ALL" || item.channel === templateChannel) &&
        (templateStatus === "ALL" || item.status === templateStatus),
    );
  }, [templateChannel, templateQuery, templateRows, templateStatus]);

  const loadOutbox = useCallback(async () => {
    setOutboxLoading(true);
    const params = new URLSearchParams({
      page: String(outboxPageNumber),
      pageSize: String(outboxPageSize),
    });
    if (outboxQuery.trim()) params.set("search", outboxQuery.trim());
    if (outboxStatus !== "ALL") params.set("status", outboxStatus);
    if (outboxChannel !== "ALL") params.set("channel", outboxChannel);
    try {
      const result = await apiGet<OutboxPage>(
        `/notifications/outbox?${params}`,
      );
      setOutboxRows(result.data);
      setOutboxMeta(result.meta);
      setOutboxSummary(result.summary ?? {});
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Unable to load delivery history.",
      );
    } finally {
      setOutboxLoading(false);
    }
  }, [
    outboxChannel,
    outboxPageNumber,
    outboxPageSize,
    outboxQuery,
    outboxStatus,
  ]);

  useEffect(() => {
    if (tab !== "outbox") return;
    const timer = setTimeout(() => void loadOutbox(), 250);
    return () => clearTimeout(timer);
  }, [loadOutbox, tab]);

  useEffect(() => {
    const search = customerSearch.trim();
    if (search.length < 2 || selectedCustomer) {
      setCustomerResults([]);
      return;
    }
    const timer = setTimeout(() => {
      apiGet<{ data: CustomerResult[] }>(
        `/customers?page=1&pageSize=8&search=${encodeURIComponent(search)}`,
      )
        .then((result) => setCustomerResults(result.data))
        .catch(() => setCustomerResults([]));
    }, 250);
    return () => clearTimeout(timer);
  }, [customerSearch, selectedCustomer]);

  function suggestedDraft(eventType: string, channel: "EMAIL" | "WHATSAPP") {
    const item =
      catalog.find((entry) => entry.eventType === eventType) ?? catalog[0];
    const suggestion = item?.suggestions[channel];
    return {
      eventType: item?.eventType ?? eventType,
      channel,
      name: suggestion?.name ?? "",
      subjectTemplate: suggestion?.subjectTemplate ?? "",
      bodyTemplate: suggestion?.bodyTemplate ?? "",
      status: "ACTIVE" as const,
    };
  }

  function openNewTemplate() {
    setNotice(null);
    setDraft(
      suggestedDraft(catalog[0]?.eventType ?? "CUSTOMER_WELCOME", "EMAIL"),
    );
  }

  function editTemplate(template: NotificationTemplate) {
    setDraft({
      id: template.id,
      eventType: template.eventType,
      channel: template.channel,
      name: template.name,
      subjectTemplate: template.subjectTemplate ?? "",
      bodyTemplate: template.bodyTemplate,
      status: template.status === "ACTIVE" ? "ACTIVE" : "INACTIVE",
    });
  }

  function changeDraftEvent(eventType: string) {
    if (!draft) return;
    setDraft({ ...suggestedDraft(eventType, draft.channel), id: draft.id });
  }

  function changeDraftChannel(channel: "EMAIL" | "WHATSAPP") {
    if (!draft) return;
    setDraft({ ...suggestedDraft(draft.eventType, channel), id: undefined });
  }

  async function saveTemplate(event: FormEvent) {
    event.preventDefault();
    if (!draft) return;
    if (!draft.name.trim() || !draft.bodyTemplate.trim()) {
      setNotice("Template name and message are required.");
      return;
    }
    if (draft.channel === "EMAIL" && !draft.subjectTemplate.trim()) {
      setNotice("Email templates require a subject.");
      return;
    }
    if (draft.channel === "WHATSAPP" && draft.bodyTemplate.length > 1024) {
      setNotice("WhatsApp messages cannot exceed 1,024 characters.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        eventType: draft.eventType,
        channel: draft.channel,
        name: draft.name.trim(),
        subjectTemplate:
          draft.channel === "EMAIL" ? draft.subjectTemplate.trim() : undefined,
        bodyTemplate: draft.bodyTemplate.trim(),
        status: draft.status,
      };
      const row = draft.id
        ? await apiPatch<NotificationTemplate>(
            `/notifications/templates/${draft.id}`,
            payload,
          )
        : await apiPost<NotificationTemplate>(
            "/notifications/templates",
            payload,
          );
      setTemplateRows((current) => [
        row,
        ...current.filter((item) => item.id !== row.id),
      ]);
      setDraft(null);
      setNotice(`${row.name} saved successfully.`);
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Unable to save template.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleTemplate(template: NotificationTemplate) {
    try {
      const row = await apiPatch<NotificationTemplate>(
        `/notifications/templates/${template.id}`,
        {
          status: template.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
        },
      );
      setTemplateRows((current) =>
        current.map((item) => (item.id === row.id ? row : item)),
      );
      setNotice(`${row.name} is now ${row.status.toLowerCase()}.`);
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Unable to update template.",
      );
    }
  }

  async function processPending() {
    try {
      const result = await apiPost<{ processed: number }>(
        "/notifications/outbox/process",
        {},
      );
      setNotice(`${result.processed} queued notification(s) processed.`);
      await loadOutbox();
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Unable to process notifications.",
      );
    }
  }

  async function savePreference() {
    if (!selectedCustomer) {
      setNotice("Search for and select a customer first.");
      return;
    }
    try {
      await apiPost("/notifications/preferences", {
        customerId: selectedCustomer.id,
        ...preference,
      });
      setNotice(`Preference saved for ${selectedCustomer.firstName}.`);
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Unable to save preference.",
      );
    }
  }

  const activeTemplates = templateRows.filter(
    (item) => item.status === "ACTIVE",
  ).length;
  const delivered = outboxSummary.SENT ?? 0;
  const failed = (outboxSummary.FAILED ?? 0) + (outboxSummary.DEAD_LETTER ?? 0);
  const queued = (outboxSummary.PENDING ?? 0) + (outboxSummary.PROCESSING ?? 0);

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-green)]">
            Communication centre
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Notification Administration
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create clear customer messages and monitor email and WhatsApp
            delivery.
          </p>
        </div>
        <Button
          onClick={openNewTemplate}
          className="bg-[var(--brand-green)] hover:bg-[#036b5e]"
        >
          <Plus className="mr-2 h-4 w-4" /> Add template
        </Button>
      </header>

      {loadError && <Alert tone="warning" text={loadError} />}
      {notice && (
        <Alert tone="success" text={notice} onClose={() => setNotice(null)} />
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Active templates"
          value={activeTemplates}
          icon={BellRing}
          tone="bg-teal-50 text-teal-700"
        />
        <Metric
          label="Queued"
          value={queued}
          icon={Clock3}
          tone="bg-amber-50 text-amber-700"
        />
        <Metric
          label="Delivered"
          value={delivered}
          icon={CheckCircle2}
          tone="bg-emerald-50 text-emerald-700"
        />
        <Metric
          label="Needs attention"
          value={failed}
          icon={TriangleAlert}
          tone="bg-rose-50 text-rose-700"
        />
      </section>

      {providerStatus && (
        <section className="grid gap-3 sm:grid-cols-2">
          <ProviderCard
            icon={MessageCircle}
            label="WhatsApp messaging"
            ready={providerStatus.configured && providerStatus.workerEnabled}
            detail={
              providerStatus.configured
                ? `Provider: ${providerStatus.provider}${providerStatus.templateName ? ` · ${providerStatus.templateName}` : ""}`
                : "Provider credentials are missing"
            }
          />
          <ProviderCard
            icon={Mail}
            label="Email / Gmail messaging"
            ready={
              providerStatus.emailConfigured && providerStatus.workerEnabled
            }
            detail={
              providerStatus.emailConfigured
                ? "SMTP delivery is configured"
                : "Email credentials are missing"
            }
          />
        </section>
      )}

      <div className="flex flex-wrap gap-2 border-b border-slate-200">
        {(["templates", "outbox", "preferences"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`border-b-2 px-4 py-3 text-sm font-semibold capitalize ${tab === item ? "border-[var(--brand-green)] text-[var(--brand-green)]" : "border-transparent text-slate-500"}`}
          >
            {item === "outbox" ? "Delivery history" : item}
          </button>
        ))}
      </div>

      {tab === "templates" && (
        <Card className="border-slate-200">
          <CardHeader className="gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <CardTitle>Message templates</CardTitle>
              <p className="mt-1 text-sm text-slate-500">
                One template controls one business event and delivery channel.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  value={templateQuery}
                  onChange={(event) => setTemplateQuery(event.target.value)}
                  placeholder="Search templates"
                  className="pl-9"
                />
              </div>
              <select
                value={templateChannel}
                onChange={(event) => setTemplateChannel(event.target.value)}
                className="h-10 rounded-md border bg-white px-3 text-sm"
              >
                <option value="ALL">All channels</option>
                <option value="EMAIL">Email</option>
                <option value="WHATSAPP">WhatsApp</option>
              </select>
              <select
                value={templateStatus}
                onChange={(event) => setTemplateStatus(event.target.value)}
                className="h-10 rounded-md border bg-white px-3 text-sm"
              >
                <option value="ALL">All statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-2">
            {filteredTemplates.map((template) => {
              const event = catalog.find(
                (item) => item.eventType === template.eventType,
              );
              return (
                <article
                  key={template.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 p-5"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${template.channel === "EMAIL" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"}`}
                      >
                        {template.channel === "EMAIL" ? (
                          <Mail className="h-4 w-4" />
                        ) : (
                          <MessageCircle className="h-4 w-4" />
                        )}
                      </span>
                      <div>
                        <h2 className="font-bold text-slate-900">
                          {template.name}
                        </h2>
                        <p className="text-xs text-slate-500">
                          {event?.label ?? template.eventType} ·{" "}
                          {event?.audience ?? "System recipient"}
                        </p>
                      </div>
                      <Badge
                        className={
                          template.status === "ACTIVE"
                            ? "ml-auto bg-emerald-100 text-emerald-700"
                            : "ml-auto bg-slate-100 text-slate-600"
                        }
                      >
                        {template.status}
                      </Badge>
                    </div>
                    {template.subjectTemplate && (
                      <p className="mt-4 text-xs font-semibold text-slate-700">
                        Subject: {template.subjectTemplate}
                      </p>
                    )}
                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600 line-clamp-4">
                      {plainText(template.bodyTemplate)}
                    </p>
                  </div>
                  <div className="mt-5 flex gap-2 border-t pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => editTemplate(template)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => void toggleTemplate(template)}
                    >
                      {template.status === "ACTIVE" ? "Pause" : "Activate"}
                    </Button>
                  </div>
                </article>
              );
            })}
            {!filteredTemplates.length && (
              <div className="lg:col-span-2">
                <Empty text="No templates match these filters." />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {tab === "outbox" && (
        <Card className="overflow-hidden border-slate-200">
          <CardHeader>
            <CardTitle>Delivery history</CardTitle>
            <p className="text-sm text-slate-500">
              Search sent, queued, and failed customer messages.
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-[1fr_170px_170px_auto]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  value={outboxQuery}
                  onChange={(event) => {
                    setOutboxQuery(event.target.value);
                    setOutboxPageNumber(1);
                  }}
                  placeholder="Recipient, subject, or message"
                  className="pl-9"
                />
              </div>
              <select
                value={outboxChannel}
                onChange={(event) => {
                  setOutboxChannel(event.target.value);
                  setOutboxPageNumber(1);
                }}
                className="h-10 rounded-md border bg-white px-3 text-sm"
              >
                <option value="ALL">All channels</option>
                <option value="EMAIL">Email</option>
                <option value="WHATSAPP">WhatsApp</option>
              </select>
              <select
                value={outboxStatus}
                onChange={(event) => {
                  setOutboxStatus(event.target.value);
                  setOutboxPageNumber(1);
                }}
                className="h-10 rounded-md border bg-white px-3 text-sm"
              >
                {[
                  "ALL",
                  "PENDING",
                  "PROCESSING",
                  "SENT",
                  "FAILED",
                  "DEAD_LETTER",
                ].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
              <Button onClick={() => void processPending()} variant="outline">
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${outboxLoading ? "animate-spin" : ""}`}
                />
                Process queued
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {outboxRows.map((item) => (
              <article
                key={item.id}
                className="grid gap-3 rounded-xl border border-slate-200 p-4 lg:grid-cols-[1fr_200px_140px]"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {item.recipient}
                  </p>
                  {item.subject && (
                    <p className="mt-1 text-xs font-semibold text-slate-600">
                      {item.subject}
                    </p>
                  )}
                  <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600 line-clamp-3">
                    {plainText(item.body)}
                  </p>
                  {item.lastError && (
                    <p className="mt-2 text-xs text-rose-600">
                      {item.lastError}
                    </p>
                  )}
                </div>
                <div className="text-sm text-slate-500">
                  <p>{item.channel}</p>
                  <p>{new Date(item.createdAt).toLocaleString()}</p>
                  <p>{item.attemptCount} attempt(s)</p>
                </div>
                <Badge
                  variant="outline"
                  className={`h-fit justify-center ${statusClasses[item.status] ?? ""}`}
                >
                  {item.status}
                </Badge>
              </article>
            ))}
            {!outboxRows.length && (
              <Empty
                text={
                  outboxLoading
                    ? "Loading delivery history…"
                    : "No delivery records match the filters."
                }
              />
            )}
          </CardContent>
          <PaginationControls
            meta={outboxMeta}
            onPageChange={setOutboxPageNumber}
            onPageSizeChange={(size) => {
              setOutboxPageSize(size);
              setOutboxPageNumber(1);
            }}
          />
        </Card>
      )}

      {tab === "preferences" && (
        <Card className="max-w-4xl border-slate-200">
          <CardHeader>
            <CardTitle>Customer communication preference</CardTitle>
            <p className="text-sm text-slate-500">
              Allow or stop one message type for an individual customer.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="relative">
              <label className="text-sm font-medium text-slate-700">
                Search customer by phone, number, or name
              </label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  value={customerSearch}
                  onChange={(event) => {
                    setCustomerSearch(event.target.value);
                    setSelectedCustomer(null);
                  }}
                  placeholder="Type at least 2 characters"
                  className="pl-9"
                />
              </div>
              {customerResults.length > 0 && (
                <div className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-xl border bg-white p-1 shadow-xl">
                  {customerResults.map((customer) => (
                    <button
                      key={customer.id}
                      type="button"
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setCustomerSearch(
                          `${customer.customerNumber} · ${customer.firstName} ${customer.lastName ?? ""}`,
                        );
                        setCustomerResults([]);
                      }}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50"
                    >
                      <strong>
                        {customer.firstName} {customer.lastName}
                      </strong>
                      <span className="ml-2 text-slate-500">
                        {customer.customerNumber} ·{" "}
                        {customer.phone ?? customer.email ?? "No contact"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="text-sm font-medium text-slate-700">
                Message type
                <select
                  value={preference.eventType}
                  onChange={(event) =>
                    setPreference((current) => ({
                      ...current,
                      eventType: event.target.value,
                    }))
                  }
                  className="mt-2 h-10 w-full rounded-md border bg-white px-3"
                >
                  {catalog.map((item) => (
                    <option key={item.eventType} value={item.eventType}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700">
                Channel
                <select
                  value={preference.channel}
                  onChange={(event) =>
                    setPreference((current) => ({
                      ...current,
                      channel: event.target.value as "EMAIL" | "WHATSAPP",
                    }))
                  }
                  className="mt-2 h-10 w-full rounded-md border bg-white px-3"
                >
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="EMAIL">Email</option>
                </select>
              </label>
              <label className="flex items-center gap-3 self-end rounded-lg border p-3 text-sm">
                <input
                  type="checkbox"
                  checked={preference.enabled}
                  onChange={(event) =>
                    setPreference((current) => ({
                      ...current,
                      enabled: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-[var(--brand-green)]"
                />
                Messages enabled
              </label>
            </div>
            <Button
              onClick={() => void savePreference()}
              className="bg-[var(--brand-green)]"
            >
              Save preference
            </Button>
          </CardContent>
        </Card>
      )}

      {draft && (
        <TemplateEditor
          draft={draft}
          setDraft={setDraft}
          catalog={catalog}
          onEventChange={changeDraftEvent}
          onChannelChange={changeDraftChannel}
          onSave={saveTemplate}
          saving={saving}
          onClose={() => setDraft(null)}
        />
      )}
    </div>
  );
}

function TemplateEditor({
  draft,
  setDraft,
  catalog,
  onEventChange,
  onChannelChange,
  onSave,
  saving,
  onClose,
}: {
  draft: TemplateDraft;
  setDraft: (draft: TemplateDraft) => void;
  catalog: TemplateCatalogItem[];
  onEventChange: (eventType: string) => void;
  onChannelChange: (channel: "EMAIL" | "WHATSAPP") => void;
  onSave: (event: FormEvent) => void;
  saving: boolean;
  onClose: () => void;
}) {
  const event = catalog.find((item) => item.eventType === draft.eventType);
  const preview = useMemo(() => {
    let value = draft.bodyTemplate;
    for (const [key, , example] of event?.variables ?? [])
      value = value.replaceAll(`{{${key}}}`, example);
    return plainText(value.replaceAll("{{eventType}}", draft.eventType));
  }, [draft.bodyTemplate, draft.eventType, event]);
  function addVariable(key: string) {
    setDraft({
      ...draft,
      bodyTemplate: `${draft.bodyTemplate}${draft.bodyTemplate ? " " : ""}{{${key}}}`,
    });
  }
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 p-4">
      <form
        onSubmit={onSave}
        className="mx-auto my-6 w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between border-b p-6">
          <div>
            <h2 className="text-xl font-bold">
              {draft.id ? "Edit message template" : "Add message template"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Write the message once; the system fills customer and company
              details automatically.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                Business event
                <select
                  disabled={Boolean(draft.id)}
                  value={draft.eventType}
                  onChange={(e) => onEventChange(e.target.value)}
                  className="mt-2 h-10 w-full rounded-xl border bg-white px-3 font-normal disabled:bg-slate-50"
                >
                  {catalog.map((item) => (
                    <option key={item.eventType} value={item.eventType}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold">
                Delivery channel
                <select
                  disabled={Boolean(draft.id)}
                  value={draft.channel}
                  onChange={(e) =>
                    onChannelChange(e.target.value as "EMAIL" | "WHATSAPP")
                  }
                  className="mt-2 h-10 w-full rounded-xl border bg-white px-3 font-normal disabled:bg-slate-50"
                >
                  <option value="EMAIL">Email / Gmail</option>
                  <option value="WHATSAPP">WhatsApp</option>
                </select>
              </label>
            </div>
            {event && (
              <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-800">
                <strong>{event.audience}</strong>
                <p className="mt-1">{event.description}</p>
              </div>
            )}
            <label className="block text-sm font-semibold">
              Template name
              <Input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="mt-2"
                placeholder="Easy name for administrators"
              />
            </label>
            {draft.channel === "EMAIL" && (
              <label className="block text-sm font-semibold">
                Email subject
                <Input
                  value={draft.subjectTemplate}
                  onChange={(e) =>
                    setDraft({ ...draft, subjectTemplate: e.target.value })
                  }
                  className="mt-2"
                  placeholder="Example: Welcome to {{companyName}}"
                />
              </label>
            )}
            <label className="block text-sm font-semibold">
              Message
              <textarea
                value={draft.bodyTemplate}
                maxLength={draft.channel === "WHATSAPP" ? 1024 : 10000}
                onChange={(e) =>
                  setDraft({ ...draft, bodyTemplate: e.target.value })
                }
                rows={10}
                className="mt-2 w-full resize-y rounded-xl border p-3 font-normal leading-6 outline-none focus:border-[var(--brand-green)]"
                placeholder="Write a clear multiline message"
              />
              <span className="mt-1 block text-right text-xs font-normal text-slate-400">
                {draft.bodyTemplate.length} /{" "}
                {draft.channel === "WHATSAPP" ? "1,024" : "10,000"}
              </span>
            </label>
            <div>
              <p className="text-sm font-semibold">
                Insert customer or company detail
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {event?.variables.map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => addVariable(key)}
                    className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700"
                  >
                    + {label}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-3 rounded-xl border p-3 text-sm">
              <input
                type="checkbox"
                checked={draft.status === "ACTIVE"}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    status: e.target.checked ? "ACTIVE" : "INACTIVE",
                  })
                }
                className="h-4 w-4 accent-[var(--brand-green)]"
              />
              <span>
                <strong className="block">Template active</strong>
                <small className="text-slate-500">
                  Inactive templates stop this message channel.
                </small>
              </span>
            </label>
          </div>
          <aside className="border-t bg-slate-50 p-6 lg:border-l lg:border-t-0">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Message preview
            </p>
            <div className="mt-4 rounded-2xl border bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                {draft.channel === "EMAIL" ? (
                  <Mail className="h-4 w-4 text-blue-600" />
                ) : (
                  <MessageCircle className="h-4 w-4 text-emerald-600" />
                )}
                {draft.channel === "EMAIL" ? "Email / Gmail" : "WhatsApp"}
              </div>
              {draft.channel === "EMAIL" && (
                <p className="mb-3 border-b pb-3 text-sm">
                  <strong>Subject:</strong>{" "}
                  {sampleText(draft.subjectTemplate, event)}
                </p>
              )}
              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {preview || "Your message preview will appear here."}
              </p>
            </div>
            <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-xs leading-5 text-blue-800">
              Variables such as <strong>Company name</strong> are replaced when
              the notification is created. For WhatsApp, the configured provider
              template carries this message.
            </div>
          </aside>
        </div>
        <footer className="flex justify-end gap-3 border-t p-5">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={saving} className="bg-[var(--brand-green)]">
            <Send className="mr-2 h-4 w-4" />
            {saving ? "Saving…" : "Save template"}
          </Button>
        </footer>
      </form>
    </div>
  );
}

function sampleText(value: string, event?: TemplateCatalogItem) {
  let output = value;
  for (const [key, , example] of event?.variables ?? [])
    output = output.replaceAll(`{{${key}}}`, example);
  return output;
}
function plainText(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .trim();
}
function Alert({
  tone,
  text,
  onClose,
}: {
  tone: "warning" | "success";
  text: string;
  onClose?: () => void;
}) {
  return (
    <div
      className={`flex items-start justify-between rounded-xl border p-4 text-sm ${tone === "warning" ? "border-amber-200 bg-amber-50 text-amber-800" : "border-teal-200 bg-teal-50 text-teal-800"}`}
    >
      <span>
        {tone === "warning" && (
          <TriangleAlert className="mr-2 inline h-4 w-4" />
        )}
        {text}
      </span>
      {onClose && (
        <button type="button" onClick={onClose}>
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
function ProviderCard({
  icon: Icon,
  label,
  ready,
  detail,
}: {
  icon: typeof Mail;
  label: string;
  ready: boolean;
  detail: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-4 ${ready ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}
    >
      <Icon
        className={`h-5 w-5 ${ready ? "text-emerald-700" : "text-amber-700"}`}
      />
      <div>
        <p className="text-sm font-bold">{label}</p>
        <p className="text-xs text-slate-600">
          {detail} · Worker {ready ? "ready" : "needs setup"}
        </p>
      </div>
    </div>
  );
}
function Metric({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: typeof BellRing;
  tone: string;
}) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {value.toLocaleString()}
          </p>
        </div>
        <div className={`rounded-xl p-3 ${tone}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center text-sm text-slate-500">
      {text}
    </div>
  );
}
