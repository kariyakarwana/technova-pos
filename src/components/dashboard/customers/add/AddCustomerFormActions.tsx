"use client";

import Link from "next/link";

interface AddCustomerFormActionsProps {
  onCancel?: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

export default function AddCustomerFormActions({
  onCancel,
  onSubmit,
  isSubmitting = false,
}: AddCustomerFormActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3 pt-2">
      {/* Cancel */}
      <Link
        href="/customers"
        onClick={onCancel}
        className="h-10 px-5 rounded-xl bg-[#004532] hover:bg-[#003828] text-white text-xs font-semibold flex items-center justify-center transition-colors shadow-xs"
      >
        Cancel
      </Link>

      {/* Add Customer */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="h-10 px-6 rounded-xl bg-[var(--brand-green)] hover:bg-[#0B6E63] text-white text-xs font-bold flex items-center justify-center transition-colors shadow-xs cursor-pointer disabled:opacity-50"
      >
        {isSubmitting ? "Adding..." : "Add Customer"}
      </button>
    </div>
  );
}
