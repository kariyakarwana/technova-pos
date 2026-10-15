import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiPost } from "@/lib/api/client";
import { claimLegacySales, enqueueOfflineSale, queuedSales, synchronizeOfflineSales } from "./offlineSales";

vi.mock("@/lib/api/client", () => ({ apiPost: vi.fn() }));

const request = vi.mocked(apiPost);
const payload = {
  branchId: "branch-1",
  customerId: "customer-1",
  items: [{ productId: "product-1", quantity: 1 }],
  payments: [{ method: "CASH", amount: 100 }],
};

beforeEach(() => {
  const values = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  });
  vi.stubGlobal("window", new EventTarget());
  request.mockReset();
});

describe("offline sale queue", () => {
  it("keeps registered-customer sales associated with the cashier who saved them", () => {
    enqueueOfflineSale("cashier-a", payload, { customer: "C-1 · Ada", total: 100, items: 1 });
    expect(queuedSales("cashier-a").pending[0].payload.customerId).toBe("customer-1");
    expect(queuedSales("cashier-b").pending).toHaveLength(0);
  });

  it("automatically-submittable sales are removed only after server confirmation", async () => {
    const sale = enqueueOfflineSale("cashier-a", payload, { customer: "C-1 · Ada", total: 100, items: 1 });
    request.mockResolvedValue({ operations: [{ clientOperationId: sale.clientOperationId, status: "APPLIED" }] });

    expect(await synchronizeOfflineSales("cashier-a")).toMatchObject({ applied: 1, rejected: 0, pending: 0 });
    expect(request).toHaveBeenCalledWith("/offline-sync/batches", expect.objectContaining({
      clientBatchId: `web-batch-${sale.clientOperationId}`,
      operations: [expect.objectContaining({ payload })],
    }));
    expect(queuedSales("cashier-a").pending).toHaveLength(0);
  });

  it("retries an ambiguous failure with the same batch identifier", async () => {
    const sale = enqueueOfflineSale("cashier-a", payload, { customer: "C-1 · Ada", total: 100, items: 1 });
    request.mockRejectedValueOnce(new Error("Connection lost"));
    expect(await synchronizeOfflineSales("cashier-a")).toMatchObject({ pending: 1, error: "Connection lost" });
    request.mockResolvedValueOnce({ operations: [{ clientOperationId: sale.clientOperationId, status: "APPLIED" }] });
    expect(await synchronizeOfflineSales("cashier-a")).toMatchObject({ applied: 1, pending: 0 });
    expect(request.mock.calls[0][1]).toMatchObject({ clientBatchId: `web-batch-${sale.clientOperationId}` });
    expect(request.mock.calls[1][1]).toMatchObject({ clientBatchId: `web-batch-${sale.clientOperationId}` });
  });

  it("reports rejected operations without claiming they became online sales", async () => {
    const sale = enqueueOfflineSale("cashier-a", payload, { customer: "C-1 · Ada", total: 100, items: 1 });
    request.mockResolvedValue({ operations: [{ clientOperationId: sale.clientOperationId, status: "REJECTED", errorMessage: "Out of stock" }] });
    expect(await synchronizeOfflineSales("cashier-a")).toMatchObject({ applied: 0, rejected: 1, pending: 0 });
    expect(queuedSales("cashier-a").pending).toHaveLength(0);
  });

  it("does not auto-submit legacy sales without an owner", async () => {
    localStorage.setItem("technova_pos_queue", JSON.stringify([{ clientOperationId: "legacy-sale", operationType: "SALE_CREATE", clientTimestamp: new Date().toISOString(), payload }]));
    expect(queuedSales("cashier-a")).toMatchObject({ pending: [], legacyCount: 1 });
    expect(await synchronizeOfflineSales("cashier-a")).toMatchObject({ applied: 0 });
    expect(request).not.toHaveBeenCalled();
    expect(claimLegacySales("cashier-a")).toBe(1);
    expect(queuedSales("cashier-a").pending).toHaveLength(1);
  });
});
