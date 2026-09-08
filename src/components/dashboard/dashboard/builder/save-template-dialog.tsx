"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createDashboardTemplate } from "@/lib/api/dashboard";
import type { DashboardLayout } from "@/types/dashboard";

interface SaveTemplateDialogProps {
  workingLayout: DashboardLayout;
  onSuccess: (templateName: string) => void;
  onClose: () => void;
}

export function SaveTemplateDialog({
  workingLayout,
  onSuccess,
  onClose,
}: SaveTemplateDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !submitting) {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [submitting, onClose]);

  function validateName(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) return "Template name is required.";
    if (trimmed.length > 120) return "Template name must be 120 characters or fewer.";
    return null;
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
    if (nameError) setNameError(validateName(e.target.value));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const error = validateName(name);
    if (error) {
      setNameError(error);
      nameInputRef.current?.focus();
      return;
    }

    setSubmitting(true);
    setApiError(null);
    try {
      const created = await createDashboardTemplate({
        name: name.trim(),
        description: description.trim() || undefined,
        layout: workingLayout,
      });
      onSuccess(created.name);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save template.";
      if (msg.includes("403") || msg.toLowerCase().includes("forbidden")) {
        setApiError("You do not have permission to create dashboard templates.");
      } else {
        setApiError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="save-template-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
        onClick={submitting ? undefined : onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--brand-stroke)] bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="absolute right-4 top-4 flex size-7 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
          aria-label="Close dialog"
        >
          <X className="size-4" />
        </button>

        <h2
          id="save-template-title"
          className="text-base font-semibold text-[var(--brand-black-font)]"
        >
          Save as Template
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Save the current dashboard layout as a reusable template.
        </p>

        {apiError && (
          <div
            role="alert"
            className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700"
          >
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="save-template-name">
              Template Name <span aria-hidden="true" className="text-rose-500">*</span>
            </Label>
            <Input
              ref={nameInputRef}
              id="save-template-name"
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. Sales Overview"
              maxLength={120}
              required
              aria-required="true"
              aria-invalid={nameError !== null}
              aria-describedby={nameError ? "save-template-name-error" : undefined}
              disabled={submitting}
            />
            {nameError && (
              <p
                id="save-template-name-error"
                role="alert"
                className="text-xs text-rose-600"
              >
                {nameError}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="save-template-description">
              Description <span className="font-normal text-slate-400">(optional)</span>
            </Label>
            <textarea
              id="save-template-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe this template…"
              maxLength={500}
              rows={3}
              disabled={submitting}
              className="h-auto w-full min-w-0 resize-none rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm placeholder:text-muted-foreground transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              id="save-template-cancel-btn"
              onClick={onClose}
              disabled={submitting}
              className="inline-flex h-7 items-center justify-center rounded-[min(var(--radius-md),12px)] border border-border bg-background px-2.5 text-[0.8rem] font-medium transition-all hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
            >
              Cancel
            </button>
            <Button
              type="submit"
              size="sm"
              disabled={submitting}
              className="bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green)]/90"
              id="save-template-submit-btn"
            >
              {submitting ? "Saving…" : "Save Template"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
