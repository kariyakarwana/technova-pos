"use client";

import { Calendar, ChevronDown, Info } from "lucide-react";

interface DiscountConfigurationCardProps {
  discountType: string;
  onDiscountTypeChange: (val: string) => void;
  discountValue: string;
  onDiscountValueChange: (val: string) => void;
  startDate: string;
  onStartDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;
  generateCouponCode: boolean;
  onToggleGenerateCouponCode: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function DiscountConfigurationCard({
  discountType,
  onDiscountTypeChange,
  discountValue,
  onDiscountValueChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  generateCouponCode,
  onToggleGenerateCouponCode,
  isCollapsed = false,
  onToggleCollapse,
}: DiscountConfigurationCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] shadow-xs overflow-hidden">
      {/* Top Banner */}
      <div className="p-5 flex items-center justify-between border-b border-[var(--brand-stroke)] bg-white">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-[var(--brand-green)]" />
          <h2 className="text-sm font-bold text-[var(--brand-black-font)]">
            Discount Configuration
          </h2>
        </div>

        <button
          type="button"
          onClick={onToggleCollapse}
          title="Toggle view"
          className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <ChevronDown
            className={[
              "h-5 w-5 transition-transform duration-200",
              isCollapsed ? "-rotate-90" : "rotate-0",
            ].join(" ")}
          />
        </button>
      </div>

      {/* Form Body */}
      {!isCollapsed && (
        <div className="p-6 space-y-6">
          {/* 2x2 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Discount Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Discount Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={discountType}
                  onChange={(e) => onDiscountTypeChange(e.target.value)}
                  className="w-full h-10 pl-3.5 pr-9 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] appearance-none focus:outline-none focus:border-[var(--brand-green)] cursor-pointer shadow-xs font-medium"
                >
                  <option value="Percentage">Percentage</option>
                  <option value="Fixed Amount">Fixed Amount</option>
                  <option value="Free Shipping">Free Shipping</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Discount Value */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Discount Value <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={discountValue}
                onChange={(e) => onDiscountValueChange(e.target.value)}
                placeholder="e.g. 15% or $10.00"
                className="w-full h-10 px-3.5 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs font-medium"
              />
            </div>

            {/* Start Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Start Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="dd/mm/yyyy"
                  value={startDate}
                  onChange={(e) => onStartDateChange(e.target.value)}
                  className="w-full h-10 pl-3.5 pr-9 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs font-medium"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* End Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                End Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="dd/mm/yyyy"
                  value={endDate}
                  onChange={(e) => onEndDateChange(e.target.value)}
                  className="w-full h-10 pl-3.5 pr-9 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs font-medium"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Generate Coupon Code Banner */}
          <div className="bg-[#F0FDF9] border border-[#CBEFE8] rounded-xl p-4 flex items-center justify-between shadow-2xs">
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold text-[var(--brand-black-font)]">
                Generate Coupon Code
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Require customers to enter a code at checkout.
              </p>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={generateCouponCode}
              onClick={onToggleGenerateCouponCode}
              className={[
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                generateCouponCode ? "bg-[var(--brand-green)]" : "bg-slate-300",
              ].join(" ")}
            >
              <span
                aria-hidden="true"
                className={[
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out",
                  generateCouponCode ? "translate-x-5" : "translate-x-0",
                ].join(" ")}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
