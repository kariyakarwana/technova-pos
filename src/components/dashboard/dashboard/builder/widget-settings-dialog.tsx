"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { RotateCcw, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWidgetDefinition } from "@/components/dashboard/dashboard/registry/widget-registry";
import type {
  DashboardLayoutWidget,
  DashboardWidgetSettings,
} from "@/types/dashboard";

interface WidgetSettingsDialogProps {
  widget: DashboardLayoutWidget;
  onApply: (settings: DashboardWidgetSettings, title?: string) => void;
  onClose: () => void;
}

export function WidgetSettingsDialog({
  widget,
  onApply,
  onClose,
}: WidgetSettingsDialogProps) {
  const definition = getWidgetDefinition(widget.type);
  const titleInputId = useId();

  const [title, setTitle] = useState<string>(widget.title ?? definition?.name ?? "");
  const [settings, setSettings] = useState<DashboardWidgetSettings>(() => ({
    ...(definition?.defaultSettings ?? {}),
    ...(widget.settings ?? {}),
  }));

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleFieldChange = useCallback(
    (key: string, value: unknown) => {
      setSettings((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  const handleResetToDefaults = useCallback(() => {
    setTitle(definition?.name ?? widget.title ?? "");
    setSettings({ ...(definition?.defaultSettings ?? {}) });
  }, [definition, widget.title]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(settings, title.trim() ? title.trim() : undefined);
    onClose();
  };

  const fields = definition?.settingsFields ?? [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="widget-settings-title"
      aria-describedby="widget-settings-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--brand-stroke)] bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-[var(--brand-green)]/10 text-[var(--brand-green)]">
              <Settings className="size-4" />
            </div>
            <div>
              <h2
                id="widget-settings-title"
                className="text-base font-bold text-[var(--brand-black-font)]"
              >
                Configure Widget
              </h2>
              <p id="widget-settings-desc" className="text-xs text-slate-500">
                {definition?.name ?? widget.type}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close widget settings"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Custom Widget Title Field */}
          <div className="space-y-1.5">
            <label
              htmlFor={titleInputId}
              className="text-xs font-semibold text-slate-700"
            >
              Widget Title
            </label>
            <input
              id={titleInputId}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={definition?.name ?? "Widget Title"}
              className="h-9 w-full rounded-xl border border-[var(--brand-stroke)] bg-slate-50 px-3 text-xs text-slate-800 placeholder-slate-400 focus:border-[var(--brand-green)] focus:bg-white focus:outline-none"
            />
          </div>

          {/* Configurable Settings Fields */}
          {fields.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-3 text-center text-xs text-slate-500">
              No additional configuration options available for this widget.
            </p>
          ) : (
            fields.map((field) => {
              const fieldId = `setting-${field.key}`;
              const value = settings[field.key];

              return (
                <div key={field.key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={fieldId}
                      className="text-xs font-semibold text-slate-700"
                    >
                      {field.label}
                    </label>
                  </div>

                  {field.type === "select" && (
                    <select
                      id={fieldId}
                      value={String(value ?? "")}
                      onChange={(e) => {
                        const raw = e.target.value;
                        // Coerce to number if options are numeric
                        const num = Number(raw);
                        const finalVal =
                          !isNaN(num) &&
                          field.options?.some((o) => typeof o.value === "number")
                            ? num
                            : raw;
                        handleFieldChange(field.key, finalVal);
                      }}
                      className="h-9 w-full rounded-xl border border-[var(--brand-stroke)] bg-slate-50 px-3 text-xs text-slate-800 focus:border-[var(--brand-green)] focus:bg-white focus:outline-none cursor-pointer"
                    >
                      {field.options?.map((opt) => (
                        <option key={String(opt.value)} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {field.type === "number" && (
                    <input
                      id={fieldId}
                      type="number"
                      min={field.min}
                      max={field.max}
                      step={field.step ?? 1}
                      value={typeof value === "number" ? value : (field.min ?? 0)}
                      onChange={(e) =>
                        handleFieldChange(field.key, Number(e.target.value))
                      }
                      className="h-9 w-full rounded-xl border border-[var(--brand-stroke)] bg-slate-50 px-3 text-xs text-slate-800 focus:border-[var(--brand-green)] focus:bg-white focus:outline-none"
                    />
                  )}

                  {field.type === "boolean" && (
                    <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-[var(--brand-stroke)] bg-slate-50 p-2.5 hover:bg-slate-100/70 transition-colors">
                      <input
                        id={fieldId}
                        type="checkbox"
                        checked={Boolean(value)}
                        onChange={(e) =>
                          handleFieldChange(field.key, e.target.checked)
                        }
                        className="size-4 rounded border-slate-300 text-[var(--brand-green)] focus:ring-[var(--brand-green)]"
                      />
                      <span className="text-xs text-slate-700 select-none">
                        Enabled
                      </span>
                    </label>
                  )}

                  {field.description && (
                    <p className="text-[11px] text-slate-500">
                      {field.description}
                    </p>
                  )}
                </div>
              );
            })
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResetToDefaults}
              className="gap-1.5 text-xs text-slate-500 hover:text-slate-800"
            >
              <RotateCcw className="size-3" />
              Reset Defaults
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green)]/90 text-xs"
              >
                Apply Settings
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
