"use client";

import { Info } from "lucide-react";

interface OrderDetailsSidebarCardProps {
  dateCreated: string;
  expectedDelivery: string;
  paymentTerms: string;
  department: string;
}

export default function OrderDetailsSidebarCard({
  dateCreated,
  expectedDelivery,
  paymentTerms,
  department,
}: OrderDetailsSidebarCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs space-y-4">
      {/* Title */}
      <div className="flex items-center gap-2">
        <Info className="h-5 w-5 text-[var(--brand-green)]" />
        <h2 className="text-base font-bold text-[var(--brand-black-font)]">
          Order Details
        </h2>
      </div>

      {/* Stacked Details */}
      <div className="space-y-3.5 pt-1 text-xs">
        <div>
          <span className="block text-[11px] font-bold text-slate-400 tracking-wider uppercase">
            DATE CREATED
          </span>
          <span className="block font-bold text-[var(--brand-black-font)] mt-0.5">
            {dateCreated}
          </span>
        </div>

        <div>
          <span className="block text-[11px] font-bold text-slate-400 tracking-wider uppercase">
            EXPECTED DELIVERY
          </span>
          <span className="block font-bold text-[var(--brand-black-font)] mt-0.5">
            {expectedDelivery}
          </span>
        </div>

        <div>
          <span className="block text-[11px] font-bold text-slate-400 tracking-wider uppercase">
            PAYMENT TERMS
          </span>
          <span className="block font-bold text-[var(--brand-black-font)] mt-0.5">
            {paymentTerms}
          </span>
        </div>

        <div>
          <span className="block text-[11px] font-bold text-slate-400 tracking-wider uppercase">
            DEPARTMENT
          </span>
          <span className="inline-block mt-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#E6F7F5] text-[var(--brand-green)]">
            {department}
          </span>
        </div>
      </div>
    </div>
  );
}
