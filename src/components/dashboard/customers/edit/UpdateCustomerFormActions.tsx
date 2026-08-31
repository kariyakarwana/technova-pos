"use client";

import Link from "next/link";

interface UpdateCustomerFormActionsProps {
  onCancel?: () => void;
  onUpdate?: () => void;
  isSubmitting?: boolean;
}

export default function UpdateCustomerFormActions({
  onCancel,
  onUpdate,
  isSubmitting = false,
}: UpdateCustomerFormActionsProps) {
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

      {/* Update Customer */}
      <button
        type="button"
        onClick={onUpdate}
        disabled={isSubmitting}
        className="h-10 px-6 rounded-xl bg-[var(--brand-green)] hover:bg-[#0B6E63] text-white text-xs font-bold flex items-center justify-center transition-colors shadow-xs cursor-pointer disabled:opacity-50"
      >
        {isSubmitting ? "Updating..." : "Update Customer"}
      </button>
    </div>
  );
}
