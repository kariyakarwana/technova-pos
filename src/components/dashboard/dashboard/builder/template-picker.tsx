"use client";

import { useCallback, useEffect, useState } from "react";
import { LayoutTemplate, Search, X } from "lucide-react";
import { getDashboardTemplates } from "@/lib/api/dashboard";
import type { DashboardTemplate } from "@/types/dashboard";

interface TemplateSummary {
  widgetCount: number;
  columns: number;
}

function extractSummary(template: DashboardTemplate): TemplateSummary {
  const layout = template.layout;
  return {
    widgetCount: Array.isArray(layout?.widgets) ? layout.widgets.length : 0,
    columns: layout?.columns ?? 12,
  };
}

interface TemplatePickerProps {
  onSelect: (template: DashboardTemplate) => void;
  refreshKey?: number;
  selectedTemplateId?: string | null;
}

export function TemplatePicker({
  onSelect,
  refreshKey = 0,
  selectedTemplateId = null,
}: TemplatePickerProps) {
  const [templates, setTemplates] = useState<DashboardTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const load = useCallback(async (searchTerm: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getDashboardTemplates({
        search: searchTerm || undefined,
        pageSize: 50,
      });
      setTemplates(result.data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load templates.";
      if (msg.includes("403") || msg.toLowerCase().includes("forbidden")) {
        setError("You do not have permission to view dashboard templates.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setSearch("");
    void load("");
  }, [load, refreshKey]);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void load(search);
  }

  function handleClearSearch() {
    setSearch("");
    void load("");
  }

  function handleSelect(template: DashboardTemplate) {
    setSelected(template.id);
    onSelect(template);
  }

  const activeSelectedId = selectedTemplateId !== undefined ? selectedTemplateId : selected;

  return (
    <div className="rounded-2xl border border-dashed border-[var(--brand-green)]/40 bg-white p-4 shadow-xs">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--brand-green)]">
        Apply Template
      </p>

      <form
        onSubmit={handleSearchSubmit}
        role="search"
        className="mb-3 flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
          <input
            id="template-search-input"
            type="search"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search templates…"
            aria-label="Search dashboard templates"
            className="h-8 w-full rounded-lg border border-[var(--brand-stroke)] bg-[var(--brand-app-bg)] pl-8 pr-7 text-xs outline-none transition-colors focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)]/30"
          />
          {search && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Clear template search"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="h-8 rounded-lg border border-[var(--brand-stroke)] bg-[var(--brand-app-bg)] px-3 text-xs font-medium transition-colors hover:border-[var(--brand-green)]/60 hover:bg-[var(--brand-green-transparent)]"
          aria-label="Search"
        >
          Search
        </button>
      </form>

      {loading && (
        <p className="py-6 text-center text-xs text-slate-400" role="status" aria-live="polite">
          Loading templates…
        </p>
      )}

      {!loading && error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-medium text-rose-700"
        >
          {error}
        </div>
      )}

      {!loading && !error && templates.length === 0 && (
        <div className="py-8 text-center" aria-live="polite">
          <LayoutTemplate className="mx-auto mb-2 size-8 text-slate-300" />
          <p className="text-xs text-slate-400">
            {search ? `No templates matching "${search}".` : "No templates found."}
          </p>
          {search && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="mt-2 text-xs font-medium text-[var(--brand-green)] hover:underline"
            >
              Clear search filter
            </button>
          )}
        </div>
      )}

      {!loading && !error && templates.length > 0 && (
        <ul
          role="list"
          aria-label="Available dashboard templates"
          className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3"
        >
          {templates.map((template) => {
            const summary = extractSummary(template);
            const isSelected = activeSelectedId === template.id;
            return (
              <li key={template.id}>
                <button
                  type="button"
                  id={`template-card-${template.id}`}
                  aria-label={`Apply template: ${template.name}`}
                  aria-pressed={isSelected}
                  onClick={() => handleSelect(template)}
                  className={`flex w-full flex-col gap-1 rounded-xl border p-3 text-left transition-colors ${
                    isSelected
                      ? "border-[var(--brand-green)] bg-[var(--brand-green-transparent)] ring-1 ring-[var(--brand-green)]/40"
                      : "border-[var(--brand-stroke)] bg-[var(--brand-app-bg)] hover:border-[var(--brand-green)]/60 hover:bg-[var(--brand-green-transparent)]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-xs font-semibold text-[var(--brand-black-font)]">
                      {template.name}
                    </p>
                    {template.isSystem && (
                      <span className="shrink-0 rounded-full bg-[var(--brand-green)]/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[var(--brand-green)]">
                        System
                      </span>
                    )}
                  </div>

                  {template.description && (
                    <p className="line-clamp-2 text-[10px] leading-relaxed text-slate-500">
                      {template.description}
                    </p>
                  )}

                  {template.category && (
                    <p className="text-[10px] font-medium text-slate-400">
                      {template.category}
                    </p>
                  )}

                  <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                    <span>{summary.widgetCount} widget{summary.widgetCount !== 1 ? "s" : ""}</span>
                    <span aria-hidden="true">·</span>
                    <span>{summary.columns}-column grid</span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
