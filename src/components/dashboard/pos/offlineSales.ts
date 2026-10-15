import { apiPost } from "@/lib/api/client";

const QUEUE_KEY = "technova_pos_queue";
const DEVICE_KEY = "technova_device_id";
export const OFFLINE_QUEUE_CHANGED = "technova:offline-queue-changed";

export type OfflineSale = {
  clientOperationId: string;
  operationType: "SALE_CREATE";
  clientTimestamp: string;
  payload: {
    branchId: string;
    customerId?: string;
    items: Array<{ productId: string; quantity: number; serialNumber?: string }>;
    payments: Array<{ method: string; amount: number }>;
    loyaltyPointsToRedeem?: number;
  };
  ownerId?: string;
  summary?: { customer: string; total: number; items: number };
};

type SyncedOperation = {
  clientOperationId: string;
  status: string;
  errorMessage?: string | null;
};
type SyncedBatch = { operations: SyncedOperation[] };
export type SyncResult = { applied: number; rejected: number; pending: number; error?: string };

function readAll(): OfflineSale[] {
  const raw = localStorage.getItem(QUEUE_KEY);
  if (!raw) return [];
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed) || parsed.some((item) => !item || typeof item.clientOperationId !== "string" || item.operationType !== "SALE_CREATE")) {
    throw new Error("The saved offline queue is damaged. It was not overwritten; contact support before retrying.");
  }
  return parsed as OfflineSale[];
}

function writeAll(operations: OfflineSale[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(operations));
  window.dispatchEvent(new Event(OFFLINE_QUEUE_CHANGED));
}

export function queuedSales(ownerId: string) {
  const operations = readAll();
  return {
    pending: operations.filter((operation) => operation.ownerId === ownerId),
    legacyCount: operations.filter((operation) => !operation.ownerId).length,
  };
}

export function enqueueOfflineSale(ownerId: string, payload: OfflineSale["payload"], summary: NonNullable<OfflineSale["summary"]>) {
  const operation: OfflineSale = {
    clientOperationId: crypto.randomUUID(),
    operationType: "SALE_CREATE",
    clientTimestamp: new Date().toISOString(),
    payload,
    ownerId,
    summary,
  };
  writeAll([...readAll(), operation]);
  return operation;
}

export function claimLegacySales(ownerId: string) {
  const operations = readAll();
  const count = operations.filter((operation) => !operation.ownerId).length;
  if (count) writeAll(operations.map((operation) => operation.ownerId ? operation : { ...operation, ownerId }));
  return count;
}

function removeOperation(clientOperationId: string) {
  // Read again so a sale queued while synchronization was running is retained.
  writeAll(readAll().filter((operation) => operation.clientOperationId !== clientOperationId));
}

function deviceId() {
  let value = localStorage.getItem(DEVICE_KEY);
  if (!value) {
    value = `web-${crypto.randomUUID()}`;
    localStorage.setItem(DEVICE_KEY, value);
  }
  return value;
}

let activeSync: Promise<SyncResult> | null = null;

export function synchronizeOfflineSales(ownerId: string): Promise<SyncResult> {
  if (activeSync) return activeSync;
  activeSync = (async () => {
    const result: SyncResult = { applied: 0, rejected: 0, pending: 0 };
    try {
      const operations = queuedSales(ownerId).pending;
      if (!operations.length) return result;
      const sourceDevice = deviceId();
      for (const operation of operations) {
        try {
          // A stable one-sale batch ID lets a retry recover a response lost after
          // the server committed the sale, without creating a second sale.
          const batch = await apiPost<SyncedBatch>("/offline-sync/batches", {
            clientBatchId: `web-batch-${operation.clientOperationId}`,
            deviceId: sourceDevice,
            operations: [{
              clientOperationId: operation.clientOperationId,
              operationType: operation.operationType,
              clientTimestamp: operation.clientTimestamp,
              payload: operation.payload,
            }],
          });
          const status = batch.operations.find((item) => item.clientOperationId === operation.clientOperationId);
          if (status?.status === "APPLIED" || status?.status === "REJECTED") {
            removeOperation(operation.clientOperationId);
            if (status.status === "APPLIED") result.applied++;
            else result.rejected++;
          } else {
            result.error = "A sale is still processing on the server. It remains queued for retry.";
            break;
          }
        } catch (error) {
          result.error = error instanceof Error ? error.message : "Synchronization failed.";
          break;
        }
      }
    } catch (error) {
      result.error = error instanceof Error ? error.message : "Unable to read the offline queue.";
    } finally {
      try { result.pending = queuedSales(ownerId).pending.length; } catch { /* The read error is already reported. */ }
    }
    return result;
  })().finally(() => { activeSync = null; });
  return activeSync;
}
