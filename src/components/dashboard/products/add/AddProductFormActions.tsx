"use client";

import Link from "next/link";

interface AddProductFormActionsProps {
  onCancel?: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

export default function AddProductFormActions({
  onCancel,
  onSubmit,
  isSubmitting = false,
}: AddProductFormActionsProps) {
  return (
    <div className="fixed bottom-0 left-72 right-0 z-30 flex justify-end gap-3 px-6 py-4 bg-white border-t border-[var(--brand-stroke)] shadow-[0_-1px_4px_0_rgba(0,0,0,0.06)]">
      <Link
        href="/products/product-list"
        onClick={onCancel}
        className="inline-flex items-center justify-center h-10 px-6 rounded-xl bg-[var(--brand-blue-pending)] text-white text-xs font-semibold hover:bg-[#071F36] active:scale-[0.98] transition-all"
      >
        Cancel
      </Link>
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="h-10 px-6 rounded-xl bg-[var(--brand-green)] text-white text-xs font-semibold hover:bg-[#0C7B6F] active:scale-[0.98] transition-all shadow-xs cursor-pointer disabled:opacity-50"
      >
        {isSubmitting ? "Creating..." : "Create Product"}
      </button>
    </div>
  );
}
