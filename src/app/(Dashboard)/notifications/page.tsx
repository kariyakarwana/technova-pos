import type { Metadata } from "next";
import NotificationAdminClientView, {
  type NotificationTemplate,
  type OutboxItem,
} from "@/components/dashboard/notifications/NotificationAdminClientView";
import { serverApi } from "@/lib/api/server";

export const metadata: Metadata = {
  title: "Notification Administration | TechNova POS",
};

type Paginated<T> = { data: T[] };
export type ProviderStatus = { provider: string; configured: boolean; workerEnabled: boolean; templateName: string | null };

export default async function NotificationAdminPage() {
  let templates: NotificationTemplate[] = [];
  let outbox: OutboxItem[] = [];
  let loadError: string | undefined;
  let providerStatus: ProviderStatus | undefined;

  try {
    [templates, outbox, providerStatus] = await Promise.all([
      serverApi<NotificationTemplate[]>("/notifications/templates"),
      serverApi<Paginated<OutboxItem>>("/notifications/outbox?page=1&pageSize=25").then((result) => result.data),
      serverApi<ProviderStatus>("/notifications/provider-status"),
    ]);
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Unable to load notification data.";
  }

  return <NotificationAdminClientView templates={templates} outbox={outbox} providerStatus={providerStatus} loadError={loadError} />;
}
