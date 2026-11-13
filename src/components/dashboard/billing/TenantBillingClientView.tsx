"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Building2,
  Users,
  MessageSquare,
  Bot,
  Mail,
  Zap,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  PlusCircle,
  FileText,
  ShieldCheck,
  Landmark,
  ArrowUpRight,
  Sparkles,
  Lock,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";

export interface MetricUsage {
  used: number;
  limit: number;
  remaining: number;
  percent: number;
  enabled: boolean;
}

export interface BillingDetails {
  subscription: {
    id: string;
    organizationId: string;
    status: "ACTIVE" | "PAST_DUE" | "SUSPENDED" | "CANCELLED";
    currentPeriodStart: string;
    currentPeriodEnd: string;
    vatRate?: number | string;
    plan: {
      id: string;
      code: string;
      name: string;
      description: string | null;
      priceUsd: number | string;
      vatRate?: number | string;
      priceWithVatUsd?: number | string;
      billingCycle: string;
      maxBranches: number;
      maxUsers?: number;
      maxInternalUsers?: number;
      monthlyWhatsAppBills: number;
      monthlyWhatsAppMarketing: number;
      monthlyTransactionalEmails: number;
      monthlyAiRequests: number;
      allowCustomBranding?: boolean;
      allowCustomSmtp?: boolean;
    };
    addons: Array<{
      id: string;
      type: string;
      quantity: number;
      extraUnits?: number;
      priceUsd?: number | string;
      unitPriceUsd?: number | string;
      addedAt?: string;
      createdAt?: string;
      isActive: boolean;
    }>;
    invoices: Array<{
      id: string;
      invoiceNumber: string;
      billingMonth?: string;
      subtotalUsd?: number | string;
      amountUsd?: number | string;
      vatAmountUsd: number | string;
      totalAmountUsd: number | string;
      status: "PENDING" | "PAID" | "PENDING_PAYMENT" | "OVERDUE" | "VOID" | "CANCELLED";
      paymentMethod: string | null;
      paymentRef?: string | null;
      paymentReference?: string | null;
      issuedDate: string;
      paidAt?: string | null;
      paidDate?: string | null;
      dueDate: string;
      notes: string | null;
    }>;
  };
  usageOverview: {
    period?: string;
    plan?: {
      tier: string;
      name: string;
      priceUsd: number;
      priceWithVatUsd: number;
      status: string;
      currentPeriodEnd: string;
    };
    features?: Array<{
      key: string;
      label: string;
      description?: string;
      enabled: boolean;
      source?: "PLAN" | "ADDON";
    }>;
    metrics?: {
      branches: MetricUsage;
      users: MetricUsage;
      whatsAppBills: MetricUsage;
      whatsAppMarketing: MetricUsage;
      transactionalEmails: MetricUsage;
      aiRequests: MetricUsage;
    };
    branches?: MetricUsage;
    users?: MetricUsage;
    whatsAppBills?: MetricUsage;
    whatsAppMarketing?: MetricUsage;
    transactionalEmails?: MetricUsage;
    aiRequests?: MetricUsage;
  };
  availablePlans?: Array<{
    id: string;
    code: string;
    name: string;
    description: string | null;
    priceUsd: number | string;
    maxBranches: number;
    maxInternalUsers: number;
    monthlyWhatsAppBills: number;
    monthlyAiRequests: number;
    features?: Array<{ key: string; label: string; enabled: boolean }>;
  }>;
  availableAddonPacks?: Array<{
    id: string;
    code: string;
    name: string;
    description: string | null;
    quotaTarget: string;
    unitsPerPack: number;
    priceUsd: number | string;
    billingCycle: string;
    features?: Array<{ key: string; label: string; enabled: boolean }>;
  }>;
  requests?: Array<{
    id: string;
    type: "PLAN_CHANGE" | "ADDON_PACK";
    status: "PENDING" | "APPROVED" | "REJECTED";
    targetPlanCode: string | null;
    addonCode: string | null;
    quantity: number;
    notes: string | null;
    paymentRef: string | null;
    reviewNotes: string | null;
    createdAt: string;
  }>;
}

const EMPTY_METRIC: MetricUsage = {
  used: 0,
  limit: 0,
  remaining: 0,
  percent: 0,
  enabled: false,
};

interface Props {
  initialData: BillingDetails;
}

