"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GridLayout,
  type Layout,
  type LayoutItem,
  type ResizeHandleAxis,
} from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import { Settings, X } from "lucide-react";
import type {
  DashboardLayout,
  DashboardLayoutWidget,
  DashboardReportData,
  FormattedDashboardData,
} from "@/types/dashboard";
import {
  getWidgetDefinition,
  UnknownWidgetFallback,
} from "@/components/dashboard/dashboard/registry/widget-registry";

export const RESIZE_HANDLES: ResizeHandleAxis[] = [
  "nw",
  "ne",
  "sw",
  "se",
  "n",
  "e",
  "s",
  "w",
];

interface DashboardBuilderGridProps {
  layout: DashboardLayout;
  report: DashboardReportData;
  formattedData: FormattedDashboardData;
  onLayoutChange: (updated: DashboardLayout) => void;
  onRemove: (widgetId: string) => void;
  onConfigure?: (widget: DashboardLayoutWidget) => void;
}

export function toGridLayout(widgets: DashboardLayoutWidget[]): Layout {
  return widgets.map((w): LayoutItem => {
    const def = getWidgetDefinition(w.type);
    const minW = Math.max(1, w.position?.minW ?? def?.minW ?? 2);
    const minH = Math.max(1, w.position?.minH ?? def?.minH ?? 2);
    const maxW = Math.min(12, Math.max(minW, w.position?.maxW ?? def?.maxW ?? 12));
    const maxH = Math.max(minH, w.position?.maxH ?? def?.maxH ?? 12);

    const safeW = Math.max(minW, Math.min(maxW, w.position?.w || minW));
    const safeH = Math.max(minH, Math.min(maxH, w.position?.h || minH));
    const safeX = Math.max(0, Math.min(12 - safeW, w.position?.x ?? 0));
    const safeY = Math.max(0, w.position?.y ?? 0);

    return {
      i: w.id,
      x: safeX,
      y: safeY,
      w: safeW,
      h: safeH,
      minW,
      minH,
      maxW,
      maxH,
      resizeHandles: RESIZE_HANDLES,
    };
  });
}

