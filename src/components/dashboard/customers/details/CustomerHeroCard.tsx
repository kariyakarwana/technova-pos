"use client";

import Image from "next/image";
import { Check, ChevronDown, Info, Mail, MapPin, Phone, User } from "lucide-react";

interface CustomerHeroCardProps {
  customerId: string;
  name: string;
  customerSince: string;
  email: string;
  phone: string;
  city: string;
  avatarUrl?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function CustomerHeroCard({
  customerId,
  name,
  customerSince,
  email,
  phone,
  city,
  avatarUrl,
  isCollapsed = false,
  onToggleCollapse,
}: CustomerHeroCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] shadow-xs overflow-hidden">
      {/* Top Banner Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-[var(--brand-stroke)] bg-white">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-[var(--brand-green)]" />
          <h2 className="text-sm font-bold text-[var(--brand-black-font)]">
            {customerId}
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

      {/* Hero Body */}
      {!isCollapsed && (
        <div className="p-6">
          <div className="bg-[#F0FDF9] border border-[#CBEFE8] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar with Verified badge */}
            <div className="relative shrink-0">
              <div className="relative h-20 w-20 rounded-2xl overflow-hidden border-2 border-white shadow-xs bg-slate-100">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-[var(--brand-green)] text-white flex items-center justify-center font-bold text-xl">
                    <User className="h-10 w-10" />
                  </div>
                )}
              </div>

              {/* Verified check badge */}
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-[var(--brand-green)] border-2 border-white text-white flex items-center justify-center shadow-xs">
                <Check className="h-3.5 w-3.5 stroke-[3]" />
              </div>
            </div>

            {/* Information */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-bold text-[var(--brand-black-font)] tracking-tight">
                  {name}
                </h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-[var(--brand-green)] text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  <span>ID : {customerId}</span>
                </span>
              </div>

              <p className="text-xs text-slate-500 font-medium">
                Customer since {customerSince}
              </p>

              {/* Contact strip */}
              <div className="flex items-center gap-5 flex-wrap pt-1 text-xs text-slate-600 font-medium">
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-1.5 hover:text-[var(--brand-green)] transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>{email}</span>
                </a>

                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-1.5 hover:text-[var(--brand-green)] transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{phone}</span>
                </a>

                <span className="flex items-center gap-1.5 text-slate-600">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>{city}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
