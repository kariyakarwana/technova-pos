"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";

interface UpdateProductCustomFieldsCardProps {
  warranties: boolean;
  onWarrantiesChange: (val: boolean) => void;
  manufacturer: boolean;
  onManufacturerChange: (val: boolean) => void;
  expiry: boolean;
  onExpiryChange: (val: boolean) => void;
  warrantyValue: string;
  onWarrantyValueChange: (val: string) => void;
  manufacturerName: string;
  onManufacturerNameChange: (val: string) => void;
  manufacturedDate: string;
  onManufacturedDateChange: (val: string) => void;
  expiryDate: string;
  onExpiryDateChange: (val: string) => void;
}

export default function UpdateProductCustomFieldsCard({
  warranties,
  onWarrantiesChange,
  manufacturer,
  onManufacturerChange,
  expiry,
  onExpiryChange,
  warrantyValue,
  onWarrantyValueChange,
  manufacturerName,
  onManufacturerNameChange,
  manufacturedDate,
  onManufacturedDateChange,
  expiryDate,
  onExpiryDateChange,
}: UpdateProductCustomFieldsCardProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="pos-card overflow-hidden bg-white border border-[var(--brand-stroke)] rounded-2xl shadow-xs">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--brand-stroke)]">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center text-[var(--brand-green)]">
            <SlidersHorizontal className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold text-[var(--brand-black-font)]">
            Custom Fields
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
          {/* Toggle Bar */}
          <div className="flex items-center gap-4 px-4 py-3 bg-slate-50 rounded-xl border border-[var(--brand-stroke)]">
            {[
              { label: "Warranties", state: warranties, set: onWarrantiesChange },
              { label: "Manufacturer", state: manufacturer, set: onManufacturerChange },
              { label: "Expiry", state: expiry, set: onExpiryChange },
            ].map(({ label, state, set }) => (
              <label key={label} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={state}
                  onChange={(e) => set(e.target.checked)}
                  className="accent-[var(--brand-green)] h-4 w-4 rounded cursor-pointer"
                />
                <span className="text-xs font-medium text-[var(--brand-black-font)]">
                  {label}
                </span>
              </label>
            ))}
          </div>

          {/* Warranty & Manufacturer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {warranties && (
              <div>
                <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1.5">
                  Warranty <span className="text-[var(--brand-red)] ml-0.5">*</span>
                </label>
                <div className="relative">
                  <select
                    value={warrantyValue}
                    onChange={(e) => onWarrantyValueChange(e.target.value)}
                    className="w-full h-10 rounded-xl border border-[var(--brand-stroke)] px-3 pr-8 text-xs text-[var(--brand-black-font)] bg-white focus:outline-none focus:border-[var(--brand-green)] appearance-none cursor-pointer"
                  >
                    <option value="1 Year">1 Year</option>
                    <option value="2 Years">2 Years</option>
                    <option value="No Warranty">No Warranty</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>
            )}
            {manufacturer && (
              <div>
                <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1.5">
                  Manufacturer <span className="text-[var(--brand-red)] ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  value={manufacturerName}
                  onChange={(e) => onManufacturerNameChange(e.target.value)}
                  placeholder="Enter manufacturer name"
                  className="w-full h-10 rounded-xl border border-[var(--brand-stroke)] px-3 text-xs text-[var(--brand-black-font)] placeholder:text-slate-400 bg-white focus:outline-none focus:border-[var(--brand-green)]"
                />
              </div>
            )}
          </div>

          {/* Manufactured Date & Expiry Date */}
          {expiry && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1.5">
                  Manufactured Date <span className="text-[var(--brand-red)] ml-0.5">*</span>
                </label>
                <input
                  type="date"
                  value={manufacturedDate}
                  onChange={(e) => onManufacturedDateChange(e.target.value)}
                  className="w-full h-10 rounded-xl border border-[var(--brand-stroke)] px-3 text-xs text-[var(--brand-black-font)] bg-white focus:outline-none focus:border-[var(--brand-green)]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1.5">
                  Expiry On <span className="text-[var(--brand-red)] ml-0.5">*</span>
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => onExpiryDateChange(e.target.value)}
                  className="w-full h-10 rounded-xl border border-[var(--brand-stroke)] px-3 text-xs text-[var(--brand-black-font)] bg-white focus:outline-none focus:border-[var(--brand-green)]"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
