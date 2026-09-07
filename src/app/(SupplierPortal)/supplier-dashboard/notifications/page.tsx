import SupplierNotificationsClient, { type SupplierNotification } from "@/components/supplier-portal/notifications/SupplierNotificationsClient";
import { serverApi } from "@/lib/api/server";

export default async function SupplierNotificationsPage() {
  let initial: SupplierNotification[] = [];
  let loadError: string | undefined;
  try {
    const result = await serverApi<{ data: SupplierNotification[] }>("/notifications/in-app?page=1&pageSize=100");
    initial = result.data;
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Unable to load notifications.";
  }
  return <SupplierNotificationsClient initial={initial} loadError={loadError} />;
}
