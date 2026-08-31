"use client";

import { Mail, Store } from "lucide-react";

interface SupplierInformationCardProps {
  supplierName: string;
  vendorId: string;
  contactName: string;
  contactEmail: string;
  shippingWarehouse: string;
  shippingAddress1: string;
  shippingAddress2: string;
}

export default function SupplierInformationCard({
  supplierName,
  vendorId,
  contactName,
  contactEmail,
  shippingWarehouse,
  shippingAddress1,
  shippingAddress2,
}: SupplierInformationCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs space-y-6">
      {/* Title */}
      <div className="flex items-center gap-2.5">
        <Store className="h-5 w-5 text-[var(--brand-green)]" />
        <h2 className="text-base font-bold text-[var(--brand-black-font)]">
          Supplier Information
        </h2>
      </div>

      {/* Top 2-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Supplier */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
            SUPPLIER
          </span>
          <h3 className="text-sm font-bold text-[var(--brand-black-font)] mt-1">
            {supplierName}
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Vendor ID: {vendorId}
          </p>
        </div>

        {/* Contact */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
            CONTACT
          </span>
          <h3 className="text-sm font-bold text-[var(--brand-black-font)] mt-1">
            {contactName}
          </h3>
          <p className="text-xs text-[var(--brand-green)] font-medium mt-0.5 flex items-center gap-1.5 hover:underline cursor-pointer">
            <Mail className="h-3.5 w-3.5" />
            <span>{contactEmail}</span>
          </p>
        </div>
      </div>

      {/* Shipping Address Row */}
      <div className="pt-4 border-t border-[var(--brand-stroke)]">
        <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
          SHIPPING ADDRESS
        </span>
        <p className="text-xs font-bold text-[var(--brand-black-font)] mt-1">
          {shippingWarehouse}
        </p>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          {shippingAddress1}
        </p>
        <p className="text-xs text-slate-500 font-medium">
          {shippingAddress2}
        </p>
      </div>
    </div>
  );
}
