import type { Metadata } from "next";
import NotificationAdminClientView, {
  type NotificationTemplate,
  type OutboxPage,
  type TemplateCatalogItem,
} from "@/components/dashboard/notifications/NotificationAdminClientView";
import { serverApi } from "@/lib/api/server";

export const metadata: Metadata = {
  title: "Notification Administration | TechNova POS",
};

export type ProviderStatus = {
  provider: string;
  configured: boolean;
  emailConfigured: boolean;
  workerEnabled: boolean;
  templateName: string | null;
};

const emptyOutbox: OutboxPage = {
  data: [],
  meta: { page: 1, pageSize: 20, total: 0, pageCount: 0 },
  summary: {},
};

export default async function NotificationAdminPage() {
  let templates: NotificationTemplate[] = [];
  let catalog: TemplateCatalogItem[] = [];
  let outboxPage = emptyOutbox;
  let providerStatus: ProviderStatus | undefined;
  let loadError: string | undefined;

  const results = await Promise.allSettled([
    serverApi<NotificationTemplate[]>("/notifications/templates"),
    serverApi<TemplateCatalogItem[]>("/notifications/templates/catalog"),
    serverApi<OutboxPage>("/notifications/outbox?page=1&pageSize=20"),
    serverApi<ProviderStatus>("/notifications/provider-status"),
  ]);

  if (results[0].status === "fulfilled") templates = results[0].value;
  if (results[1].status === "fulfilled") catalog = results[1].value;
  if (results[2].status === "fulfilled") outboxPage = results[2].value;
  if (results[3].status === "fulfilled") providerStatus = results[3].value;
  const failures = results.filter((result) => result.status === "rejected");
  if (failures.length) {
    loadError = `${failures.length} notification section(s) could not be loaded. Restart the API if it is still using an older version.`;
  }

  return (
    <NotificationAdminClientView
      templates={templates}
      catalog={catalog}
      outboxPage={outboxPage}
      providerStatus={providerStatus}
      loadError={loadError}
    />
  );
}
