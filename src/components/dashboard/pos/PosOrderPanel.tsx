"use client";

import Link from "next/link";
import {
  Award,
  CreditCard,
  FileText,
  Info,
  Minus,
  Plus,
  Trash2,
  UserPlus,
  Wallet,
} from "lucide-react";
import type { CartItem } from "./pos.mock";

type Customer = {
  id: string;
  customerNumber: string;
  firstName: string;
  lastName: string | null;
  creditLimit: number | string;
  currentBalance: number | string;
  storeCreditAccount: { balance: number | string } | null;
  loyaltyAccount: { points: number | string } | null;
};
type Quote = {
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;
};
type Receipt = { invoiceNumber: string; receiptNumber: string; total: number };
const methods = [
  { value: "CASH", label: "Cash", icon: Wallet },
  { value: "CARD", label: "Card", icon: CreditCard },
  { value: "BANK_TRANSFER", label: "Transfer", icon: FileText },
  { value: "STORE_CREDIT", label: "Credit", icon: Award },
];

interface Props {
  cartItems: CartItem[];
  isOffline: boolean;
  customers: Customer[];
  customerId: string;
  quote: Quote;
  paid: number;
  paymentMethod: string;
  credit: boolean;
  dueDate: string;
  message: string | null;
  receipt: Receipt | null;
  onCustomerChange: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onUpdateSerial: (id: string, serial: string) => void;
  onPaidChange: (amount: number) => void;
  onPaymentMethodChange: (method: string) => void;
  onCreditChange: (enabled: boolean) => void;
  onDueDateChange: (date: string) => void;
  onCheckout: () => void;
}

