"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  Bell,
  Bot,
  Building2,
  ChevronLeft,
  ChevronRight,
  Cloud,
  CreditCard,
  Download,
  GripVertical,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Store,
  Tag,
  UserCheck,
  X,
  Zap,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { logoutAction } from "@/lib/auth/actions";
import {
  PlanDistributionDonutCard,
  WeeklyActivityChartCard,
} from "./PlatformAdminCharts";
import { PlatformAdminFinancialsView } from "./PlatformAdminFinancialsView";
import {
  AddonsView,
  AuditLogsView,
  NotificationsView,
  SubscriptionsView,
  TelemetryView,
} from "./PlatformAdminSubViews";
import type {
  PlatformAddonPack,
  PlatformAnalytics,
  PlatformAuditEvent,
  PlatformInvoice,
  PlatformNotificationItem,
  PlatformPlan,
  PlatformSubscriptionRequest,
  PlatformTabId,
  TenantSummary,
} from "./types";

export type { PlatformAnalytics, TenantBranch, TenantSummary } from "./types";

interface Props {
  initialAnalytics: PlatformAnalytics;
  initialOrganizations: TenantSummary[];
  initialInvoices?: PlatformInvoice[];
  initialAuditLogs?: PlatformAuditEvent[];
  initialPlans?: PlatformPlan[];
  initialAddonPacks?: PlatformAddonPack[];
  initialRequests?: PlatformSubscriptionRequest[];
  initialNotifications?: PlatformNotificationItem[];
  adminEmail: string;
}

const AVATAR_THEMES = [
  "bg-[#EEFFFD] text-[#0E9384] border-[#0E9384]/25",
  "bg-indigo-50 text-[#3852D4] border-indigo-200",
  "bg-emerald-50 text-emerald-700 border-emerald-200",
  "bg-amber-50 text-[#E26D1E] border-amber-200",
  "bg-purple-50 text-purple-700 border-purple-200",
];

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "TN";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

function getPlanBadgeStyle(planCode?: string) {
  const code = (planCode || "").toUpperCase();
  if (code === "ENTERPRISE") return "bg-[#EEFFFD] text-[#004532] border-[#0E9384]/30";
  if (code === "PROFESSIONAL") return "bg-indigo-50 text-[#3852D4] border-indigo-200";
  if (code === "STANDARD") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
}

const PAGE_SIZE = 6;

const FLEET_NAV: Array<{
  id: PlatformTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "organizations", label: "Tenant Organizations", icon: Building2 },
  { id: "subscriptions", label: "Subscriptions & Plans", icon: Tag },
  { id: "addons", label: "Add-ons & Quotas", icon: Zap },
  { id: "financials", label: "Financials & Invoicing", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "telemetry", label: "AI & WhatsApp Telemetry", icon: Activity },
  { id: "audit", label: "Audit Logs", icon: History },
];

