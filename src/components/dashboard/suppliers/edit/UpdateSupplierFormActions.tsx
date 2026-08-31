"use client";

import Link from "next/link";

interface UpdateSupplierFormActionsProps {
  onCancel?: () => void;
  onSaveDraft?: () => void;
  onSaveCreate?: () => void;
  isSubmitting?: boolean;
}

export default function UpdateSupplierFormActions({
  onCancel,
  onSaveDraft,
  onSaveCreate,
  isSubmitting = false,
}: UpdateSupplierFormActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3 pt-2">
      {/* Cancel */}
      <Link
        href="/suppliers/management"
        onClick={onCancel}
        className="h-10 px-5 rounded-xl border border-[var(--brand-stroke)] bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center transition-colors shadow-xs"
      >
        Cancel
      </Link>

      {/* Save as Draft */}
      <button
        type="button"
        onClick={onSaveDraft}
        disabled={isSubmitting}
        className="h-10 px-5 rounded-xl border border-[var(--brand-stroke)] bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center transition-colors shadow-xs cursor-pointer disabled:opacity-50"
      >
        Save as Draft
      </button>

      {/* Save & Create / Update */}
      <button
        type="button"
        onClick={onSaveCreate}
        disabled={isSubmitting}
        className="h-10 px-6 rounded-xl bg-[var(--brand-green)] hover:bg-[#0B6E63] text-white text-xs font-bold flex items-center justify-center transition-colors shadow-xs cursor-pointer disabled:opacity-50"
      >
        {isSubmitting ? "Updating..." : "Save & Create"}
      </button>
    </div>
  );
}
