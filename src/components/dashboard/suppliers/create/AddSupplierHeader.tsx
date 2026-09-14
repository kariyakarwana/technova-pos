"use client";

import { BackButton } from "@/components/ui/back-button";

interface AddSupplierHeaderProps {
  isPreferred: boolean;
  onTogglePreferred: (value: boolean) => void;
}

export default function AddSupplierHeader({
  isPreferred,
  onTogglePreferred,
}: AddSupplierHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0E9384]">
          Suppliers / Management
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Add New Supplier
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Create and register a new vendor or supplier with contact and financial terms.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 self-start sm:self-auto">
        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={isPreferred}
            onClick={() => onTogglePreferred(!isPreferred)}
            className={[
              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
              isPreferred ? "bg-[var(--brand-green)]" : "bg-slate-200",
            ].join(" ")}
          >
            <span
              className={[
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                isPreferred ? "translate-x-5" : "translate-x-0",
              ].join(" ")}
            />
          </button>
          <span className="text-xs font-semibold text-[var(--brand-black-font)]">
            Preferred Supplier
          </span>
        </div>

        <BackButton
          href="/suppliers/management"
          label="Back to Suppliers"
        />
      </div>
    </header>
  );
}
