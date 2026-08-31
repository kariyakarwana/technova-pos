"use client";

import { Check, Search } from "lucide-react";
import type { ReturnLookupResult } from "./ProcessReturnMock";

interface TransactionLookupCardProps {
  query: string;
  onQueryChange: (val: string) => void;
  onSearch: () => void;
  lookupResult: ReturnLookupResult | null;
  isSearching?: boolean;
}

export default function TransactionLookupCard({
  query,
  onQueryChange,
  onSearch,
  lookupResult,
  isSearching = false,
}: TransactionLookupCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-full bg-[var(--brand-green)] text-white text-xs font-bold flex items-center justify-center">
            1
          </div>
          <h2 className="text-base font-bold text-[var(--brand-black-font)]">
            Transaction Lookup
          </h2>
        </div>

        <span className="text-[11px] font-mono text-slate-400 font-medium">
          FR-RET-001
        </span>
      </div>

      {/* Search Input Box */}
      <div className="bg-[#F0FDF9] border border-[#CBEFE8] rounded-xl p-1.5 flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Enter Transaction / Invoice ID..."
          className="flex-1 px-3.5 py-1.5 text-xs text-[var(--brand-black-font)] bg-transparent placeholder:text-slate-400 font-semibold focus:outline-none"
        />
        <button
          type="button"
          onClick={onSearch}
          disabled={isSearching}
          className="px-4 py-2 rounded-lg bg-[var(--brand-green)] hover:bg-[#0B6E63] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
        >
          <Search className="h-3.5 w-3.5" />
          <span>{isSearching ? "Searching..." : "Search"}</span>
        </button>
      </div>

      {/* Verified Invoice Notification Card */}
      {lookupResult && lookupResult.isVerified && (
        <div className="border border-[var(--brand-stroke)] rounded-xl p-4 flex items-center justify-between bg-white shadow-2xs">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold text-[var(--brand-black-font)]">
              Invoice #{lookupResult.invoiceNumber}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Purchased: {lookupResult.purchaseDate} • Customer:{" "}
              {lookupResult.customerName}
            </p>
          </div>

          <div className="h-6 w-6 rounded-full bg-[var(--brand-green)] text-white flex items-center justify-center shrink-0">
            <Check className="h-3.5 w-3.5 stroke-[3]" />
          </div>
        </div>
      )}
    </div>
  );
}
