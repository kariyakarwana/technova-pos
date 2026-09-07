import SupplierNotificationsClient, { type SupplierNotification } from "@/components/supplier-portal/notifications/SupplierNotificationsClient";
import { serverApi } from "@/lib/api/server";

export default async function UserNotificationsPage() {
  const result = await serverApi<{ data: SupplierNotification[] }>("/notifications/in-app?page=1&pageSize=100");
  return <SupplierNotificationsClient initial={result.data} />;
}
