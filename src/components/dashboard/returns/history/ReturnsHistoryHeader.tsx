"use client";

import { BackButton } from "@/components/ui/back-button";

export default function ReturnsHistoryHeader() {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0E9384]">
          Returns & Refunds / History
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Returns History
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Complete refund, store-credit, points and exchange audit trail.
        </p>
      </div>
      <BackButton
        href="/returns-refunds"
        label="Back to Returns"
        className="self-start sm:self-auto"
      />
    </header>
  );
}
