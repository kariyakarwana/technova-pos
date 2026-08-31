"use client";

import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingCart, AlertCircle } from "lucide-react";
import type { CartItem } from "./pos.mock";

interface PosCartDrawerProps {
  cartItems: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

type PaymentMethod = "cash" | "card" | "points" | "deposit" | "cheque";

const SHIPPING = 25;
const TAX_RATE = 0.05;

const PAYMENT_METHODS: { id: PaymentMethod; label: string }[] = [
  { id: "cash",    label: "Cash"    },
  { id: "card",    label: "Card"    },
  { id: "points",  label: "Points"  },
  { id: "deposit", label: "Deposit" },
  { id: "cheque",  label: "Cheque"  },
];

const QUICK_ACTIONS = [
  { label: "Hold",        bg: "#F59E0B" },
  { label: "Void",        bg: "#0E9384" },
  { label: "Payment",     bg: "#1E3A5F" },
  { label: "View Orders", bg: "#0E9384" },
  { label: "Reset",       bg: "#3B82F6" },
  { label: "Transaction", bg: "#BA1A1A" },
];

export default function PosCartDrawer({
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}: PosCartDrawerProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const tax = subtotal * TAX_RATE;
  const grandTotal = Math.max(0, subtotal + SHIPPING + tax - couponDiscount);

  const today = new Date().toISOString().split("T")[0];
  const txnId = "885505";

  return (
    <aside className="w-[360px] shrink-0 bg-white border-l border-[var(--brand-stroke)] flex flex-col overflow-hidden">

      {/* ── Header ── */}
      <div className="px-4 pt-3 pb-2 border-b border-[var(--brand-stroke)] space-y-2 shrink-0">

        {/* Title row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[var(--brand-black-font)]">Order List</span>
            <span className="text-[10px] text-slate-400">Transaction #: {txnId}</span>
          </div>
          <span className="h-2.5 w-2.5 rounded-full bg-red-500 shrink-0" title="Offline" />
        </div>

        {/* Offline warning */}
        <div className="flex items-center gap-1.5 text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
          <AlertCircle className="h-3 w-3 text-amber-500 shrink-0" aria-hidden="true" />
          Receipts will print. Sync pending connection.
        </div>

        {/* Date + ref */}
        <div className="flex gap-2">
          <input
            type="date"
            defaultValue={today}
            className="flex-1 h-7 rounded-md border border-[var(--brand-stroke)] text-[10px] px-2 text-[var(--brand-black-font)] bg-white focus:outline-none focus:border-[var(--brand-green)]"
          />
          <input
            type="text"
            placeholder="Tare Ref Number"
            className="flex-1 h-7 rounded-md border border-[var(--brand-stroke)] text-[10px] px-2 placeholder:text-slate-300 focus:outline-none focus:border-[var(--brand-green)]"
          />
          <select className="w-24 h-7 rounded-md border border-[var(--brand-stroke)] text-[10px] px-1 bg-white focus:outline-none focus:border-[var(--brand-green)]">
            <option>Select Shop</option>
            <option>Branch 1</option>
            <option>Branch 2</option>
          </select>
        </div>

        {/* Customer + currency */}
        <div className="flex gap-2">
          <select className="flex-1 h-7 rounded-md border border-[var(--brand-stroke)] text-[10px] px-2 bg-white focus:outline-none focus:border-[var(--brand-green)]">
            <option>Walk in Customer</option>
            <option>John Smith</option>
            <option>Jane Doe</option>
          </select>
          <select className="w-14 h-7 rounded-md border border-[var(--brand-stroke)] text-[10px] px-1 bg-white focus:outline-none focus:border-[var(--brand-green)]">
            <option>USD</option>
            <option>LKR</option>
            <option>EUR</option>
          </select>
          <input
            type="text"
            placeholder="Currency Exchange Rate"
            className="flex-1 h-7 rounded-md border border-[var(--brand-stroke)] text-[10px] px-2 placeholder:text-slate-300 focus:outline-none focus:border-[var(--brand-green)]"
          />
        </div>
      </div>

      {/* ── Order details header ── */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-slate-50 border-b border-[var(--brand-stroke)] shrink-0">
        <span className="text-[11px] font-semibold text-[var(--brand-black-font)]">Order Details</span>
        <span className="text-[10px] text-[var(--brand-green)] cursor-pointer hover:underline">Home &rsaquo;</span>
      </div>

      {/* ── Cart items (scrollable) ── */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
            <ShoppingCart className="h-8 w-8 text-slate-200" aria-hidden="true" />
            <p className="text-xs font-medium">Cart is empty</p>
            <p className="text-[10px] text-slate-300">Click a product to add it</p>
          </div>
        ) : (
          <>
            {/* Column labels */}
            <div className="grid grid-cols-[1fr_52px_72px_52px_20px] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-slate-400 border-b border-[var(--brand-stroke)]">
              <span>Product</span>
              <span className="text-right">Price</span>
              <span className="text-center">QTY</span>
              <span className="text-right">Total</span>
              <span />
            </div>

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[1fr_52px_72px_52px_20px] items-center gap-0.5 px-3 py-2 border-b border-[var(--brand-stroke)] last:border-0"
              >
                {/* Name */}
                <div className="min-w-0 pr-1">
                  <p className="text-[10px] font-semibold text-[var(--brand-black-font)] truncate">{item.name}</p>
                  <p className="text-[9px] text-slate-400">In Stock: {item.stockCount}</p>
                </div>

                {/* Price */}
                <span className="text-[10px] text-slate-600 text-right">${item.price}</span>

                {/* QTY controls */}
                <div className="flex items-center justify-center gap-1">
                  <button
                    onClick={() => onUpdateQty(item.id, -1)}
                    className="h-5 w-5 rounded border border-[var(--brand-stroke)] flex items-center justify-center text-slate-400 hover:border-[var(--brand-green)] hover:text-[var(--brand-green)] transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-2.5 w-2.5" />
                  </button>
                  <span className="w-5 text-center text-[10px] font-bold text-[var(--brand-black-font)]">{item.qty}</span>
                  <button
                    onClick={() => onUpdateQty(item.id, 1)}
                    className="h-5 w-5 rounded border border-[var(--brand-stroke)] flex items-center justify-center text-slate-400 hover:border-[var(--brand-green)] hover:text-[var(--brand-green)] transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-2.5 w-2.5" />
                  </button>
                </div>

                {/* Sub-total */}
                <span className="text-[10px] font-semibold text-[var(--brand-black-font)] text-right">
                  ${(item.price * item.qty).toFixed(0)}
                </span>

                {/* Delete */}
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      {/* ── Financial breakdown ── */}
      <div className="border-t border-[var(--brand-stroke)] px-4 py-2.5 space-y-1.5 shrink-0">
        {[
          { label: "Sub total",  value: `$${subtotal.toFixed(2)}` },
          { label: "Shipping",   value: `$${SHIPPING.toFixed(2)}`  },
          { label: "Tax (5%)",   value: `$${tax.toFixed(2)}`       },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between text-[11px] text-slate-500">
            <span>{label}</span>
            <span className="font-medium text-[var(--brand-black-font)]">{value}</span>
          </div>
        ))}

        {/* Coupon row */}
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>Coupon ↑</span>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-400">$</span>
            <input
              type="number"
              min={0}
              value={couponDiscount}
              onChange={(e) => setCouponDiscount(Math.max(0, Number(e.target.value)))}
              className="w-16 h-5 text-right text-[10px] border border-[var(--brand-stroke)] rounded px-1 focus:outline-none focus:border-[var(--brand-green)]"
            />
          </div>
        </div>

        <div className="flex justify-between text-[11px] text-slate-500">
          <span>Discount ↑</span>
          <span className="font-medium text-[var(--brand-black-font)]">
            -${couponDiscount.toFixed(2)}
          </span>
        </div>

        {/* Grand Total */}
        <div className="flex justify-between items-center pt-1 border-t border-[var(--brand-stroke)] text-sm font-bold text-[var(--brand-black-font)]">
          <span>Grand Total</span>
          <span className="text-[var(--brand-green)]">${grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* ── Quick Actions (2 × 3 grid) ── */}
      <div className="px-3 pb-2 grid grid-cols-3 gap-1.5 shrink-0">
        {QUICK_ACTIONS.map(({ label, bg }) => (
          <button
            key={label}
            type="button"
            onClick={() => {
              if (label === "Reset") {
                onClearCart();
              }
            }}
            className="h-8 rounded-lg text-white text-[10px] font-semibold transition-opacity hover:opacity-85 active:scale-[0.97]"
            style={{ backgroundColor: bg }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Payment Methods ── */}
      <div className="px-3 pb-2 shrink-0">
        <p className="text-[10px] font-semibold text-slate-500 mb-1.5">Select Payment</p>
        <div className="flex gap-1.5">
          {PAYMENT_METHODS.map((pm) => (
            <button
              key={pm.id}
              onClick={() => setPaymentMethod(pm.id)}
              className={[
                "flex-1 h-8 rounded-lg text-[10px] font-semibold border transition-all duration-150",
                paymentMethod === pm.id
                  ? "bg-[var(--brand-green)] text-white border-[var(--brand-green)] shadow-sm"
                  : "bg-white text-slate-500 border-[var(--brand-stroke)] hover:border-[var(--brand-green)] hover:text-[var(--brand-green)]",
              ].join(" ")}
            >
              {pm.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Pay CTA ── */}
      <div className="px-3 pb-4 shrink-0">
        <button
          className="w-full h-11 rounded-xl bg-[var(--brand-green)] text-white text-sm font-bold tracking-wide hover:opacity-90 active:scale-[0.98] transition-all duration-150 shadow-sm"
        >
          Pay : ${grandTotal.toFixed(2)} (Offline)
        </button>
      </div>
    </aside>
  );
}
