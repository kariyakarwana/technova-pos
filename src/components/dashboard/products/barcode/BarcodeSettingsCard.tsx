"use client";

import { ChevronDown } from "lucide-react";

interface BarcodeSettingsCardProps {
  warehouse: string;
  onWarehouseChange: (val: string) => void;
  store: string;
  onStoreChange: (val: string) => void;
  paperSize: string;
  onPaperSizeChange: (val: string) => void;
}

export default function BarcodeSettingsCard({
  warehouse,
  onWarehouseChange,
  store,
  onStoreChange,
  paperSize,
  onPaperSizeChange,
}: BarcodeSettingsCardProps) {
  return (
    <div className="p-6 bg-white border border-[var(--brand-stroke)] rounded-2xl shadow-xs space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Warehouse */}
        <div>
          <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1.5">
            Warehouse <span className="text-[var(--brand-red)] ml-0.5">*</span>
          </label>
          <div className="relative">
            <select
              value={warehouse}
              onChange={(e) => onWarehouseChange(e.target.value)}
              className="w-full h-10 rounded-xl border border-[var(--brand-stroke)] px-3 pr-8 text-xs text-[var(--brand-black-font)] bg-white focus:outline-none focus:border-[var(--brand-green)] appearance-none cursor-pointer"
            >
              <option value="Select Warehouse">Select Warehouse</option>
              <option value="Main Warehouse">Main Warehouse</option>
              <option value="Secondary Warehouse">Secondary Warehouse</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Store */}
        <div>
          <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1.5">
            Store <span className="text-[var(--brand-red)] ml-0.5">*</span>
          </label>
          <div className="relative">
            <select
              value={store}
              onChange={(e) => onStoreChange(e.target.value)}
              className="w-full h-10 rounded-xl border border-[var(--brand-stroke)] px-3 pr-8 text-xs text-[var(--brand-black-font)] bg-white focus:outline-none focus:border-[var(--brand-green)] appearance-none cursor-pointer"
            >
              <option value="Select Store">Select Store</option>
              <option value="Store A">Store A</option>
              <option value="Store B">Store B</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Paper Size */}
      <div>
        <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1.5">
          Paper Size <span className="text-[var(--brand-red)] ml-0.5">*</span>
        </label>
        <div className="relative">
          <select
            value={paperSize}
            onChange={(e) => onPaperSizeChange(e.target.value)}
            className="w-full h-10 rounded-xl border border-[var(--brand-stroke)] px-3 pr-8 text-xs text-[var(--brand-black-font)] bg-white focus:outline-none focus:border-[var(--brand-green)] appearance-none cursor-pointer"
          >
            <option value="36mm (1.4 Inch)">36mm (1.4 Inch)</option>
            <option value="24mm (0.94 Inch)">24mm (0.94 Inch)</option>
            <option value="18mm (0.7 Inch)">18mm (0.7 Inch)</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
