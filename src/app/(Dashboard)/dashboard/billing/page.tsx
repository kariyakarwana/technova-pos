import React from "react";
import { requirePermission } from "@/lib/auth/session";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { serverApi } from "@/lib/api/server";
import {
  TenantBillingClientView,
  type BillingDetails,
} from "@/components/dashboard/billing/TenantBillingClientView";

export const dynamic = "force-dynamic";

export default async function TenantBillingPage() {
  const user = await requirePermission(PERMISSIONS.BILLING_VIEW, "/dashboard/billing");
  const billingData = await serverApi<BillingDetails>("/subscription/billing");
  return <TenantBillingClientView initialData={billingData} canManage={user.roles.includes("SUPER_ADMIN") || user.permissions.includes(PERMISSIONS.BILLING_MANAGE)} />;
}