export function DashboardBuilderGrid({
  layout,
  report,
  formattedData,
  onLayoutChange,
  onRemove,
  onConfigure,
}: DashboardBuilderGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(1200);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      if (el.clientWidth > 0) {
        setContainerWidth(Math.max(el.clientWidth - 16, 320));
      }
    };

    measure();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const w = entry.contentRect?.width || el.clientWidth;
          if (w > 0) {
            setContainerWidth(Math.max(w - 16, 320));
          }
        }
      });
      observer.observe(el);
      return () => observer.disconnect();
    } else {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
  }, []);

  const gridLayout = useMemo(() => toGridLayout(layout.widgets), [layout.widgets]);

  const syncPositions = useCallback(
    (newLayout: Layout) => {
      const positionMap = new Map<string, LayoutItem>();
      for (const item of newLayout) {
        positionMap.set(item.i, item);
      }
      const updatedWidgets: DashboardLayoutWidget[] = layout.widgets.map((widget) => {
        const pos = positionMap.get(widget.id);
        if (!pos) return widget;
        return {
          ...widget,
          position: {
            ...widget.position,
            x: pos.x,
            y: pos.y,
            w: pos.w,
            h: pos.h,
          },
        };
      });
      onLayoutChange({ ...layout, widgets: updatedWidgets });
    },
    [layout, onLayoutChange],
  );

  const handleLayoutChange = useCallback(
    (newLayout: Layout) => syncPositions(newLayout),
    [syncPositions],
  );

  const handleDragStop = useCallback(
    (newLayout: Layout) => syncPositions(newLayout),
    [syncPositions],
  );

  const handleResizeStop = useCallback(
    (newLayout: Layout) => syncPositions(newLayout),
    [syncPositions],
  );

  return (
    <div ref={containerRef} className="dashboard-builder-container relative w-full">
      <style>{`
        /* Scoped styles for Dashboard Builder Multi-Corner Resize Handles */
        .dashboard-builder-container .react-grid-item {
          touch-action: none;
        }

        .dashboard-builder-container .react-grid-item > .react-resizable-handle {
          position: absolute !important;
          z-index: 30 !important;
          box-sizing: border-box !important;
          user-select: none !important;
          -webkit-user-select: none !important;
          opacity: 0.9 !important;
          transition: opacity 0.15s ease, transform 0.15s ease !important;
        }

        .dashboard-builder-container .react-grid-item:hover > .react-resizable-handle,
        .dashboard-builder-container .react-grid-item.resizing > .react-resizable-handle {
          opacity: 1 !important;
        }

        .dashboard-builder-container .react-grid-item > .react-resizable-handle::after {
          display: none !important;
          content: "" !important;
          border: none !important;
        }

        /* 4 Corner Handles: nw, ne, sw, se */
        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-nw,
        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-ne,
        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-sw,
        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-se {
          width: 22px !important;
          height: 22px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transform: none !important;
        }

        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-nw {
          top: -4px !important;
          left: -4px !important;
          right: auto !important;
          bottom: auto !important;
          cursor: nwse-resize !important;
        }

        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-ne {
          top: -4px !important;
          right: -4px !important;
          left: auto !important;
          bottom: auto !important;
          cursor: nesw-resize !important;
        }

        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-sw {
          bottom: -4px !important;
          left: -4px !important;
          top: auto !important;
          right: auto !important;
          cursor: nesw-resize !important;
        }

        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-se {
          bottom: -4px !important;
          right: -4px !important;
          top: auto !important;
          left: auto !important;
          cursor: nwse-resize !important;
        }

        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-nw::before,
        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-ne::before,
        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-sw::before,
        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-se::before {
          content: "" !important;
          display: block !important;
          width: 10px !important;
          height: 10px !important;
          border-radius: 9999px !important;
          background-color: #ffffff !important;
          border: 2px solid var(--brand-green, #0D9488) !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25) !important;
          transition: transform 0.15s ease, background-color 0.15s ease, border-color 0.15s ease !important;
        }

        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-nw:hover::before,
        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-ne:hover::before,
        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-sw:hover::before,
        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-se:hover::before {
          transform: scale(1.3) !important;
          background-color: var(--brand-green, #0D9488) !important;
          border-color: #ffffff !important;
          box-shadow: 0 2px 6px rgba(13, 148, 136, 0.5) !important;
        }

        /* 4 Side Handles: n, s, w, e */
        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-n,
        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-s {
          width: 36px !important;
          height: 16px !important;
          left: 50% !important;
          margin-left: -18px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: ns-resize !important;
          transform: none !important;
        }

        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-n {
          top: -4px !important;
          bottom: auto !important;
        }

        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-s {
          bottom: -4px !important;
          top: auto !important;
        }

        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-w,
        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-e {
          width: 16px !important;
          height: 36px !important;
          top: 50% !important;
          margin-top: -18px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: ew-resize !important;
          transform: none !important;
        }

        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-w {
          left: -4px !important;
          right: auto !important;
        }

        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-e {
          right: -4px !important;
          left: auto !important;
        }

        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-n::before,
        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-s::before {
          content: "" !important;
          display: block !important;
          width: 18px !important;
          height: 4px !important;
          border-radius: 9999px !important;
          background-color: var(--brand-green, #0D9488) !important;
          opacity: 0.65 !important;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
          transition: transform 0.15s ease, opacity 0.15s ease !important;
        }

        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-w::before,
        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-e::before {
          content: "" !important;
          display: block !important;
          width: 4px !important;
          height: 18px !important;
          border-radius: 9999px !important;
          background-color: var(--brand-green, #0D9488) !important;
          opacity: 0.65 !important;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
          transition: transform 0.15s ease, opacity 0.15s ease !important;
        }

        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-n:hover::before,
        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-s:hover::before,
        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-w:hover::before,
        .dashboard-builder-container .react-grid-item > .react-resizable-handle.react-resizable-handle-e:hover::before {
          opacity: 1 !important;
          transform: scale(1.25) !important;
          box-shadow: 0 2px 5px rgba(13, 148, 136, 0.45) !important;
        }

        .dashboard-builder-container .react-grid-item.resizing {
          z-index: 40 !important;
        }
      `}</style>

      <div
        aria-label="Dashboard builder grid — drag to reorder, resize handles at corners and edges"
        className="rounded-2xl border-2 border-dashed border-[var(--brand-green)]/30 bg-[var(--brand-app-bg)] p-2"
      >
        <GridLayout
          className="layout"
          layout={gridLayout}
          width={containerWidth}
          gridConfig={{
            cols: 12,
            rowHeight: layout.rowHeight,
            margin: [16, 16],
            containerPadding: [8, 8],
            maxRows: Infinity,
          }}
          dragConfig={{
            enabled: true,
            bounded: false,
            handle: ".widget-drag-handle",
            threshold: 3,
          }}
          resizeConfig={{
            enabled: true,
            handles: RESIZE_HANDLES,
          }}
          onLayoutChange={handleLayoutChange}
          onDragStop={handleDragStop}
          onResizeStop={handleResizeStop}
        >
          {layout.widgets.map((widget) => {
            const definition = getWidgetDefinition(widget.type);

            return (
              <div
                key={widget.id}
                className="group relative h-full w-full overflow-hidden rounded-2xl border border-[var(--brand-stroke)] bg-white shadow-xs ring-2 ring-transparent transition-all focus-within:ring-[var(--brand-green)]/40 hover:ring-[var(--brand-green)]/40 flex flex-col"
              >
                <div
                  className="widget-drag-handle absolute inset-x-0 top-0 z-10 flex h-7 cursor-grab items-center justify-between rounded-t-2xl bg-[var(--brand-green)]/10 pl-3 pr-3 active:cursor-grabbing"
                  aria-label={`Drag handle for ${widget.title ?? widget.type}`}
                >
                  <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--brand-green)] pl-1">
                    <span className="inline-flex gap-0.5">
                      <span className="block h-0.5 w-3 rounded-full bg-[var(--brand-green)]/60" />
                      <span className="block h-0.5 w-3 rounded-full bg-[var(--brand-green)]/60" />
                      <span className="block h-0.5 w-3 rounded-full bg-[var(--brand-green)]/60" />
                    </span>
                    {widget.title ?? widget.type}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100 pr-1">
                    {onConfigure && definition?.supportsSettings && (
                      <button
                        type="button"
                        id={`configure-widget-${widget.id}`}
                        aria-label={`Configure ${widget.title ?? widget.type} widget`}
                        onClick={() => onConfigure(widget)}
                        className="flex size-5 items-center justify-center rounded-full bg-white/80 text-slate-600 hover:bg-white hover:text-slate-900 shadow-2xs transition-colors"
                      >
                        <Settings className="size-3" />
                      </button>
                    )}
                    <button
                      type="button"
                      id={`remove-widget-${widget.id}`}
                      aria-label={`Remove ${widget.title ?? widget.type} widget`}
                      onClick={() => onRemove(widget.id)}
                      className="flex size-5 items-center justify-center rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200 transition-colors"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto pt-7">
                  {definition ? (
                    <definition.component
                      widget={widget}
                      report={report}
                      formattedData={formattedData}
                    />
                  ) : (
                    <div className="p-4">
                      <UnknownWidgetFallback widget={widget} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </GridLayout>
      </div>
    </div>
  );
}
