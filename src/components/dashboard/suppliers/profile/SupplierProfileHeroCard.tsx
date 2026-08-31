"use client";

import { Building2, Calendar, Edit, MapPin, TrendingUp } from "lucide-react";

interface SupplierProfileHeroCardProps {
  name: string;
  status: "Active" | "Inactive";
  location: string;
  category: string;
  partnerSince: string;
  onEditProfile?: () => void;
}

export default function SupplierProfileHeroCard({
  name,
  status,
  location,
  category,
  partnerSince,
  onEditProfile,
}: SupplierProfileHeroCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      {/* Left Details with Logo */}
      <div className="flex items-center gap-4">
        {/* Supplier Logo Container */}
        <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-[var(--brand-stroke)] flex flex-col items-center justify-center p-2 text-[var(--brand-green)] shrink-0 shadow-2xs">
          <TrendingUp className="h-7 w-7 text-[var(--brand-green)]" />
          <span className="text-[7px] font-bold tracking-tight text-slate-500 mt-1">
            Global IT Traders
          </span>
        </div>

        {/* Info */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-2xl font-bold text-[var(--brand-black-font)] tracking-tight">
              {name}
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
              {status}
            </span>
          </div>

          {/* Meta Info Row */}
          <div className="flex items-center gap-4 flex-wrap text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>{location}</span>
            </span>

            <span className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5 text-slate-400" />
              <span>{category}</span>
            </span>

            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>Partner since {partnerSince}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right Edit Action */}
      <button
        type="button"
        onClick={onEditProfile}
        className="h-9 px-4 rounded-xl border border-[var(--brand-stroke)] bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
      >
        <Edit className="h-3.5 w-3.5 text-slate-500" />
        <span>Edit Profile</span>
      </button>
    </div>
  );
}
