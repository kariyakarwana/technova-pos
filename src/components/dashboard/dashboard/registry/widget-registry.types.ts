import type { ComponentType } from "react";
import type {
  DashboardLayoutWidget,
  DashboardReportData,
  DashboardWidgetPosition,
  DashboardWidgetSettings,
  FormattedDashboardData,
} from "@/types/dashboard";

/**
 * Props passed to each widget component rendered by the registry.
 */
export interface WidgetRenderProps {
  widget: DashboardLayoutWidget;
  report: DashboardReportData;
  formattedData: FormattedDashboardData;
}

/**
 * Descriptor for an individual configurable setting field.
 */
export interface WidgetSettingField {
  key: string;
  label: string;
  description?: string;
  type: "select" | "number" | "boolean";
  options?: { label: string; value: string | number }[];
  min?: number;
  max?: number;
  step?: number;
}

/**
 * Definition and metadata for a registered dashboard widget.
 */
export interface WidgetDefinition {
  type: string;
  name: string;
  description?: string;
  defaultPosition: DashboardWidgetPosition;
  component: ComponentType<WidgetRenderProps>;
  supportsSettings?: boolean;
  defaultSettings?: DashboardWidgetSettings;
  settingsFields?: WidgetSettingField[];
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
}
