"use client";

import { Calendar, ChevronDown } from "lucide-react";
import type { SupplierPOStatus } from "./SupplierPurchaseOrdersMock";

interface SupplierPurchaseOrdersFilterBarProps {
  selectedSupplier: string;
  onSupplierChange: (supplier: string) => void;
  dateRange: string;
  onDateRangeChange: (date: string) => void;
  selectedStatus: "All Statuses" | SupplierPOStatus;
  onStatusChange: (status: "All Statuses" | SupplierPOStatus) => void;
  supplierOptions: string[];
}

export default function SupplierPurchaseOrdersFilterBar({
  selectedSupplier,
  onSupplierChange,
  dateRange,
  onDateRangeChange,
  selectedStatus,
  onStatusChange,
  supplierOptions,
}: SupplierPurchaseOrdersFilterBarProps) {
  const statusOptions: Array<"All Statuses" | SupplierPOStatus> = [
    "All Statuses",
    "Draft",
    "Pending",
    "Approved",
    "Sent",
    "Received",
    "Completed",
  ];

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-5 shadow-xs">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* 1. Supplier Select */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Supplier
          </label>
          <div className="relative">
            <select
              value={selectedSupplier}
              onChange={(e) => onSupplierChange(e.target.value)}
              className="w-full h-10 pl-3.5 pr-9 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] appearance-none focus:outline-none focus:border-[var(--brand-green)] cursor-pointer shadow-xs font-medium"
            >
              {supplierOptions.map((sup) => (
                <option key={sup} value={sup}>
                  {sup}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* 2. Date Range Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Date Range
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="mm/dd/yyyy"
              value={dateRange}
              onChange={(e) => onDateRangeChange(e.target.value)}
              className="w-full h-10 pl-3.5 pr-9 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs font-medium"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* 3. Status Select */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Status
          </label>
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) =>
                onStatusChange(e.target.value as "All Statuses" | SupplierPOStatus)
              }
              className="w-full h-10 pl-3.5 pr-9 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] appearance-none focus:outline-none focus:border-[var(--brand-green)] cursor-pointer shadow-xs font-medium"
            >
              {statusOptions.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
