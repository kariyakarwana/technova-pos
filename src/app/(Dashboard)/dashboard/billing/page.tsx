import React from "react";
import { requirePermission } from "@/lib/auth/session";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { serverApi } from "@/lib/api/server";
import {
  TenantBillingClientView,
  type BillingDetails,
} from "@/components/dashboard/billing/TenantBillingClientView";

export const dynamic = "force-dynamic";

const FALLBACK_BILLING_DATA: BillingDetails = {
  subscription: {
    id: "",
    organizationId: "",
    status: "ACTIVE" as const,
    currentPeriodStart: "2026-01-01T00:00:00.000Z",
    currentPeriodEnd: "2026-12-31T23:59:59.000Z",
    plan: {
      id: "",
      code: "ENTERPRISE",
      name: "Enterprise Plan",
      description: "Full-scale multi-branch enterprise tier with unlimited capacity.",
      priceUsd: 199,
      vatRate: 0.18,
      priceWithVatUsd: 234.82,
      billingCycle: "MONTHLY",
      maxBranches: 9999,
      maxInternalUsers: 9999,
      monthlyWhatsAppBills: 20000,
      monthlyWhatsAppMarketing: 10000,
      monthlyTransactionalEmails: 50000,
      monthlyAiRequests: 2000,
    },
    addons: [],
    invoices: [],
  },
  usageOverview: {
    plan: {
      tier: "ENTERPRISE",
      name: "Enterprise Plan",
      priceUsd: 199,
      priceWithVatUsd: 234.82,
      status: "ACTIVE",
      currentPeriodEnd: "2026-12-31T23:59:59.000Z",
    },
    metrics: {
      branches: { used: 1, limit: 9999, remaining: 9998, percent: 0, enabled: true },
      users: { used: 1, limit: 9999, remaining: 9998, percent: 0, enabled: true },
      whatsAppBills: { used: 0, limit: 20000, remaining: 20000, percent: 0, enabled: true },
      whatsAppMarketing: { used: 0, limit: 10000, remaining: 10000, percent: 0, enabled: true },
      transactionalEmails: { used: 0, limit: 50000, remaining: 50000, percent: 0, enabled: true },
      aiRequests: { used: 0, limit: 2000, remaining: 2000, percent: 0, enabled: true },
    },
  },
};

export default async function TenantBillingPage() {
  await requirePermission(PERMISSIONS.SETTINGS_VIEW, "/dashboard/billing");

  const billingData = await serverApi<BillingDetails>("/subscription/billing").catch(
    () => FALLBACK_BILLING_DATA,
  );

  return <TenantBillingClientView initialData={billingData} />;
}