export function PlatformAdminClientView({
  initialAnalytics,
  initialOrganizations,
  initialInvoices = [],
  initialAuditLogs = [],
  initialPlans = [],
  initialAddonPacks = [],
  initialRequests = [],
  initialNotifications = [],
  adminEmail,
}: Props) {
  const [activeTab, setActiveTab] = useState<PlatformTabId>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showInfraBanner, setShowInfraBanner] = useState(true);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const [analytics, setAnalytics] = useState<PlatformAnalytics>(initialAnalytics);
  const [organizations, setOrganizations] = useState<TenantSummary[]>(initialOrganizations);
  const [invoices, setInvoices] = useState<PlatformInvoice[]>(initialInvoices);
  const [auditLogs, setAuditLogs] = useState<PlatformAuditEvent[]>(initialAuditLogs);
  const [plans, setPlans] = useState<PlatformPlan[]>(initialPlans);
  const [addonPacks, setAddonPacks] = useState<PlatformAddonPack[]>(initialAddonPacks);
  const [subscriptionRequests, setSubscriptionRequests] =
    useState<PlatformSubscriptionRequest[]>(initialRequests);
  const [notifications, setNotifications] =
    useState<PlatformNotificationItem[]>(initialNotifications);
  const [createPlanSignal, setCreatePlanSignal] = useState(0);
  const [createAddonSignal, setCreateAddonSignal] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [sortOrder, setSortOrder] = useState<"NEWEST" | "NAME_ASC" | "MRR_DESC">("NEWEST");
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreatingTenant, setIsCreatingTenant] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState<TenantSummary | null>(null);
  const [showAddonModal, setShowAddonModal] = useState<TenantSummary | null>(null);
  const [showPlanModal, setShowPlanModal] = useState<TenantSummary | null>(null);
  const [showEditModal, setShowEditModal] = useState<TenantSummary | null>(null);
  const [showAdminModal, setShowAdminModal] = useState<TenantSummary | null>(null);

  const [editForm, setEditForm] = useState({
    name: "",
    registrationNumber: "",
    phone: "",
    email: "",
  });

  const [adminForm, setAdminForm] = useState({
    mode: "EDIT" as "EDIT" | "REPLACE",
    name: "",
    email: "",
    phone: "",
    status: "ACTIVE",
    newPassword: "",
  });

  const [createForm, setCreateForm] = useState({
    name: "",
    registrationNumber: "",
    phone: "",
    email: "",
    planCode: "PROFESSIONAL",
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    temporaryPassword: "",
    branchName: "Main Branch",
    branchCode: "MAIN",
  });

  const [paymentForm, setPaymentForm] = useState({
    invoiceId: "",
    paymentMethod: "BANK_TRANSFER",
    paymentRef: "",
    notes: "",
  });

  const [addonForm, setAddonForm] = useState({
    type: "WHATSAPP_BILLS_PACK",
    quantity: 1,
  });

  const [planForm, setPlanForm] = useState({
    planCode: "ENTERPRISE",
  });

  // Keyboard shortcut Cmd+K / Ctrl+K for Global Search
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const [
        newAnalytics,
        newOrgs,
        newInvoices,
        newAuditLogs,
        newPlans,
        newAddons,
        newRequests,
        newNotifs,
      ] = await Promise.all([
        apiClient<PlatformAnalytics>("/platform-admin/analytics"),
        apiClient<TenantSummary[]>("/platform-admin/organizations"),
        apiClient<PlatformInvoice[]>("/platform-admin/invoices").catch(() => []),
        apiClient<PlatformAuditEvent[]>("/platform-admin/audit-logs").catch(() => []),
        apiClient<PlatformPlan[]>("/platform-admin/plans").catch(() => []),
        apiClient<PlatformAddonPack[]>("/platform-admin/addon-packs").catch(() => []),
        apiClient<PlatformSubscriptionRequest[]>("/platform-admin/subscription-requests").catch(
          () => []
        ),
        apiClient<PlatformNotificationItem[]>("/platform-admin/notifications").catch(() => []),
      ]);
      setAnalytics(newAnalytics);
      setOrganizations(newOrgs);
      setInvoices(newInvoices);
      setAuditLogs(newAuditLogs);
      if (newPlans.length > 0) setPlans(newPlans);
      if (newAddons.length > 0) setAddonPacks(newAddons);
      setSubscriptionRequests(newRequests);
      setNotifications(newNotifs);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to refresh platform telemetry.";
      toast.error(msg, { duration: 8000 });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportReport = () => {
    const headers = [
      "Organization ID",
      "Organization Name",
      "Reg Number",
      "Email",
      "Phone",
      "Status",
      "Plan",
      "Monthly Price (USD)",
      "Branches",
      "Users",
      "WhatsApp Bills Used",
      "WhatsApp Limit",
      "Gemini AI Used",
      "Gemini AI Limit",
    ];
    const rows = organizations.map((o) => [
      o.id,
      `"${(o.name || "").replace(/"/g, '""')}"`,
      `"${o.registrationNumber || ""}"`,
      `"${o.email || ""}"`,
      `"${o.phone || ""}"`,
      o.status,
      o.subscription?.planName || "No Subscription",
      o.subscription ? o.subscription.priceUsd.toFixed(2) : "0.00",
      o.counts.branches,
      o.counts.users,
      o.usage?.whatsAppBills?.used ?? 0,
      o.usage?.whatsAppBills?.limit ?? 0,
      o.usage?.aiRequests?.used ?? 0,
      o.usage?.aiRequests?.limit ?? 0,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `technova-platform-report-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Platform fleet report exported to CSV.", { duration: 4000 });
  };

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreatingTenant) return;
    setIsCreatingTenant(true);
    try {
      const res = await apiClient<{
        message: string;
        temporaryPasswordSent?: boolean;
        admin: { email: string; temporaryPassword?: string };
      }>("/platform-admin/organizations", {
        method: "POST",
        body: JSON.stringify({
          name: createForm.name.trim(),
          registrationNumber: createForm.registrationNumber.trim() || undefined,
          phone: createForm.phone.trim() || undefined,
          email: createForm.email.trim() || undefined,
          planCode: createForm.planCode,
          adminName: createForm.adminName.trim(),
          adminEmail: createForm.adminEmail.trim(),
          adminPhone: createForm.adminPhone.trim() || undefined,
          branchName: "Main Branch",
          branchCode: "MAIN",
        }),
      });
      toast.success(
        res.temporaryPasswordSent
          ? `Organization '${createForm.name}' created! Temporary password emailed to ${res.admin.email}.`
          : `Organization '${createForm.name}' created! Admin: ${res.admin.email} (Temp Password: ${res.admin.temporaryPassword || "generated"} • email delivery failed)`,
        { duration: 7000 }
      );
      setShowCreateModal(false);
      setCreateForm({
        name: "",
        registrationNumber: "",
        phone: "",
        email: "",
        planCode: "PROFESSIONAL",
        adminName: "",
        adminEmail: "",
        adminPhone: "",
        temporaryPassword: "",
        branchName: "Main Branch",
        branchCode: "MAIN",
      });
      await refreshData();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to create organization.";
      toast.error(msg, { duration: 8000 });
    } finally {
      setIsCreatingTenant(false);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentForm.invoiceId) return;
    try {
      await apiClient(`/platform-admin/invoices/${paymentForm.invoiceId}/record-payment`, {
        method: "POST",
        body: JSON.stringify(paymentForm),
      });
      toast.success("Payment successfully recorded! Invoice marked as PAID.", {
        duration: 5000,
      });
      setShowPaymentModal(null);
      setPaymentForm({
        invoiceId: "",
        paymentMethod: "BANK_TRANSFER",
        paymentRef: "",
        notes: "",
      });
      await refreshData();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to record payment.";
      toast.error(msg, { duration: 8000 });
    }
  };

  const handleAllocateAddon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAddonModal) return;
    try {
      await apiClient(`/platform-admin/organizations/${showAddonModal.id}/addons`, {
        method: "POST",
        body: JSON.stringify(addonForm),
      });
      toast.success(
        `Add-on ${addonForm.type} (${addonForm.quantity}x) allocated to ${showAddonModal.name}!`,
        { duration: 5000 }
      );
      setShowAddonModal(null);
      await refreshData();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to allocate add-on.";
      toast.error(msg, { duration: 8000 });
    }
  };

  const handleEditOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditModal) return;
    try {
      await apiClient(`/platform-admin/organizations/${showEditModal.id}`, {
        method: "PATCH",
        body: JSON.stringify(editForm),
      });
      toast.success(`Organization '${editForm.name}' updated successfully!`, {
        duration: 5000,
      });
      setShowEditModal(null);
      await refreshData();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to update organization.";
      toast.error(msg, { duration: 8000 });
    }
  };

  const handleUpdateTenantAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAdminModal) return;
    try {
      const payload: Record<string, string | undefined> = {
        mode: adminForm.mode,
        name: adminForm.name.trim(),
        email: adminForm.email.trim(),
        phone: adminForm.phone.trim(),
        status: adminForm.status,
      };
      if (adminForm.newPassword.trim()) {
        payload.newPassword = adminForm.newPassword.trim();
      }
      const res = await apiClient<{
        message: string;
        temporaryPassword?: string;
        emailNotifications?: {
          oldEmailNotified: boolean;
          newEmailSent: boolean;
        };
      }>(`/platform-admin/organizations/${showAdminModal.id}/tenant-admin`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      const emailNotes: string[] = [];
      if (res.emailNotifications?.oldEmailNotified) {
        emailNotes.push("Previous email notified");
      }
      if (res.emailNotifications?.newEmailSent) {
        emailNotes.push("Temporary password emailed to new address");
      } else if (res.temporaryPassword) {
        emailNotes.push(`Temp Password: ${res.temporaryPassword} (email delivery failed)`);
      }
      toast.success(
        emailNotes.length > 0 ? `${res.message} (${emailNotes.join(" • ")})` : res.message,
        { duration: 8000 }
      );
      setShowAdminModal(null);
      await refreshData();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to update tenant admin.";
      toast.error(msg, { duration: 8000 });
    }
  };

  const handleChangePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showPlanModal) return;
    try {
      await apiClient(`/platform-admin/organizations/${showPlanModal.id}/plan`, {
        method: "PATCH",
        body: JSON.stringify(planForm),
      });
      toast.success(`Plan updated to ${planForm.planCode} for ${showPlanModal.name}!`, {
        duration: 5000,
      });
      setShowPlanModal(null);
      await refreshData();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to change plan.";
      toast.error(msg, { duration: 8000 });
    }
  };

  const handleToggleStatus = async (org: TenantSummary) => {
    const newStatus = org.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const confirmAction = window.confirm(
      `Are you sure you want to ${
        newStatus === "INACTIVE" ? "SUSPEND" : "REACTIVATE"
      } access for organization '${org.name}'?`
    );
    if (!confirmAction) return;

    try {
      await apiClient(`/platform-admin/organizations/${org.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      toast.success(`Organization status updated to ${newStatus}.`, { duration: 5000 });
      await refreshData();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to update status.";
      toast.error(msg, { duration: 8000 });
    }
  };

  const filteredOrgs = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const list = organizations.filter((o) => {
      const matchesSearch =
        !q ||
        o.name.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        (o.registrationNumber && o.registrationNumber.toLowerCase().includes(q)) ||
        (o.email && o.email.toLowerCase().includes(q)) ||
        (o.tenantAdmin?.email && o.tenantAdmin.email.toLowerCase().includes(q)) ||
        (o.tenantAdmin?.name && o.tenantAdmin.name.toLowerCase().includes(q)) ||
        (o.branches && o.branches.some((b) => b.name.toLowerCase().includes(q) || b.code.toLowerCase().includes(q)));
      const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    if (sortOrder === "NAME_ASC") {
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortOrder === "MRR_DESC") {
      return [...list].sort(
        (a, b) => (b.subscription?.priceUsd ?? 0) - (a.subscription?.priceUsd ?? 0)
      );
    }
    return list;
  }, [organizations, searchTerm, statusFilter, sortOrder]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredOrgs.length / PAGE_SIZE));
  const paginatedOrgs = filteredOrgs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const startEntry = filteredOrgs.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endEntry = Math.min(currentPage * PAGE_SIZE, filteredOrgs.length);

  const pendingInvoicesCount = invoices.filter((i) => i.status === "PENDING").length;
  const pendingPlanRequestsCount = subscriptionRequests.filter(
    (r) => r.type === "PLAN_CHANGE" && r.status === "PENDING"
  ).length;
  const pendingAddonRequestsCount = subscriptionRequests.filter(
    (r) => r.type === "ADDON_PACK" && r.status === "PENDING"
  ).length;
  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  const tabMeta: Record<PlatformTabId, { title: string; subtitle: string }> = {
    dashboard: {
      title: "Platform Administration Dashboard",
      subtitle: `Welcome back, Platform Super Admin! Live telemetry across all ${analytics.tenants.total} POS tenant organizations.`,
    },
    organizations: {
      title: "Tenant Organizations Fleet",
      subtitle: `Manage registered retail organizations, provisioned branches, subscription plans, and access controls.`,
    },
    subscriptions: {
      title: "Subscriptions & Commercial Plans",
      subtitle: `Configure tier allocations, VAT billing summaries, and migrate organizations across SaaS plans.`,
    },
    addons: {
      title: "Add-ons & Capacity Quotas",
      subtitle: `Provision extra WhatsApp bill packs, marketing broadcasts, Gemini AI credits, and extra branches.`,
    },
    financials: {
      title: "Financials & Invoicing",
      subtitle: `Platform MRR tracking, B2B tax invoices (+18% VAT), and manual bank wire settlement ledger.`,
    },
    notifications: {
      title: "Notifications",
      subtitle: "Manage Your System Alerts, Messages and Updates",
    },
    telemetry: {
      title: "AI & WhatsApp Telemetry",
      subtitle: `Monitor real-time monthly consumption across Gemini AI Assistant and WhatsApp Cloud bill dispatch.`,
    },
    audit: {
      title: "Platform Audit Logs",
      subtitle: `Immutable governance trail of tenant onboarding, billing settlements, and security actions.`,
    },
  };

  const SidebarContent = (
    <div className="flex flex-col h-full justify-between bg-white">
      <div>
        {/* Brand Block */}
        <div className="h-16 px-4 border-b border-[#E4E7EC] bg-gradient-to-r from-white to-[#F4FBF9] flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/technova-logo.svg"
            alt="TechNova POS"
            className="h-9 w-auto object-contain shrink-0"
          />
        </div>

        {/* Nav Section 1: Fleet Operations */}
        <div className="px-3 pt-5 pb-2">
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Fleet Operations
          </div>
          <nav className="space-y-1">
            {FLEET_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#0E9384] text-white shadow-sm shadow-[#0E9384]/25"
                      : "text-slate-600 hover:bg-[#EEFFFD] hover:text-[#0E9384]"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span className="truncate">{item.label}</span>
                  {item.id === "subscriptions" && pendingPlanRequestsCount > 0 && (
                    <span
                      className={`ml-auto px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                        isActive ? "bg-white/20 text-white" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {pendingPlanRequestsCount}
                    </span>
                  )}
                  {item.id === "addons" && pendingAddonRequestsCount > 0 && (
                    <span
                      className={`ml-auto px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                        isActive ? "bg-white/20 text-white" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {pendingAddonRequestsCount}
                    </span>
                  )}
                  {item.id === "financials" && pendingInvoicesCount > 0 && (
                    <span
                      className={`ml-auto px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {pendingInvoicesCount}
                    </span>
                  )}
                  {item.id === "notifications" && unreadNotifsCount > 0 && (
                    <span
                      className={`ml-auto px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {unreadNotifsCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Cluster Status Card */}
      <div className="px-3 pb-4 pt-3 border-t border-slate-100">
        <div className="p-3 rounded-xl bg-[#EEFFFD] border border-[#0E9384]/20 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[10px] text-slate-500 font-medium">Root Deployment</div>
            <div className="text-[11px] font-mono font-bold text-[#004532] truncate">
              technova-cloud-core
            </div>
          </div>
          <Cloud className="w-4 h-4 text-[#0E9384] shrink-0" />
        </div>
      </div>
    </div>
  );

  // Reusable Organization Table Renderer (used in both Dashboard Overview & Organizations Tab)
  const renderOrganizationsTable = () => (
    <div className="bg-white rounded-2xl border border-[#E4E7EC] shadow-xs overflow-hidden">
      {/* Table Filter Toolbar */}
      <div className="p-5 border-b border-[#E4E7EC] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          <GripVertical className="w-4 h-4 text-slate-300 shrink-0" />
          <h2 className="text-sm font-bold text-[#1D2939]">
            Tenant Organizations Overview
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-[#E4E7EC] font-mono">
            {organizations.length} Total Fleet
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Table Search */}
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, Reg No, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-[#E4E7EC] rounded-xl text-[#1D2939] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0E9384] focus:bg-white transition"
            />
          </div>

          {/* Sort Select */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "NEWEST" | "NAME_ASC" | "MRR_DESC")}
            className="px-3 py-1.5 text-xs font-medium bg-white border border-[#E4E7EC] rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0E9384]"
          >
            <option value="NEWEST">Newest First</option>
            <option value="NAME_ASC">Name (A–Z)</option>
            <option value="MRR_DESC">Highest MRR</option>
          </select>

          {/* Status Filter */}
          <div className="inline-flex items-center gap-1 rounded-xl bg-slate-50 p-1 border border-[#E4E7EC] text-[11px]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
            {(["ALL", "ACTIVE", "INACTIVE"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  statusFilter === tab
                    ? "bg-white text-[#1D2939] shadow-xs"
                    : "text-slate-500 hover:text-[#1D2939]"
                }`}
              >
                {tab === "ALL" ? "All Statuses" : tab === "ACTIVE" ? "Active" : "Suspended"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/75 border-b border-[#E4E7EC] text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-5">Organization & Tax Reg</th>
              <th className="py-3 px-4">Branches & Staff</th>
              <th className="py-3 px-4">Active Plan</th>
              <th className="py-3 px-4">WhatsApp Quota</th>
              <th className="py-3 px-4">Gemini AI Usage</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedOrgs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  No tenant organizations match your search criteria.
                </td>
              </tr>
            ) : (
              paginatedOrgs.map((org, idx) => {
                const pendingInvoice = org.subscription?.recentInvoices?.find(
                  (i) => i.status === "PENDING"
                );
                const waUsed = org.usage?.whatsAppBills?.used ?? 0;
                const waLimit = org.usage?.whatsAppBills?.limit ?? 0;
                const waPercent = Math.round(org.usage?.whatsAppBills?.percent ?? 0);

                const aiUsed = org.usage?.aiRequests?.used ?? 0;
                const aiLimit = org.usage?.aiRequests?.limit ?? 0;
                const aiPercent = Math.round(org.usage?.aiRequests?.percent ?? 0);

                const branchesList = org.branches || [];
                const avatarStyle = AVATAR_THEMES[idx % AVATAR_THEMES.length];

                return (
                  <tr key={org.id} className="hover:bg-slate-50/60 transition">
                    {/* Col 1: Avatar + Name + Reg + Email */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl border flex items-center justify-center font-extrabold text-xs shrink-0 ${avatarStyle}`}
                        >
                          {getInitials(org.name)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#1D2939] text-sm truncate">
                              {org.name}
                            </span>
                            {org.status === "INACTIVE" && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                SUSPENDED
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                            {org.registrationNumber ? `${org.registrationNumber} • ` : ""}
                            {org.email || "No email"}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                            Admin:{" "}
                            <span className="font-semibold text-[#004532]">
                              {org.tenantAdmin?.email || "Not assigned"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Col 2: Branches & Staff */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-[#1D2939]">
                        {org.counts.branches} / {org.usage?.branches?.limit ?? 1} Branches •{" "}
                        <span className="font-semibold text-slate-600">
                          {org.counts.users} Staff
                        </span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {branchesList.length > 0 ? (
                          branchesList.map((b) => (
                            <span
                              key={b.id}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200/70"
                            >
                              <Store className="w-2.5 h-2.5 text-[#0E9384]" />
                              {b.name} [{b.code}]
                            </span>
                          ))
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                            Main Branch [MAIN]
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Col 3: Active Plan */}
                    <td className="py-4 px-4">
                      {org.subscription ? (
                        <div>
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${getPlanBadgeStyle(
                              org.subscription.planCode
                            )}`}
                          >
                            {org.subscription.planName}
                          </span>
                          <div className="text-[11px] font-mono text-slate-500 mt-1">
                            ${org.subscription.priceUsd.toFixed(2)} / month
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">No Subscription</span>
                      )}
                    </td>

                    {/* Col 4: WhatsApp Quota */}
                    <td className="py-4 px-4 min-w-[140px]">
                      {org.usage?.whatsAppBills?.enabled ? (
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                            <span className="text-slate-600">
                              {waUsed.toLocaleString()} / {waLimit.toLocaleString()}
                            </span>
                            <span
                              className={`font-bold ${
                                waPercent > 90
                                  ? "text-[#D32F2F]"
                                  : waPercent > 70
                                  ? "text-amber-600"
                                  : "text-[#1D2939]"
                              }`}
                            >
                              {waPercent}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                waPercent > 90
                                  ? "bg-[#D32F2F]"
                                  : waPercent > 70
                                  ? "bg-amber-500"
                                  : "bg-[#0E9384]"
                              }`}
                              style={{ width: `${Math.min(waPercent, 100)}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Disabled</span>
                      )}
                    </td>

                    {/* Col 5: Gemini AI Usage */}
                    <td className="py-4 px-4 min-w-[140px]">
                      {org.usage?.aiRequests?.enabled ? (
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                            <span className="text-slate-600">
                              {aiUsed.toLocaleString()} / {aiLimit.toLocaleString()}
                            </span>
                            <span
                              className={`font-bold ${
                                aiPercent > 90
                                  ? "text-[#D32F2F]"
                                  : aiPercent > 70
                                  ? "text-amber-600"
                                  : "text-[#1D2939]"
                              }`}
                            >
                              {aiPercent}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                aiPercent > 90
                                  ? "bg-[#D32F2F]"
                                  : aiPercent > 70
                                  ? "bg-amber-500"
                                  : "bg-[#3852D4]"
                              }`}
                              style={{ width: `${Math.min(aiPercent, 100)}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Disabled</span>
                      )}
                    </td>

                    {/* Col 6: Actions */}
                    <td className="py-4 px-5 text-right space-x-1 whitespace-nowrap">
                      {pendingInvoice && (
                        <button
                          onClick={() => {
                            setShowPaymentModal(org);
                            setPaymentForm({
                              invoiceId: pendingInvoice.id,
                              paymentMethod: "BANK_TRANSFER",
                              paymentRef: "",
                              notes: "",
                            });
                          }}
                          className="px-2 py-1 text-[11px] font-semibold text-[#0E9384] bg-[#EEFFFD] border border-[#0E9384]/30 rounded-lg hover:bg-[#0E9384] hover:text-white transition"
                        >
                          Record Pay
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setShowAddonModal(org);
                          setAddonForm({ type: "WHATSAPP_BILLS_PACK", quantity: 1 });
                        }}
                        className="px-2 py-1 text-[11px] font-semibold text-slate-700 bg-white border border-[#E4E7EC] rounded-lg hover:bg-slate-50 transition"
                      >
                        + Add-on
                      </button>

                      <button
                        onClick={() => {
                          setShowEditModal(org);
                          setEditForm({
                            name: org.name,
                            registrationNumber: org.registrationNumber || "",
                            phone: org.phone || "",
                            email: org.email || "",
                          });
                        }}
                        className="px-2 py-1 text-[11px] font-semibold text-[#0E9384] bg-[#EEFFFD] border border-[#0E9384]/25 rounded-lg hover:bg-[#0E9384]/15 transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          setShowAdminModal(org);
                          if (org.tenantAdmin) {
                            setAdminForm({
                              mode: "EDIT",
                              name: org.tenantAdmin.name || "",
                              email: org.tenantAdmin.email || "",
                              phone: org.tenantAdmin.phone || "",
                              status: org.tenantAdmin.status || "ACTIVE",
                              newPassword: "",
                            });
                          } else {
                            setAdminForm({
                              mode: "REPLACE",
                              name: "",
                              email: "",
                              phone: "",
                              status: "ACTIVE",
                              newPassword: "",
                            });
                          }
                        }}
                        className="px-2 py-1 text-[11px] font-semibold text-[#3852D4] bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition"
                      >
                        Admin
                      </button>

                      <button
                        onClick={() => {
                          setShowPlanModal(org);
                          setPlanForm({
                            planCode: org.subscription?.planCode || "PROFESSIONAL",
                          });
                        }}
                        className="px-2 py-1 text-[11px] font-semibold text-slate-700 bg-white border border-[#E4E7EC] rounded-lg hover:bg-slate-50 transition"
                      >
                        Plan
                      </button>

                      <button
                        onClick={() => handleToggleStatus(org)}
                        className={`px-2 py-1 text-[11px] font-semibold rounded-lg border transition ${
                          org.status === "ACTIVE"
                            ? "text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100"
                            : "text-[#0E9384] bg-[#EEFFFD] border-[#0E9384]/25 hover:bg-[#0E9384]/15"
                        }`}
                      >
                        {org.status === "ACTIVE" ? "Suspend" : "Activate"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-5 py-3.5 border-t border-[#E4E7EC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
        <div className="font-mono text-[11px]">
          Showing <strong className="text-[#1D2939]">{startEntry}</strong> to{" "}
          <strong className="text-[#1D2939]">{endEntry}</strong> of{" "}
          <strong className="text-[#1D2939]">{filteredOrgs.length}</strong> tenant organizations
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E4E7EC] bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 font-medium"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                currentPage === page
                  ? "bg-[#004532] text-white shadow-xs"
                  : "bg-white border border-[#E4E7EC] text-slate-600 hover:bg-slate-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E4E7EC] bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 font-medium"
          >
            Next
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#1D2939] font-sans">
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-[#E4E7EC] bg-white sticky top-0 h-screen overflow-y-auto">
        {SidebarContent}
      </aside>

      {/* Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative w-64 max-w-[80vw] h-full bg-white shadow-2xl z-10 overflow-y-auto">
            {SidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content Shell */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Global Header Bar */}
        <header className="h-16 bg-white border-b border-[#E4E7EC] sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-[#E4E7EC] text-slate-600 hover:bg-slate-50"
              aria-label="Open navigation menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Refresh Button */}
            <button
              onClick={refreshData}
              disabled={isRefreshing}
              title="Refresh Live Telemetry"
              className="p-2 rounded-xl border border-[#E4E7EC] bg-white text-slate-500 hover:text-[#0E9384] hover:border-[#0E9384]/30 transition disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#0E9384]" : ""}`}
              />
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown((v) => !v)}
                title="Platform Alerts & Notifications"
                className="relative p-2 rounded-xl border border-[#E4E7EC] bg-white text-slate-500 hover:text-[#0E9384] hover:border-[#0E9384]/30 transition"
              >
                <Bell className="w-4 h-4" />
                {(unreadNotifsCount > 0 || pendingInvoicesCount > 0) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D32F2F]" />
                )}
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-[#E4E7EC] shadow-xl p-4 z-40 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between font-bold text-[#1D2939]">
                    <span className="flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-[#0E9384]" />
                      Platform Notifications
                    </span>
                    <button
                      onClick={() => setShowNotifDropdown(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 space-y-1">
                    {unreadNotifsCount > 0 && (
                      <div className="font-semibold text-slate-800">
                        <span className="text-[#0E9384] font-bold">{unreadNotifsCount}</span> unread
                        platform alert(s) requiring attention.
                      </div>
                    )}
                    {pendingInvoicesCount > 0 ? (
                      <div>
                        <strong className="text-amber-700">{pendingInvoicesCount}</strong>{" "}
                        subscription invoice(s) awaiting payment settlement.
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400">All tenant invoices are settled.</div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        setActiveTab("notifications");
                        setShowNotifDropdown(false);
                      }}
                      className="py-1.5 px-2 rounded-lg bg-[#0E9384] text-white font-semibold hover:bg-[#004532] transition text-center"
                    >
                      All Notifications
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("financials");
                        setShowNotifDropdown(false);
                      }}
                      className="py-1.5 px-2 rounded-lg bg-[#EEFFFD] text-[#0E9384] font-semibold hover:bg-[#0E9384]/15 transition text-center"
                    >
                      Financials
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile + Sign Out */}
            <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-[#E4E7EC]">
              <div className="text-right leading-tight">
                <div className="text-xs font-bold text-[#1D2939]">Super Admin</div>
                <div className="text-[10px] font-mono text-slate-400">{adminEmail}</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#0E9384] text-white flex items-center justify-center shadow-xs">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                title="Sign Out"
                className="p-2 text-slate-400 hover:text-[#D32F2F] hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-200 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </header>

        {/* Workspace Main Content */}
        <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-7 space-y-6">
          {/* Page Hero Heading + Action Buttons (Financials renders its own Billing & Treasury hero) */}
          {activeTab !== "financials" && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#1D2939] tracking-tight">
                  {tabMeta[activeTab].title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {tabMeta[activeTab].subtitle}
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={handleExportReport}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#1D2939] bg-white border border-[#E4E7EC] rounded-xl hover:bg-slate-50 transition shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  Export Report
                </button>

                <button
                  onClick={() => {
                    if (activeTab === "subscriptions") {
                      setCreatePlanSignal((n) => n + 1);
                    } else if (activeTab === "addons") {
                      setCreateAddonSignal((n) => n + 1);
                    } else {
                      setShowCreateModal(true);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#0E9384] rounded-xl hover:bg-[#004532] shadow-sm shadow-[#0E9384]/25 transition"
                >
                  <Plus className="w-4 h-4" />
                  {activeTab === "subscriptions"
                    ? "Add Subscription"
                    : activeTab === "addons"
                    ? "Add Add-on"
                    : "Add Organization"}
                </button>
              </div>
            </div>
          )}

          {/* ACTIVE TAB: DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <>
              {/* 4 KPI Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
                {/* KPI 1: Total Tenants */}
                <div className="bg-white rounded-2xl border border-[#E4E7EC] p-5 shadow-xs hover:border-slate-300 transition space-y-4">
                  <div className="flex items-center justify-between text-slate-300">
                    <GripVertical className="w-4 h-4" />
                    <MoreHorizontal className="w-4 h-4" />
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-pink-600 text-white flex items-center justify-center shadow-sm shadow-pink-600/20 shrink-0">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500">Total Tenants</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-2xl font-extrabold text-[#1D2939] font-mono">
                          {analytics.tenants.total}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EEFFFD] text-[#0E9384] border border-[#0E9384]/20">
                          +{analytics.tenants.newThisMonth ?? 0} this month
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-1 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1.5 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-[#0E9384]" />
                      {analytics.tenants.active} Active
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-slate-500">
                      <span className="w-2 h-2 rounded-full bg-[#D32F2F]" />
                      {analytics.tenants.suspended} Suspended
                    </span>
                  </div>
                </div>

                {/* KPI 2: Platform MRR */}
                <div className="bg-white rounded-2xl border border-[#E4E7EC] p-5 shadow-xs hover:border-slate-300 transition space-y-4">
                  <div className="flex items-center justify-between text-slate-300">
                    <GripVertical className="w-4 h-4" />
                    <MoreHorizontal className="w-4 h-4" />
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#3852D4] text-white flex items-center justify-center shadow-sm shadow-[#3852D4]/20 shrink-0">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500">Platform MRR</div>
                      <div className="text-2xl font-extrabold text-[#1D2939] font-mono mt-0.5">
                        ${analytics.financials.totalMrrUsd.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="pt-1 text-xs text-slate-500">
                    Gross (+18% VAT):{" "}
                    <strong className="text-[#1D2939] font-mono">
                      ${(analytics.financials.totalMrrUsd * 1.18).toFixed(2)} USD
                    </strong>
                  </div>
                </div>

                {/* KPI 3: WhatsApp Receipts */}
                <div className="bg-white rounded-2xl border border-[#E4E7EC] p-5 shadow-xs hover:border-slate-300 transition space-y-4">
                  <div className="flex items-center justify-between text-slate-300">
                    <GripVertical className="w-4 h-4" />
                    <MoreHorizontal className="w-4 h-4" />
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#0E9384] text-white flex items-center justify-center shadow-sm shadow-[#0E9384]/20 shrink-0">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500">WhatsApp Receipts</div>
                      <div className="text-2xl font-extrabold text-[#1D2939] font-mono mt-0.5">
                        {analytics.currentMonthConsumption.totalWhatsAppBillsSent.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 text-[11px]">
                    <span className="px-2 py-0.5 rounded-md font-bold bg-[#EEFFFD] text-[#0E9384] border border-[#0E9384]/20">
                      Active Rails
                    </span>
                    <span className="text-slate-400 truncate">
                      Period {analytics.currentMonthConsumption.period}
                    </span>
                  </div>
                </div>

                {/* KPI 4: Gemini AI Queries */}
                <div className="bg-white rounded-2xl border border-[#E4E7EC] p-5 shadow-xs hover:border-slate-300 transition space-y-4">
                  <div className="flex items-center justify-between text-slate-300">
                    <GripVertical className="w-4 h-4" />
                    <MoreHorizontal className="w-4 h-4" />
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#E26D1E] text-white flex items-center justify-center shadow-sm shadow-[#E26D1E]/20 shrink-0">
                      <Bot className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500">Gemini AI Queries</div>
                      <div className="text-2xl font-extrabold text-[#1D2939] font-mono mt-0.5">
                        {analytics.currentMonthConsumption.totalAiRequestsUsed.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 text-[11px]">
                    <span className="text-slate-500">Assistant & Predictions</span>
                    <span className="px-2 py-0.5 rounded-md font-bold bg-indigo-50 text-[#3852D4]">
                      Auto Forecast
                    </span>
                  </div>
                </div>
              </div>

              {/* Analytics & Distribution Charts Row */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                <div className="xl:col-span-7">
                  <WeeklyActivityChartCard weeklyActivity={analytics.weeklyActivity} />
                </div>
                <div className="xl:col-span-5">
                  <PlanDistributionDonutCard analytics={analytics} />
                </div>
              </div>

              {/* Infrastructure Status Banner */}
              {showInfraBanner && (
                <div className="bg-white rounded-2xl border border-[#E4E7EC] p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#3852D4] flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-[#1D2939]">Infrastructure Status:</div>
                      <div className="text-slate-500 mt-0.5">
                        TechNova Cloud cluster running optimal (99.98% uptime). All WhatsApp
                        gateways and Gemini AI forecasting endpoints operational.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => setActiveTab("telemetry")}
                      className="px-3.5 py-1.5 rounded-xl border border-[#E4E7EC] bg-white text-xs font-semibold text-[#1D2939] hover:bg-slate-50 transition"
                    >
                      View Telemetry
                    </button>
                    <button
                      onClick={() => setShowInfraBanner(false)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                      aria-label="Dismiss infrastructure status"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Tenant Organizations Table */}
              {renderOrganizationsTable()}
            </>
          )}

          {/* OTHER SIDEBAR TABS */}
          {activeTab === "organizations" && renderOrganizationsTable()}

          {activeTab === "subscriptions" && (
            <SubscriptionsView
              plans={plans}
              organizations={organizations}
              requests={subscriptionRequests.filter((r) => r.type === "PLAN_CHANGE")}
              createSignal={createPlanSignal}
              onRefresh={refreshData}
              onOpenPlanModal={(org) => {
                setShowPlanModal(org);
                setPlanForm({
                  planCode:
                    org.subscription?.planCode || plans.find((p) => p.isActive)?.code || "PROFESSIONAL",
                });
              }}
            />
          )}

          {activeTab === "addons" && (
            <AddonsView
              addonPacks={addonPacks}
              organizations={organizations}
              requests={subscriptionRequests.filter((r) => r.type === "ADDON_PACK")}
              createSignal={createAddonSignal}
              onRefresh={refreshData}
              onOpenAddonModal={(org) => {
                setShowAddonModal(org);
                setAddonForm({
                  type: addonPacks.find((p) => p.isActive)?.code || "WHATSAPP_BILLS_PACK",
                  quantity: 1,
                });
              }}
            />
          )}

          {activeTab === "financials" && (
            <PlatformAdminFinancialsView
              analytics={analytics}
              invoices={invoices}
              organizations={organizations}
              onOpenPaymentModal={(org, invoiceId) => {
                setShowPaymentModal(org);
                setPaymentForm({
                  invoiceId,
                  paymentMethod: "BANK_TRANSFER",
                  paymentRef: "",
                  notes: "",
                });
              }}
            />
          )}

          {activeTab === "notifications" && (
            <NotificationsView notifications={notifications} onRefresh={refreshData} />
          )}

          {activeTab === "telemetry" && (
            <TelemetryView analytics={analytics} organizations={organizations} />
          )}

          {activeTab === "audit" && <AuditLogsView auditLogs={auditLogs} />}
        </main>
      </div>

      {/* MODAL 1: ADD ORGANIZATION MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#E4E7EC] space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EEFFFD] text-[#0E9384] flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1D2939]">Add New Organization</h3>
                  <p className="text-xs text-slate-500">
                    Provision a new retail business tenant on TechNova Cloud.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-4 text-xs">
              <div className="space-y-3">
                <h4 className="font-bold uppercase tracking-wider text-[11px] text-[#0E9384]">
                  Business / Organization Details
                </h4>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Organization Name <span className="text-[#D32F2F]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Colombo Supermarket (Pvt) Ltd"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl text-[#1D2939] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0E9384] focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Business Reg No. (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. PV-12345"
                      value={createForm.registrationNumber}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, registrationNumber: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl text-[#1D2939] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0E9384] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. +94771234567"
                      value={createForm.phone}
                      onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl text-[#1D2939] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0E9384] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Business Email
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. info@business.com"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl text-[#1D2939] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0E9384] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Commercial Subscription Plan
                  </label>
                  <select
                    value={createForm.planCode}
                    onChange={(e) => setCreateForm({ ...createForm, planCode: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl text-[#1D2939] focus:outline-none focus:ring-2 focus:ring-[#0E9384] focus:bg-white font-medium"
                  >
                    {plans.filter((p) => p.isActive).length > 0 ? (
                      plans
                        .filter((p) => p.isActive)
                        .map((p) => (
                          <option key={p.id} value={p.code}>
                            {p.name} — ${p.priceUsd.toFixed(2)}/
                            {p.billingCycle === "ANNUAL" ? "yr" : "mo"} ({p.maxBranches} Br,{" "}
                            {p.maxInternalUsers} Staff, {p.monthlyWhatsAppBills.toLocaleString()} WA)
                          </option>
                        ))
                    ) : (
                      <>
                        <option value="BASIC">Basic Plan — $49/mo</option>
                        <option value="STANDARD">Standard Plan — $69/mo</option>
                        <option value="PROFESSIONAL">Professional Plan — $149/mo</option>
                        <option value="ENTERPRISE">Enterprise Plan — $199/mo</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-[#EEFFFD] border border-[#0E9384]/25 rounded-xl flex items-start gap-2.5">
                <Store className="w-4 h-4 text-[#0E9384] shrink-0 mt-0.5" />
                <div className="text-[11px] text-[#004532] leading-relaxed">
                  <strong className="font-bold">Automatic Primary Branch:</strong> The initial
                  branch for this organization will be created automatically as{" "}
                  <strong>Main Branch [MAIN]</strong>.
                </div>
              </div>

              <div className="space-y-3 border-t border-[#E4E7EC] pt-3">
                <h4 className="font-bold uppercase tracking-wider text-[11px] text-[#0E9384]">
                  Initial Tenant Super Admin Account
                </h4>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Admin Full Name <span className="text-[#D32F2F]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ruwan Silva"
                    value={createForm.adminName}
                    onChange={(e) => setCreateForm({ ...createForm, adminName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl text-[#1D2939] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0E9384] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Admin Login Email <span className="text-[#D32F2F]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="admin@business.com"
                    value={createForm.adminEmail}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, adminEmail: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl text-[#1D2939] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0E9384] focus:bg-white"
                  />
                </div>

                <div className="p-3 bg-slate-50 border border-[#E4E7EC] rounded-xl text-[11px] text-slate-600 leading-relaxed">
                  A secure temporary password will be auto-generated and emailed to this address.
                  On first sign-in, the Tenant Admin will be required to reset their password.
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E4E7EC]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingTenant}
                  className="px-5 py-2 font-bold text-white bg-[#0E9384] rounded-xl hover:bg-[#004532] transition shadow-sm shadow-[#0E9384]/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isCreatingTenant ? "Creating Organization..." : "Create Organization"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RECORD PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E4E7EC] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-3">
              <h3 className="text-base font-bold text-[#1D2939] flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#0E9384]" />
                Record Bank Wire Payment
              </h3>
              <button
                onClick={() => setShowPaymentModal(null)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Mark subscription invoice as <strong>PAID</strong> for organization{" "}
              <strong className="text-[#1D2939]">{showPaymentModal.name}</strong> upon bank
              confirmation.
            </p>
            <form onSubmit={handleRecordPayment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Invoice ID</label>
                <input
                  type="text"
                  readOnly
                  value={paymentForm.invoiceId}
                  className="w-full px-3 py-2 bg-slate-100 border border-[#E4E7EC] rounded-xl text-slate-600 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Payment Method</label>
                <select
                  value={paymentForm.paymentMethod}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl text-[#1D2939] font-medium"
                >
                  <option value="BANK_TRANSFER">Bank Wire / Direct Deposit</option>
                  <option value="CASH">Direct Cash</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="ONLINE">Online Portal</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Bank Reference / Deposit Slip No.
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TXN-9988224"
                  value={paymentForm.paymentRef}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, paymentRef: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl text-[#1D2939] font-mono"
                />
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(null)}
                  className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-[#0E9384] rounded-xl hover:bg-[#004532] shadow-sm"
                >
                  Mark Paid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ALLOCATE ADD-ON MODAL */}
      {showAddonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E4E7EC] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-3">
              <h3 className="text-base font-bold text-[#1D2939] flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#0E9384]" />
                Allocate Top-Up Capacity
              </h3>
              <button
                onClick={() => setShowAddonModal(null)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Provision extra capacity for organization{" "}
              <strong className="text-[#1D2939]">{showAddonModal.name}</strong>.
            </p>
            <form onSubmit={handleAllocateAddon} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Add-on Pack Type
                </label>
                <select
                  value={addonForm.type}
                  onChange={(e) => setAddonForm({ ...addonForm, type: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl text-[#1D2939] font-medium"
                >
                  {addonPacks.filter((a) => a.isActive).length > 0 ? (
                    addonPacks
                      .filter((a) => a.isActive)
                      .map((a) => (
                        <option key={a.id} value={a.code}>
                          {a.name} (
                          {a.unitsPerPack > 0
                            ? `+${a.unitsPerPack.toLocaleString()} ${a.quotaTarget.replace(/_/g, " ")}`
                            : "Feature Pack"}{" "}
                          — ${a.priceUsd.toFixed(2)})
                        </option>
                      ))
                  ) : (
                    <>
                      <option value="WHATSAPP_BILLS_PACK">
                        +1,000 Extra WhatsApp Digital Bills ($10)
                      </option>
                      <option value="WHATSAPP_MARKETING_PACK">
                        +100 Extra WhatsApp Marketing Broadcasts ($15)
                      </option>
                      <option value="TRANSACTIONAL_EMAIL_PACK">
                        +5,000 Extra Transactional Emails ($15)
                      </option>
                      <option value="GEMINI_AI_PACK">+500 Extra Gemini AI Queries ($20)</option>
                      <option value="ADDITIONAL_BRANCH">+1 Extra Branch Location ($20/mo)</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Pack Quantity</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={addonForm.quantity}
                  onChange={(e) =>
                    setAddonForm({ ...addonForm, quantity: parseInt(e.target.value) || 1 })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl text-[#1D2939]"
                />
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddonModal(null)}
                  className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-[#0E9384] rounded-xl hover:bg-[#004532] shadow-sm"
                >
                  Allocate Add-on
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT ORGANIZATION MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E4E7EC] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-3">
              <h3 className="text-base font-bold text-[#1D2939] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#0E9384]" />
                Edit Organization Details
              </h3>
              <button
                onClick={() => setShowEditModal(null)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Update organization info for{" "}
              <strong className="text-[#1D2939]">{showEditModal.name}</strong>.
            </p>
            <form onSubmit={handleEditOrganization} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Organization Name <span className="text-[#D32F2F]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl text-[#1D2939] focus:outline-none focus:ring-2 focus:ring-[#0E9384] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Business Registration Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. PV-12345"
                  value={editForm.registrationNumber}
                  onChange={(e) =>
                    setEditForm({ ...editForm, registrationNumber: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl text-[#1D2939] focus:outline-none focus:ring-2 focus:ring-[#0E9384] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Contact Phone</label>
                <input
                  type="text"
                  placeholder="e.g. +94771234567"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl text-[#1D2939] focus:outline-none focus:ring-2 focus:ring-[#0E9384] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Business Email</label>
                <input
                  type="email"
                  placeholder="e.g. info@business.com"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl text-[#1D2939] focus:outline-none focus:ring-2 focus:ring-[#0E9384] focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(null)}
                  className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-[#0E9384] rounded-xl hover:bg-[#004532] shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: CHANGE PLAN MODAL */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E4E7EC] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-3">
              <h3 className="text-base font-bold text-[#1D2939] flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#0E9384]" />
                Change Commercial Plan
              </h3>
              <button
                onClick={() => setShowPlanModal(null)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Migrate organization <strong className="text-[#1D2939]">{showPlanModal.name}</strong>{" "}
              to a new tier.
            </p>
            <form onSubmit={handleChangePlan} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Select Plan Tier
                </label>
                <select
                  value={planForm.planCode}
                  onChange={(e) => setPlanForm({ ...planForm, planCode: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl text-[#1D2939] font-medium"
                >
                  {plans.filter((p) => p.isActive).length > 0 ? (
                    plans
                      .filter((p) => p.isActive)
                      .map((p) => (
                        <option key={p.id} value={p.code}>
                          {p.name} (${p.priceUsd.toFixed(2)}/
                          {p.billingCycle === "ANNUAL" ? "yr" : "mo"} + VAT) — {p.maxBranches} Br,{" "}
                          {p.maxInternalUsers} Staff
                        </option>
                      ))
                  ) : (
                    <>
                      <option value="BASIC">Basic ($49/mo + 18% VAT)</option>
                      <option value="STANDARD">Standard ($69/mo + 18% VAT)</option>
                      <option value="PROFESSIONAL">Professional ($149/mo + 18% VAT)</option>
                      <option value="ENTERPRISE">Enterprise ($199/mo + 18% VAT)</option>
                    </>
                  )}
                </select>
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(null)}
                  className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-[#0E9384] rounded-xl hover:bg-[#004532] shadow-sm"
                >
                  Update Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: EDIT / CHANGE TENANT ADMIN MODAL */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E4E7EC] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#3852D4] flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1D2939]">
                    Tenant Super Admin
                  </h3>
                  <p className="text-[11px] text-slate-500 truncate max-w-[260px]">
                    {showAdminModal.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAdminModal(null)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Current Tenant Admin Banner */}
            <div className="p-3 rounded-xl bg-slate-50 border border-[#E4E7EC] text-xs space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Current Tenant Admin
              </div>
              {showAdminModal.tenantAdmin ? (
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-bold text-[#1D2939] truncate">
                      {showAdminModal.tenantAdmin.name || "Unnamed Admin"}
                    </div>
                    <div className="font-mono text-[11px] text-[#0E9384] truncate">
                      {showAdminModal.tenantAdmin.email}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEFFFD] text-[#0E9384] border border-[#0E9384]/25 shrink-0">
                    {showAdminModal.tenantAdmin.status}
                  </span>
                </div>
              ) : (
                <div className="text-slate-500 italic">
                  No Tenant Super Admin assigned yet. Create or assign one below.
                </div>
              )}
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 border border-[#E4E7EC] text-xs">
              <button
                type="button"
                disabled={!showAdminModal.tenantAdmin}
                onClick={() => {
                  if (!showAdminModal.tenantAdmin) return;
                  setAdminForm({
                    mode: "EDIT",
                    name: showAdminModal.tenantAdmin.name || "",
                    email: showAdminModal.tenantAdmin.email || "",
                    phone: showAdminModal.tenantAdmin.phone || "",
                    status: showAdminModal.tenantAdmin.status || "ACTIVE",
                    newPassword: "",
                  });
                }}
                className={`py-1.5 rounded-lg font-semibold transition disabled:opacity-40 ${
                  adminForm.mode === "EDIT"
                    ? "bg-white text-[#1D2939] shadow-xs"
                    : "text-slate-500 hover:text-[#1D2939]"
                }`}
              >
                Edit Current Admin
              </button>
              <button
                type="button"
                onClick={() =>
                  setAdminForm({
                    mode: "REPLACE",
                    name: "",
                    email: "",
                    phone: "",
                    status: "ACTIVE",
                    newPassword: "",
                  })
                }
                className={`py-1.5 rounded-lg font-semibold transition ${
                  adminForm.mode === "REPLACE"
                    ? "bg-white text-[#1D2939] shadow-xs"
                    : "text-slate-500 hover:text-[#1D2939]"
                }`}
              >
                {showAdminModal.tenantAdmin ? "Replace / Switch Admin" : "Assign New Admin"}
              </button>
            </div>

            <form onSubmit={handleUpdateTenantAdmin} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Admin Full Name <span className="text-[#D32F2F]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ruwan Silva"
                  value={adminForm.name}
                  onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl text-[#1D2939] focus:outline-none focus:ring-2 focus:ring-[#0E9384] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Admin Login Email <span className="text-[#D32F2F]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin@business.com"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl text-[#1D2939] font-mono focus:outline-none focus:ring-2 focus:ring-[#0E9384] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+9477..."
                    value={adminForm.phone}
                    onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl text-[#1D2939] focus:outline-none focus:ring-2 focus:ring-[#0E9384] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Status</label>
                  <select
                    value={adminForm.status}
                    onChange={(e) => setAdminForm({ ...adminForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl text-[#1D2939] font-medium"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {adminForm.mode === "EDIT" &&
                  adminForm.email.trim().toLowerCase() ===
                    (showAdminModal.tenantAdmin?.email || "").toLowerCase()
                    ? "Reset Password (Optional)"
                    : "Temporary Password (Optional)"}
                </label>
                <input
                  type="text"
                  minLength={8}
                  placeholder={
                    adminForm.mode === "EDIT" &&
                    adminForm.email.trim().toLowerCase() ===
                      (showAdminModal.tenantAdmin?.email || "").toLowerCase()
                      ? "Leave blank to keep existing password"
                      : "Leave blank to auto-generate & email temp password"
                  }
                  value={adminForm.newPassword}
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, newPassword: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E4E7EC] rounded-xl text-[#1D2939] font-mono focus:outline-none focus:ring-2 focus:ring-[#0E9384] focus:bg-white"
                />
                {(adminForm.mode === "REPLACE" ||
                  (showAdminModal.tenantAdmin?.email &&
                    adminForm.email.trim().toLowerCase() !==
                      showAdminModal.tenantAdmin.email.toLowerCase())) && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-[#EEFFFD] border border-[#0E9384]/25 text-[11px] text-[#004532] leading-relaxed">
                    <strong>Email &amp; Password Reset Workflow:</strong>{" "}
                    {showAdminModal.tenantAdmin?.email ? (
                      <>
                        <strong>{showAdminModal.tenantAdmin.email}</strong> will receive a
                        notification with the updated email, and{" "}
                      </>
                    ) : null}
                    the new email address will receive a fresh temporary password and must reset it
                    on first sign-in.
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-[#E4E7EC]">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(null)}
                  className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-[#0E9384] rounded-xl hover:bg-[#004532] shadow-sm"
                >
                  {adminForm.mode === "EDIT" ? "Save Admin Changes" : "Assign Tenant Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
