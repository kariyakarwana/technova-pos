"use client";

import { ArrowLeftRight, CreditCard, Store } from "lucide-react";
import type { ResolutionType } from "./ProcessReturnMock";

interface ReturnResolutionCardProps {
  selectedResolution: ResolutionType;
  onSelectResolution: (res: ResolutionType) => void;
}

export default function ReturnResolutionCard({
  selectedResolution,
  onSelectResolution,
}: ReturnResolutionCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-full bg-[var(--brand-green)] text-white text-xs font-bold flex items-center justify-center">
            3
          </div>
          <h2 className="text-base font-bold text-[var(--brand-black-font)]">
            Resolution
          </h2>
        </div>

        <span className="text-[11px] font-mono text-slate-400 font-medium">
          FR-RET-003
        </span>
      </div>

      {/* 3 Resolution Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 1. Original Method */}
        <button
          type="button"
          onClick={() => onSelectResolution("original_method")}
          className={[
            "p-5 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs",
            selectedResolution === "original_method"
              ? "border-[var(--brand-green)] bg-[#F0FDF9] ring-1 ring-[var(--brand-green)]"
              : "border-[var(--brand-stroke)] bg-white hover:bg-slate-50",
          ].join(" ")}
        >
          <CreditCard
            className={[
              "h-6 w-6",
              selectedResolution === "original_method"
                ? "text-[var(--brand-green)]"
                : "text-slate-500",
            ].join(" ")}
          />
          <div>
            <p className="text-xs font-bold text-[var(--brand-black-font)]">
              Original Method
            </p>
            <p
              className={[
                "text-[11px] font-medium mt-0.5",
                selectedResolution === "original_method"
                  ? "text-[var(--brand-green)]"
                  : "text-slate-400",
              ].join(" ")}
            >
              Visa ending in 4242
            </p>
          </div>
        </button>

        {/* 2. Store Credit */}
        <button
          type="button"
          onClick={() => onSelectResolution("store_credit")}
          className={[
            "p-5 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs",
            selectedResolution === "store_credit"
              ? "border-[var(--brand-green)] bg-[#F0FDF9] ring-1 ring-[var(--brand-green)]"
              : "border-[var(--brand-stroke)] bg-white hover:bg-slate-50",
          ].join(" ")}
        >
          <Store
            className={[
              "h-6 w-6",
              selectedResolution === "store_credit"
                ? "text-[var(--brand-green)]"
                : "text-slate-500",
            ].join(" ")}
          />
          <div>
            <p className="text-xs font-bold text-[var(--brand-black-font)]">
              Store Credit
            </p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              Instant digital card
            </p>
          </div>
        </button>

        {/* 3. Exchange */}
        <button
          type="button"
          onClick={() => onSelectResolution("exchange")}
          className={[
            "p-5 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs",
            selectedResolution === "exchange"
              ? "border-[var(--brand-green)] bg-[#F0FDF9] ring-1 ring-[var(--brand-green)]"
              : "border-[var(--brand-stroke)] bg-white hover:bg-slate-50",
          ].join(" ")}
        >
          <ArrowLeftRight
            className={[
              "h-6 w-6",
              selectedResolution === "exchange"
                ? "text-[var(--brand-green)]"
                : "text-slate-500",
            ].join(" ")}
          />
          <div>
            <p className="text-xs font-bold text-[var(--brand-black-font)]">
              Exchange
            </p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              For another product
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
