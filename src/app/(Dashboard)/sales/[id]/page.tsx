import Link from "next/link";
import { serverApi } from "@/lib/api/server";

type Warranty = {
  status: string;
  activatedAt: string | null;
  startsAt: string | null;
  endsAt: string | null;
  warrantyPolicy: {
    name: string;
    durationMonths: number;
    terms: string | null;
  };
};

type SaleItem = {
  id: string;
  quantity: string | number;
  unitPrice: string | number;
  discountTotal: string | number;
  lineTotal: string | number;
  product: { sku: string; name: string };
  inventoryUnit: { id: string; serialNumber: string } | null;
  warranty: Warranty | null;
};

type Sale = {
  invoiceNumber: string;
  status: string;
  subtotal: string | number;
  discountTotal: string | number;
  taxTotal: string | number;
  total: string | number;
  paidTotal: string | number;
  balanceDue: string | number;
  branch: { name: string };
  customer: { firstName: string; lastName: string | null } | null;
  items: SaleItem[];
  payments: Array<{ id: string; method: string; amount: string | number }>;
  receipt: { receiptNumber: string } | null;
};

function formatDate(value: string | null) {
  return value
    ? new Intl.DateTimeFormat("en-LK", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(value))
    : "—";
}

function warrantyStatusClass(status: string) {
  if (status === "ACTIVE") return "bg-emerald-50 text-emerald-700";
  if (status === "EXPIRED") return "bg-amber-50 text-amber-700";
  if (status === "VOID") return "bg-rose-50 text-rose-700";
  return "bg-slate-100 text-slate-700";
}

export default async function SaleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sale = await serverApi<Sale>(`/sales/${id}`);
  const serializedItems = sale.items.filter(
    (item): item is SaleItem & { inventoryUnit: NonNullable<SaleItem["inventoryUnit"]> } =>
      Boolean(item.inventoryUnit),
  );

  return (
    <main className="space-y-6 p-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#0E9384]">
            {sale.receipt?.receiptNumber ?? "Sale"}
          </p>
          <h1 className="text-2xl font-bold">{sale.invoiceNumber}</h1>
          <p className="text-sm text-slate-500">
            {sale.branch.name} · {sale.customer
              ? `${sale.customer.firstName} ${sale.customer.lastName ?? ""}`
              : "Walk-in"}
          </p>
        </div>
        <Link href="/sales" className="rounded-xl border px-4 py-2 text-sm font-semibold">
          Back
        </Link>
      </div>

      <section className="overflow-x-auto rounded-2xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Serial</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Discount</th>
              <th className="px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sale.items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3">
                  {item.product.name}
                  <p className="text-xs text-slate-500">{item.product.sku}</p>
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  {item.inventoryUnit ? (
                    <Link
                      href={`/inventory/serialized/${item.inventoryUnit.id}`}
                      className="text-[#0E9384] hover:underline"
                    >
                      {item.inventoryUnit.serialNumber}
                    </Link>
                  ) : "—"}
                </td>
                <td className="px-4 py-3">{Number(item.quantity)}</td>
                <td className="px-4 py-3">{Number(item.unitPrice).toLocaleString()}</td>
                <td className="px-4 py-3">{Number(item.discountTotal).toLocaleString()}</td>
                <td className="px-4 py-3 font-semibold">{Number(item.lineTotal).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {serializedItems.length > 0 && (
        <section className="rounded-2xl border bg-white p-5">
          <div className="mb-4">
            <h2 className="font-bold">Warranty coverage</h2>
            <p className="mt-1 text-xs text-slate-500">
              Coverage starts automatically when this sale is completed.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {serializedItems.map((item) => (
              <article key={item.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{item.product.name}</p>
                    <Link
                      href={`/inventory/serialized/${item.inventoryUnit.id}`}
                      className="font-mono text-xs text-[#0E9384] hover:underline"
                    >
                      {item.inventoryUnit.serialNumber}
                    </Link>
                  </div>
                  {item.warranty && (
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${warrantyStatusClass(item.warranty.status)}`}>
                      {item.warranty.status.replaceAll("_", " ")}
                    </span>
                  )}
                </div>
                {item.warranty ? (
                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-slate-500">Policy</p>
                      <p className="font-medium">{item.warranty.warrantyPolicy.name}</p>
                      <p className="text-xs text-slate-500">
                        {item.warranty.warrantyPolicy.durationMonths} months
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Started</p>
                      <p className="font-medium">{formatDate(item.warranty.startsAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Ends</p>
                      <p className="font-medium">{formatDate(item.warranty.endsAt)}</p>
                    </div>
                    {item.warranty.warrantyPolicy.terms && (
                      <p className="text-xs text-slate-500 sm:col-span-3">
                        {item.warranty.warrantyPolicy.terms}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
                    No warranty policy was assigned when this item was sold.
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border bg-white p-5">
          <h2 className="mb-3 font-bold">Payments</h2>
          {sale.payments.map((payment) => (
            <div key={payment.id} className="flex justify-between border-b py-2 text-sm">
              <span>{payment.method.replaceAll("_", " ")}</span>
              <span>{Number(payment.amount).toLocaleString()}</span>
            </div>
          ))}
        </section>
        <section className="space-y-2 rounded-2xl border bg-white p-5 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{Number(sale.subtotal).toLocaleString()}</span></div>
          <div className="flex justify-between text-emerald-700"><span>Discount</span><span>-{Number(sale.discountTotal).toLocaleString()}</span></div>
          <div className="flex justify-between"><span>Tax</span><span>{Number(sale.taxTotal).toLocaleString()}</span></div>
          <div className="flex justify-between border-t pt-3 text-lg font-bold"><span>Total</span><span>{Number(sale.total).toLocaleString()}</span></div>
          <div className="flex justify-between text-rose-600"><span>Balance due</span><span>{Number(sale.balanceDue).toLocaleString()}</span></div>
        </section>
      </div>
    </main>
  );
}
