import { afterEach, describe, expect, it, vi } from "vitest";
import { apiGet, apiPatch, apiPost } from "./client";

const response = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

describe("critical authenticated API workflows", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("uses the protected proxy for sales, credit, returns, warranty and reports", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response({ id: "sale-1", creditAgreement: { id: "credit-1" } }, 201))
      .mockResolvedValueOnce(response({ id: "payment-1", outstandingBalance: 50000 }, 201))
      .mockResolvedValueOnce(response({ id: "return-1" }, 201))
      .mockResolvedValueOnce(response({ id: "policy-1", name: "12 months" }, 201))
      .mockResolvedValueOnce(response({ id: "policy-1", name: "24 months" }))
      .mockResolvedValueOnce(response([{ invoiceNumber: "INV-1", total: 125000 }]));
    vi.stubGlobal("fetch", fetchMock);
    await apiPost("/sales", { branchId: "branch-1", items: [], payments: [] });
    await apiPost("/credit/agreements/credit-1/payments", { amount: 50000, method: "CASH" });
    await apiPost("/returns", { saleId: "sale-1", items: [] });
    await apiPost("/warranties/policies", { productId: "product-1", name: "12 months", durationMonths: 12 });
    await apiPatch("/warranties/policies/policy-1", { name: "24 months", durationMonths: 24 });
    await apiGet("/reports/sales?from=2026-09-01&to=2026-09-30");
    expect(fetchMock).toHaveBeenCalledTimes(6);
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      "/api/backend/sales", "/api/backend/credit/agreements/credit-1/payments", "/api/backend/returns", "/api/backend/warranties/policies", "/api/backend/warranties/policies/policy-1", "/api/backend/reports/sales?from=2026-09-01&to=2026-09-30",
    ]);
    expect(fetchMock.mock.calls.every(([, options]) => options.credentials === "same-origin")).toBe(true);
  });
  it("surfaces backend validation errors", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response({ message: ["amount must be positive"] }, 400)));
    await expect(apiPost("/credit/agreements/credit-1/payments", { amount: 0 })).rejects.toMatchObject({ status: 400, message: "amount must be positive" });
  });
});
