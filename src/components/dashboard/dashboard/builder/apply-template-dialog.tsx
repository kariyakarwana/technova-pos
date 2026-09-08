"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DashboardTemplate } from "@/types/dashboard";

interface ApplyTemplateDialogProps {
  template: DashboardTemplate;
  hasUnsavedChanges: boolean;
  isApplying: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ApplyTemplateDialog({
  template,
  hasUnsavedChanges,
  isApplying,
  onConfirm,
  onCancel,
}: ApplyTemplateDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !isApplying) {
        onCancel();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isApplying, onCancel]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-template-title"
      aria-describedby="apply-template-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
        onClick={isApplying ? undefined : onCancel}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--brand-stroke)] bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onCancel}
          disabled={isApplying}
          className="absolute right-4 top-4 flex size-7 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
          aria-label="Close dialog"
        >
          <X className="size-4" />
        </button>

        <h2
          id="apply-template-title"
          className="text-base font-semibold text-[var(--brand-black-font)]"
        >
          Apply Template
        </h2>

        <div id="apply-template-desc" className="mt-3 space-y-2">
          <p className="text-sm text-slate-600">
            Apply{" "}
            <span className="font-semibold text-[var(--brand-black-font)]">
              {template.name}
            </span>{" "}
            to your dashboard?
          </p>
          <p className="text-sm text-slate-500">
            This will replace your current layout with the template layout.
          </p>
          {hasUnsavedChanges && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
              You have unsaved changes. Applying a template will discard them.
            </p>
          )}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            id="apply-template-cancel-btn"
            onClick={onCancel}
            disabled={isApplying}
            className="inline-flex h-7 items-center justify-center rounded-[min(var(--radius-md),12px)] border border-border bg-background px-2.5 text-[0.8rem] font-medium transition-all hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
          >
            Cancel
          </button>
          <Button
            type="button"
            size="sm"
            onClick={onConfirm}
            disabled={isApplying}
            className="bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green)]/90"
            id="apply-template-confirm-btn"
          >
            {isApplying ? "Applying…" : "Apply Template"}
          </Button>
        </div>
      </div>
    </div>
  );
}
