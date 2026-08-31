"use client";

import { Sparkles, Star } from "lucide-react";

interface CustomerLoyaltySnapshotCardProps {
  totalPoints: string;
  expiringSoon: string;
  expDate: string;
  onViewLoyaltyDetails?: () => void;
}

export default function CustomerLoyaltySnapshotCard({
  totalPoints,
  expiringSoon,
  expDate,
  onViewLoyaltyDetails,
}: CustomerLoyaltySnapshotCardProps) {
  return (
    <div className="relative bg-[#246A66] text-white rounded-2xl p-6 shadow-xs overflow-hidden flex flex-col justify-between space-y-6">
      {/* Background Star Watermark */}
      <div className="absolute -right-8 -top-8 text-white/10 pointer-events-none">
        <Star className="h-44 w-44 fill-current" />
      </div>

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-white/15 flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          </div>
          <h3 className="text-sm font-bold tracking-wide text-white">
            Loyalty Snapshot
          </h3>
        </div>

        {/* Total Points Metric */}
        <div>
          <span className="block text-[10px] font-bold text-white/75 tracking-wider uppercase">
            TOTAL POINTS
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mt-0.5">
            {totalPoints}
          </h2>
        </div>

        {/* Expiry Details */}
        <div className="flex items-center justify-between text-xs pt-2 border-t border-white/15 text-white/90">
          <div>
            <span className="block text-[10px] text-white/70">Expiring Soon</span>
            <span className="font-semibold">{expiringSoon}</span>
          </div>
          <div className="text-right">
            <span className="block text-[10px] text-white/70">Exp. Date</span>
            <span className="font-semibold">{expDate}</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="relative z-10 pt-1">
        <button
          type="button"
          onClick={onViewLoyaltyDetails}
          className="w-full py-2.5 bg-white hover:bg-slate-50 text-[var(--brand-green)] font-bold text-xs rounded-xl transition-colors shadow-xs cursor-pointer"
        >
          View Full Loyalty Details
        </button>
      </div>
    </div>
  );
}
