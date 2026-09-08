"use client";

import { Plus } from "lucide-react";
import {
  getAllWidgetDefinitions,
  getWidgetDefinition,
} from "@/components/dashboard/dashboard/registry/widget-registry";
import type { DashboardLayout, DashboardLayoutWidget } from "@/types/dashboard";

interface WidgetPickerProps {
  currentLayout: DashboardLayout;
  onAdd: (widget: DashboardLayoutWidget) => void;
}

/** Derives the next Y position to append a new widget below existing ones. */
function nextYPosition(layout: DashboardLayout): number {
  if (layout.widgets.length === 0) return 0;
  return Math.max(
    ...layout.widgets.map((w) => w.position.y + w.position.h),
  );
}

/** Returns true when the widget type already exists in the current layout. */
function isAlreadyAdded(layout: DashboardLayout, type: string): boolean {
  return layout.widgets.some((w) => w.type === type);
}

export function WidgetPicker({ currentLayout, onAdd }: WidgetPickerProps) {
  const allWidgets = getAllWidgetDefinitions();

  function handleAdd(type: string) {
    const definition = getWidgetDefinition(type);
    if (!definition) return;

    const y = nextYPosition(currentLayout);
    const newWidget: DashboardLayoutWidget = {
      id: `widget-${type}-${crypto.randomUUID()}`,
      type: definition.type,
      title: definition.name,
      position: {
        x: definition.defaultPosition.x,
        y,
        w: definition.defaultPosition.w,
        h: definition.defaultPosition.h,
      },
      settings: {},
    };
    onAdd(newWidget);
  }

  return (
    <div className="rounded-2xl border border-dashed border-[var(--brand-green)]/40 bg-white p-4 shadow-xs">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--brand-green)]">
        Add Widgets
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {allWidgets.map((widget) => {
          const added = isAlreadyAdded(currentLayout, widget.type);
          return (
            <button
              key={widget.type}
              id={`widget-picker-${widget.type}`}
              type="button"
              onClick={() => handleAdd(widget.type)}
              disabled={added}
              aria-label={added ? `${widget.name} already on dashboard` : `Add ${widget.name}`}
              className="flex items-start gap-2 rounded-xl border border-[var(--brand-stroke)] bg-[var(--brand-app-bg)] p-3 text-left transition-colors hover:border-[var(--brand-green)]/60 hover:bg-[var(--brand-green-transparent)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="mt-0.5 size-3.5 shrink-0 text-[var(--brand-green)]" />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-[var(--brand-black-font)]">
                  {widget.name}
                </p>
                {widget.description && (
                  <p className="mt-0.5 line-clamp-2 text-[10px] leading-relaxed text-slate-500">
                    {widget.description}
                  </p>
                )}
                {added && (
                  <p className="mt-0.5 text-[10px] font-medium text-[var(--brand-green)]">
                    On dashboard
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
