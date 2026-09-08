"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getVisualThemes,
  setDefaultVisualTheme,
  deleteVisualTheme,
} from "@/lib/api/dashboard";
import { VisualThemePreview } from "./visual-theme-preview";
import { VisualThemeDialog } from "./visual-theme-dialog";
import type { VisualTheme } from "@/types/dashboard";

interface VisualThemePanelProps {
  activeThemeId: string | null;
  onApply: (theme: VisualTheme) => void;
}

type DialogMode = { type: "create" } | { type: "edit"; theme: VisualTheme } | null;
type DeleteState = { themeId: string; themeName: string } | null;

function permissionError(msg: string): boolean {
  return msg.includes("403") || msg.toLowerCase().includes("forbidden");
}

export function VisualThemePanel({ activeThemeId, onApply }: VisualThemePanelProps) {
  const [themes, setThemes] = useState<VisualTheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [pendingDelete, setPendingDelete] = useState<DeleteState>(null);

  const [actionError, setActionError] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setListError(null);
    try {
      const res = await getVisualThemes({ pageSize: 50 });
      setThemes(res.data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load themes.";
      setListError(permissionError(msg) ? "You do not have permission to view visual themes." : msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function handleThemeSaved(saved: VisualTheme) {
    setDialogMode(null);
    setThemes((prev) => {
      const idx = prev.findIndex((t) => t.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [...prev, saved];
    });
  }

  async function handleSetDefault(themeId: string) {
    setSettingDefaultId(themeId);
    setActionError(null);
    try {
      const updated = await setDefaultVisualTheme(themeId);
      setThemes((prev) =>
        prev.map((t) => ({ ...t, isDefault: t.id === updated.id })),
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to set default.";
      setActionError(permissionError(msg) ? "You do not have permission to manage visual themes." : msg);
    } finally {
      setSettingDefaultId(null);
    }
  }

  async function handleDeleteConfirm() {
    if (!pendingDelete) return;
    const { themeId } = pendingDelete;
    setDeletingId(themeId);
    setPendingDelete(null);
    setActionError(null);
    try {
      await deleteVisualTheme(themeId);
      setThemes((prev) => prev.filter((t) => t.id !== themeId));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete theme.";
      setActionError(permissionError(msg) ? "You do not have permission to manage visual themes." : msg);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="rounded-2xl border border-dashed border-[var(--brand-green)]/40 bg-white p-4 shadow-xs">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-green)]">
          Visual Themes
        </p>
        <Button
          id="vt-create-btn"
          size="sm"
          variant="outline"
          onClick={() => setDialogMode({ type: "create" })}
          className="h-7 gap-1 text-xs"
          aria-label="Create a new visual theme"
        >
          <Plus className="size-3" />
          New Theme
        </Button>
      </div>

      {actionError && (
        <div role="alert" className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
          {actionError}
        </div>
      )}

      {loading && (
        <p role="status" aria-live="polite" className="py-6 text-center text-xs text-slate-400">
          Loading themes…
        </p>
      )}

      {!loading && listError && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-medium text-rose-700">
          {listError}
        </div>
      )}

      {!loading && !listError && themes.length === 0 && (
        <div className="py-8 text-center" aria-live="polite">
          <p className="text-xs text-slate-400">No themes yet. Create one to get started.</p>
        </div>
      )}

      {!loading && !listError && themes.length > 0 && (
        <ul role="list" aria-label="Available visual themes" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {themes.map((theme) => {
            const isActive = activeThemeId === theme.id;
            const isSettingDefault = settingDefaultId === theme.id;
            const isDeleting = deletingId === theme.id;

            return (
              <li key={theme.id}>
                <div
                  className={`flex flex-col gap-2 rounded-xl border p-3 transition-colors ${
                    isActive
                      ? "border-[var(--brand-green)] bg-[var(--brand-green-transparent)] ring-1 ring-[var(--brand-green)]/30"
                      : "border-[var(--brand-stroke)] bg-[var(--brand-app-bg)]"
                  }`}
                >
                  <VisualThemePreview tokens={theme.tokens} size="md" />

                  <div className="flex items-start justify-between gap-1">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-[var(--brand-black-font)]">
                        {theme.name}
                      </p>
                      {theme.tokens?.customVariables?.description && (
                        <p className="line-clamp-2 mt-0.5 text-[11px] text-slate-500">
                          {theme.tokens.customVariables.description}
                        </p>
                      )}
                      <div className="mt-0.5 flex items-center gap-1.5">
                        {theme.isDefault && (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-[var(--brand-green)]/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[var(--brand-green)]">
                            <Star className="size-2.5" aria-hidden="true" />
                            Default
                          </span>
                        )}
                        {isActive && (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-emerald-600">
                            <CheckCircle2 className="size-2.5" aria-hidden="true" />
                            Applied
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    <Button
                      id={`vt-apply-${theme.id}`}
                      size="sm"
                      variant={isActive ? "default" : "outline"}
                      onClick={() => onApply(theme)}
                      disabled={isActive || isDeleting}
                      className={`h-6 flex-1 text-[10px] ${
                        isActive
                          ? "bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green)]/90"
                          : ""
                      }`}
                      aria-label={isActive ? `${theme.name} is currently applied` : `Apply theme: ${theme.name}`}
                      aria-pressed={isActive}
                    >
                      {isActive ? "Applied" : "Apply"}
                    </Button>
                    <button
                      type="button"
                      id={`vt-edit-${theme.id}`}
                      onClick={() => setDialogMode({ type: "edit", theme })}
                      disabled={isDeleting}
                      aria-label={`Edit theme: ${theme.name}`}
                      className="flex size-6 items-center justify-center rounded-lg border border-[var(--brand-stroke)] bg-white text-slate-500 transition-colors hover:border-[var(--brand-green)]/60 hover:text-[var(--brand-green)] disabled:opacity-40"
                    >
                      <Pencil className="size-3" />
                    </button>
                    <button
                      type="button"
                      id={`vt-default-${theme.id}`}
                      onClick={() => void handleSetDefault(theme.id)}
                      disabled={theme.isDefault || isSettingDefault || isDeleting}
                      aria-label={theme.isDefault ? `${theme.name} is already the default` : `Set ${theme.name} as default`}
                      className="flex size-6 items-center justify-center rounded-lg border border-[var(--brand-stroke)] bg-white text-slate-500 transition-colors hover:border-amber-300 hover:text-amber-500 disabled:opacity-40"
                    >
                      <Star className="size-3" />
                    </button>
                    <button
                      type="button"
                      id={`vt-delete-${theme.id}`}
                      onClick={() => setPendingDelete({ themeId: theme.id, themeName: theme.name })}
                      disabled={isDeleting}
                      aria-label={`Delete theme: ${theme.name}`}
                      className="flex size-6 items-center justify-center rounded-lg border border-[var(--brand-stroke)] bg-white text-slate-500 transition-colors hover:border-rose-300 hover:text-rose-500 disabled:opacity-40"
                    >
                      {isDeleting ? (
                        <span className="size-3 animate-spin rounded-full border border-rose-400 border-t-transparent" />
                      ) : (
                        <Trash2 className="size-3" />
                      )}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {pendingDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="vt-delete-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => setPendingDelete(null)}
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-[var(--brand-stroke)] bg-white p-6 shadow-xl">
            <h3 id="vt-delete-title" className="text-base font-semibold text-[var(--brand-black-font)]">
              Delete Theme
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Delete{" "}
              <span className="font-semibold">{pendingDelete.themeName}</span>? This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                id="vt-delete-cancel-btn"
                onClick={() => setPendingDelete(null)}
                className="inline-flex h-7 items-center justify-center rounded-[min(var(--radius-md),12px)] border border-border bg-background px-2.5 text-[0.8rem] font-medium transition-all hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
              >
                Cancel
              </button>
              <Button
                type="button"
                size="sm"
                id="vt-delete-confirm-btn"
                onClick={() => void handleDeleteConfirm()}
                className="bg-rose-600 text-white hover:bg-rose-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {dialogMode && (
        <VisualThemeDialog
          theme={dialogMode.type === "edit" ? dialogMode.theme : null}
          onSuccess={handleThemeSaved}
          onClose={() => setDialogMode(null)}
        />
      )}
    </div>
  );
}
