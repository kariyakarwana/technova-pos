"use client";

import Link from "next/link";
import { useState } from "react";
import { FileUp, PackageCheck, Send, Truck } from "lucide-react";
import { apiPost } from "@/lib/api/client";

type ResponseRow = {
  id: string;
  status: string;
  reviewStatus: string;
  notes: string | null;
  respondedAt: string;
  lines: Array<{ purchaseOrderItemId: string; proposedQuantity: string | number | null; proposedUnitCost: string | number | null; note: string | null }>;
};

export type SupplierOrderDetail = {
  id: string;
  orderNumber: string;
  status: string;
  total: string | number;
  expectedAt: string | null;
  notes: string | null;
  allowOrderChanges: boolean;
  branch: { name: string; code: string; address?: unknown };
  items: Array<{
    id: string;
    quantity: string | number;
    receivedQuantity: string | number;
    unitCost: string | number;
    lineTotal: string | number;
    product: { sku: string; name: string };
  }>;
  supplierResponses: ResponseRow[];
  supplierShipments: Array<{ id: string; status: string; carrier: string | null; trackingNumber: string | null; expectedArrival: string | null; dispatchedAt: string | null }>;
  supplierInvoices: Array<{ id: string; invoiceNumber: string; fileName: string; mimeType: string; fileSize: number; uploadedAt: string }>;
};

