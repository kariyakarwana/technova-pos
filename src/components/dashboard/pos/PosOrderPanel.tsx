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
      className="w-[370px] shrink-0 bg-white border-l border-[#E6EAED] flex flex-col h-full overflow-y-auto text-[#212B36] select-none"
    >
      <div className="p-3 pb-1 shrink-0">
        {props.isOffline && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FDEDEC] border border-[#F7C2BE] text-[#D32F2F] text-[11px] font-medium">
            <Info className="h-3.5 w-3.5" />
            Sale will be stored and synchronized later.
          </div>
        )}
      </div>
      <div className="flex items-center justify-between px-3.5 py-1.5 shrink-0">
        <div>
          <h2 className="text-xs font-bold">Order List</h2>
          <p className="text-[10px] text-slate-400">
            Items - {props.cartItems.length}
          </p>
        </div>
        <button
          type="button"
          onClick={props.onClearCart}
          title="Clear order"
          className="p-1 text-[#D32F2F] hover:bg-red-50 rounded"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="px-3.5 py-1.5 space-y-1.5 shrink-0">
        <div className="flex gap-1.5">
          <select
            value={props.customerId}
            onChange={(event) => props.onCustomerChange(event.target.value)}
            className="flex-1 h-7 px-2 text-[10px] bg-white border border-[#E6EAED] rounded-md"
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
            className="h-7 w-7 rounded-md bg-[#0E9384] text-white flex items-center justify-center"
          >
            <UserPlus className="h-3.5 w-3.5" />
          </Link>
        </div>
        {customer && (
          <div className="grid grid-cols-2 gap-1.5 rounded-md bg-teal-50 p-2 text-[9px]">
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
      <div className="flex items-center justify-between px-3.5 pt-2 pb-1 shrink-0">
        <h3 className="text-[11px] font-bold">Order Details</h3>
        <span className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          Items - {props.cartItems.length}
        </span>
      </div>
      <div className="grid grid-cols-[1.2fr_48px_60px_55px_18px] px-3.5 py-1 text-[9px] font-semibold text-slate-400 border-b border-slate-100 shrink-0">
        <span>Product</span>
        <span className="text-center">Price</span>
        <span className="text-center">QTY</span>
        <span className="text-center">Subtotal</span>
        <span />
      </div>
      <div className="flex-1 min-h-[140px] max-h-[220px] overflow-y-auto divide-y divide-slate-100 px-3.5">
        {props.cartItems.length === 0 ? (
          <div className="py-8 text-center text-slate-300">
            <p className="text-xs font-medium">Cart is empty</p>
            <p className="text-[10px]">Select a product or scan a barcode</p>
          </div>
        ) : (
          props.cartItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1.2fr_48px_60px_55px_18px] items-center py-2 text-[10px]"
            >
              <div className="pr-1 min-w-0">
                <p className="font-semibold truncate leading-tight">
                  {item.name}
                </p>
                <p className="text-[9px] text-slate-400">
                  Stock: {item.stockCount}
                </p>
                {item.trackSerials && (
                  <input
                    value={item.serialNumber ?? ""}
                    onChange={(event) =>
                      props.onUpdateSerial(item.id, event.target.value)
                    }
                    placeholder="Serial number"
                    className="mt-1 h-5 w-full rounded border px-1 text-[9px]"
                  />
                )}
              </div>
              <div className="text-center">{item.price.toLocaleString()}</div>
              <div className="flex items-center justify-center">
                <div className="flex items-center border border-slate-200 rounded-full px-1 py-0.5">
                  <button
                    type="button"
                    onClick={() => props.onUpdateQty(item.id, -1)}
                  >
                    <Minus className="h-2 w-2" />
                  </button>
                  <span className="w-5 text-center font-semibold">
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => props.onUpdateQty(item.id, 1)}
                  >
                    <Plus className="h-2 w-2" />
                  </button>
                </div>
              </div>
              <div className="text-right font-semibold">
                {(item.price * item.qty).toLocaleString()}
              </div>
              <button
                type="button"
                onClick={() => props.onRemoveItem(item.id)}
                className="text-slate-300 hover:text-[#D32F2F]"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))
        )}
      </div>
      <div className="px-3.5 py-2 border-t border-slate-100 space-y-1 text-[11px] shrink-0">
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
        <div className="flex justify-between items-center pt-1.5 border-t border-slate-200">
          <span className="text-xs font-bold">Grand Total</span>
          <b className="text-xs">LKR {props.quote.total.toLocaleString()}</b>
        </div>
      </div>
      <div className="px-3 py-1.5 grid grid-cols-3 gap-1.5 shrink-0 text-white text-[11px] font-semibold">
        <button
          type="button"
          disabled
          title="Hold requires a backend hold-order workflow"
          className="h-7 rounded-md bg-[#E26D1E] disabled:opacity-45"
        >
          Hold
        </button>
        <button
          type="button"
          onClick={props.onClearCart}
          className="h-7 rounded-md bg-[#1E6DE2]"
        >
          Void
        </button>
        <button
          type="button"
          onClick={props.onCheckout}
          className="h-7 rounded-md bg-[#0E9384]"
        >
          Payment
        </button>
        <Link
          href="/sales"
          className="flex h-7 items-center justify-center rounded-md bg-[#0A2540]"
        >
          View Orders
        </Link>
        <button
          type="button"
          onClick={props.onClearCart}
          className="h-7 rounded-md bg-[#3852D4]"
        >
          Reset
        </button>
        <button
          type="button"
          disabled
          title="Use View Orders to inspect transactions"
          className="h-7 rounded-md bg-[#D32F2F] disabled:opacity-45"
        >
          Transaction
        </button>
      </div>
      <div className="px-3 py-1.5 shrink-0">
        <p className="text-[10px] font-semibold mb-1">Select Payment</p>
        <div className="grid grid-cols-4 gap-1">
          {methods.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => props.onPaymentMethodChange(value)}
              className={`flex flex-col items-center justify-center py-1 rounded-lg border text-[9px] font-semibold ${props.paymentMethod === value ? "border-2 border-[#0E9384] bg-[#EEFFFD] text-[#0E9384]" : "border-[#E6EAED]"}`}
            >
              <Icon className="h-3.5 w-3.5 mb-0.5" />
              {label}
            </button>
          ))}
        </div>
        <label className="mt-1.5 block text-[9px] font-semibold text-slate-500">
          {props.credit ? "Down payment (0 for full credit)" : "Amount paid"}
          <input type="number" min="0" max={props.quote.total} value={props.paid} onChange={(event) => props.onPaidChange(Number(event.target.value))} aria-label={props.credit ? "Down payment" : "Amount paid"} className="mt-1 h-7 w-full rounded-md border px-2 text-[10px]" />
        </label>
        <label className="mt-1.5 flex items-center gap-1.5 text-[10px]">
          <input
            type="checkbox"
            checked={props.credit}
            onChange={(event) => props.onCreditChange(event.target.checked)}
          />
          Customer credit purchase
        </label>
        {props.credit && <div className="mt-1 space-y-1 rounded-md bg-amber-50 p-2 text-[9px] text-amber-900">
          <div className="flex justify-between"><span>Credit amount</span><b>LKR {Math.max(0, props.quote.total - props.paid).toLocaleString()}</b></div>
          {customer && <><div className="flex justify-between"><span>Available credit</span><b>LKR {Math.max(0, Number(customer.creditLimit) - Number(customer.currentBalance)).toLocaleString()}</b></div><div className="flex justify-between"><span>Balance after sale</span><b>LKR {(Number(customer.currentBalance) + Math.max(0, props.quote.total - props.paid)).toLocaleString()}</b></div></>}
          <label className="block font-semibold">Final due date<input type="date" value={props.dueDate} onChange={(event) => props.onDueDateChange(event.target.value)} className="mt-1 h-7 w-full rounded-md border bg-white px-2 text-[10px]" /></label>
        </div>}
      </div>
      {props.message && (
        <p className="mx-3 rounded-lg bg-slate-50 p-2 text-[10px]">
          {props.message}
        </p>
      )}
      {props.receipt && (
        <p className="mx-3 mt-1 rounded-lg bg-emerald-50 p-2 text-[10px] text-emerald-800">
          <b>{props.receipt.invoiceNumber}</b> · {props.receipt.receiptNumber}
        </p>
      )}
      <div className="p-3 pt-1 shrink-0 mt-auto">
        <button
          type="button"
          onClick={props.onCheckout}
          disabled={
            !props.cartItems.length ||
            (!props.isOffline && props.quote.total <= 0)
          }
          className="w-full h-9 rounded-xl bg-[#0E9384] text-white text-xs font-bold disabled:opacity-40"
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
