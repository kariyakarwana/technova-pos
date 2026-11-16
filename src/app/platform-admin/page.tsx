import React from "react";
import { redirect } from "next/navigation";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import { serverApi } from "@/lib/api/server";
import {
  PlatformAdminClientView,
  type PlatformAnalytics,
  type TenantSummary,
} from "@/components/platform-admin/PlatformAdminClientView";
import type {
  PlatformAddonPack,
  PlatformAuditEvent,
  PlatformInvoice,
  PlatformNotificationItem,
  PlatformPlan,
  PlatformSubscriptionRequest,
} from "@/components/platform-admin/types";

export const dynamic = "force-dynamic";

export default async function PlatformAdminPage() {
  const user = await requireAuthenticatedUser("/platform-admin");

  if (!user.roles.includes("PLATFORM_SUPER_ADMIN")) {
    redirect("/forbidden");
  }

  const [
    analytics,
    organizations,
    invoices,
    auditLogs,
    plans,
    addonPacks,
    subscriptionRequests,
    notifications,
  ] = await Promise.all([
    serverApi<PlatformAnalytics>("/platform-admin/analytics").catch(() => ({
      tenants: { total: 0, active: 0, suspended: 0, newThisMonth: 0 },
      financials: {
        totalMrrUsd: 0,
        activeSubscriptionsCount: 0,
        planDistribution: [],
      },
      currentMonthConsumption: {
        period: new Date().toISOString().substring(0, 7),
        totalWhatsAppBillsSent: 0,
        totalWhatsAppMarketingSent: 0,
        totalEmailsSent: 0,
        totalAiRequestsUsed: 0,
      },
      weeklyActivity: {
        totalWeeklyTxns: 0,
        prevWeekTxns: 0,
        avgDailyTxns: 0,
        days: [],
      },
    })),
    serverApi<TenantSummary[]>("/platform-admin/organizations").catch(() => []),
    serverApi<PlatformInvoice[]>("/platform-admin/invoices").catch(() => []),
    serverApi<PlatformAuditEvent[]>("/platform-admin/audit-logs").catch(() => []),
    serverApi<PlatformPlan[]>("/platform-admin/plans").catch(() => []),
    serverApi<PlatformAddonPack[]>("/platform-admin/addon-packs").catch(() => []),
    serverApi<PlatformSubscriptionRequest[]>("/platform-admin/subscription-requests").catch(
      () => []
    ),
    serverApi<PlatformNotificationItem[]>("/platform-admin/notifications").catch(() => []),
  ]);

  return (
    <PlatformAdminClientView
      initialAnalytics={analytics}
      initialOrganizations={organizations}
      initialInvoices={invoices}
      initialAuditLogs={auditLogs}
      initialPlans={plans}
      initialAddonPacks={addonPacks}
      initialRequests={subscriptionRequests}
      initialNotifications={notifications}
      adminEmail={user.email}
    />
  );
}
