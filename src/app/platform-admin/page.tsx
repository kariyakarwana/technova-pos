import type { PageResult } from "@/components/platform-admin/types";
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
    serverApi<PlatformAnalytics>("/platform-admin/analytics"),
    serverApi<PageResult<TenantSummary>>("/platform-admin/organizations"),
    serverApi<PageResult<PlatformInvoice>>("/platform-admin/invoices"),
    serverApi<PageResult<PlatformAuditEvent>>("/platform-admin/audit-logs"),
    serverApi<PlatformPlan[]>("/platform-admin/plans"),
    serverApi<PlatformAddonPack[]>("/platform-admin/addon-packs"),
    serverApi<PageResult<PlatformSubscriptionRequest>>("/platform-admin/subscription-requests"),
    serverApi<PlatformNotificationItem[]>("/platform-admin/notifications"),
  ]);

  return (
    <PlatformAdminClientView
      initialAnalytics={analytics}
      initialOrganizations={organizations.data}
      initialInvoices={invoices.data}
      initialAuditLogs={auditLogs.data}
      initialPlans={plans}
      initialAddonPacks={addonPacks}
      initialRequests={subscriptionRequests.data}
      initialNotifications={notifications}
      initialPages={{ organizations: organizations.meta, invoices: invoices.meta, audit: auditLogs.meta, requests: subscriptionRequests.meta }}
      adminEmail={user.email}
    />
  );
}
