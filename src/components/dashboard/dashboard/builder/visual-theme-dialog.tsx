"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createVisualTheme, updateVisualTheme } from "@/lib/api/dashboard";
import { VisualThemePreview } from "./visual-theme-preview";
import type { VisualTheme, VisualThemeTokens } from "@/types/dashboard";

interface VisualThemeDialogProps {
  theme: VisualTheme | null;
  onSuccess: (theme: VisualTheme) => void;
  onClose: () => void;
}

function toFormTokens(tokens?: VisualThemeTokens): VisualThemeTokens {
  return {
    primaryColor: tokens?.primaryColor ?? "",
    backgroundColor: tokens?.backgroundColor ?? "",
    cardBackground: tokens?.cardBackground ?? "",
    surfaceColor: tokens?.surfaceColor ?? "",
    textColor: tokens?.textColor ?? "",
    secondaryColor: tokens?.secondaryColor ?? "",
    borderRadius: tokens?.borderRadius ?? "",
    fontFamily: tokens?.fontFamily ?? "",
  };
}

function toPayloadTokens(form: VisualThemeTokens): VisualThemeTokens {
  const out: VisualThemeTokens = {};
  for (const [k, v] of Object.entries(form)) {
    if (typeof v === "string" && v.trim() !== "") {
      (out as Record<string, string>)[k] = v.trim();
    }
  }
  return out;
}

interface FieldConfig {
  key: keyof VisualThemeTokens;
  label: string;
  placeholder: string;
  hint: string;
}

const COLOR_FIELDS: FieldConfig[] = [
  { key: "primaryColor", label: "Primary / Accent Color", placeholder: "#0E9384", hint: "hex, rgb(), or hsl()" },
  { key: "backgroundColor", label: "Page Background Color", placeholder: "#F8FAFC", hint: "hex, rgb(), or hsl()" },
  { key: "cardBackground", label: "Card Background Color", placeholder: "#FFFFFF", hint: "hex, rgb(), or hsl()" },
  { key: "surfaceColor", label: "Surface Color", placeholder: "#F1F5F9", hint: "hex, rgb(), or hsl()" },
  { key: "textColor", label: "Text Color", placeholder: "#1D2939", hint: "hex, rgb(), or hsl()" },
  { key: "secondaryColor", label: "Secondary Color", placeholder: "#092C4C", hint: "hex, rgb(), or hsl()" },
];

export function VisualThemeDialog({ theme, onSuccess, onClose }: VisualThemeDialogProps) {
  const isEditing = theme !== null;

  const [name, setName] = useState(theme?.name ?? "");
  const [description, setDescription] = useState(
    theme?.tokens?.customVariables?.description ?? "",
  );
  const [tokens, setTokens] = useState<VisualThemeTokens>(toFormTokens(theme?.tokens));
  const [nameError, setNameError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !submitting) onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [submitting, onClose]);

  function validateName(v: string): string | null {
    const t = v.trim();
    if (!t) return "Theme name is required.";
    if (t.length > 120) return "Theme name must be 120 characters or fewer.";
    return null;
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
    if (nameError) setNameError(validateName(e.target.value));
  }

  function handleTokenChange(key: keyof VisualThemeTokens, value: string) {
    setTokens((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const err = validateName(name);
    if (err) {
      setNameError(err);
      nameRef.current?.focus();
      return;
    }

    setSubmitting(true);
    setApiError(null);
    try {
      const payloadTokens = toPayloadTokens(tokens);
      if (description.trim()) {
        payloadTokens.customVariables = {
          ...payloadTokens.customVariables,
          description: description.trim().slice(0, 200),
        };
      }
      let saved: VisualTheme;
      if (isEditing) {
        saved = await updateVisualTheme(theme.id, { name: name.trim(), tokens: payloadTokens });
      } else {
        saved = await createVisualTheme({ name: name.trim(), tokens: payloadTokens });
      }
      onSuccess(saved);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save theme.";
      if (msg.includes("403") || msg.toLowerCase().includes("forbidden")) {
        setApiError("You do not have permission to manage visual themes.");
      } else {
        setApiError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  }

  const previewTokens = toPayloadTokens(tokens);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="vt-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
        onClick={submitting ? undefined : onClose}
      />
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border border-[var(--brand-stroke)] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--brand-stroke)] px-6 py-4">
          <h2 id="vt-dialog-title" className="text-base font-semibold text-[var(--brand-black-font)]">
            {isEditing ? "Edit Theme" : "Create Theme"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex size-7 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
            aria-label="Close dialog"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {apiError && (
              <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                {apiError}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="vt-name">
                Theme Name <span aria-hidden="true" className="text-rose-500">*</span>
              </Label>
              <Input
                ref={nameRef}
                id="vt-name"
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="e.g. Dark Forest"
                maxLength={120}
                required
                aria-required="true"
                aria-invalid={nameError !== null}
                aria-describedby={nameError ? "vt-name-error" : undefined}
                disabled={submitting}
              />
              {nameError && (
                <p id="vt-name-error" role="alert" className="text-xs text-rose-600">{nameError}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="vt-description">
                Description <span className="text-xs text-slate-400 font-normal">(optional)</span>
              </Label>
              <Input
                id="vt-description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Modern dark theme with emerald accents"
                maxLength={200}
                disabled={submitting}
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Color Tokens</p>
              <p className="text-[10px] text-slate-400">All fields are optional. Leave blank to inherit the default value.</p>
            </div>

            {COLOR_FIELDS.map(({ key, label, placeholder, hint }) => (
              <div key={key} className="space-y-1.5">
                <Label htmlFor={`vt-${key}`}>{label}</Label>
                <div className="flex items-center gap-2">
                  {tokens[key] && (
                    <div
                      className="size-6 shrink-0 rounded-md border border-black/10"
                      style={{ backgroundColor: tokens[key] as string }}
                      aria-hidden="true"
                    />
                  )}
                  <Input
                    id={`vt-${key}`}
                    type="text"
                    value={tokens[key] as string}
                    onChange={(e) => handleTokenChange(key, e.target.value)}
                    placeholder={placeholder}
                    disabled={submitting}
                    aria-label={`${label} — ${hint}`}
                  />
                </div>
              </div>
            ))}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="vt-borderRadius">Border Radius</Label>
                <Input
                  id="vt-borderRadius"
                  type="text"
                  value={tokens.borderRadius ?? ""}
                  onChange={(e) => handleTokenChange("borderRadius", e.target.value)}
                  placeholder="e.g. 8px or 0.5rem"
                  disabled={submitting}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vt-fontFamily">Font Family</Label>
                <Input
                  id="vt-fontFamily"
                  type="text"
                  value={tokens.fontFamily ?? ""}
                  onChange={(e) => handleTokenChange("fontFamily", e.target.value)}
                  placeholder="e.g. Inter, sans-serif"
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-medium text-slate-500">Preview</p>
              <VisualThemePreview tokens={previewTokens} size="md" />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-[var(--brand-stroke)] px-6 py-4">
            <button
              type="button"
              id="vt-dialog-cancel-btn"
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
              id="vt-dialog-submit-btn"
            >
              {submitting ? "Saving…" : isEditing ? "Update Theme" : "Create Theme"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
