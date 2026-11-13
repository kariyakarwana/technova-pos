"use client";

import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Bot,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Edit3,
  FileText,
  Layers,
  Mail,
  MessageSquare,
  Plus,
  RefreshCw,
  Send,
  ShoppingBag,
  Sparkles,
  Tag,
  Trash2,
  UserPlus,
  X,
  Zap,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import type {
  AddonQuotaTarget,
  PackageFeatureItem,
  PlatformAddonPack,
  PlatformAnalytics,
  PlatformAuditEvent,
  PlatformNotificationItem,
  PlatformPlan,
  PlatformSubscriptionRequest,
  TenantSummary,
} from "./types";

const FEATURE_PRESETS: Array<{ key: string; label: string }> = [
  { key: "custom_branding", label: "White-Label Custom Branding" },
  { key: "byo_smtp", label: "Custom BYO SMTP Server" },
  { key: "supplier_portal", label: "Supplier Portal Workflow" },
  { key: "customer_loyalty_app", label: "Customer Loyalty & Rewards App" },
  { key: "offline_sync", label: "Offline POS Mode & Sync" },
  { key: "priority_support", label: "24/7 Priority SLA Support" },
];

function getPlanBadgeStyle(code: string) {
  switch (code.toUpperCase()) {
    case "ENTERPRISE":
      return "bg-[#004532]/10 text-[#004532] border-[#004532]/20";
    case "PROFESSIONAL":
      return "bg-indigo-50 text-[#3852D4] border-indigo-200";
    case "STANDARD":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-[#EEFFFD] text-[#0E9384] border-[#0E9384]/25";
  }
}

function FeatureListEditor({
  features,
  onChange,
}: {
  features: PackageFeatureItem[];
  onChange: (next: PackageFeatureItem[]) => void;
}) {
  const [newKey, setNewKey] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const addFeature = (keyStr: string, labelStr: string, descStr?: string) => {
    const cleanKey = keyStr
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_]+/g, "_")
      .replace(/^_+|_+$/g, "");
    const cleanLabel = labelStr.trim();
    if (!cleanKey || !cleanLabel) {
      toast.error("Provide both a feature key and label.");
      return;
    }
    if (features.some((f) => f.key === cleanKey)) {
      toast.error(`Feature '${cleanKey}' is already added.`);
      return;
    }
    onChange([
      ...features,
      {
        key: cleanKey,
        label: cleanLabel,
        description: descStr?.trim() || undefined,
        enabled: true,
      },
    ]);
    setNewKey("");
    setNewLabel("");
    setNewDesc("");
  };

  return (
    <div className="space-y-3 border-t border-[#E4E7EC] pt-3">
      <div className="flex items-center justify-between">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#0E9384] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Custom &amp; Future Features
        </h4>
        <span className="text-[10px] text-slate-400">
          Synced live to subscribed tenants
        </span>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap gap-1.5">
        {FEATURE_PRESETS.filter((p) => !features.some((f) => f.key === p.key)).map(
          (preset) => (
            <button
              key={preset.key}
              type="button"
              onClick={() => addFeature(preset.key, preset.label)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-50 hover:bg-[#EEFFFD] border border-[#E4E7EC] hover:border-[#0E9384]/30 text-[10px] font-semibold text-slate-600 hover:text-[#0E9384] transition"
            >
              <Plus className="w-3 h-3" />
              {preset.label}
            </button>
          )
        )}
      </div>

      {/* Existing Feature Rows */}
      {features.length > 0 && (
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          {features.map((feat, idx) => (
            <div
              key={feat.key}
              className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-[#E4E7EC]"
            >
              <label className="flex items-center gap-2 min-w-0 cursor-pointer flex-1">
                <input
                  type="checkbox"
                  checked={feat.enabled}
                  onChange={(e) => {
                    const next = [...features];
                    next[idx] = { ...feat, enabled: e.target.checked };
                    onChange(next);
                  }}
                  className="rounded border-slate-300 text-[#0E9384] focus:ring-[#0E9384]"
                />
                <div className="min-w-0">
                  <div className="font-semibold text-[#1D2939] truncate">{feat.label}</div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">
                    key: {feat.key}
                  </div>
                </div>
              </label>
              <button
                type="button"
                onClick={() => onChange(features.filter((_, i) => i !== idx))}
                className="p-1 rounded-lg text-slate-400 hover:text-[#D32F2F] hover:bg-rose-50"
                title="Remove feature"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Arbitrary Custom Feature */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center pt-1">
        <input
          type="text"
          placeholder="Feature label (e.g. Multi-Currency)"
          value={newLabel}
          onChange={(e) => {
            setNewLabel(e.target.value);
            if (!newKey) {
              // keep newKey empty until typed or auto-derive on add
            }
          }}
          className="sm:col-span-5 px-2.5 py-1.5 bg-slate-50 border border-[#E4E7EC] rounded-lg text-xs text-[#1D2939]"
        />
        <input
          type="text"
          placeholder="Key (e.g. multi_currency)"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          className="sm:col-span-4 px-2.5 py-1.5 bg-slate-50 border border-[#E4E7EC] rounded-lg text-xs font-mono text-[#1D2939]"
        />
        <button
          type="button"
          onClick={() =>
            addFeature(newKey || newLabel, newLabel || newKey, newDesc)
          }
          className="sm:col-span-3 px-2.5 py-1.5 rounded-lg bg-[#EEFFFD] text-[#0E9384] border border-[#0E9384]/30 hover:bg-[#0E9384] hover:text-white text-xs font-bold transition"
        >
          + Add Feature
        </button>
      </div>
    </div>
  );
}

function SubscriptionRequestsPanel({
  title,
  emptyLabel,
  requests,
  onRefresh,
}: {
  title: string;
  emptyLabel: string;
  requests: PlatformSubscriptionRequest[];
  onRefresh: () => Promise<void>;
}) {
  const [reviewingReq, setReviewingReq] = useState<{
    req: PlatformSubscriptionRequest;
    action: "APPROVE" | "REJECT";
  } | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [paymentRef, setPaymentRef] = useState("");
  const [markPaid, setMarkPaid] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;

  const openReview = (req: PlatformSubscriptionRequest, action: "APPROVE" | "REJECT") => {
    setReviewingReq({ req, action });
    setReviewNotes("");
    setPaymentRef(req.paymentRef || "");
    setMarkPaid(Boolean(req.paymentRef));
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingReq) return;
    setSubmitting(true);
    try {
      const res = await apiClient<{ message: string }>(
        `/platform-admin/subscription-requests/${reviewingReq.req.id}/review`,
        {
          method: "PATCH",
          body: JSON.stringify({
            action: reviewingReq.action,
            reviewNotes: reviewNotes.trim() || undefined,
            paymentRef: paymentRef.trim() || undefined,
            markPaid: reviewingReq.action === "APPROVE" ? markPaid : undefined,
          }),
        }
      );
      toast.success(res.message, { duration: 6000 });
      setReviewingReq(null);
      await onRefresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to review request.", {
        duration: 8000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E4E7EC] shadow-xs overflow-hidden">
      <div className="p-4 sm:px-5 border-b border-[#E4E7EC] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#0E9384]" />
          <h3 className="text-sm font-bold text-[#1D2939]">{title}</h3>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200">
              {pendingCount} Pending
            </span>
          )}
        </div>
        <span className="text-[11px] font-mono text-slate-400">{requests.length} Total</span>
      </div>

      {requests.length === 0 ? (
        <div className="py-6 px-5 text-center text-xs text-slate-400">{emptyLabel}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-[#E4E7EC] text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-2.5 px-5">Organization</th>
                <th className="py-2.5 px-4">Requested Change</th>
                <th className="py-2.5 px-4">Note / Bank Ref</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-5">
                    <div className="font-bold text-[#1D2939]">{req.organizationName}</div>
                    <div className="text-[10px] font-mono text-slate-400">
                      {new Date(req.createdAt).toLocaleString()}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {req.type === "PLAN_CHANGE" ? (
                      <div>
                        <span className="text-slate-500">{req.currentPlanName}</span>{" "}
                        <span className="text-[#0E9384] font-bold">&rarr;</span>{" "}
                        <span className="font-bold text-[#004532]">
                          {req.targetPlanName || req.targetPlanCode}
                        </span>
                        {req.targetPlanPriceUsd !== null && (
                          <div className="text-[10px] font-mono text-slate-500">
                            ${req.targetPlanPriceUsd.toFixed(2)}/mo + VAT
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <span className="font-bold text-[#1D2939]">
                          {req.quantity}x {req.addonName || req.addonCode}
                        </span>
                        {req.addonPriceUsd !== null && (
                          <div className="text-[10px] font-mono text-slate-500">
                            ${(req.addonPriceUsd * req.quantity).toFixed(2)} + VAT
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    {req.paymentRef && (
                      <div className="font-mono text-[11px] font-semibold text-[#0E9384]">
                        Ref: {req.paymentRef}
                      </div>
                    )}
                    {req.notes ? (
                      <div className="text-[11px] text-slate-600 truncate">{req.notes}</div>
                    ) : (
                      !req.paymentRef && <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        req.status === "APPROVED"
                          ? "bg-[#EEFFFD] text-[#0E9384] border-[#0E9384]/25"
                          : req.status === "REJECTED"
                          ? "bg-rose-50 text-[#D32F2F] border-rose-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right whitespace-nowrap space-x-1.5">
                    {req.status === "PENDING" ? (
                      <>
                        <button
                          onClick={() => openReview(req, "APPROVE")}
                          className="px-2.5 py-1 rounded-lg bg-[#0E9384] hover:bg-[#004532] text-white text-[11px] font-bold transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => openReview(req, "REJECT")}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-[#D32F2F] border border-rose-200 text-[11px] font-semibold transition"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        {req.reviewNotes || "Reviewed"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Review Modal */}
      {reviewingReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E4E7EC] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-3">
              <h3 className="text-base font-bold text-[#1D2939]">
                {reviewingReq.action === "APPROVE"
                  ? "Approve Tenant Request"
                  : "Reject Tenant Request"}
              </h3>
              <button
                onClick={() => setReviewingReq(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-[#E4E7EC] text-xs space-y-1">
              <div className="font-bold text-[#1D2939]">{reviewingReq.req.organizationName}</div>
              <div className="text-slate-600">
                {reviewingReq.req.type === "PLAN_CHANGE"
                  ? `Switch plan: ${reviewingReq.req.currentPlanName} -> ${reviewingReq.req.targetPlanName}`
                  : `Add-on: ${reviewingReq.req.quantity}x ${reviewingReq.req.addonName}`}
              </div>
              {reviewingReq.req.notes && (
                <div className="text-slate-500 italic">&ldquo;{reviewingReq.req.notes}&rdquo;</div>
              )}
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
              {reviewingReq.action === "APPROVE" && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Bank Payment / Wire Reference (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TXN-882910"
                      value={paymentRef}
                      onChange={(e) => setPaymentRef(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl font-mono text-[#1D2939]"
                    />
                  </div>
                  <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={markPaid}
                      disabled={!paymentRef.trim()}
                      onChange={(e) => setMarkPaid(e.target.checked)}
                      className="rounded border-slate-300 text-[#0E9384]"
                    />
                    Mark generated invoice as PAID immediately (requires reference)
                  </label>
                </>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {reviewingReq.action === "APPROVE"
                    ? "Approval Notes (Optional)"
                    : "Rejection Reason (Optional)"}
                </label>
                <input
                  type="text"
                  placeholder={
                    reviewingReq.action === "APPROVE"
                      ? "e.g. Verified bank deposit slip"
                      : "e.g. Invalid bank reference provided"
                  }
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl text-[#1D2939]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E4E7EC]">
                <button
                  type="button"
                  onClick={() => setReviewingReq(null)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-4 py-2 rounded-xl font-bold text-white shadow-sm disabled:opacity-50 ${
                    reviewingReq.action === "APPROVE"
                      ? "bg-[#0E9384] hover:bg-[#004532]"
                      : "bg-[#D32F2F] hover:bg-rose-700"
                  }`}
                >
                  {submitting
                    ? "Processing..."
                    : reviewingReq.action === "APPROVE"
                    ? "Approve & Activate"
                    : "Confirm Reject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function SubscriptionsView({
  plans,
  organizations,
  requests = [],
  createSignal = 0,
  onRefresh,
  onOpenPlanModal,
}: {
  plans: PlatformPlan[];
  organizations: TenantSummary[];
  requests?: PlatformSubscriptionRequest[];
  createSignal?: number;
  onRefresh: () => Promise<void>;
  onOpenPlanModal: (org: TenantSummary) => void;
}) {
  const [editingPlan, setEditingPlan] = useState<PlatformPlan | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const [planForm, setPlanForm] = useState({
    code: "",
    tier: "CUSTOM",
    name: "",
    description: "",
    priceUsd: 99,
    vatRate: 0.18,
    billingCycle: "MONTHLY",
    isActive: true,
    maxBranches: 3,
    maxInternalUsers: 15,
    monthlyWhatsAppBills: 1500,
    monthlyWhatsAppMarketing: 200,
    monthlyEmailLimit: 1000,
    monthlyAiRequests: 300,
    multiBranchEnabled: true,
    emailEnabled: true,
    whatsAppBillsEnabled: true,
    whatsAppMarketingEnabled: false,
    aiEnabled: true,
    features: [] as PackageFeatureItem[],
  });

  useEffect(() => {
    if (createSignal > 0) {
      openCreateModal();
    }
  }, [createSignal]);

  const openCreateModal = () => {
    setEditingPlan(null);
    setIsCreating(true);
    setPlanForm({
      code: "",
      tier: "CUSTOM",
      name: "",
      description: "",
      priceUsd: 99,
      vatRate: 0.18,
      billingCycle: "MONTHLY",
      isActive: true,
      maxBranches: 3,
      maxInternalUsers: 15,
      monthlyWhatsAppBills: 1500,
      monthlyWhatsAppMarketing: 200,
      monthlyEmailLimit: 1000,
      monthlyAiRequests: 300,
      multiBranchEnabled: true,
      emailEnabled: true,
      whatsAppBillsEnabled: true,
      whatsAppMarketingEnabled: false,
      aiEnabled: true,
      features: [],
    });
  };

  const openEditModal = (plan: PlatformPlan) => {
    setIsCreating(false);
    setEditingPlan(plan);
    setPlanForm({
      code: plan.code,
      tier: plan.tier,
      name: plan.name,
      description: plan.description || "",
      priceUsd: plan.priceUsd,
      vatRate: plan.vatRate,
      billingCycle: plan.billingCycle,
      isActive: plan.isActive,
      maxBranches: plan.maxBranches,
      maxInternalUsers: plan.maxInternalUsers,
      monthlyWhatsAppBills: plan.monthlyWhatsAppBills,
      monthlyWhatsAppMarketing: plan.monthlyWhatsAppMarketing,
      monthlyEmailLimit: plan.monthlyEmailLimit,
      monthlyAiRequests: plan.monthlyAiRequests,
      multiBranchEnabled: plan.multiBranchEnabled,
      emailEnabled: plan.emailEnabled,
      whatsAppBillsEnabled: plan.whatsAppBillsEnabled,
      whatsAppMarketingEnabled: plan.whatsAppMarketingEnabled,
      aiEnabled: plan.aiEnabled,
      features: Array.isArray(plan.features) ? plan.features : [],
    });
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isCreating) {
        const res = await apiClient<{ message: string }>("/platform-admin/plans", {
          method: "POST",
          body: JSON.stringify(planForm),
        });
        toast.success(res.message, { duration: 5000 });
        setIsCreating(false);
      } else if (editingPlan) {
        const { code: _omitCode, ...updatePayload } = planForm;
        const res = await apiClient<{ message: string }>(
          `/platform-admin/plans/${editingPlan.id}`,
          {
            method: "PATCH",
            body: JSON.stringify(updatePayload),
          }
        );
        toast.success(res.message, { duration: 6000 });
        setEditingPlan(null);
      }
      await onRefresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save plan.", {
        duration: 8000,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Incoming Tenant Plan Change Requests */}
      <SubscriptionRequestsPanel
        title="Incoming Plan Change Requests"
        emptyLabel="No plan change requests submitted by tenants yet."
        requests={requests}
        onRefresh={onRefresh}
      />

      {/* Commercial Plan Tiers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between space-y-4 ${
              plan.isActive ? "border-[#E4E7EC]" : "border-amber-200 bg-amber-50/20 opacity-80"
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getPlanBadgeStyle(
                    plan.code
                  )}`}
                >
                  {plan.name}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {plan.subscriberCount} Tenants
                </span>
              </div>

              <div className="mt-1 flex items-center gap-2 text-[10px] font-mono text-slate-400">
                <span>CODE: {plan.code}</span>
                {!plan.isActive && (
                  <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                    INACTIVE
                  </span>
                )}
              </div>

              <div className="mt-3 text-2xl font-extrabold text-[#1D2939] font-mono">
                ${plan.priceUsd.toFixed(2)}
                <span className="text-xs font-normal text-slate-400">
                  {" "}
                  /{plan.billingCycle === "ANNUAL" ? "yr" : "mo"} + VAT
                </span>
              </div>

              {plan.description && (
                <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2">
                  {plan.description}
                </p>
              )}

              <ul className="mt-4 space-y-1.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0E9384] shrink-0" />
                  {plan.maxBranches} Branches • {plan.maxInternalUsers} Staff
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 shrink-0 ${
                      plan.whatsAppBillsEnabled ? "text-[#0E9384]" : "text-slate-300"
                    }`}
                  />
                  {plan.monthlyWhatsAppBills.toLocaleString()} WhatsApp Bills
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 shrink-0 ${
                      plan.aiEnabled ? "text-[#0E9384]" : "text-slate-300"
                    }`}
                  />
                  {plan.monthlyAiRequests.toLocaleString()} Gemini AI Queries
                </li>
                {plan.features
                  ?.filter((f) => f.enabled)
                  .map((f) => (
                    <li key={f.key} className="flex items-center gap-2 text-[#004532] font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-[#0E9384] shrink-0" />
                      {f.label}
                    </li>
                  ))}
              </ul>
            </div>

            <button
              onClick={() => openEditModal(plan)}
              className="w-full py-2 rounded-xl border border-[#0E9384]/30 bg-[#EEFFFD] text-[#004532] hover:bg-[#0E9384] hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Plan &amp; Features
            </button>
          </div>
        ))}
      </div>

      {/* Tenant Plan Assignments */}
      <div className="bg-white rounded-2xl border border-[#E4E7EC] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E4E7EC]">
          <h3 className="text-sm font-bold text-[#1D2939] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#0E9384]" />
            Tenant Subscription Assignments
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-[#E4E7EC] text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3 px-5">Organization</th>
                <th className="py-3 px-4">Active Plan</th>
                <th className="py-3 px-4">Monthly Base / +18% VAT</th>
                <th className="py-3 px-4">Extra Capacity</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {organizations.map((org) => (
                <tr key={org.id} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-5 font-bold text-[#1D2939]">{org.name}</td>
                  <td className="py-3.5 px-4">
                    {org.subscription ? (
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#EEFFFD] text-[#0E9384] border border-[#0E9384]/20">
                        {org.subscription.planName}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">No Subscription</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    {org.subscription ? (
                      <>
                        <span className="font-bold text-[#1D2939]">
                          ${org.subscription.priceUsd.toFixed(2)}
                        </span>{" "}
                        <span className="text-slate-400">
                          (${org.subscription.priceWithVatUsd.toFixed(2)} incl. VAT)
                        </span>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                    {org.subscription
                      ? `+${org.subscription.extraBranches} Br • +${org.subscription.extraWhatsAppBills} WA • +${org.subscription.extraAiRequests} AI`
                      : "—"}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => onOpenPlanModal(org)}
                      className="px-3 py-1 rounded-lg text-[11px] font-semibold bg-[#EEFFFD] text-[#0E9384] border border-[#0E9384]/25 hover:bg-[#0E9384] hover:text-white transition"
                    >
                      Change Plan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Plan Modal */}
      {(isCreating || editingPlan) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#E4E7EC] space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#1D2939]">
                  {isCreating ? "Create New Subscription Plan" : `Edit Plan: ${editingPlan?.name}`}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {isCreating
                    ? "Define quotas, pricing, built-in toggles, and custom features."
                    : `Changes apply immediately to ${editingPlan?.subscriberCount ?? 0} subscribed tenant organization(s).`}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingPlan(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Plan Code *</label>
                  <input
                    type="text"
                    required
                    disabled={!isCreating}
                    placeholder="e.g. GROWTH_PLUS"
                    value={planForm.code}
                    onChange={(e) =>
                      setPlanForm({ ...planForm, code: e.target.value.toUpperCase() })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl font-mono text-[#1D2939] disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Plan Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Growth Plus Plan"
                    value={planForm.name}
                    onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl text-[#1D2939]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tier Group</label>
                  <select
                    value={planForm.tier}
                    onChange={(e) => setPlanForm({ ...planForm, tier: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl text-[#1D2939]"
                  >
                    <option value="BASIC">BASIC</option>
                    <option value="STANDARD">STANDARD</option>
                    <option value="PROFESSIONAL">PROFESSIONAL</option>
                    <option value="ENTERPRISE">ENTERPRISE</option>
                    <option value="CUSTOM">CUSTOM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={planForm.priceUsd}
                    onChange={(e) =>
                      setPlanForm({ ...planForm, priceUsd: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl font-mono text-[#1D2939]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Billing Cycle</label>
                  <select
                    value={planForm.billingCycle}
                    onChange={(e) => setPlanForm({ ...planForm, billingCycle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl text-[#1D2939]"
                  >
                    <option value="MONTHLY">MONTHLY</option>
                    <option value="ANNUAL">ANNUAL</option>
                  </select>
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={planForm.isActive}
                      onChange={(e) => setPlanForm({ ...planForm, isActive: e.target.checked })}
                      className="rounded border-slate-300 text-[#0E9384]"
                    />
                    Plan Active &amp; Assignable
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Short description of who this package is built for..."
                  value={planForm.description}
                  onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl text-[#1D2939]"
                />
              </div>

              {/* Numeric Quotas */}
              <div className="border-t border-[#E4E7EC] pt-3 space-y-2.5">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#0E9384]">
                  Resource Limits &amp; Monthly Quotas
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Max Branches</label>
                    <input
                      type="number"
                      min="1"
                      value={planForm.maxBranches}
                      onChange={(e) =>
                        setPlanForm({ ...planForm, maxBranches: parseInt(e.target.value) || 1 })
                      }
                      className="w-full px-3 py-1.5 bg-slate-50 border border-[#E4E7EC] rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Max Staff Users</label>
                    <input
                      type="number"
                      min="1"
                      value={planForm.maxInternalUsers}
                      onChange={(e) =>
                        setPlanForm({
                          ...planForm,
                          maxInternalUsers: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full px-3 py-1.5 bg-slate-50 border border-[#E4E7EC] rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      WhatsApp Bills / mo
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={planForm.monthlyWhatsAppBills}
                      onChange={(e) =>
                        setPlanForm({
                          ...planForm,
                          monthlyWhatsAppBills: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-1.5 bg-slate-50 border border-[#E4E7EC] rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      WA Marketing / mo
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={planForm.monthlyWhatsAppMarketing}
                      onChange={(e) =>
                        setPlanForm({
                          ...planForm,
                          monthlyWhatsAppMarketing: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-1.5 bg-slate-50 border border-[#E4E7EC] rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Emails / mo
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={planForm.monthlyEmailLimit}
                      onChange={(e) =>
                        setPlanForm({
                          ...planForm,
                          monthlyEmailLimit: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-1.5 bg-slate-50 border border-[#E4E7EC] rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Gemini AI Queries / mo
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={planForm.monthlyAiRequests}
                      onChange={(e) =>
                        setPlanForm({
                          ...planForm,
                          monthlyAiRequests: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-1.5 bg-slate-50 border border-[#E4E7EC] rounded-xl font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Built-in Capabilities */}
              <div className="border-t border-[#E4E7EC] pt-3 space-y-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#0E9384]">
                  Core Platform Modules Enabled
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { key: "multiBranchEnabled", label: "Multi-Branch" },
                    { key: "emailEnabled", label: "Transactional Emails" },
                    { key: "whatsAppBillsEnabled", label: "WhatsApp Digital Bills" },
                    { key: "whatsAppMarketingEnabled", label: "WhatsApp Marketing" },
                    { key: "aiEnabled", label: "Gemini AI Assistant" },
                  ].map((toggle) => (
                    <label
                      key={toggle.key}
                      className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-[#E4E7EC] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(planForm[toggle.key as keyof typeof planForm])}
                        onChange={(e) =>
                          setPlanForm({ ...planForm, [toggle.key]: e.target.checked })
                        }
                        className="rounded border-slate-300 text-[#0E9384]"
                      />
                      <span className="font-semibold text-[#1D2939]">{toggle.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dynamic Custom & Future Features */}
              <FeatureListEditor
                features={planForm.features}
                onChange={(features) => setPlanForm({ ...planForm, features })}
              />

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E4E7EC]">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingPlan(null);
                  }}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl font-bold text-white bg-[#0E9384] hover:bg-[#004532] shadow-sm disabled:opacity-50"
                >
                  {saving ? "Saving..." : isCreating ? "Create Plan" : "Save & Propagate Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function AddonsView({
  addonPacks,
  organizations,
  requests = [],
  createSignal = 0,
  onRefresh,
  onOpenAddonModal,
}: {
  addonPacks: PlatformAddonPack[];
  organizations: TenantSummary[];
  requests?: PlatformSubscriptionRequest[];
  createSignal?: number;
  onRefresh: () => Promise<void>;
  onOpenAddonModal: (org: TenantSummary) => void;
}) {
  const [editingPack, setEditingPack] = useState<PlatformAddonPack | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const [packForm, setPackForm] = useState({
    code: "",
    name: "",
    description: "",
    quotaTarget: "WHATSAPP_BILLS" as AddonQuotaTarget,
    unitsPerPack: 1000,
    priceUsd: 10,
    billingCycle: "ONE_TIME",
    isActive: true,
    features: [] as PackageFeatureItem[],
  });

  useEffect(() => {
    if (createSignal > 0) {
      openCreateModal();
    }
  }, [createSignal]);

  const openCreateModal = () => {
    setEditingPack(null);
    setIsCreating(true);
    setPackForm({
      code: "",
      name: "",
      description: "",
      quotaTarget: "CUSTOM_FEATURE",
      unitsPerPack: 0,
      priceUsd: 15,
      billingCycle: "ONE_TIME",
      isActive: true,
      features: [],
    });
  };

  const openEditModal = (pack: PlatformAddonPack) => {
    setIsCreating(false);
    setEditingPack(pack);
    setPackForm({
      code: pack.code,
      name: pack.name,
      description: pack.description || "",
      quotaTarget: pack.quotaTarget,
      unitsPerPack: pack.unitsPerPack,
      priceUsd: pack.priceUsd,
      billingCycle: pack.billingCycle,
      isActive: pack.isActive,
      features: Array.isArray(pack.features) ? pack.features : [],
    });
  };

  const handleSavePack = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isCreating) {
        const res = await apiClient<{ message: string }>("/platform-admin/addon-packs", {
          method: "POST",
          body: JSON.stringify(packForm),
        });
        toast.success(res.message, { duration: 5000 });
        setIsCreating(false);
      } else if (editingPack) {
        const { code: _omitCode, ...updatePayload } = packForm;
        const res = await apiClient<{ message: string }>(
          `/platform-admin/addon-packs/${editingPack.id}`,
          {
            method: "PATCH",
            body: JSON.stringify(updatePayload),
          }
        );
        toast.success(res.message, { duration: 5000 });
        setEditingPack(null);
      }
      await onRefresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save add-on pack.", {
        duration: 8000,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Incoming Tenant Add-on Requests */}
      <SubscriptionRequestsPanel
        title="Incoming Add-on Requests"
        emptyLabel="No add-on requests submitted by tenants yet."
        requests={requests}
        onRefresh={onRefresh}
      />

      {/* Add-on Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {addonPacks.map((addon) => (
          <div
            key={addon.id}
            className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between space-y-3 ${
              addon.isActive ? "border-[#E4E7EC]" : "border-amber-200 bg-amber-50/20 opacity-80"
            }`}
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-[#EEFFFD] text-[#0E9384] flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-[#1D2939]">
                    ${addon.priceUsd.toFixed(2)}
                    {addon.billingCycle === "MONTHLY" ? "/mo" : ""}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#1D2939]">{addon.name}</h4>
                <div className="text-[10px] font-mono text-slate-400">
                  CODE: {addon.code} • {addon.allocationCount} allocations
                </div>
              </div>

              <div className="text-xs font-bold text-[#0E9384] font-mono">
                {addon.unitsPerPack > 0
                  ? `+${addon.unitsPerPack.toLocaleString()} ${addon.quotaTarget.replace(/_/g, " ")}`
                  : "Feature Unlock Pack"}
              </div>

              {addon.description && (
                <p className="text-xs text-slate-500 leading-relaxed">{addon.description}</p>
              )}

              {addon.features && addon.features.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {addon.features
                    .filter((f) => f.enabled)
                    .map((f) => (
                      <span
                        key={f.key}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#EEFFFD] text-[#004532] border border-[#0E9384]/20 text-[10px] font-semibold"
                      >
                        <Sparkles className="w-2.5 h-2.5 text-[#0E9384]" />
                        {f.label}
                      </span>
                    ))}
                </div>
              )}
            </div>

            <button
              onClick={() => openEditModal(addon)}
              className="w-full py-2 rounded-xl border border-[#E4E7EC] hover:border-[#0E9384]/40 bg-slate-50 hover:bg-[#EEFFFD] text-xs font-semibold text-[#1D2939] hover:text-[#004532] flex items-center justify-center gap-1.5 transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Add-on Pack
            </button>
          </div>
        ))}
      </div>

      {/* Allocation Table */}
      <div className="bg-white rounded-2xl border border-[#E4E7EC] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E4E7EC]">
          <h3 className="text-sm font-bold text-[#1D2939]">
            Tenant Add-on &amp; Quota Allocation
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-[#E4E7EC] text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3 px-5">Organization</th>
                <th className="py-3 px-4">WhatsApp Quota</th>
                <th className="py-3 px-4">Gemini AI Quota</th>
                <th className="py-3 px-4">Branch Capacity</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {organizations.map((org) => (
                <tr key={org.id} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-5 font-bold text-[#1D2939]">{org.name}</td>
                  <td className="py-3.5 px-4 font-mono">
                    {org.usage?.whatsAppBills?.used ?? 0} / {org.usage?.whatsAppBills?.limit ?? 0}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    {org.usage?.aiRequests?.used ?? 0} / {org.usage?.aiRequests?.limit ?? 0}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    {org.counts.branches} / {org.usage?.branches?.limit ?? 1}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => onOpenAddonModal(org)}
                      className="px-3 py-1 rounded-lg text-[11px] font-semibold bg-[#0E9384] text-white hover:bg-[#004532] transition"
                    >
                      + Allocate Pack
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Add-on Modal */}
      {(isCreating || editingPack) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E4E7EC] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-3">
              <h3 className="text-base font-bold text-[#1D2939]">
                {isCreating ? "Create Add-on Pack" : `Edit Add-on: ${editingPack?.name}`}
              </h3>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingPack(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePack} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pack Code *</label>
                  <input
                    type="text"
                    required
                    disabled={!isCreating}
                    placeholder="e.g. LOYALTY_MODULE"
                    value={packForm.code}
                    onChange={(e) =>
                      setPackForm({ ...packForm, code: e.target.value.toUpperCase() })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl font-mono disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pack Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Loyalty Rewards Pack"
                    value={packForm.name}
                    onChange={(e) => setPackForm({ ...packForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="What does this add-on provide?"
                  value={packForm.description}
                  onChange={(e) => setPackForm({ ...packForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quota Target</label>
                  <select
                    value={packForm.quotaTarget}
                    onChange={(e) =>
                      setPackForm({
                        ...packForm,
                        quotaTarget: e.target.value as AddonQuotaTarget,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl"
                  >
                    <option value="WHATSAPP_BILLS">WHATSAPP_BILLS</option>
                    <option value="WHATSAPP_MARKETING">WHATSAPP_MARKETING</option>
                    <option value="EMAILS">EMAILS</option>
                    <option value="AI_REQUESTS">AI_REQUESTS</option>
                    <option value="BRANCHES">BRANCHES</option>
                    <option value="CUSTOM_FEATURE">CUSTOM_FEATURE</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Units Per Pack</label>
                  <input
                    type="number"
                    min="0"
                    value={packForm.unitsPerPack}
                    onChange={(e) =>
                      setPackForm({ ...packForm, unitsPerPack: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price (USD) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={packForm.priceUsd}
                    onChange={(e) =>
                      setPackForm({ ...packForm, priceUsd: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Billing Cycle</label>
                  <select
                    value={packForm.billingCycle}
                    onChange={(e) => setPackForm({ ...packForm, billingCycle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl"
                  >
                    <option value="ONE_TIME">ONE_TIME</option>
                    <option value="MONTHLY">MONTHLY</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={packForm.isActive}
                  onChange={(e) => setPackForm({ ...packForm, isActive: e.target.checked })}
                  className="rounded border-slate-300 text-[#0E9384]"
                />
                Add-on Active in Catalog
              </label>

              <FeatureListEditor
                features={packForm.features}
                onChange={(features) => setPackForm({ ...packForm, features })}
              />

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E4E7EC]">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingPack(null);
                  }}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl font-bold text-white bg-[#0E9384] hover:bg-[#004532] shadow-sm disabled:opacity-50"
                >
                  {saving ? "Saving..." : isCreating ? "Create Add-on" : "Save Add-on Pack"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function TelemetryView({
  analytics,
  organizations,
}: {
  analytics: PlatformAnalytics;
  organizations: TenantSummary[];
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#E4E7EC] p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">WhatsApp Digital Bills</span>
            <MessageSquare className="w-4 h-4 text-[#0E9384]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#1D2939]">
            {analytics.currentMonthConsumption.totalWhatsAppBillsSent.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400">
            Period: {analytics.currentMonthConsumption.period}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E4E7EC] p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Transactional Emails</span>
            <Mail className="w-4 h-4 text-[#3852D4]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#1D2939]">
            {analytics.currentMonthConsumption.totalEmailsSent.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400">SMTP Dispatch Operational</div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E4E7EC] p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Gemini AI Requests</span>
            <Bot className="w-4 h-4 text-[#E26D1E]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#1D2939]">
            {analytics.currentMonthConsumption.totalAiRequestsUsed.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400">AI Assistant &amp; Stock Forecasting</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E4E7EC] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E4E7EC]">
          <h3 className="text-sm font-bold text-[#1D2939]">Per-Tenant Consumption Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-[#E4E7EC] text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3 px-5">Organization</th>
                <th className="py-3 px-4">WhatsApp Bills</th>
                <th className="py-3 px-4">WhatsApp Marketing</th>
                <th className="py-3 px-4">Emails</th>
                <th className="py-3 px-4">Gemini AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {organizations.map((org) => (
                <tr key={org.id} className="hover:bg-slate-50/60 font-mono">
                  <td className="py-3.5 px-5 font-sans font-bold text-[#1D2939]">{org.name}</td>
                  <td className="py-3.5 px-4">
                    {org.usage?.whatsAppBills?.used ?? 0} / {org.usage?.whatsAppBills?.limit ?? 0}
                  </td>
                  <td className="py-3.5 px-4">
                    {org.usage?.whatsAppMarketing?.used ?? 0} /{" "}
                    {org.usage?.whatsAppMarketing?.limit ?? 0}
                  </td>
                  <td className="py-3.5 px-4">
                    {org.usage?.transactionalEmails?.used ?? 0} /{" "}
                    {org.usage?.transactionalEmails?.limit ?? 0}
                  </td>
                  <td className="py-3.5 px-4">
                    {org.usage?.aiRequests?.used ?? 0} / {org.usage?.aiRequests?.limit ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function AuditLogsView({ auditLogs }: { auditLogs: PlatformAuditEvent[] }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E4E7EC] shadow-xs overflow-hidden">
      <div className="p-5 border-b border-[#E4E7EC] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#1D2939] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0E9384]" />
            Platform Security &amp; Governance Audit Trail
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Latest 50 authenticated platform operations, plan updates, tenant modifications, and
            security events.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/75 border-b border-[#E4E7EC] text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="py-3 px-5">Timestamp</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Actor</th>
              <th className="py-3 px-4">Outcome</th>
              <th className="py-3 px-5">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {auditLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  No audit events recorded yet.
                </td>
              </tr>
            ) : (
              auditLogs.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {new Date(ev.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#1D2939]">{ev.action}</td>
                  <td className="py-3 px-4 text-slate-600">{ev.actorEmail}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ev.outcome === "SUCCESS"
                          ? "bg-[#EEFFFD] text-[#0E9384] border border-[#0E9384]/25"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {ev.outcome}
                    </span>
                  </td>
                  <td className="py-3 px-5 font-mono text-[11px] text-slate-500 max-w-xs truncate">
                    {ev.metadata ? JSON.stringify(ev.metadata) : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function NotificationsView({
  notifications: initialNotifs = [],
  onRefresh,
}: {
  notifications?: PlatformNotificationItem[];
  onRefresh?: () => Promise<void>;
}) {
  const [items, setItems] = useState<PlatformNotificationItem[]>(initialNotifs);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "UNREAD">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);

  useEffect(() => {
    try {
      const readIds = new Set<string>(
        JSON.parse(
          localStorage.getItem("technova_read_platform_notifs") || "[]",
        ),
      );
      setItems(
        initialNotifs.map((n) =>
          readIds.has(n.id) ? { ...n, isRead: true } : n,
        ),
      );
    } catch {
      setItems(initialNotifs);
    }
  }, [initialNotifs]);

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, isRead: true })));
    try {
      const allIds = items.map((i) => i.id);
      localStorage.setItem(
        "technova_read_platform_notifs",
        JSON.stringify(allIds),
      );
    } catch {
      // Ignore
    }
    toast.success("All notifications marked as read.");
  };

  const handleMarkAsRead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
    );
    try {
      const stored = JSON.parse(
        localStorage.getItem("technova_read_platform_notifs") || "[]",
      );
      if (!stored.includes(id)) {
        localStorage.setItem(
          "technova_read_platform_notifs",
          JSON.stringify([...stored, id]),
        );
      }
    } catch {
      // Ignore
    }
    toast.success("Notification marked as read.");
  };

  const handleDispatchReminders = async () => {
    setIsDispatching(true);
    try {
      const res = await apiClient<{
        message: string;
        dispatchedCount: number;
        dispatched: Array<{
          invoiceNumber: string;
          organizationName: string;
          daysRemaining: number;
          stage: string;
          emailSent: boolean;
        }>;
      }>("/platform-admin/notifications/dispatch-reminders", {
        method: "POST",
      });

      toast.success(res.message || "Payment reminder check completed.", { duration: 6000 });
      if (onRefresh) await onRefresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to dispatch reminders.";
      toast.error(msg);
    } finally {
      setIsDispatching(false);
    }
  };

  const unreadCount = items.filter((i) => !i.isRead).length;

  const filteredItems = items.filter((item) => {
    if (activeFilter === "UNREAD" && item.isRead) return false;
    if (categoryFilter !== "ALL" && item.category !== categoryFilter) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + rowsPerPage);

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "INVENTORY ALERT":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "PURCHASE ORDER":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "SYSTEM UPDATE":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "EMPLOYEE":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "BILLING":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "SUBSCRIPTION":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "INVENTORY ALERT":
        return (
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 border border-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        );
      case "PURCHASE ORDER":
        return (
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0E9384] border border-teal-100 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
        );
      case "SYSTEM UPDATE":
        return (
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 border border-blue-100 flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
        );
      case "EMPLOYEE":
        return (
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0">
            <UserPlus className="w-5 h-5" />
          </div>
        );
      case "BILLING":
        return (
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-100 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
        );
      case "SUBSCRIPTION":
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
            <Tag className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-[#E4E7EC] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1D2939] tracking-tight">Notifications</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage Your System Alerts, Messages and Updates
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDispatchReminders}
            disabled={isDispatching}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#EEFFFD] text-[#0E9384] border border-[#0E9384]/25 hover:bg-[#0E9384] hover:text-white transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            {isDispatching ? "Scanning Invoices..." : "Dispatch 15d / 10d / 5d / 1d Reminders"}
          </button>
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-white border border-[#0E9384] text-[#0E9384] hover:bg-[#EEFFFD] transition shadow-xs"
          >
            Mark all as read
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 mr-1">Filter By:</span>
          <button
            onClick={() => setActiveFilter("ALL")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeFilter === "ALL"
                ? "bg-[#004532] text-white shadow-xs"
                : "bg-white border border-[#E4E7EC] text-slate-600 hover:bg-slate-50"
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setActiveFilter("UNREAD")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeFilter === "UNREAD"
                ? "bg-[#004532] text-white shadow-xs"
                : "bg-white border border-[#E4E7EC] text-slate-600 hover:bg-slate-50"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-white border border-[#E4E7EC] rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0E9384]"
          >
            <option value="ALL">All Categories</option>
            <option value="BILLING">Billing &amp; Payments</option>
            <option value="SUBSCRIPTION">Subscriptions &amp; Add-ons</option>
            <option value="INVENTORY ALERT">Inventory Alerts</option>
            <option value="PURCHASE ORDER">Purchase Orders</option>
            <option value="SYSTEM UPDATE">System Updates</option>
            <option value="EMPLOYEE">Employees &amp; Tenants</option>
          </select>
        </div>
      </div>

      {/* Notification List Container */}
      <div className="bg-white rounded-2xl border border-[#E4E7EC] shadow-xs overflow-hidden divide-y divide-[#E4E7EC]/70">
        {paginatedItems.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-semibold">No notifications found.</p>
            <p className="text-xs text-slate-400 mt-1">
              You are all caught up with your platform alerts.
            </p>
          </div>
        ) : (
          paginatedItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 flex items-start gap-4 hover:bg-slate-50/60 transition relative ${
                !item.isRead ? "border-l-4 border-l-[#0E9384] bg-[#F7FDFB]/30" : ""
              }`}
            >
              {/* Category Icon */}
              {getCategoryIcon(item.category)}

              {/* Text Content */}
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${getCategoryBadge(
                      item.category
                    )}`}
                  >
                    {item.category}
                  </span>
                  <h4 className="text-sm font-bold text-[#1D2939] leading-tight">
                    {item.title}
                  </h4>
                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#0E9384] shrink-0" title="Unread" />
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{item.message}</p>
              </div>

              {/* Actions & Timestamp */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2.5 whitespace-nowrap shrink-0 pt-0.5">
                <span className="text-xs font-medium text-slate-400">
                  {item.timeAgo}
                </span>
                {!item.isRead ? (
                  <button
                    type="button"
                    onClick={(e) => handleMarkAsRead(item.id, e)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border border-[#0E9384] text-[#0E9384] hover:bg-[#EEFFFD] transition"
                    title="Mark this notification as read"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mark read
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 px-2 py-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                    Read
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer & Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>Row Per Page</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 bg-white border border-[#E4E7EC] rounded-lg text-xs font-semibold text-slate-700"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <span>Entries</span>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-[#E4E7EC] text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                  currentPage === pageNum
                    ? "bg-[#0E9384] text-white"
                    : "border border-[#E4E7EC] text-slate-600 hover:bg-slate-50"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-[#E4E7EC] text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Branding Credits */}
      <div className="pt-4 border-t border-[#E4E7EC] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
        <div>2026 © TechNova. All Right Reserved</div>
        <div className="font-medium text-slate-500">Designed &amp; Developed By ConnexInterns</div>
      </div>
    </div>
  );
}
