"use client";

import { Calendar, ChevronDown, Store } from "lucide-react";

interface AddOrderDetailsCardProps {
  supplier: string;
  onSupplierChange: (val: string) => void;
  branch: string;
  onBranchChange: (val: string) => void;
  deliveryDate: string;
  onDeliveryDateChange: (val: string) => void;
  referenceNumber: string;
  onReferenceNumberChange: (val: string) => void;
  supplierOptions: string[];
  branchOptions: string[];
}

export default function AddOrderDetailsCard({
  supplier,
  onSupplierChange,
  branch,
  onBranchChange,
  deliveryDate,
  onDeliveryDateChange,
  referenceNumber,
  onReferenceNumberChange,
  supplierOptions,
  branchOptions,
}: AddOrderDetailsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs space-y-5">
      {/* Title */}
      <h2 className="text-base font-bold text-[var(--brand-black-font)]">
        Order Details
      </h2>

      {/* 2x2 Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Supplier */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Supplier
          </label>
          <div className="relative">
            <select
              value={supplier}
              onChange={(e) => onSupplierChange(e.target.value)}
              className="w-full h-10 pl-3.5 pr-9 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] appearance-none focus:outline-none focus:border-[var(--brand-green)] cursor-pointer shadow-xs font-medium"
            >
              <option value="">Select Supplier</option>
              {supplierOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Delivery Branch */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Delivery Branch
          </label>
          <div className="relative">
            <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <select
              value={branch}
              onChange={(e) => onBranchChange(e.target.value)}
              className="w-full h-10 pl-9 pr-9 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] appearance-none focus:outline-none focus:border-[var(--brand-green)] cursor-pointer shadow-xs font-medium"
            >
              {branchOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Expected Delivery Date */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Expected Delivery Date
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="mm/dd/yyyy"
              value={deliveryDate}
              onChange={(e) => onDeliveryDateChange(e.target.value)}
              className="w-full h-10 pl-3.5 pr-9 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs font-medium"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Reference Number */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Reference Number
          </label>
          <input
            type="text"
            placeholder="#########"
            value={referenceNumber}
            onChange={(e) => onReferenceNumberChange(e.target.value)}
            className="w-full h-10 px-3.5 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs font-medium"
          />
        </div>
      </div>
    </div>
  );
}
