"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";

interface CustomerPersonalDetailsCardProps {
  customerId: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  shippingAddress: string;
}

export default function CustomerPersonalDetailsCard({
  customerId,
  fullName,
  phoneNumber,
  emailAddress,
  shippingAddress,
}: CustomerPersonalDetailsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs space-y-5">
      {/* Title & Edit CTA */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[var(--brand-black-font)]">
          Personal Details
        </h3>

        <Link
          href={`/customers/${customerId}/edit`}
          className="text-slate-400 hover:text-[var(--brand-green)] transition-colors cursor-pointer"
          title="Edit details"
        >
          <Pencil className="h-4 w-4" />
        </Link>
      </div>

      {/* Stacked Details with Dividers */}
      <div className="space-y-3.5 divide-y divide-slate-100 text-xs">
        <div>
          <span className="block text-[11px] font-semibold text-slate-400">
            Full Name
          </span>
          <span className="block font-bold text-[var(--brand-black-font)] mt-0.5">
            {fullName}
          </span>
        </div>

        <div className="pt-3">
          <span className="block text-[11px] font-semibold text-slate-400">
            Phone Number
          </span>
          <span className="block font-bold text-[var(--brand-black-font)] mt-0.5">
            {phoneNumber}
          </span>
        </div>

        <div className="pt-3">
          <span className="block text-[11px] font-semibold text-slate-400">
            Email Address
          </span>
          <span className="block font-bold text-[var(--brand-black-font)] mt-0.5">
            {emailAddress}
          </span>
        </div>

        <div className="pt-3">
          <span className="block text-[11px] font-semibold text-slate-400">
            Shipping Address
          </span>
          <span className="block font-bold text-[var(--brand-black-font)] mt-0.5">
            {shippingAddress}
          </span>
        </div>
      </div>
    </div>
  );
}
