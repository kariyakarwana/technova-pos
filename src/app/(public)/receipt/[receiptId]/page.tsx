import React from "react";
import type { Metadata } from "next";
import {
  ShieldAlert,
  Store,
  Phone,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Digital Receipt | TechNova POS",
  description: "Cryptographically verified digital sale receipt.",
};

const API_URL =
  process.env.INTERNAL_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:4000/api/v1";

interface ReceiptItem {
  productName?: string;
  name?: string;
  quantity: number;
  unitPrice: number;
  discountAmount?: number;
  total?: number;
  totalPrice?: number;
}

interface PageProps {
  params: Promise<{ receiptId: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function PublicReceiptPage({
  params,
  searchParams,
}: PageProps) {
  const { receiptId } = await params;
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-rose-200 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Missing Security Signature</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            This e-receipt requires a cryptographically signed HMAC token for access. Please use the original secure link sent to your WhatsApp or Email.
          </p>
        </div>
      </div>
    );
  }

  const response = await fetch(
    `${API_URL}/receipts/${encodeURIComponent(receiptId)}?token=${encodeURIComponent(token)}`,
    { cache: "no-store" },
  ).catch(() => null);

  if (!response || !response.ok) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-rose-200 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Access Denied / Expired Receipt</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Security verification failed. The signature token on this URL is invalid or has been tampered with. To prevent unauthorized data exposure, this receipt cannot be displayed.
          </p>
        </div>
      </div>
    );
  }

  const data = await response.json();
  const org = data.organization || {};
  const branch = data.branch || {};
  const snapshot = data.snapshot || {};
  const items = Array.isArray(snapshot.items) ? snapshot.items : [];
  const totals = snapshot.totals || {};
  const currency = org.currencyCode || "USD";

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Receipt Header Banner */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 text-white text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Digital Receipt
          </div>
          <h1 className="text-2xl font-black tracking-tight">{org.name || "TechNova Retail"}</h1>
          <div className="text-xs text-indigo-200 space-y-0.5">
            <p className="flex items-center justify-center gap-1.5">
              <Store className="w-3.5 h-3.5" />
              {branch.name} {branch.code ? `(${branch.code})` : ""}
            </p>
            {branch.phone && (
              <p className="flex items-center justify-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                {branch.phone}
              </p>
            )}
          </div>
        </div>

        {/* Receipt Meta */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 text-xs text-gray-600 space-y-1.5">
          <div className="flex justify-between">
            <span className="text-gray-400">Receipt No:</span>
            <span className="font-mono font-bold text-gray-900">{data.receiptNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Issued On:</span>
            <span>{new Date(data.issuedAt).toLocaleString()}</span>
          </div>
          {snapshot.cashier && (
            <div className="flex justify-between">
              <span className="text-gray-400">Cashier:</span>
              <span className="font-medium text-gray-800">{snapshot.cashier.name || snapshot.cashier.email}</span>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="p-6 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2 flex justify-between">
            <span>Item Description</span>
            <span>Total ({currency})</span>
          </div>
          <div className="divide-y divide-gray-100">
            {(items as ReceiptItem[]).map((item, idx: number) => (
              <div key={idx} className="py-3 flex justify-between items-start text-xs">
                <div>
                  <div className="font-bold text-gray-900">{item.productName || item.name || "Item"}</div>
                  <div className="text-gray-400 text-[11px]">
                    {item.quantity} x {currency} {Number(item.unitPrice || 0).toFixed(2)}
                    {typeof item.discountAmount === "number" && item.discountAmount > 0
                      ? ` (-${currency} ${item.discountAmount.toFixed(2)})`
                      : null}
                  </div>
                </div>
                <div className="font-mono font-bold text-gray-900">
                  {currency} {Number(item.total || item.totalPrice || (item.quantity * item.unitPrice)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Totals Calculation */}
          <div className="border-t-2 border-dashed border-gray-200 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal:</span>
              <span className="font-mono">{currency} {Number(totals.subtotal || totals.subTotal || 0).toFixed(2)}</span>
            </div>
            {totals.taxAmount > 0 && (
              <div className="flex justify-between text-gray-500">
                <span>Tax / VAT:</span>
                <span className="font-mono">{currency} {Number(totals.taxAmount).toFixed(2)}</span>
              </div>
            )}
            {totals.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Total Discount:</span>
                <span className="font-mono">-{currency} {Number(totals.discountAmount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-100">
              <span>Final Paid:</span>
              <span className="font-mono">{currency} {Number(totals.finalTotal || totals.grandTotal || totals.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 text-center space-y-3">
          <p className="text-xs text-gray-500">
            Thank you for shopping with {org.name || "us"}!
          </p>
          <div className="text-[10px] text-gray-400 font-mono">
            Powered by TechNova Multi-Tenant Cloud POS
          </div>
        </div>
      </div>
    </div>
  );
}
