"use client";

import { BookmarkPlus, LayoutGrid, LayoutTemplate, Palette, RotateCcw, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardBuilderToolbarProps {
  isEditing: boolean;
  isSaving: boolean;
  showingTemplates: boolean;
  showingThemes: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onReset: () => void;
  onToggleTemplates: () => void;
  onToggleThemes: () => void;
  onSaveAsTemplate: () => void;
}

export function DashboardBuilderToolbar({
  isEditing,
  isSaving,
  showingTemplates,
  showingThemes,
  onEdit,
  onSave,
  onCancel,
  onReset,
  onToggleTemplates,
  onToggleThemes,
  onSaveAsTemplate,
}: DashboardBuilderToolbarProps) {
  if (!isEditing) {
    return (
      <Button
        id="dashboard-customize-btn"
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="gap-1.5"
      >
        <LayoutGrid className="size-3.5" />
        Customize
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        id="dashboard-templates-btn"
        variant={showingTemplates ? "default" : "outline"}
        size="sm"
        onClick={onToggleTemplates}
        disabled={isSaving}
        className={
          showingTemplates
            ? "gap-1.5 bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green)]/90"
            : "gap-1.5"
        }
        aria-label={showingTemplates ? "Hide templates panel" : "Show templates panel"}
        aria-pressed={showingTemplates}
      >
        <LayoutTemplate className="size-3.5" />
        Templates
      </Button>
      <Button
        id="dashboard-themes-btn"
        variant={showingThemes ? "default" : "outline"}
        size="sm"
        onClick={onToggleThemes}
        disabled={isSaving}
        className={
          showingThemes
            ? "gap-1.5 bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green)]/90"
            : "gap-1.5"
        }
        aria-label={showingThemes ? "Hide themes panel" : "Show themes panel"}
        aria-pressed={showingThemes}
      >
        <Palette className="size-3.5" />
        Themes
      </Button>
      <Button
        id="dashboard-save-as-template-btn"
        variant="outline"
        size="sm"
        onClick={onSaveAsTemplate}
        disabled={isSaving}
        className="gap-1.5"
        aria-label="Save current layout as a template"
      >
        <BookmarkPlus className="size-3.5" />
        Save as Template
      </Button>
      <Button
        id="dashboard-reset-btn"
        variant="ghost"
        size="sm"
        onClick={onReset}
        disabled={isSaving}
        className="gap-1.5 text-slate-600"
        aria-label="Reset to default layout"
      >
        <RotateCcw className="size-3.5" />
        Reset to Default
      </Button>
      <Button
        id="dashboard-cancel-btn"
        variant="outline"
        size="sm"
        onClick={onCancel}
        disabled={isSaving}
        className="gap-1.5"
        aria-label="Cancel editing"
      >
        <X className="size-3.5" />
        Cancel
      </Button>
      <Button
        id="dashboard-save-btn"
        size="sm"
        onClick={onSave}
        disabled={isSaving}
        className="gap-1.5 bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green)]/90"
        aria-label="Save dashboard layout"
      >
        {isSaving ? (
          <span className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <Save className="size-3.5" />
        )}
        {isSaving ? "Saving…" : "Save Layout"}
      </Button>
    </div>
  );
}
