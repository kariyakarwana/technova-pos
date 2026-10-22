"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, DollarSign } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
              <Select
                value={taxType}
                onValueChange={(val) => onTaxTypeChange(val)}
              >
                <SelectTrigger className="w-full h-9 data-[size=default]:h-9 rounded-lg border border-[var(--brand-stroke)] px-3 text-xs text-[var(--brand-black-font)] bg-white focus:border-[var(--brand-green)] cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectItem value="Exclusive" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Exclusive</SelectItem>
                  <SelectItem value="Inclusive" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Inclusive</SelectItem>
                  <SelectItem value="None" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Discount Type, Discount Value, Qty Alert */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1">
                Discount Type <span className="text-[var(--brand-red)] ml-0.5">*</span>
              </label>
              <Select
                value={discountType}
                onValueChange={(val) => onDiscountTypeChange(val)}
              >
                <SelectTrigger className="w-full h-9 data-[size=default]:h-9 rounded-lg border border-[var(--brand-stroke)] px-3 text-xs text-[var(--brand-black-font)] bg-white focus:border-[var(--brand-green)] cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectItem value="Percentage" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Percentage</SelectItem>
                  <SelectItem value="Fixed Amount" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
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
