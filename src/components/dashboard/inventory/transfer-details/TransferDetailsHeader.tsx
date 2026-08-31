"use client";

import Link from "next/link";
import { CheckCheck, ChevronRight, Printer } from "lucide-react";

interface TransferDetailsHeaderProps {
  transferId: string;
  status: string;
  onPrint?: () => void;
  onReceiveVerify?: () => void;
}

export default function TransferDetailsHeader({
  transferId,
  status,
  onPrint,
  onReceiveVerify,
}: TransferDetailsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      {/* Title & Breadcrumbs */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-[var(--brand-black-font)] tracking-tight">
            {transferId}
          </h1>
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[var(--brand-green)] text-white shadow-xs">
            {status}
          </span>
        </div>

        <div className="flex items-center gap-1.5 mt-1 text-xs text-[var(--brand-muted-font)] font-medium">
          <Link
            href="/dashboard"
            className="hover:text-[var(--brand-green)] transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <Link
            href="/inventory/transfer"
            className="hover:text-[var(--brand-green)] transition-colors"
          >
            Stock Transfer
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <span className="text-[var(--brand-black-font)] font-semibold">
            {transferId}
          </span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onPrint}
          className="h-9 px-3.5 rounded-xl border border-[var(--brand-stroke)] bg-white hover:bg-slate-50 text-[var(--brand-black-font)] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Printer className="h-3.5 w-3.5 text-slate-500" />
          <span>Print</span>
        </button>

        <button
          type="button"
          onClick={onReceiveVerify}
          className="h-9 px-4 rounded-xl bg-[var(--brand-green)] hover:bg-[#0B6E63] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <CheckCheck className="h-4 w-4" />
          <span>Receive & Verify</span>
        </button>
      </div>
    </div>
  );
}
