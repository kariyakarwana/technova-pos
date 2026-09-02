"use client";

import Link from "next/link";
import { useState } from "react";
import { Printer, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { apiPost } from "@/lib/api/client";

export type PurchaseDetail = {
  id: string; orderNumber: string; status: string; total: number | string;
  expectedAt: string | null; notes?: string | null;
  supplier: { name: string; code: string }; branch: { name: string };
  items: Array<{ id: string; quantity: number | string; receivedQuantity: number | string; unitCost: number | string; lineTotal: number | string; product: { sku: string; name: string; trackSerials: boolean } }>;
  receipts: Array<{ id: string; receiptNumber: string; supplierInvoiceNumber?: string | null; notes?: string | null; createdAt: string; labels?: Label[]; hasLegacyLabels?: boolean }>;
};

type Label = { serialNumber: string; qrPayload: string };

export default function PurchaseOrderDetail({ initial }: { initial: PurchaseDetail }) {
  const [order, setOrder] = useState(initial);
  const [receiptNumber, setReceiptNumber] = useState(`GRN-${initial.orderNumber}-${initial.receipts.length + 1}`);
  const [supplierInvoiceNumber, setSupplierInvoiceNumber] = useState("");
  const [receiptNotes, setReceiptNotes] = useState("");
  const [serials, setSerials] = useState<Record<string, string>>(Object.fromEntries(initial.items.map((item) => [item.id, ""])));
  const [labels, setLabels] = useState<Label[]>(initial.receipts.flatMap((receipt) => receipt.labels ?? []));
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function approve() {
    try {
      const result = await apiPost<PurchaseDetail>(`/purchasing/orders/${order.id}/approve`, {});
      setOrder((current) => ({ ...current, status: result.status }));
      setMessage("Purchase order approved.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to approve order."); }
  }

  async function receive() {
    const items = order.items.map((item) => ({
      purchaseOrderItemId: item.id,
      quantity: Number(item.quantity) - Number(item.receivedQuantity),
      serialNumbers: item.product.trackSerials ? (serials[item.id] ?? "").split(/[\n,]/).map((value) => value.trim()).filter(Boolean) : undefined,
    })).filter((item) => item.quantity > 0);
    if (!receiptNumber.trim()) return setMessage("Enter a goods receipt number.");
    setSaving(true);
    try {
      const result = await apiPost<{ labels: Label[] }>(`/purchasing/orders/${order.id}/receipts`, {
        receiptNumber: receiptNumber.trim(), supplierInvoiceNumber: supplierInvoiceNumber.trim() || undefined,
        notes: receiptNotes.trim() || undefined, items,
      });
      setLabels(result.labels ?? []);
      setOrder((current) => ({ ...current, status: "RECEIVED", items: current.items.map((item) => ({ ...item, receivedQuantity: item.quantity })) }));
      setMessage("Stock received. Secure QR labels are ready to print.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to receive stock."); }
    finally { setSaving(false); }
  }

  async function openReceiptLabels(receipt: PurchaseDetail["receipts"][number]) {
    if (receipt.labels?.length) {
      setLabels(receipt.labels);
      setMessage(`${receipt.labels.length} saved label(s) loaded from ${receipt.receiptNumber}.`);
      return;
    }
    if (!receipt.hasLegacyLabels) return setMessage("This receipt has no serialized QR labels.");
    try {
      const result = await apiPost<{ labels: Label[] }>(`/purchasing/orders/${order.id}/receipts/${receipt.id}/reissue-labels`, {});
      setLabels(result.labels);
      setMessage("Legacy QR labels were securely reissued. Previously printed QR codes are now invalid.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to reissue labels."); }
  }

  const input = "mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-[#0E9384]";
  return <main className="space-y-6 bg-[#F8FAFC] p-6">
    <header className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase text-[#0E9384]">Purchasing / Order details</p><h1 className="text-2xl font-bold">{order.orderNumber}</h1><p className="text-sm text-slate-500">{order.supplier.code} · {order.supplier.name} · {order.branch.name}</p></div><div className="flex gap-2"><Link href="/purchases/order-management" className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold">Back</Link>{["DRAFT", "SUBMITTED"].includes(order.status) && <button onClick={() => void approve()} className="rounded-xl bg-[#0E9384] px-4 py-2 text-sm font-semibold text-white">Approve order</button>}</div></header>
    {message && <div className="rounded-xl border border-teal-200 bg-teal-50 p-3 text-sm text-teal-800">{message}</div>}
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Status", order.status.replaceAll("_", " ")], ["Expected", order.expectedAt ? new Date(order.expectedAt).toLocaleDateString() : "Not specified"], ["Receipts", String(order.receipts.length)], ["Order total", `LKR ${Number(order.total).toLocaleString()}`]].map(([label, value]) => <article key={label} className="rounded-2xl border bg-white p-4"><p className="text-xs uppercase text-slate-500">{label}</p><p className="mt-2 font-bold">{value}</p></article>)}</section>
    <section className="overflow-x-auto rounded-2xl border bg-white shadow-sm"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-4">Product</th><th className="p-4">Ordered</th><th className="p-4">Received</th><th className="p-4">Remaining</th><th className="p-4">Unit cost</th><th className="p-4">Total</th></tr></thead><tbody>{order.items.map((item) => <tr key={item.id} className="border-t"><td className="p-4"><b>{item.product.name}</b><small className="block text-slate-500">{item.product.sku}{item.product.trackSerials ? " · Serialized" : ""}</small></td><td className="p-4">{Number(item.quantity)}</td><td className="p-4">{Number(item.receivedQuantity)}</td><td className="p-4">{Number(item.quantity) - Number(item.receivedQuantity)}</td><td className="p-4">{Number(item.unitCost).toLocaleString()}</td><td className="p-4 font-semibold">{Number(item.lineTotal).toLocaleString()}</td></tr>)}</tbody></table></section>
    {["APPROVED", "PARTIALLY_RECEIVED"].includes(order.status) && <section className="space-y-5 rounded-2xl border bg-white p-5"><div><h2 className="font-bold">Receive remaining stock</h2><p className="text-xs text-slate-500">Record supplier documents before inventory is increased.</p></div><div className="grid gap-4 md:grid-cols-2"><label className="text-xs font-semibold">Goods receipt number *<input required value={receiptNumber} onChange={(event) => setReceiptNumber(event.target.value)} className={input} /></label><label className="text-xs font-semibold">Supplier invoice number<input value={supplierInvoiceNumber} onChange={(event) => setSupplierInvoiceNumber(event.target.value)} placeholder="Invoice or delivery note" className={input} /></label></div><label className="block text-xs font-semibold">Receipt notes<textarea value={receiptNotes} onChange={(event) => setReceiptNotes(event.target.value)} placeholder="Condition, shortages or delivery remarks" className="mt-1 min-h-20 w-full rounded-xl border p-3 text-sm" /></label>{order.items.filter((item) => item.product.trackSerials && Number(item.quantity) > Number(item.receivedQuantity)).map((item) => <label key={item.id} className="block text-xs font-semibold">Serial numbers for {item.product.name} ({Number(item.quantity) - Number(item.receivedQuantity)} required)<textarea value={serials[item.id]} onChange={(event) => setSerials((current) => ({ ...current, [item.id]: event.target.value }))} placeholder="One serial per line" className="mt-1 min-h-28 w-full rounded-xl border p-3 text-sm" /></label>)}<button disabled={saving} onClick={() => void receive()} className="rounded-xl bg-[#0E9384] px-5 py-2.5 font-semibold text-white disabled:opacity-50">{saving ? "Receiving..." : "Receive stock and generate QR labels"}</button></section>}
    {order.receipts.length > 0 && <section className="rounded-2xl border bg-white p-5"><h2 className="mb-3 font-bold">Goods receipts</h2><div className="space-y-2">{order.receipts.map((receipt) => <div key={receipt.id} className="grid items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm md:grid-cols-5"><b>{receipt.receiptNumber}</b><span>{receipt.supplierInvoiceNumber ?? "No supplier invoice"}</span><span>{receipt.notes ?? "No notes"}</span><span>{new Date(receipt.createdAt).toLocaleString()}</span><button onClick={() => void openReceiptLabels(receipt)} className="rounded-lg border bg-white px-3 py-2 text-xs font-semibold text-[#0E9384]">{receipt.hasLegacyLabels ? "Reissue QR labels" : "Open QR labels"}</button></div>)}</div></section>}
    {labels.length > 0 && <section className="qr-label-print-root rounded-2xl border bg-white p-5"><div className="qr-label-print-controls flex justify-between"><div><h2 className="flex items-center gap-2 font-bold"><QrCode className="h-5 w-5 text-[#0E9384]" />Secure serialized labels</h2><p className="text-xs text-slate-500">Saved labels can be reopened from their goods receipt at any time.</p></div><button onClick={() => window.print()} className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold"><Printer className="h-4 w-4" />Print labels</button></div><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{labels.map((label) => <article key={label.serialNumber} className="break-inside-avoid rounded-xl border p-4 text-center"><QRCodeSVG value={label.qrPayload} size={150} level="H" marginSize={2} className="mx-auto" /><p className="mt-3 font-mono font-bold">{label.serialNumber}</p><p className="mt-1 break-all text-[9px] text-slate-500">{label.qrPayload}</p></article>)}</div></section>}
    <style jsx global>{`@media print { body * { visibility: hidden !important; } .qr-label-print-root, .qr-label-print-root * { visibility: visible !important; } .qr-label-print-root { position: absolute !important; inset: 0 !important; width: 100% !important; border: 0 !important; box-shadow: none !important; background: white !important; } .qr-label-print-controls { display: none !important; } @page { margin: 10mm; } }`}</style>
  </main>;
}