export function TenantBillingClientView({ initialData }: Props) {
  const [data, setData] = useState<BillingDetails>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddonModal, setShowAddonModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlanCode, setSelectedPlanCode] = useState<string>("");
  const [planReqNotes, setPlanReqNotes] = useState("");
  const [planReqPaymentRef, setPlanReqPaymentRef] = useState("");
  const [submittingPlanReq, setSubmittingPlanReq] = useState(false);

  const [selectedAddonCode, setSelectedAddonCode] = useState<string>("");
  const [addonQuantity, setAddonQuantity] = useState<number>(1);
  const [addonReqNotes, setAddonReqNotes] = useState("");
  const [addonReqPaymentRef, setAddonReqPaymentRef] = useState("");
  const [submittingAddonReq, setSubmittingAddonReq] = useState(false);

  // Online Payment Gateway Modal state
  const [showPayOnlineModal, setShowPayOnlineModal] = useState(false);
  const [selectedPayInvoice, setSelectedPayInvoice] = useState<
    BillingDetails["subscription"]["invoices"][0] | null
  >(null);
  const [payGatewayMethod, setPayGatewayMethod] = useState<"CREDIT_CARD" | "PAYHERE_ONLINE">(
    "CREDIT_CARD"
  );
  const [cardHolder, setCardHolder] = useState("Demo Business Account");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("789");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handlePayInvoiceOnline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayInvoice || isProcessingPayment) return;
    setIsProcessingPayment(true);
    try {
      const res = await apiClient<{
        message: string;
        transactionReference: string;
      }>(`/subscription/invoices/${selectedPayInvoice.id}/pay-online`, {
        method: "POST",
        body: JSON.stringify({
          paymentMethod: payGatewayMethod,
          cardBrand: payGatewayMethod === "CREDIT_CARD" ? "Visa" : "PayHere",
          cardLast4: "4242",
          cardHolderName: cardHolder,
        }),
      });

      toast.success(
        `Payment successful! Invoice ${selectedPayInvoice.invoiceNumber} marked as PAID. (Ref: ${res.transactionReference})`,
        { duration: 7000 }
      );
      setShowPayOnlineModal(false);
      setSelectedPayInvoice(null);
      await refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to process online payment.";
      toast.error(msg, { duration: 6000 });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const sub = data.subscription;
  const plan = sub.plan;
  const rawUsage = data.usageOverview;
  const effectiveFeatures = (rawUsage?.features ?? []).filter((f) => f.enabled);
  const availablePlans = data.availablePlans ?? [];
  const availableAddonPacks = data.availableAddonPacks ?? [];
  const subscriptionRequests = data.requests ?? [];
  const metrics = {
    branches: rawUsage?.metrics?.branches ?? rawUsage?.branches ?? EMPTY_METRIC,
    users: rawUsage?.metrics?.users ?? rawUsage?.users ?? EMPTY_METRIC,
    whatsAppBills: rawUsage?.metrics?.whatsAppBills ?? rawUsage?.whatsAppBills ?? EMPTY_METRIC,
    whatsAppMarketing:
      rawUsage?.metrics?.whatsAppMarketing ?? rawUsage?.whatsAppMarketing ?? EMPTY_METRIC,
    transactionalEmails:
      rawUsage?.metrics?.transactionalEmails ?? rawUsage?.transactionalEmails ?? EMPTY_METRIC,
    aiRequests: rawUsage?.metrics?.aiRequests ?? rawUsage?.aiRequests ?? EMPTY_METRIC,
  };
  const billingPeriodLabel =
    rawUsage?.period ||
    new Date(sub.currentPeriodStart).toISOString().substring(0, 7);
  const planPriceUsd = Number(plan.priceUsd ?? 0);
  const planVatRate = Number(plan.vatRate ?? sub.vatRate ?? 0.18);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const res = await apiClient<BillingDetails>("/subscription/billing");
      setData(res);
      toast.success("Billing & usage quota refreshed successfully.", { duration: 5000 });
    } catch {
      toast.error("Failed to reload billing details. Please try again.", { duration: 8000 });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSubmitPlanChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetCode =
      selectedPlanCode || availablePlans.find((p) => p.code !== plan.code)?.code || "";
    if (!targetCode) {
      toast.error("Please select a target subscription plan.");
      return;
    }
    setSubmittingPlanReq(true);
    try {
      const res = await apiClient<{ message: string }>("/subscription/plan-change-request", {
        method: "POST",
        body: JSON.stringify({
          targetPlanCode: targetCode,
          notes: planReqNotes.trim() || undefined,
          paymentRef: planReqPaymentRef.trim() || undefined,
        }),
      });
      toast.success(res.message || "Plan change request submitted!", { duration: 6000 });
      setShowUpgradeModal(false);
      setPlanReqNotes("");
      setPlanReqPaymentRef("");
      await refreshData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to submit plan change request.", {
        duration: 8000,
      });
    } finally {
      setSubmittingPlanReq(false);
    }
  };

  const handleSubmitAddonRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const addonCode = selectedAddonCode || availableAddonPacks[0]?.code || "";
    if (!addonCode) {
      toast.error("Please select an add-on pack.");
      return;
    }
    setSubmittingAddonReq(true);
    try {
      const res = await apiClient<{ message: string }>("/subscription/addons", {
        method: "POST",
        body: JSON.stringify({
          type: addonCode,
          quantity: addonQuantity,
          notes: addonReqNotes.trim() || undefined,
          paymentRef: addonReqPaymentRef.trim() || undefined,
        }),
      });
      toast.success(res.message || "Add-on request submitted!", { duration: 6000 });
      setShowAddonModal(false);
      setAddonQuantity(1);
      setAddonReqNotes("");
      setAddonReqPaymentRef("");
      await refreshData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to submit add-on request.", {
        duration: 8000,
      });
    } finally {
      setSubmittingAddonReq(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
      case "PAID":
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {status}
          </span>
        );
      case "PENDING":
      case "PENDING_PAYMENT":
      case "PAST_DUE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            {status.replace("_", " ")}
          </span>
        );
      case "SUSPENDED":
      case "OVERDUE":
      case "REJECTED":
      case "VOID":
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5" />
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  const getMeterColor = (percent: number) => {
    if (percent >= 100) return "bg-rose-500";
    if (percent >= 80) return "bg-amber-500";
    return "bg-indigo-600";
  };

  const meters = [
    {
      title: "Branches Allocated",
      icon: Building2,
      used: metrics.branches.used,
      limit: metrics.branches.limit,
      remaining: metrics.branches.remaining,
      percent: metrics.branches.percent,
      unit: "branches",
      hint: "Store locations permitted on your active plan tier.",
    },
    {
      title: "Team / Cashier Accounts",
      icon: Users,
      used: metrics.users.used,
      limit: metrics.users.limit,
      remaining: metrics.users.remaining,
      percent: metrics.users.percent,
      unit: "users",
      hint: "Cashiers, branch managers, and admin logins.",
    },
    {
      title: "WhatsApp Digital Bills",
      icon: MessageSquare,
      used: metrics.whatsAppBills.used,
      limit: metrics.whatsAppBills.limit,
      remaining: metrics.whatsAppBills.remaining,
      percent: metrics.whatsAppBills.percent,
      unit: "bills sent",
      hint: "Digital e-receipts sent to customers. Cashier checkout is never blocked even if limit is met.",
    },
    {
      title: "WhatsApp Marketing",
      icon: Sparkles,
      used: metrics.whatsAppMarketing.used,
      limit: metrics.whatsAppMarketing.limit,
      remaining: metrics.whatsAppMarketing.remaining,
      percent: metrics.whatsAppMarketing.percent,
      unit: "broadcasts",
      hint: "Promotional messages, seasonal offers, and coupon campaigns.",
    },
    {
      title: "Transactional Emails",
      icon: Mail,
      used: metrics.transactionalEmails.used,
      limit: metrics.transactionalEmails.limit,
      remaining: metrics.transactionalEmails.remaining,
      percent: metrics.transactionalEmails.percent,
      unit: "emails",
      hint: "E-invoices and password reset notifications via platform SMTP.",
    },
    {
      title: "Gemini AI Intelligence",
      icon: Bot,
      used: metrics.aiRequests.used,
      limit: metrics.aiRequests.limit,
      remaining: metrics.aiRequests.remaining,
      percent: metrics.aiRequests.percent,
      unit: "requests",
      hint: "AI business assistant queries, inventory forecasts, and sales analysis.",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-7 h-7 text-indigo-600" />
            Subscription & Quota Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor real-time resource quotas, manage plan limits, and review your monthly subscription invoices.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-indigo-600" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow-sm"
          >
            <ArrowUpRight className="w-4 h-4" />
            Upgrade Plan
          </button>
        </div>
      </div>



      {/* Plan Overview Card */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Zap className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs uppercase tracking-wider font-bold bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-md">
                Active Tier
              </span>
              {getStatusBadge(sub.status)}
            </div>
            <h2 className="text-3xl font-black tracking-tight">{plan.name}</h2>
            <p className="text-indigo-200 text-sm max-w-xl">
              {plan.description || "Comprehensive multi-location retail point-of-sale platform."}
            </p>
            <div className="flex items-center gap-4 text-xs text-indigo-200 pt-2 flex-wrap">
              <span>
                Billing Cycle: <strong className="text-white">{plan.billingCycle}</strong>
              </span>
              <span>•</span>
              <span>
                Period Ends:{" "}
                <strong className="text-white">
                  {new Date(sub.currentPeriodEnd).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </strong>
              </span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/10 md:text-right shrink-0">
            <div className="text-xs text-indigo-200 font-medium uppercase tracking-wider">
              Subscription Cost
            </div>
            <div className="text-3xl font-extrabold text-white mt-1">
              ${planPriceUsd.toFixed(2)}
              <span className="text-sm font-normal text-indigo-200"> /mo</span>
            </div>
            <div className="text-xs text-indigo-300 mt-1">
              + {Math.round(planVatRate * 100)}% VAT (${(planPriceUsd * planVatRate).toFixed(2)}) ={" "}
              <strong className="text-white">
                ${(planPriceUsd * (1 + planVatRate)).toFixed(2)} USD
              </strong>
            </div>
            <button
              onClick={() => setShowAddonModal(true)}
              className="mt-4 inline-flex items-center justify-center gap-1.5 w-full px-3 py-2 text-xs font-semibold text-indigo-900 bg-white rounded-lg hover:bg-indigo-50 transition shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Request Add-on Pack
            </button>
          </div>
        </div>
      </div>

      {/* Live Quota Meters */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Current Monthly Consumption</h3>
            <p className="text-xs text-gray-500">
              Billing Period: <span className="font-semibold text-gray-700">{billingPeriodLabel}</span>. Quotas reset automatically at the start of each calendar month.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {meters.map((meter, idx) => {
            const Icon = meter.icon;
            const isFull = meter.percent >= 100;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:border-gray-300 transition space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{meter.title}</span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isFull
                        ? "bg-rose-100 text-rose-700"
                        : meter.percent > 80
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {meter.percent}%
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1.5">
                    <span>
                      <strong className="text-gray-900">{meter.used.toLocaleString()}</strong> of{" "}
                      {meter.limit.toLocaleString()} {meter.unit}
                    </span>
                    <span className="text-gray-400">
                      {meter.remaining.toLocaleString()} left
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${getMeterColor(meter.percent)}`}
                      style={{ width: `${Math.min(meter.percent, 100)}%` }}
                    />
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                  {meter.hint}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Included Plan & Add-on Custom Features */}
      {effectiveFeatures.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Included Plan &amp; Add-on Features
            </h3>
            <span className="text-xs text-gray-500">
              Live capabilities provisioned on your active package
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {effectiveFeatures.map((feat) => (
              <div
                key={feat.key}
                className="flex items-start justify-between gap-2 p-3 rounded-lg bg-indigo-50/40 border border-indigo-100"
              >
                <div className="flex items-start gap-2 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-gray-900 truncate">
                      {feat.label}
                    </div>
                    {feat.description && (
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {feat.description}
                      </div>
                    )}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-white border border-indigo-200 text-[10px] font-bold text-indigo-700 shrink-0">
                  {feat.source === "ADDON" ? "Add-on" : "Plan"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Add-ons Section */}
      {sub.addons && sub.addons.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Active Top-Up Add-on Packs
            </h3>
            <span className="text-xs text-gray-500">
              Provisioned by Platform Super Admin
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sub.addons.map((addon) => {
              const addonDate = addon.createdAt || addon.addedAt;
              const addonPrice = Number(addon.priceUsd ?? addon.unitPriceUsd ?? 0);
              return (
                <div
                  key={addon.id}
                  className="bg-amber-50/50 border border-amber-200 rounded-lg p-3.5 space-y-1.5"
                >
                  <div className="text-xs font-bold text-amber-900">
                    {addon.type.replace(/_/g, " ")}
                  </div>
                  <div className="text-xl font-black text-amber-950">
                    {addon.extraUnits
                      ? `+${addon.extraUnits.toLocaleString()} units`
                      : `${addon.quantity}x Pack ($${addonPrice.toFixed(2)})`}
                  </div>
                  <div className="text-[11px] text-amber-700">
                    Qty: {addon.quantity}
                    {addonDate
                      ? ` • Added ${new Date(addonDate).toISOString().slice(0, 10)}`
                      : ""}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bank Transfer Instructions Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-indigo-700">
              <Landmark className="w-6 h-6" />
              <h3 className="text-base font-bold text-gray-900">
                Direct Bank Wire / Invoice Settlement Instructions
              </h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              To settle any pending subscription invoice or order top-up add-on packs, transfer the exact invoice total to our official corporate settlement account. Your payment is verified and cleared by the Platform Administrator within 2-4 business hours.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-0.5">
                <span className="text-gray-400 block font-medium">Beneficiary Name</span>
                <span className="font-bold text-gray-900">TechNova Cloud Technologies (Pvt) Ltd</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-0.5">
                <span className="text-gray-400 block font-medium">Bank & Branch</span>
                <span className="font-bold text-gray-900">Commercial Bank of Ceylon (City Branch)</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-0.5">
                <span className="text-gray-400 block font-medium">Account Number</span>
                <span className="font-bold text-gray-900 font-mono">1000 4589 2241</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-0.5">
                <span className="text-gray-400 block font-medium">Payment Reference</span>
                <span className="font-bold text-indigo-700 font-mono">Mention Invoice # (e.g. INV-xxxx)</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shrink-0 text-center space-y-2 max-w-xs">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto" />
            <div className="text-xs font-bold text-gray-900">Payment Proof Submission</div>
            <p className="text-[11px] text-gray-500">
              Email your bank deposit slip or transaction reference receipt to:
            </p>
            <a
              href="mailto:billing@technovapos.com"
              className="inline-block text-xs font-semibold text-indigo-600 hover:underline"
            >
              billing@technovapos.com
            </a>
          </div>
        </div>
      </div>

      {/* Invoices & Payment Ledger */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Invoices & Payment History
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Historical ledger of generated monthly subscription invoices and verified receipts.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Invoice #</th>
                <th className="px-6 py-3.5">Billing Month</th>
                <th className="px-6 py-3.5">Base (USD)</th>
                <th className="px-6 py-3.5">VAT 18%</th>
                <th className="px-6 py-3.5">Total (USD)</th>
                <th className="px-6 py-3.5">Due Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Payment Ref</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-medium">
              {sub.invoices && sub.invoices.length > 0 ? (
                sub.invoices.map((inv) => {
                  const baseUsd = Number(inv.subtotalUsd ?? inv.amountUsd ?? 0);
                  const vatUsd = Number(inv.vatAmountUsd ?? 0);
                  const totalUsd = Number(inv.totalAmountUsd ?? 0);
                  const monthLabel =
                    inv.billingMonth ||
                    new Date(inv.issuedDate).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    });
                  const refLabel = inv.paymentRef ?? inv.paymentReference;

                  return (
                    <tr key={inv.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4 font-mono font-bold text-gray-900">
                        {inv.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{monthLabel}</td>
                      <td className="px-6 py-4 text-gray-700 font-mono">
                        ${baseUsd.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-mono">
                        ${vatUsd.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-mono font-bold">
                        ${totalUsd.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(inv.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(inv.status)}</td>
                      <td className="px-6 py-4 text-gray-500 font-mono">
                        {refLabel || "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {inv.status === "PAID" ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                            <CheckCircle2 className="w-3 h-3" /> Settled
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedPayInvoice(inv);
                              setShowPayOnlineModal(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-[#0E9384] text-white hover:bg-[#004532] transition shadow-xs"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            Pay Online
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-400">
                    No billing invoices recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submitted Plan & Add-on Requests History */}
      {subscriptionRequests.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                Plan &amp; Add-on Requests
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Track approval status of your submitted subscription change and top-up requests.
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Request Type</th>
                  <th className="px-6 py-3">Package / Add-on</th>
                  <th className="px-6 py-3">Note / Bank Ref</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Admin Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 font-medium">
                {subscriptionRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-3.5 text-gray-500 font-mono">
                      {new Date(req.createdAt).toISOString().slice(0, 10)}
                    </td>
                    <td className="px-6 py-3.5 text-gray-800">
                      {req.type === "PLAN_CHANGE" ? "Plan Change" : "Add-on Pack"}
                    </td>
                    <td className="px-6 py-3.5 font-mono font-bold text-gray-900">
                      {req.type === "PLAN_CHANGE"
                        ? req.targetPlanCode
                        : `${req.quantity}x ${req.addonCode}`}
                    </td>
                    <td className="px-6 py-3.5 text-gray-600">
                      {req.paymentRef ? `Ref: ${req.paymentRef}` : req.notes || "—"}
                    </td>
                    <td className="px-6 py-3.5">{getStatusBadge(req.status)}</td>
                    <td className="px-6 py-3.5 text-gray-500">{req.reviewNotes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Plan Change Request Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-indigo-600" />
                Request Subscription Plan Change
              </h3>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Select a target subscription tier below to submit an upgrade or change request to the
              Platform Super Admin.
            </p>
            <form onSubmit={handleSubmitPlanChange} className="space-y-3 text-xs">
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {availablePlans.length > 0 ? (
                  availablePlans.map((p) => {
                    const isCurrent = p.code === plan.code;
                    const isSelected =
                      (selectedPlanCode ||
                        availablePlans.find((ap) => ap.code !== plan.code)?.code) === p.code;
                    return (
                      <label
                        key={p.id}
                        className={`block p-3 rounded-lg border cursor-pointer transition ${
                          isCurrent
                            ? "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                            : isSelected
                            ? "bg-indigo-50/70 border-indigo-400 ring-1 ring-indigo-400"
                            : "bg-white border-gray-200 hover:border-indigo-300"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="targetPlanCode"
                              disabled={isCurrent}
                              checked={!isCurrent && isSelected}
                              onChange={() => setSelectedPlanCode(p.code)}
                              className="text-indigo-600"
                            />
                            <span className="font-bold text-gray-900">
                              {p.name} (${Number(p.priceUsd).toFixed(2)}/mo + 18% VAT)
                            </span>
                          </div>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-gray-500 mt-1 pl-5">
                          {p.maxBranches} Branches • {p.maxInternalUsers} Staff •{" "}
                          {p.monthlyWhatsAppBills.toLocaleString()} WhatsApp Bills •{" "}
                          {p.monthlyAiRequests.toLocaleString()} AI Requests
                        </div>
                      </label>
                    );
                  })
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-500">
                    No other active plans available.
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Bank Transfer Reference (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. TXN-998822 (if paid in advance)"
                  value={planReqPaymentRef}
                  onChange={(e) => setPlanReqPaymentRef(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Request Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Expanding to 2 new branches next week"
                  value={planReqNotes}
                  onChange={(e) => setPlanReqNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    submittingPlanReq ||
                    availablePlans.filter((p) => p.code !== plan.code).length === 0
                  }
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {submittingPlanReq ? "Submitting..." : "Submit Plan Change Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Addon Pack Request Modal */}
      {showAddonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-600" />
                Request Extra Capacity Add-on
              </h3>
              <button
                onClick={() => setShowAddonModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Choose an add-on pack and submit your request to the Platform Super Admin for approval
              and immediate provisioning.
            </p>
            <form onSubmit={handleSubmitAddonRequest} className="space-y-3 text-xs">
              <div className="space-y-2 max-h-52 overflow-y-auto">
                {availableAddonPacks.length > 0 ? (
                  availableAddonPacks.map((pack) => {
                    const isSelected =
                      (selectedAddonCode || availableAddonPacks[0]?.code) === pack.code;
                    return (
                      <label
                        key={pack.id}
                        className={`p-3 rounded-lg border flex justify-between items-center gap-3 cursor-pointer transition ${
                          isSelected
                            ? "bg-indigo-50/70 border-indigo-400 ring-1 ring-indigo-400"
                            : "bg-white border-gray-200 hover:border-indigo-300"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <input
                            type="radio"
                            name="selectedAddonCode"
                            checked={isSelected}
                            onChange={() => setSelectedAddonCode(pack.code)}
                            className="text-indigo-600"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-gray-900">{pack.name}</div>
                            <div className="text-gray-500">
                              {pack.unitsPerPack > 0
                                ? `+${pack.unitsPerPack.toLocaleString()} ${pack.quotaTarget.replace(/_/g, " ")}`
                                : pack.description || "Feature Pack"}
                            </div>
                          </div>
                        </div>
                        <span className="font-bold text-indigo-700 font-mono shrink-0">
                          ${Number(pack.priceUsd).toFixed(2)}
                        </span>
                      </label>
                    );
                  })
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-500">
                    No active add-on packs in catalog.
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max="25"
                    value={addonQuantity}
                    onChange={(e) => setAddonQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Bank Reference (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TXN-441209"
                    value={addonReqPaymentRef}
                    onChange={(e) => setAddonReqPaymentRef(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Request Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Need extra WhatsApp bills for seasonal promotion"
                  value={addonReqNotes}
                  onChange={(e) => setAddonReqNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddonModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAddonReq || availableAddonPacks.length === 0}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {submittingAddonReq ? "Submitting..." : "Submit Add-on Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ONLINE PAYMENT GATEWAY CHECKOUT MODAL */}
      {showPayOnlineModal && selectedPayInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-200 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#EEFFFD] text-[#0E9384] flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Online Payment Gateway
                  </h3>
                  <p className="text-xs text-gray-500">
                    Instant 256-bit SSL encrypted invoice settlement
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPayOnlineModal(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Invoice summary banner */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Invoice Number</span>
                <span className="font-mono font-bold text-gray-900">
                  {selectedPayInvoice.invoiceNumber}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Subtotal (excl. VAT)</span>
                <span className="font-mono text-gray-700">
                  ${Number(selectedPayInvoice.subtotalUsd ?? selectedPayInvoice.amountUsd ?? 0).toFixed(2)} USD
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>VAT (18%)</span>
                <span className="font-mono text-gray-700">
                  ${Number(selectedPayInvoice.vatAmountUsd ?? 0).toFixed(2)} USD
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total Amount Due</span>
                <span className="font-mono text-[#0E9384] text-base">
                  ${Number(selectedPayInvoice.totalAmountUsd ?? 0).toFixed(2)} USD
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Select Online Gateway
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPayGatewayMethod("CREDIT_CARD")}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                    payGatewayMethod === "CREDIT_CARD"
                      ? "border-[#0E9384] bg-[#EEFFFD]/40 text-[#004532] shadow-xs"
                      : "border-gray-200 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#0E9384]" />
                  <div>
                    <div className="text-xs font-bold leading-tight">Card Checkout</div>
                    <div className="text-[10px] text-gray-400">Visa, Master, Amex</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setPayGatewayMethod("PAYHERE_ONLINE")}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                    payGatewayMethod === "PAYHERE_ONLINE"
                      ? "border-[#0E9384] bg-[#EEFFFD]/40 text-[#004532] shadow-xs"
                      : "border-gray-200 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <Landmark className="w-5 h-5 text-indigo-600" />
                  <div>
                    <div className="text-xs font-bold leading-tight">PayHere Gateway</div>
                    <div className="text-[10px] text-gray-400">Online Web Portal</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Card Inputs Form */}
            <form onSubmit={handlePayInvoiceOnline} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0E9384]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-gray-700">Card Number</label>
                  <button
                    type="button"
                    onClick={() => {
                      setCardNumber("4242 4242 4242 4242");
                      setCardExpiry("12/28");
                      setCardCvv("789");
                    }}
                    className="text-[11px] text-[#0E9384] hover:underline font-semibold"
                  >
                    Quick-Fill Test Card
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-[#0E9384]"
                  />
                  <CreditCard className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#0E9384]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">CVV / CVC</label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    placeholder="•••"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#0E9384]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t text-[11px] text-gray-400">
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  SSL Encrypted &amp; PCI-DSS Ready
                </span>
                <span className="font-medium text-gray-500">Instant Activation</span>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPayOnlineModal(false)}
                  className="px-4 py-2 font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="px-5 py-2 font-bold text-white bg-[#0E9384] rounded-lg hover:bg-[#004532] transition shadow-xs disabled:opacity-50 flex items-center gap-2"
                >
                  {isProcessingPayment
                    ? "Processing Payment..."
                    : `Pay $${Number(selectedPayInvoice.totalAmountUsd ?? 0).toFixed(2)} USD Now`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
