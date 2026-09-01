"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, DollarSign } from "lucide-react";

interface AddProductPricingCardProps {
  productType: "single" | "variable";
  onProductTypeChange: (val: "single" | "variable") => void;
  quantity: string;
  onQuantityChange: (val: string) => void;
  price: string;
  onPriceChange: (val: string) => void;
  taxType: string;
  onTaxTypeChange: (val: string) => void;
  discountType: string;
  onDiscountTypeChange: (val: string) => void;
  discountValue: string;
  onDiscountValueChange: (val: string) => void;
  quantityAlert: string;
  onQuantityAlertChange: (val: string) => void;
}

export default function AddProductPricingCard({
  productType,
  onProductTypeChange,
  quantity,
  onQuantityChange,
  price,
  onPriceChange,
  taxType,
  onTaxTypeChange,
  discountType,
  onDiscountTypeChange,
  discountValue,
  onDiscountValueChange,
  quantityAlert,
  onQuantityAlertChange,
}: AddProductPricingCardProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="pos-card overflow-hidden bg-white border border-[var(--brand-stroke)] rounded-2xl shadow-xs">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--brand-stroke)]">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center text-[var(--brand-green)]">
            <DollarSign className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold text-[var(--brand-black-font)]">
            Pricing & Stocks
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          className="text-slate-400 hover:text-[var(--brand-green)] transition-colors p-1 cursor-pointer"
        >
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="p-6 space-y-4">
          {/* Product Type Radio */}
          <div>
            <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1">
              Product Type <span className="text-[var(--brand-red)] ml-0.5">*</span>
            </label>
            <div className="flex items-center gap-6 mt-1">
              {(["single", "variable"] as const).map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="productType"
                    checked={productType === type}
                    onChange={() => onProductTypeChange(type)}
                    className="accent-[var(--brand-green)] h-4 w-4 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-[var(--brand-black-font)]">
                    {type === "single" ? "Single Product" : "Variable Product"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Row 1: Quantity, Price, Tax Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1">
                Quantity <span className="text-[var(--brand-red)] ml-0.5">*</span>
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => onQuantityChange(e.target.value)}
                placeholder="0"
                className="w-full h-9 rounded-lg border border-[var(--brand-stroke)] px-3 text-xs text-[var(--brand-black-font)] placeholder:text-slate-400 bg-white focus:outline-none focus:border-[var(--brand-green)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1">
                Price <span className="text-[var(--brand-red)] ml-0.5">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => onPriceChange(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-9 rounded-lg border border-[var(--brand-stroke)] pl-7 pr-3 text-xs text-[var(--brand-black-font)] placeholder:text-slate-400 bg-white focus:outline-none focus:border-[var(--brand-green)]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1">
                Tax Type <span className="text-[var(--brand-red)] ml-0.5">*</span>
              </label>
              <div className="relative">
                <select
                  value={taxType}
                  onChange={(e) => onTaxTypeChange(e.target.value)}
                  className="w-full h-9 rounded-lg border border-[var(--brand-stroke)] px-3 pr-8 text-xs text-[var(--brand-black-font)] bg-white focus:outline-none focus:border-[var(--brand-green)] appearance-none cursor-pointer"
                >
                  <option value="Exclusive">Exclusive</option>
                  <option value="Inclusive">Inclusive</option>
                  <option value="None">None</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 2: Discount Type, Discount Value, Qty Alert */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1">
                Discount Type <span className="text-[var(--brand-red)] ml-0.5">*</span>
              </label>
              <div className="relative">
                <select
                  value={discountType}
                  onChange={(e) => onDiscountTypeChange(e.target.value)}
                  className="w-full h-9 rounded-lg border border-[var(--brand-stroke)] px-3 pr-8 text-xs text-[var(--brand-black-font)] bg-white focus:outline-none focus:border-[var(--brand-green)] appearance-none cursor-pointer"
                >
                  <option value="Percentage">Percentage</option>
                  <option value="Fixed Amount">Fixed Amount</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1">
                Discount Value <span className="text-[var(--brand-red)] ml-0.5">*</span>
              </label>
              <input
                type="text"
                value={discountValue}
                onChange={(e) => onDiscountValueChange(e.target.value)}
                placeholder="0"
                className="w-full h-9 rounded-lg border border-[var(--brand-stroke)] px-3 text-xs text-[var(--brand-black-font)] placeholder:text-slate-400 bg-white focus:outline-none focus:border-[var(--brand-green)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1">
                Quantity Alert <span className="text-[var(--brand-red)] ml-0.5">*</span>
              </label>
              <input
                type="text"
                value={quantityAlert}
                onChange={(e) => onQuantityAlertChange(e.target.value)}
                placeholder="0"
                className="w-full h-9 rounded-lg border border-[var(--brand-stroke)] px-3 text-xs text-[var(--brand-black-font)] placeholder:text-slate-400 bg-white focus:outline-none focus:border-[var(--brand-green)]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
