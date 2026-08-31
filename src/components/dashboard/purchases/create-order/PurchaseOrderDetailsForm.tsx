"use client";

import Link from "next/link";
import { Calendar, ChevronDown } from "lucide-react";

interface PurchaseOrderDetailsFormProps {
  supplier: string;
  onSupplierChange: (val: string) => void;
  deliveryDate: string;
  onDeliveryDateChange: (val: string) => void;
  referenceNumber: string;
  onReferenceNumberChange: (val: string) => void;
  onSaveDraft?: () => void;
  onSubmitApproval?: () => void;
}

export default function PurchaseOrderDetailsForm({
  supplier,
  onSupplierChange,
  deliveryDate,
  onDeliveryDateChange,
  referenceNumber,
  onReferenceNumberChange,
  onSaveDraft,
  onSubmitApproval,
}: PurchaseOrderDetailsFormProps) {
  const suppliers = [
    "All",
    "Acme Corp Ltd.",
    "Global Tech Supplies",
    "Nexus Industries",
    "Omega Resources",
  ];

  return (
    <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
      {/* Left Form Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 flex-1 max-w-3xl">
        {/* Supplier */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[var(--brand-black-font)]">
            Supplier
          </label>
          <div className="relative">
            <select
              value={supplier}
              onChange={(e) => onSupplierChange(e.target.value)}
              className="w-full h-9 pl-3 pr-8 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] appearance-none focus:outline-none focus:border-[var(--brand-green)] cursor-pointer shadow-xs font-medium"
            >
              {suppliers.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Expected Delivery Date */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[var(--brand-black-font)]">
            Expected Delivery Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={deliveryDate}
              onChange={(e) => onDeliveryDateChange(e.target.value)}
              placeholder="01-Aug-2026"
              className="w-full h-9 pl-8 pr-3 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs font-medium"
            />
          </div>
        </div>

        {/* Reference Number */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[var(--brand-black-font)]">
            Reference Number
          </label>
          <input
            type="text"
            value={referenceNumber}
            onChange={(e) => onReferenceNumberChange(e.target.value)}
            placeholder="#########"
            className="w-full h-9 px-3 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs font-medium"
          />
        </div>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2.5 self-end xl:self-auto">
        <Link
          href="/purchases/order-management"
          className="h-9 px-4 rounded-xl border border-[var(--brand-stroke)] bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center transition-colors shadow-xs"
        >
          Cancel
        </Link>

        <button
          type="button"
          onClick={onSaveDraft}
          className="h-9 px-4 rounded-xl border border-[var(--brand-green)] bg-white hover:bg-[#E6F7F5] text-[var(--brand-green)] text-xs font-semibold transition-colors shadow-xs cursor-pointer"
        >
          Save as Draft
        </button>

        <button
          type="button"
          onClick={onSubmitApproval}
          className="h-9 px-4 rounded-xl bg-[var(--brand-green)] hover:bg-[#0B6E63] text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
        >
          Submit to Approval
        </button>
      </div>
    </div>
  );
}