export function PosOrderPanel(props: Props) {
  const customer = props.customers.find((item) => item.id === props.customerId);
  return (
    <aside
      aria-label="Order and checkout summary"
      className="h-full min-h-0 w-[410px] xl:w-[440px] shrink-0 bg-white border-l border-[#E6EAED] flex flex-col overflow-hidden text-[#212B36] select-none"
    >
      <div className="px-4 pt-3 pb-1 shrink-0">
        {props.isOffline && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FDEDEC] border border-[#F7C2BE] text-[#D32F2F] text-xs font-medium">
            <Info className="h-4 w-4" />
            Sale will be stored and synchronized later.
          </div>
        )}
      </div>
      <div className="flex items-center justify-between px-4 py-2 shrink-0">
        <div>
          <h2 className="text-base font-bold">Order List</h2>
          <p className="text-xs text-slate-400">
            Items - {props.cartItems.length}
          </p>
        </div>
        <button
          type="button"
          onClick={props.onClearCart}
          title="Clear order"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-[#D32F2F] hover:bg-red-50"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
      <div className="px-4 py-2 space-y-2 shrink-0">
        <div className="flex gap-2">
          <select
            value={props.customerId}
            onChange={(event) => props.onCustomerChange(event.target.value)}
            className="flex-1 h-11 px-3 text-sm bg-white border border-[#D9E0E5] rounded-xl outline-none focus:border-[#0E9384]"
          >
            <option value="">Walk-in Customer</option>
            {props.customers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.customerNumber} · {item.firstName} {item.lastName}
              </option>
            ))}
          </select>
          <Link
            href="/customers"
            title="Add customer"
            className="h-11 w-11 rounded-xl bg-[#0E9384] text-white flex items-center justify-center transition-colors hover:bg-[#0B6E63]"
          >
            <UserPlus className="h-5 w-5" />
          </Link>
        </div>
        {customer && (
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-teal-50 p-3 text-xs">
            <span>
              Store credit
              <b className="block">
                LKR{" "}
                {Number(
                  customer.storeCreditAccount?.balance ?? 0,
                ).toLocaleString()}
              </b>
            </span>
            <span>
              Star points
              <b className="block">
                {Number(customer.loyaltyAccount?.points ?? 0).toLocaleString()}
              </b>
            </span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between px-4 pt-3 pb-2 shrink-0">
        <h3 className="text-sm font-bold">Order Details</h3>
        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
          Items - {props.cartItems.length}
        </span>
      </div>
      <div className="grid grid-cols-[1.2fr_64px_92px_70px_28px] px-4 py-2 text-[10px] font-semibold text-slate-400 border-b border-slate-100 shrink-0">
        <span>Product</span>
        <span className="text-center">Price</span>
        <span className="text-center">QTY</span>
        <span className="text-center">Subtotal</span>
        <span />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain divide-y divide-slate-100 px-4">
        {props.cartItems.length === 0 ? (
          <div className="flex h-full min-h-[90px] flex-col items-center justify-center py-4 text-center text-slate-300">
            <p className="text-sm font-semibold">Cart is empty</p>
            <p className="mt-1 text-xs">Select a product or scan a barcode</p>
          </div>
        ) : (
          props.cartItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1.2fr_64px_92px_70px_28px] items-center py-2.5 text-xs"
            >
              <div className="pr-1 min-w-0">
                <p className="font-semibold truncate leading-tight">
                  {item.name}
                </p>
                <p className="text-[10px] text-slate-400">
                  Stock: {item.stockCount}
                </p>
                {item.trackSerials && (
                  <input
                    value={item.serialNumber ?? ""}
                    onChange={(event) =>
                      props.onUpdateSerial(item.id, event.target.value)
                    }
                    placeholder="Serial number"
                    className="mt-1.5 h-8 w-full rounded-lg border px-2 text-xs"
                  />
                )}
              </div>
              <div className="text-center">{item.price.toLocaleString()}</div>
              <div className="flex items-center justify-center">
                <div className="flex items-center rounded-xl border border-slate-200 p-0.5">
                  <button
                    type="button"
                    onClick={() => props.onUpdateQty(item.id, -1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-slate-100"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-7 text-center text-sm font-semibold">
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => props.onUpdateQty(item.id, 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-slate-100"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="text-right font-semibold">
                {(item.price * item.qty).toLocaleString()}
              </div>
              <button
                type="button"
                onClick={() => props.onRemoveItem(item.id)}
                className="flex h-8 w-7 items-center justify-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-[#D32F2F]"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
      <div className="px-4 py-3 border-t border-slate-100 space-y-1.5 text-xs shrink-0">
        <div className="flex justify-between text-slate-500">
          <span>Sub Total</span>
          <b>LKR {props.quote.subtotal.toLocaleString()}</b>
        </div>
        <div className="flex justify-between text-emerald-700">
          <span>Discount</span>
          <b>- LKR {props.quote.discountTotal.toLocaleString()}</b>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Tax</span>
          <b>LKR {props.quote.taxTotal.toLocaleString()}</b>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-slate-200">
          <span className="text-base font-bold">Grand Total</span>
          <b className="text-base text-[#025148]">LKR {props.quote.total.toLocaleString()}</b>
        </div>
      </div>
      <div className="px-4 py-2 grid grid-cols-3 gap-2 shrink-0 text-white text-xs font-semibold">
        <button
          type="button"
          disabled
          title="Hold requires a backend hold-order workflow"
          className="h-11 rounded-xl bg-[#E26D1E] disabled:opacity-45"
        >
          Hold
        </button>
        <button
          type="button"
          onClick={props.onClearCart}
          className="h-11 rounded-xl bg-[#1E6DE2] active:scale-[0.98]"
        >
          Void
        </button>
        <button
          type="button"
          onClick={props.onCheckout}
          className="h-11 rounded-xl bg-[#0E9384] active:scale-[0.98]"
        >
          Payment
        </button>
        <Link
          href="/sales"
          className="flex h-11 items-center justify-center rounded-xl bg-[#0A2540] active:scale-[0.98]"
        >
          View Orders
        </Link>
        <button
          type="button"
          onClick={props.onClearCart}
          className="h-11 rounded-xl bg-[#3852D4] active:scale-[0.98]"
        >
          Reset
        </button>
        <button
          type="button"
          disabled
          title="Use View Orders to inspect transactions"
          className="h-11 rounded-xl bg-[#D32F2F] disabled:opacity-45"
        >
          Transaction
        </button>
      </div>
      <div className="px-4 py-2 shrink-0">
        <p className="text-xs font-bold mb-2">Select Payment</p>
        <div className="grid grid-cols-4 gap-2">
          {methods.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => props.onPaymentMethodChange(value)}
              className={`flex h-14 flex-col items-center justify-center rounded-xl border text-[11px] font-semibold transition-colors ${props.paymentMethod === value ? "border-2 border-[#0E9384] bg-[#EEFFFD] text-[#0E9384]" : "border-[#D9E0E5] hover:border-[#0E9384]"}`}
            >
              <Icon className="h-5 w-5 mb-1" />
              {label}
            </button>
          ))}
        </div>
        <label className="mt-2 block text-[11px] font-semibold text-slate-600">
          {props.credit ? "Down payment (0 for full credit)" : "Amount paid"}
          <input type="number" min="0" max={props.quote.total} value={props.paid} onChange={(event) => props.onPaidChange(Number(event.target.value))} aria-label={props.credit ? "Down payment" : "Amount paid"} className="mt-1.5 h-10 w-full rounded-xl border px-3 text-sm outline-none focus:border-[#0E9384]" />
        </label>
        <label className="mt-2 flex min-h-8 items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={props.credit}
            onChange={(event) => props.onCreditChange(event.target.checked)}
            className="h-4 w-4 accent-[#0E9384]"
          />
          Customer credit purchase
        </label>
        {props.credit && <div className="mt-2 space-y-1.5 rounded-xl bg-amber-50 p-3 text-[11px] text-amber-900">
          <div className="flex justify-between"><span>Credit amount</span><b>LKR {Math.max(0, props.quote.total - props.paid).toLocaleString()}</b></div>
          {customer && <><div className="flex justify-between"><span>Available credit</span><b>LKR {Math.max(0, Number(customer.creditLimit) - Number(customer.currentBalance)).toLocaleString()}</b></div><div className="flex justify-between"><span>Balance after sale</span><b>LKR {(Number(customer.currentBalance) + Math.max(0, props.quote.total - props.paid)).toLocaleString()}</b></div></>}
          <label className="block font-semibold">Final due date<input type="date" value={props.dueDate} onChange={(event) => props.onDueDateChange(event.target.value)} className="mt-1.5 h-10 w-full rounded-xl border bg-white px-3 text-xs" /></label>
        </div>}
      </div>
      {props.message && (
        <p className="mx-4 rounded-xl bg-slate-50 p-3 text-xs">
          {props.message}
        </p>
      )}
      {props.receipt && (
        <p className="mx-4 mt-1 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
          <b>{props.receipt.invoiceNumber}</b> · {props.receipt.receiptNumber}
        </p>
      )}
      <div className="p-4 pt-2 shrink-0 mt-auto">
        <button
          type="button"
          onClick={props.onCheckout}
          disabled={
            !props.cartItems.length ||
            (!props.isOffline && props.quote.total <= 0)
          }
          className="w-full h-12 rounded-xl bg-[#0E9384] text-white text-sm font-bold shadow-sm transition-all hover:bg-[#0B6E63] active:scale-[0.99] disabled:opacity-40"
        >
          {props.isOffline
            ? `Save Offline · LKR ${props.quote.total.toLocaleString()}`
            : `Pay · LKR ${props.quote.total.toLocaleString()}`}
        </button>
      </div>
    </aside>
  );
}

export default PosOrderPanel;
