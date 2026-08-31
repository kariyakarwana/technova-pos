"use client";

import { Store, Truck, Warehouse } from "lucide-react";

interface TransferLocationCardsProps {
  sourceName: string;
  sourceCode: string;
  sourceAuth: string;
  destinationName: string;
  destinationCode: string;
  destinationAttn: string;
  logisticsCarrier: string;
  logisticsTrackingNumber: string;
}

export default function TransferLocationCards({
  sourceName,
  sourceCode,
  sourceAuth,
  destinationName,
  destinationCode,
  destinationAttn,
  logisticsCarrier,
  logisticsTrackingNumber,
}: TransferLocationCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* 1. Source Location */}
      <div className="bg-[#F2FAF9] border border-[#CBEFE8] rounded-2xl p-5 shadow-xs flex items-start gap-3.5">
        <div className="h-10 w-10 rounded-xl bg-white border border-[#CBEFE8] text-[var(--brand-green)] flex items-center justify-center shrink-0 shadow-xs">
          <Warehouse className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
            SOURCE LOCATION
          </span>
          <h2 className="text-sm font-bold text-[var(--brand-black-font)] mt-0.5 leading-tight">
            {sourceName} ({sourceCode})
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1.5 flex items-center gap-1">
            <span>👤</span>
            <span>Auth: {sourceAuth}</span>
          </p>
        </div>
      </div>

      {/* 2. Destination */}
      <div className="bg-[#F2FAF9] border border-[#CBEFE8] rounded-2xl p-5 shadow-xs flex items-start gap-3.5">
        <div className="h-10 w-10 rounded-xl bg-white border border-[#CBEFE8] text-[var(--brand-green)] flex items-center justify-center shrink-0 shadow-xs">
          <Store className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
            DESTINATION
          </span>
          <h2 className="text-sm font-bold text-[var(--brand-black-font)] mt-0.5 leading-tight">
            {destinationName} ({destinationCode})
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1.5 flex items-center gap-1">
            <span>👤</span>
            <span>Attn: {destinationAttn}</span>
          </p>
        </div>
      </div>

      {/* 3. Logistics Info */}
      <div className="bg-[#F2FAF9] border border-[#CBEFE8] rounded-2xl p-5 shadow-xs flex items-start gap-3.5">
        <div className="h-10 w-10 rounded-xl bg-white border border-[#CBEFE8] text-[var(--brand-green)] flex items-center justify-center shrink-0 shadow-xs">
          <Truck className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
            LOGISTICS INFO
          </span>
          <h2 className="text-sm font-bold text-[var(--brand-black-font)] mt-0.5 leading-tight">
            {logisticsCarrier}
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1.5">
            # {logisticsTrackingNumber}
          </p>
        </div>
      </div>
    </div>
  );
}
