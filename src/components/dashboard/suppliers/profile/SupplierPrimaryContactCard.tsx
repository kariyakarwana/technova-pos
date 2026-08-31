"use client";

import Image from "next/image";
import { Mail, Phone, User } from "lucide-react";

interface SupplierPrimaryContactCardProps {
  name: string;
  role: string;
  email: string;
  phone: string;
  avatarUrl?: string;
}

export default function SupplierPrimaryContactCard({
  name,
  role,
  email,
  phone,
  avatarUrl,
}: SupplierPrimaryContactCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs space-y-4">
      {/* Title */}
      <h3 className="text-sm font-bold text-[var(--brand-black-font)]">
        Primary Contact
      </h3>

      {/* Avatar & Name */}
      <div className="flex items-center gap-3 pt-1">
        {avatarUrl ? (
          <div className="relative h-12 w-12 rounded-full overflow-hidden border border-[var(--brand-stroke)] shrink-0">
            <Image
              src={avatarUrl}
              alt={name}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-12 w-12 rounded-full bg-[var(--brand-green)] text-white flex items-center justify-center shrink-0 font-bold text-sm">
            <User className="h-6 w-6" />
          </div>
        )}

        <div>
          <h4 className="text-sm font-bold text-[var(--brand-black-font)] leading-snug">
            {name}
          </h4>
          <p className="text-xs text-slate-500 font-medium">{role}</p>
        </div>
      </div>

      {/* Contact Links */}
      <div className="pt-2 space-y-2.5 text-xs">
        <div>
          <span className="block text-[11px] font-semibold text-slate-400">
            Email
          </span>
          <a
            href={`mailto:${email}`}
            className="text-[var(--brand-green)] font-medium hover:underline inline-flex items-center gap-1.5 mt-0.5"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>{email}</span>
          </a>
        </div>

        <div>
          <span className="block text-[11px] font-semibold text-slate-400">
            Phone
          </span>
          <a
            href={`tel:${phone}`}
            className="text-slate-700 font-medium hover:text-[var(--brand-green)] inline-flex items-center gap-1.5 mt-0.5 transition-colors"
          >
            <Phone className="h-3.5 w-3.5 text-slate-400" />
            <span>{phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
