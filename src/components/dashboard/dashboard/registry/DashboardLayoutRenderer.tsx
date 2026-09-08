"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";
import type {
  DashboardLayout,
  DashboardLayoutWidget,
  DashboardReportData,
  FormattedDashboardData,
} from "@/types/dashboard";
import {
  getWidgetDefinition,
  UnknownWidgetFallback,
} from "./widget-registry";

/**
 * Isolated error boundary for single widgets to prevent any one widget error
 * from breaking the entire dashboard.
 */
interface WidgetErrorBoundaryProps {
  widget: DashboardLayoutWidget;
  children: ReactNode;
}

interface WidgetErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class WidgetErrorBoundary extends Component<
  WidgetErrorBoundaryProps,
  WidgetErrorBoundaryState
> {
  constructor(props: WidgetErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): WidgetErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      `[Dashboard] Error rendering widget "${this.props.widget.id}" (${this.props.widget.type}):`,
      error,
      errorInfo,
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col justify-between space-y-2 rounded-2xl border border-rose-200 bg-rose-50/70 p-6 text-sm text-rose-800 shadow-xs">
          <div className="flex items-center gap-2 font-semibold">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-500" />
            {this.props.widget.title || "Widget Error"}
          </div>
          <p className="text-xs text-rose-700/90">
            Failed to render widget{" "}
            <code className="rounded bg-rose-100 px-1.5 py-0.5 font-mono text-rose-900">
              {this.props.widget.type}
            </code>
            : {this.state.error?.message || "Internal rendering error"}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Maps widget grid width `w` (out of 12 columns) to responsive Tailwind CSS classes.
 */
function getGridColSpanClass(w?: number): string {
  switch (w) {
    case 12:
      return "col-span-12";
    case 9:
      return "col-span-12 lg:col-span-9";
    case 8:
      return "col-span-12 lg:col-span-8";
    case 7:
      return "col-span-12 lg:col-span-7";
    case 6:
      return "col-span-12 md:col-span-6";
    case 5:
      return "col-span-12 lg:col-span-5";
    case 4:
      return "col-span-12 lg:col-span-4";
    case 3:
      return "col-span-12 md:col-span-6 lg:col-span-3";
    case 2:
      return "col-span-12 md:col-span-4 lg:col-span-2";
    case 1:
      return "col-span-12 md:col-span-2 lg:col-span-1";
    default:
      return "col-span-12";
  }
}

export interface DashboardLayoutRendererProps {
  layout: DashboardLayout;
  report: DashboardReportData;
  formattedData: FormattedDashboardData;
}

/**
 * Configuration-driven Dashboard Layout Renderer.
 * Dynamically resolves each widget from the centralized Widget Registry
 * and mounts it inside a responsive 12-column grid.
 */
export function DashboardLayoutRenderer({
  layout,
  report,
  formattedData,
}: DashboardLayoutRendererProps) {
  const sortedWidgets = [...(layout.widgets || [])].sort((a, b) => {
    // Sort primarily by row `y`, secondarily by column `x`
    if (a.position.y !== b.position.y) {
      return a.position.y - b.position.y;
    }
    return a.position.x - b.position.x;
  });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {sortedWidgets.map((widget) => {
        const definition = getWidgetDefinition(widget.type);
        const colSpanClass = getGridColSpanClass(widget.position?.w);

        return (
          <div key={widget.id} className={colSpanClass}>
            <WidgetErrorBoundary widget={widget}>
              {definition ? (
                <definition.component
                  widget={widget}
                  report={report}
                  formattedData={formattedData}
                />
              ) : (
                <UnknownWidgetFallback widget={widget} />
              )}
            </WidgetErrorBoundary>
          </div>
        );
      })}
    </div>
  );
}

export default DashboardLayoutRenderer;