export default function SupplierOrderDetailClient({ initial }: { initial: SupplierOrderDetail }) {
  const [order, setOrder] = useState(initial);
  const [responseType, setResponseType] = useState("ACCEPTED");
  const [responseNotes, setResponseNotes] = useState("");
  const [expectedAt, setExpectedAt] = useState(initial.expectedAt?.slice(0, 10) ?? "");
  const [changes, setChanges] = useState<Record<string, { quantity: string; unitCost: string; note: string }>>(
    Object.fromEntries(initial.items.map((item) => [item.id, { quantity: String(item.quantity), unitCost: String(item.unitCost), note: "" }])),
  );
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [arrival, setArrival] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submitResponse() {
    setBusy(true); setMessage(null);
    try {
      const lines = responseType === "CHANGES_PROPOSED" ? order.items.map((item) => ({
        purchaseOrderItemId: item.id,
        proposedQuantity: Number(changes[item.id].quantity),
        proposedUnitCost: Number(changes[item.id].unitCost),
        note: changes[item.id].note.trim() || undefined,
      })) : undefined;
      const response = await apiPost<ResponseRow>(`/supplier-portal/orders/${order.id}/respond`, {
        status: responseType,
        notes: responseNotes.trim() || undefined,
        proposedExpectedAt: expectedAt ? new Date(`${expectedAt}T12:00:00`).toISOString() : undefined,
        lines,
      });
      setOrder((current) => ({ ...current, supplierResponses: [response, ...current.supplierResponses] }));
      setMessage("Your response was submitted to the purchasing team.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to submit response."); }
    finally { setBusy(false); }
  }

  async function dispatch() {
    setBusy(true); setMessage(null);
    try {
      const shipment = await apiPost<SupplierOrderDetail["supplierShipments"][number]>(`/supplier-portal/orders/${order.id}/dispatch`, {
        carrier: carrier.trim() || undefined,
        trackingNumber: trackingNumber.trim() || undefined,
        expectedArrival: arrival ? new Date(`${arrival}T12:00:00`).toISOString() : undefined,
      });
      setOrder((current) => ({ ...current, supplierShipments: [shipment, ...current.supplierShipments] }));
      setMessage("Dispatch details were sent to the destination branch.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to mark the order dispatched."); }
    finally { setBusy(false); }
  }

  async function uploadInvoice() {
    if (!invoiceNumber.trim() || !invoiceFile) return setMessage("Enter the invoice number and choose an image or PDF.");
    if (invoiceFile.size > 5 * 1024 * 1024) return setMessage("The invoice file must be 5 MB or smaller.");
    setBusy(true); setMessage(null);
    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
        reader.onerror = () => reject(new Error("Unable to read the selected file."));
        reader.readAsDataURL(invoiceFile);
      });
      const invoice = await apiPost<SupplierOrderDetail["supplierInvoices"][number]>(`/supplier-portal/orders/${order.id}/invoices`, {
        invoiceNumber: invoiceNumber.trim(), fileName: invoiceFile.name, mimeType: invoiceFile.type, base64Data,
        shipmentId: order.supplierShipments[0]?.id,
      });
      setOrder((current) => ({ ...current, supplierInvoices: [invoice, ...current.supplierInvoices] }));
      setInvoiceFile(null); setInvoiceNumber("");
      setMessage("Invoice uploaded securely.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to upload invoice."); }
    finally { setBusy(false); }
  }

  const latest = order.supplierResponses[0];
  const canDispatch = latest?.status === "ACCEPTED" || (latest?.status === "CHANGES_PROPOSED" && latest.reviewStatus === "APPROVED");
  const input = "mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#0E9384]";

  return <main className="space-y-6 p-6 lg:p-8">
    <header className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wider text-[#0E9384]">Supplier portal / Purchase order</p><h1 className="mt-1 text-2xl font-bold">{order.orderNumber}</h1><p className="text-sm text-slate-500">Deliver to {order.branch.name} · {order.status.replaceAll("_", " ")}</p></div><Link href="/supplier-dashboard" className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold">Back to orders</Link></header>
    {message && <div role="status" className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-800">{message}</div>}
    <section className="grid gap-4 sm:grid-cols-3">{[["Order total", `LKR ${Number(order.total).toLocaleString()}`], ["Expected delivery", order.expectedAt ? new Date(order.expectedAt).toLocaleDateString() : "Not specified"], ["Your latest response", latest ? `${latest.status.replaceAll("_", " ")} · ${latest.reviewStatus.replaceAll("_", " ")}` : "Awaiting response"]].map(([label, value]) => <article key={label} className="rounded-2xl border bg-white p-5"><p className="text-xs uppercase text-slate-500">{label}</p><p className="mt-2 font-bold">{value}</p></article>)}</section>
    <section className="overflow-x-auto rounded-2xl border bg-white"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-4">Product</th><th className="p-4">Quantity</th><th className="p-4">Unit cost</th><th className="p-4">Line total</th></tr></thead><tbody>{order.items.map((item) => <tr key={item.id} className="border-t"><td className="p-4"><b>{item.product.name}</b><span className="block text-xs text-slate-500">{item.product.sku}</span></td><td className="p-4">{Number(item.quantity)}</td><td className="p-4">{Number(item.unitCost).toLocaleString()}</td><td className="p-4 font-semibold">{Number(item.lineTotal).toLocaleString()}</td></tr>)}</tbody></table></section>
    {order.status === "APPROVED" && <section className="space-y-4 rounded-2xl border bg-white p-5"><div><h2 className="flex items-center gap-2 font-bold"><Send className="h-4 w-4 text-[#0E9384]" />Respond to purchase order</h2><p className="text-sm text-slate-500">Accept as issued, propose changes for approval, request clarification, or reject with a reason.</p></div><div className="grid gap-4 md:grid-cols-2"><label className="text-xs font-semibold">Response<select value={responseType} onChange={(event) => setResponseType(event.target.value)} className={input}><option value="ACCEPTED">Accept as issued</option>{order.allowOrderChanges && <option value="CHANGES_PROPOSED">Accept with proposed changes</option>}<option value="CLARIFICATION_REQUESTED">Request clarification</option><option value="REJECTED">Reject order</option></select></label><label className="text-xs font-semibold">Proposed delivery date<input type="date" value={expectedAt} onChange={(event) => setExpectedAt(event.target.value)} className={input} /></label></div>{responseType === "CHANGES_PROPOSED" && <div className="space-y-3 rounded-xl bg-slate-50 p-4">{order.items.map((item) => <div key={item.id} className="grid gap-3 md:grid-cols-[1fr_130px_150px_1fr]"><b className="self-center text-sm">{item.product.name}</b><input type="number" min="0.001" step="0.001" aria-label={`${item.product.name} quantity`} value={changes[item.id].quantity} onChange={(event) => setChanges((current) => ({ ...current, [item.id]: { ...current[item.id], quantity: event.target.value } }))} className="h-10 rounded-lg border px-3 text-sm" /><input type="number" min="0" step="0.01" aria-label={`${item.product.name} unit cost`} value={changes[item.id].unitCost} onChange={(event) => setChanges((current) => ({ ...current, [item.id]: { ...current[item.id], unitCost: event.target.value } }))} className="h-10 rounded-lg border px-3 text-sm" /><input aria-label={`${item.product.name} change note`} value={changes[item.id].note} onChange={(event) => setChanges((current) => ({ ...current, [item.id]: { ...current[item.id], note: event.target.value } }))} placeholder="Reason for change" className="h-10 rounded-lg border px-3 text-sm" /></div>)}</div>}<label className="block text-xs font-semibold">Notes<textarea value={responseNotes} onChange={(event) => setResponseNotes(event.target.value)} className="mt-1 min-h-24 w-full rounded-xl border p-3 text-sm" placeholder="Availability, reason, or clarification needed" /></label><button disabled={busy} onClick={() => void submitResponse()} className="rounded-xl bg-[#0E9384] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Submit response</button></section>}
    {canDispatch && order.status === "APPROVED" && <section className="space-y-4 rounded-2xl border bg-white p-5"><h2 className="flex items-center gap-2 font-bold"><Truck className="h-4 w-4 text-[#0E9384]" />Dispatch shipment</h2><div className="grid gap-4 md:grid-cols-3"><label className="text-xs font-semibold">Carrier<input value={carrier} onChange={(event) => setCarrier(event.target.value)} className={input} placeholder="Courier or transport provider" /></label><label className="text-xs font-semibold">Tracking / vehicle reference<input value={trackingNumber} onChange={(event) => setTrackingNumber(event.target.value)} className={input} /></label><label className="text-xs font-semibold">Expected arrival<input type="date" value={arrival} onChange={(event) => setArrival(event.target.value)} className={input} /></label></div><button disabled={busy} onClick={() => void dispatch()} className="rounded-xl bg-[#092C4C] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Mark as dispatched</button></section>}
    <section className="space-y-4 rounded-2xl border bg-white p-5"><h2 className="flex items-center gap-2 font-bold"><FileUp className="h-4 w-4 text-[#0E9384]" />Invoice or bill</h2><div className="grid gap-4 md:grid-cols-2"><label className="text-xs font-semibold">Invoice number<input value={invoiceNumber} onChange={(event) => setInvoiceNumber(event.target.value)} className={input} /></label><label className="text-xs font-semibold">Image or PDF (maximum 5 MB)<input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={(event) => setInvoiceFile(event.target.files?.[0] ?? null)} className={`${input} py-2`} /></label></div><button disabled={busy} onClick={() => void uploadInvoice()} className="rounded-xl bg-[#0E9384] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Upload invoice</button>{order.supplierInvoices.length > 0 && <div className="space-y-2">{order.supplierInvoices.map((invoice) => <a key={invoice.id} target="_blank" rel="noreferrer" href={`/api/backend/supplier-portal/invoices/${invoice.id}/file`} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm text-[#0E9384]"><span><b>{invoice.invoiceNumber}</b> · {invoice.fileName}</span><span>{Math.ceil(invoice.fileSize / 1024)} KB</span></a>)}</div>}</section>
    {order.supplierShipments.length > 0 && <section className="rounded-2xl border bg-white p-5"><h2 className="mb-3 flex items-center gap-2 font-bold"><PackageCheck className="h-4 w-4 text-[#0E9384]" />Shipment history</h2>{order.supplierShipments.map((shipment) => <div key={shipment.id} className="grid gap-2 rounded-xl bg-slate-50 p-3 text-sm md:grid-cols-4"><b>{shipment.status}</b><span>{shipment.carrier ?? "Carrier not recorded"}</span><span>{shipment.trackingNumber ?? "No tracking reference"}</span><span>{shipment.dispatchedAt ? new Date(shipment.dispatchedAt).toLocaleString() : "Preparing"}</span></div>)}</section>}
  </main>;
}
