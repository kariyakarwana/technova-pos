import { useState } from "react";
import {
  Award,
  Calendar,
  ChevronDown,
  CreditCard,
  FileText,
  Info,
  Minus,
  Pencil,
  Plus,
  Trash2,
  UserPlus,
  Wallet,
  Coins,
} from "lucide-react";
import type { CartItem } from "./pos.mock";

type PaymentMethod = "cash" | "card" | "points" | "deposit" | "cheque";

interface PosOrderPanelProps {
  cartItems: CartItem[];
  isOffline: boolean;
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onUpdateBatch?: (id: string, batchNo: string) => void;
}

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: typeof Coins }[] = [
  { id: "cash", label: "Cash", icon: Coins },
  { id: "card", label: "Card", icon: CreditCard },
  { id: "points", label: "Points", icon: Award },
  { id: "deposit", label: "Deposit", icon: Wallet },
  { id: "cheque", label: "Cheque", icon: FileText },
];

export function PosOrderPanel({
  cartItems,
  isOffline,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onUpdateBatch,
}: PosOrderPanelProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [shipping] = useState(35);
  const [tax] = useState(25);
  const [coupon] = useState(25);
  const [discount] = useState(24);

  const itemsSubtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const subtotal = itemsSubtotal > 0 ? itemsSubtotal : 1250;
  const grandTotal = Math.max(0, subtotal + shipping + tax - coupon - discount);

  return (
    <aside
      aria-label="Order and checkout summary"
      className="w-[370px] shrink-0 bg-white border-l border-[#E6EAED] flex flex-col h-full overflow-y-auto text-[#212B36] select-none"
    >
      {/* ── Top Warning Note ── */}
      <div className="p-3 pb-1 shrink-0">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FDEDEC] border border-[#F7C2BE] text-[#D32F2F] text-[11px] font-medium">
          <Info className="h-3.5 w-3.5 shrink-0" />
          <span>Receipts will print. Sync pending connection.</span>
        </div>
      </div>

      {/* ── Order List Header ── */}
      <div className="flex items-center justify-between px-3.5 py-1.5 shrink-0">
        <div>
          <h2 className="text-xs font-bold text-[#212B36]">Order List</h2>
          <p className="text-[10px] text-slate-400 font-normal">
            Transaction id : #65565
          </p>
        </div>
        <button
          type="button"
          onClick={onClearCart}
          title="Clear all items"
          className="p-1 text-[#D32F2F] hover:bg-red-50 rounded transition-colors cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* ── Customer & Order Form Inputs ── */}
      <div className="px-3.5 py-1.5 space-y-1.5 shrink-0">
        {/* Row 1: Date, Ref Number, Select Shop */}
        <div className="grid grid-cols-3 gap-1.5">
          <div className="relative">
            <input
              type="text"
              defaultValue="19/08/2026"
              className="w-full h-7 pl-2 pr-5 text-[10px] bg-white border border-[#E6EAED] rounded-md text-[#212B36] focus:outline-none focus:border-[#0E9384]"
            />
            <Calendar className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
          </div>

          <input
            type="text"
            placeholder="Type Ref Number"
            className="w-full h-7 px-2 text-[10px] bg-white border border-[#E6EAED] rounded-md text-[#212B36] placeholder:text-slate-400 focus:outline-none focus:border-[#0E9384]"
          />

          <div className="relative">
            <select className="w-full h-7 pl-2 pr-4 text-[10px] bg-white border border-[#E6EAED] rounded-md text-slate-600 appearance-none focus:outline-none focus:border-[#0E9384] cursor-pointer">
              <option>Select Shop</option>
              <option>Shop 01</option>
              <option>Shop 02</option>
            </select>
            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Row 2: Walk In Customer + Add User Button */}
        <div className="flex gap-1.5">
          <div className="relative flex-1">
            <select className="w-full h-7 pl-2 pr-5 text-[10px] bg-white border border-[#E6EAED] rounded-md text-[#212B36] appearance-none focus:outline-none focus:border-[#0E9384] cursor-pointer">
              <option>Walk In Customer</option>
              <option>John Doe (+1 555-0192)</option>
              <option>Alex Smith (+1 555-0284)</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
          </div>
          <button
            type="button"
            title="Add new customer"
            className="h-7 w-7 rounded-md bg-[#0E9384] text-white flex items-center justify-center hover:bg-[#0B6E63] transition-colors shrink-0 cursor-pointer"
          >
            <UserPlus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Row 3: Currency USD + Currency Exchange Rate */}
        <div className="flex gap-1.5">
          <div className="relative w-24">
            <select className="w-full h-7 pl-2 pr-4 text-[10px] bg-white border border-[#E6EAED] rounded-md text-[#212B36] font-medium appearance-none focus:outline-none focus:border-[#0E9384] cursor-pointer">
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
              <option>LKR</option>
            </select>
            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
          </div>

          <input
            type="text"
            placeholder="Currency Exchange Rate"
            className="flex-1 h-7 px-2 text-[10px] bg-white border border-[#E6EAED] rounded-md text-[#212B36] placeholder:text-slate-400 focus:outline-none focus:border-[#0E9384]"
          />
        </div>
      </div>

      {/* ── Order Details Section Header ── */}
      <div className="flex items-center justify-between px-3.5 pt-2 pb-1 shrink-0">
        <h3 className="text-[11px] font-bold text-[#212B36]">Order Details</h3>
        <span className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          Items - {cartItems.length}
        </span>
      </div>

      {/* ── Order Items Table Headers ── */}
      <div className="grid grid-cols-[1.2fr_48px_40px_60px_45px_18px] px-3.5 py-1 text-[9px] font-semibold text-slate-400 border-b border-slate-100 shrink-0">
        <span>Product</span>
        <span className="text-center">Batch No</span>
        <span className="text-center">Price</span>
        <span className="text-center">QTY</span>
        <span className="text-center">Sub total</span>
        <span />
      </div>

      {/* ── Order Items List ── */}
      <div className="flex-1 min-h-[140px] max-h-[220px] overflow-y-auto divide-y divide-slate-100 px-3.5">
        {cartItems.length === 0 ? (
          <div className="py-8 flex flex-col items-center justify-center text-slate-300 text-center">
            <p className="text-xs font-medium">Cart is empty</p>
            <p className="text-[10px]">Select products to add to order</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1.2fr_48px_40px_60px_45px_18px] items-center py-2 text-[10px]"
            >
              <div className="pr-1 min-w-0">
                <p className="font-semibold text-[#212B36] truncate leading-tight text-[10px]">
                  {item.name}
                </p>
                <p className="text-[9px] text-slate-400 font-normal">
                  In Stock : {item.inStockFormatted || item.stockCount}
                </p>
              </div>

              <div className="px-0.5">
                <input
                  type="text"
                  value={item.batchNo || ""}
                  onChange={(e) =>
                    onUpdateBatch && onUpdateBatch(item.id, e.target.value)
                  }
                  className="w-full h-5 text-[9px] border border-slate-200 rounded px-1 text-center focus:outline-none focus:border-[#0E9384]"
                />
              </div>

              <div className="text-center font-medium text-slate-600 text-[10px]">
                ${item.price}
              </div>

              <div className="flex items-center justify-center">
                <div className="flex items-center border border-slate-200 rounded-full px-1 py-0.5 bg-white">
                  <button
                    type="button"
                    onClick={() => onUpdateQty(item.id, -1)}
                    className="h-3.5 w-3.5 flex items-center justify-center text-slate-500 hover:text-red-500 cursor-pointer"
                  >
                    <Minus className="h-2 w-2" />
                  </button>
                  <span className="w-4 text-center font-semibold text-[10px] text-[#212B36]">
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQty(item.id, 1)}
                    className="h-3.5 w-3.5 flex items-center justify-center text-slate-500 hover:text-[#0E9384] cursor-pointer"
                  >
                    <Plus className="h-2 w-2" />
                  </button>
                </div>
              </div>

              <div className="text-center font-semibold text-[#212B36] text-[10px]">
                ${item.price * item.qty}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className="text-slate-300 hover:text-[#D32F2F] transition-colors cursor-pointer"
                  title="Remove item"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Bill Summary Calculations ── */}
      <div className="px-3.5 py-2 border-t border-slate-100 space-y-1 text-[11px] shrink-0">
        <div className="flex justify-between text-slate-500">
          <span>Sub Total</span>
          <span className="font-semibold text-[#212B36]">
            ${subtotal.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center text-slate-500">
          <div className="flex items-center gap-1">
            <span>Shipping</span>
            <Pencil className="h-2.5 w-2.5 text-slate-400" />
          </div>
          <span className="font-semibold text-[#212B36]">${shipping}</span>
        </div>

        <div className="flex justify-between items-center text-slate-500">
          <div className="flex items-center gap-1">
            <span>Tax</span>
            <Pencil className="h-2.5 w-2.5 text-slate-400" />
          </div>
          <span className="font-semibold text-[#212B36]">${tax}</span>
        </div>

        <div className="flex justify-between items-center text-slate-500">
          <div className="flex items-center gap-1">
            <span>Coupon</span>
            <Pencil className="h-2.5 w-2.5 text-slate-400" />
          </div>
          <span className="font-semibold text-[#212B36]">${coupon}</span>
        </div>

        <div className="flex justify-between items-center text-slate-500">
          <div className="flex items-center gap-1">
            <span>Discount</span>
            <Pencil className="h-2.5 w-2.5 text-slate-400" />
          </div>
          <span className="font-bold text-[#D32F2F]">-${discount}</span>
        </div>

        <div className="flex justify-between items-center pt-1.5 border-t border-slate-200">
          <span className="text-xs font-bold text-[#212B36]">Grand Total</span>
          <span className="text-xs font-bold text-[#212B36]">
            ${grandTotal.toLocaleString()}
          </span>
        </div>
      </div>

      {/* ── 2x3 Action Buttons Grid ── */}
      <div className="px-3 py-1.5 grid grid-cols-3 gap-1.5 shrink-0 text-white text-[11px] font-semibold">
        {/* Row 1 */}
        <button
          type="button"
          className="h-7 rounded-md bg-[#E26D1E] hover:opacity-90 active:scale-[0.98] transition-all shadow-xs cursor-pointer"
        >
          Hold
        </button>
        <button
          type="button"
          className="h-7 rounded-md bg-[#1E6DE2] hover:opacity-90 active:scale-[0.98] transition-all shadow-xs cursor-pointer"
        >
          Void
        </button>
        <button
          type="button"
          className="h-7 rounded-md bg-[#0E9384] hover:opacity-90 active:scale-[0.98] transition-all shadow-xs cursor-pointer"
        >
          Payment
        </button>

        {/* Row 2 */}
        <button
          type="button"
          className="h-7 rounded-md bg-[#0A2540] hover:opacity-90 active:scale-[0.98] transition-all shadow-xs cursor-pointer"
        >
          View Orders
        </button>
        <button
          type="button"
          onClick={onClearCart}
          className="h-7 rounded-md bg-[#3852D4] hover:opacity-90 active:scale-[0.98] transition-all shadow-xs cursor-pointer"
        >
          Reset
        </button>
        <button
          type="button"
          className="h-7 rounded-md bg-[#D32F2F] hover:opacity-90 active:scale-[0.98] transition-all shadow-xs cursor-pointer"
        >
          Transaction
        </button>
      </div>

      {/* ── Select Payment Method ── */}
      <div className="px-3 py-1.5 shrink-0">
        <p className="text-[10px] font-semibold text-[#212B36] mb-1">
          Select Payment
        </p>
        <div className="grid grid-cols-5 gap-1">
          {PAYMENT_METHODS.map((pm) => {
            const Icon = pm.icon;
            const isActive = paymentMethod === pm.id;

            return (
              <button
                key={pm.id}
                type="button"
                onClick={() => setPaymentMethod(pm.id)}
                className={[
                  "flex flex-col items-center justify-center py-1 px-0.5 rounded-lg border text-[9px] font-semibold transition-all cursor-pointer",
                  isActive
                    ? "border-2 border-[#0E9384] bg-[#EEFFFD] text-[#0E9384] shadow-xs"
                    : "border border-[#E6EAED] bg-white text-slate-600 hover:border-slate-300",
                ].join(" ")}
              >
                <Icon
                  className={[
                    "h-3.5 w-3.5 mb-0.5",
                    isActive ? "text-[#0E9384]" : "text-slate-600",
                  ].join(" ")}
                />
                <span className="leading-none">{pm.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Checkout Button ── */}
      <div className="p-3 pt-1 shrink-0 mt-auto">
        <button
          type="button"
          className="w-full h-9 rounded-xl bg-[#0E9384] hover:bg-[#0B6E63] text-white text-xs font-bold transition-all shadow-sm active:scale-[0.99] cursor-pointer"
        >
          {isOffline
            ? `Pay : $${grandTotal.toFixed(2)} (Offline)`
            : `Pay : $${grandTotal.toFixed(2)}`}
        </button>
      </div>
    </aside>
  );
}

export default PosOrderPanel;
