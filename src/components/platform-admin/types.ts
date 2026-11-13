export type PlatformTabId =
  | "dashboard"
  | "organizations"
  | "subscriptions"
  | "addons"
  | "financials"
  | "notifications"
  | "telemetry"
  | "audit";

export interface PlatformNotificationItem {
  id: string;
  category: "BILLING" | "INVENTORY ALERT" | "PURCHASE ORDER" | "SYSTEM UPDATE" | "EMPLOYEE" | "SUBSCRIPTION";
  title: string;
  message: string;
  createdAt: string;
  timeAgo: string;
  isRead: boolean;
  priority?: "URGENT" | "NORMAL" | "INFO";
  actionUrl?: string;
}

export interface PackageFeatureItem {
  key: string;
  label: string;
  description?: string;
  enabled: boolean;
  source?: "PLAN" | "ADDON";
}

export interface PlatformPlan {
  id: string;
  code: string;
  tier: string;
  name: string;
  description: string | null;
  priceUsd: number;
  vatRate: number;
  priceWithVatUsd: number;
  billingCycle: string;
  isActive: boolean;
  maxBranches: number;
  maxInternalUsers: number;
  monthlyEmailLimit: number;
  monthlyWhatsAppBills: number;
  monthlyWhatsAppMarketing: number;
  monthlyAiRequests: number;
  multiBranchEnabled: boolean;
  emailEnabled: boolean;
  whatsAppBillsEnabled: boolean;
  whatsAppMarketingEnabled: boolean;
  aiEnabled: boolean;
  features: PackageFeatureItem[];
  subscriberCount: number;
}

export type AddonQuotaTarget =
  | "BRANCHES"
  | "WHATSAPP_BILLS"
  | "WHATSAPP_MARKETING"
  | "EMAILS"
  | "AI_REQUESTS"
  | "CUSTOM_FEATURE";

export interface PlatformAddonPack {
  id: string;
  code: string;
  name: string;
  description: string | null;
  quotaTarget: AddonQuotaTarget;
  unitsPerPack: number;
  priceUsd: number;
  billingCycle: string;
  features: PackageFeatureItem[];
  isActive: boolean;
  allocationCount: number;
}

export interface PlatformAnalytics {
  tenants: {
    total: number;
    active: number;
    suspended: number;
    newThisMonth?: number;
  };
  financials: {
    totalMrrUsd: number;
    activeSubscriptionsCount: number;
    planDistribution?: Array<{
      code: string;
      name: string;
      count: number;
    }>;
  };
  currentMonthConsumption: {
    period: string;
    totalWhatsAppBillsSent: number;
    totalWhatsAppMarketingSent: number;
    totalEmailsSent: number;
    totalAiRequestsUsed: number;
  };
  weeklyActivity?: {
    totalWeeklyTxns: number;
    prevWeekTxns: number;
    avgDailyTxns: number;
    days: Array<{
      dateKey: string;
      day: string;
      count: number;
      volume: number;
    }>;
  };
}

export interface TenantBranch {
  id: string;
  name: string;
  code: string;
  status: string;
}

export interface TenantAdminSummary {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  status: string;
}

export interface TenantSummary {
  id: string;
  name: string;
  registrationNumber: string | null;
  phone: string | null;
  email: string | null;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  branches?: TenantBranch[];
  tenantAdmin?: TenantAdminSummary | null;
  counts: {
    branches: number;
    users: number;
  };
  subscription: {
    status: string;
    planCode: string;
    planTier: string;
    planName: string;
    priceUsd: number;
    priceWithVatUsd: number;
    currentPeriodEnd: string;
    extraBranches: number;
    extraWhatsAppBills: number;
    extraAiRequests: number;
    recentInvoices: Array<{
      id: string;
      invoiceNumber: string;
      totalAmountUsd: number;
      status: string;
      dueDate: string;
    }>;
  } | null;
  usage: {
    branches: { used: number; limit: number; remaining: number; percent: number; enabled: boolean };
    users: { used: number; limit: number; remaining: number; percent: number; enabled: boolean };
    whatsAppBills: { used: number; limit: number; remaining: number; percent: number; enabled: boolean };
    whatsAppMarketing: { used: number; limit: number; remaining: number; percent: number; enabled: boolean };
    transactionalEmails: { used: number; limit: number; remaining: number; percent: number; enabled: boolean };
    aiRequests: { used: number; limit: number; remaining: number; percent: number; enabled: boolean };
  } | null;
}

export interface PlatformInvoice {
  id: string;
  invoiceNumber: string;
  organizationId: string;
  organizationName: string;
  organizationEmail: string | null;
  planName: string;
  planCode: string;
  subtotalUsd: number;
  vatAmountUsd: number;
  totalAmountUsd: number;
  status: "PENDING" | "PAID" | "OVERDUE" | "VOID";
  issuedDate: string;
  dueDate: string;
  paidAt: string | null;
  paymentMethod: string | null;
  paymentRef: string | null;
}

export interface PlatformAuditEvent {
  id: string;
  action: string;
  outcome: string;
  actorEmail: string;
  actorName: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface PlatformSubscriptionRequest {
  id: string;
  organizationId: string;
  organizationName: string;
  organizationEmail: string | null;
  currentPlanCode: string;
  currentPlanName: string;
  type: "PLAN_CHANGE" | "ADDON_PACK";
  status: "PENDING" | "APPROVED" | "REJECTED";
  targetPlanCode: string | null;
  targetPlanName: string | null;
  targetPlanPriceUsd: number | null;
  addonCode: string | null;
  addonName: string | null;
  addonPriceUsd: number | null;
  addonUnitsPerPack: number | null;
  addonQuotaTarget: string | null;
  quantity: number;
  notes: string | null;
  paymentRef: string | null;
  reviewNotes: string | null;
  reviewedAt: string | null;
  createdAt: string;
}
