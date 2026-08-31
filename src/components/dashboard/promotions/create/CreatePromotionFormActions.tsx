"use client";

import Link from "next/link";

interface CreatePromotionFormActionsProps {
  onCancel?: () => void;
  onCreate?: () => void;
  isSubmitting?: boolean;
}

export default function CreatePromotionFormActions({
  onCancel,
  onCreate,
  isSubmitting = false,
}: CreatePromotionFormActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3 pt-2">
      {/* Cancel */}
      <Link
        href="/promotions"
        onClick={onCancel}
        className="h-10 px-5 rounded-xl bg-[#004532] hover:bg-[#003828] text-white text-xs font-semibold flex items-center justify-center transition-colors shadow-xs"
      >
        Cancel
      </Link>

      {/* Create Promotion */}
      <button
        type="button"
        onClick={onCreate}
        disabled={isSubmitting}
        className="h-10 px-6 rounded-xl bg-[var(--brand-green)] hover:bg-[#0B6E63] text-white text-xs font-bold flex items-center justify-center transition-colors shadow-xs cursor-pointer disabled:opacity-50"
      >
        {isSubmitting ? "Creating..." : "Create Promotion"}
      </button>
    </div>
  );
}
