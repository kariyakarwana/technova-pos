import DashboardMetricsGrid from "@/components/dashboard/dashboard/DashboardMetricsGrid";
import LowStockProductsCard from "@/components/dashboard/dashboard/LowStockProductsCard";
import OrderStatisticsHeatmapCard from "@/components/dashboard/dashboard/OrderStatisticsHeatmapCard";
import OverallInformationCard from "@/components/dashboard/dashboard/OverallInformationCard";
import RecentSalesCard from "@/components/dashboard/dashboard/RecentSalesCard";
import SalesPurchaseChartCard from "@/components/dashboard/dashboard/SalesPurchaseChartCard";
import TopCategoriesCard from "@/components/dashboard/dashboard/TopCategoriesCard";
import TopCustomersCard from "@/components/dashboard/dashboard/TopCustomersCard";
import TopSellingProductsCard from "@/components/dashboard/dashboard/TopSellingProductsCard";
import type { DashboardLayoutWidget } from "@/types/dashboard";
import type {
  WidgetDefinition,
  WidgetRenderProps,
} from "./widget-registry.types";

/**
 * Safe fallback component rendered when a widget type is unrecognized.
 * Ensures the dashboard never crashes on custom or deprecated widget types.
 */
export function UnknownWidgetFallback({
  widget,
}: {
  widget: DashboardLayoutWidget;
}) {
  return (
    <div className="flex flex-col justify-between space-y-2 rounded-2xl border border-dashed border-amber-300 bg-amber-50/70 p-6 text-sm text-amber-800 shadow-xs">
      <div className="flex items-center gap-2 font-semibold">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />
        {widget.title || "Unknown Widget"}
      </div>
      <p className="text-xs text-amber-700/90">
        Widget type{" "}
        <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-amber-900">
          {widget.type}
        </code>{" "}
        is not registered in this dashboard runtime.
      </p>
    </div>
  );
}

/* =========================================================================
   WIDGET ADAPTERS (Connecting registry props to existing card components)
   ========================================================================= */

function MetricsGridWidget({ widget, formattedData }: WidgetRenderProps) {
  const showBanners =
    widget.settings?.showBanners !== undefined
      ? Boolean(widget.settings.showBanners)
      : true;
  const showKpis =
    widget.settings?.showKpis !== undefined
      ? Boolean(widget.settings.showKpis)
      : true;

  return (
    <DashboardMetricsGrid
      bannerMetrics={formattedData.banners}
      kpiCards={formattedData.kpis}
      showBanners={showBanners}
      showKpis={showKpis}
    />
  );
}

function SalesPurchaseChartWidget({ widget, report }: WidgetRenderProps) {
  const initialTimeframe =
    typeof widget.settings?.defaultTimeframe === "string"
      ? widget.settings.defaultTimeframe
      : "1Y";

  return (
    <SalesPurchaseChartCard
      key={initialTimeframe}
      data={report.monthlyTrends}
      initialTimeframe={initialTimeframe}
    />
  );
}

function OverallInformationWidget({ widget, formattedData }: WidgetRenderProps) {
  const initialPeriod =
    typeof widget.settings?.defaultPeriod === "string"
      ? widget.settings.defaultPeriod
      : "Today";

  return (
    <OverallInformationCard
      key={initialPeriod}
      {...formattedData.overall}
      initialPeriod={initialPeriod}
    />
  );
}

function TopSellingProductsWidget({ widget, formattedData }: WidgetRenderProps) {
  const limit =
    typeof widget.settings?.limit === "number" ? widget.settings.limit : 5;

  return (
    <TopSellingProductsCard
      key={limit}
      products={formattedData.products}
      limit={limit}
    />
  );
}

function LowStockProductsWidget({ widget, formattedData }: WidgetRenderProps) {
  const limit =
    typeof widget.settings?.limit === "number" ? widget.settings.limit : 5;

  return (
    <LowStockProductsCard
      key={limit}
      products={formattedData.lowStock}
      limit={limit}
    />
  );
}

function RecentSalesWidget({ widget, formattedData }: WidgetRenderProps) {
  const limit =
    typeof widget.settings?.limit === "number" ? widget.settings.limit : 5;
  const initialPeriod =
    typeof widget.settings?.defaultPeriod === "string"
      ? widget.settings.defaultPeriod
      : "Today";

  return (
    <RecentSalesCard
      key={`${initialPeriod}-${limit}`}
      sales={formattedData.recent}
      limit={limit}
      initialPeriod={initialPeriod}
    />
  );
}

function TopCustomersWidget({ widget, formattedData }: WidgetRenderProps) {
  const limit =
    typeof widget.settings?.limit === "number" ? widget.settings.limit : 5;

  return (
    <TopCustomersCard
      key={limit}
      customers={formattedData.customers}
      limit={limit}
    />
  );
}

function TopCategoriesWidget({ widget, report, formattedData }: WidgetRenderProps) {
  const limit =
    typeof widget.settings?.limit === "number" ? widget.settings.limit : 3;
  const initialPeriod =
    typeof widget.settings?.defaultPeriod === "string"
      ? widget.settings.defaultPeriod
      : "Weekly";

  return (
    <TopCategoriesCard
      key={`${initialPeriod}-${limit}`}
      categories={formattedData.categories}
      totalCategories={report.categorySummary.totalCategories}
      totalProducts={report.categorySummary.totalProducts}
      limit={limit}
      initialPeriod={initialPeriod}
    />
  );
}

const HEATMAP_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HEATMAP_TIMES = [
  "12 am",
  "3 am",
  "6 am",
  "9 am",
  "12 pm",
  "3 pm",
  "6 pm",
  "9 pm",
  "Late",
];

function OrderHeatmapWidget({ widget, report }: WidgetRenderProps) {
  const initialPeriod =
    typeof widget.settings?.defaultPeriod === "string"
      ? widget.settings.defaultPeriod
      : "Weekly";

  return (
    <OrderStatisticsHeatmapCard
      key={initialPeriod}
      days={HEATMAP_DAYS}
      times={HEATMAP_TIMES}
      matrix={report.heatmap}
      initialPeriod={initialPeriod}
    />
  );
}

/* =========================================================================
   CENTRALIZED REGISTRY DEFINITIONS
   ========================================================================= */

export const REGISTERED_WIDGETS: WidgetDefinition[] = [
  {
    type: "metrics_grid",
    name: "Key Performance Indicators",
    description:
      "Top revenue, purchase, and return banner metrics with KPI summary cards.",
    defaultPosition: { x: 0, y: 0, w: 12, h: 4 },
    minW: 3,
    minH: 2,
    maxW: 12,
    maxH: 8,
    component: MetricsGridWidget,
    supportsSettings: true,
    defaultSettings: { showBanners: true, showKpis: true },
    settingsFields: [
      {
        key: "showBanners",
        label: "Show Top Banner Metrics",
        description: "Display the revenue, purchase, and return summary banners.",
        type: "boolean",
      },
      {
        key: "showKpis",
        label: "Show KPI Cards",
        description:
          "Display the individual metric cards for profit, expenses, and returns.",
        type: "boolean",
      },
    ],
  },
  {
    type: "sales_purchase_chart",
    name: "Sales & Purchase Trends",
    description: "Multi-timeframe sales and purchase volume comparative chart.",
    defaultPosition: { x: 0, y: 4, w: 8, h: 5 },
    minW: 4,
    minH: 3,
    maxW: 12,
    maxH: 10,
    component: SalesPurchaseChartWidget,
    supportsSettings: true,
    defaultSettings: { defaultTimeframe: "1Y" },
    settingsFields: [
      {
        key: "defaultTimeframe",
        label: "Default Timeframe",
        description: "Initial chart view duration.",
        type: "select",
        options: [
          { label: "1 Day (1D)", value: "1D" },
          { label: "1 Week (1W)", value: "1W" },
          { label: "1 Month (1M)", value: "1M" },
          { label: "3 Months (3M)", value: "3M" },
          { label: "6 Months (6M)", value: "6M" },
          { label: "1 Year (1Y)", value: "1Y" },
        ],
      },
    ],
  },
  {
    type: "overall_information",
    name: "Overall Information",
    description:
      "Suppliers, customers, order counts, and first-time vs returning metrics.",
    defaultPosition: { x: 8, y: 4, w: 4, h: 5 },
    minW: 3,
    minH: 3,
    maxW: 12,
    maxH: 8,
    component: OverallInformationWidget,
    supportsSettings: true,
    defaultSettings: { defaultPeriod: "Today" },
    settingsFields: [
      {
        key: "defaultPeriod",
        label: "Default Time Period",
        description: "Default aggregation range.",
        type: "select",
        options: [
          { label: "Today", value: "Today" },
          { label: "Weekly", value: "Weekly" },
          { label: "Monthly", value: "Monthly" },
        ],
      },
    ],
  },
  {
    type: "top_selling_products",
    name: "Top Selling Products",
    description: "Highest-volume products by units sold and revenue contribution.",
    defaultPosition: { x: 0, y: 9, w: 4, h: 4 },
    minW: 3,
    minH: 3,
    maxW: 12,
    maxH: 8,
    component: TopSellingProductsWidget,
    supportsSettings: true,
    defaultSettings: { limit: 5 },
    settingsFields: [
      {
        key: "limit",
        label: "Products to Display",
        description: "Maximum number of top products shown.",
        type: "select",
        options: [
          { label: "3 products", value: 3 },
          { label: "5 products (Default)", value: 5 },
          { label: "10 products", value: 10 },
        ],
      },
    ],
  },
  {
    type: "low_stock_products",
    name: "Low Stock Alert",
    description: "Products at or near replenishment reorder points.",
    defaultPosition: { x: 4, y: 9, w: 4, h: 4 },
    minW: 3,
    minH: 3,
    maxW: 12,
    maxH: 8,
    component: LowStockProductsWidget,
    supportsSettings: true,
    defaultSettings: { limit: 5 },
    settingsFields: [
      {
        key: "limit",
        label: "Alerts to Display",
        description: "Maximum number of low stock items shown.",
        type: "select",
        options: [
          { label: "3 items", value: 3 },
          { label: "5 items (Default)", value: 5 },
          { label: "10 items", value: 10 },
        ],
      },
    ],
  },
  {
    type: "recent_sales",
    name: "Recent Sales",
    description:
      "Latest completed and processing orders with customer and item details.",
    defaultPosition: { x: 8, y: 9, w: 4, h: 4 },
    minW: 3,
    minH: 3,
    maxW: 12,
    maxH: 8,
    component: RecentSalesWidget,
    supportsSettings: true,
    defaultSettings: { limit: 5, defaultPeriod: "Today" },
    settingsFields: [
      {
        key: "limit",
        label: "Orders to Display",
        description: "Maximum number of recent sales shown.",
        type: "select",
        options: [
          { label: "3 orders", value: 3 },
          { label: "5 orders (Default)", value: 5 },
          { label: "10 orders", value: 10 },
        ],
      },
      {
        key: "defaultPeriod",
        label: "Default Period",
        description: "Default sales filter period.",
        type: "select",
        options: [
          { label: "Today", value: "Today" },
          { label: "Weekly", value: "Weekly" },
          { label: "Monthly", value: "Monthly" },
        ],
      },
    ],
  },
  {
    type: "top_customers",
    name: "Top Customers",
    description: "Top spending customers with total spend and order frequency.",
    defaultPosition: { x: 0, y: 13, w: 4, h: 4 },
    minW: 3,
    minH: 3,
    maxW: 12,
    maxH: 8,
    component: TopCustomersWidget,
    supportsSettings: true,
    defaultSettings: { limit: 5 },
    settingsFields: [
      {
        key: "limit",
        label: "Customers to Display",
        description: "Maximum number of top customers shown.",
        type: "select",
        options: [
          { label: "3 customers", value: 3 },
          { label: "5 customers (Default)", value: 5 },
          { label: "10 customers", value: 10 },
        ],
      },
    ],
  },
  {
    type: "top_categories",
    name: "Top Categories",
    description: "Revenue breakdown and product distribution across categories.",
    defaultPosition: { x: 4, y: 13, w: 4, h: 4 },
    minW: 3,
    minH: 3,
    maxW: 12,
    maxH: 8,
    component: TopCategoriesWidget,
    supportsSettings: true,
    defaultSettings: { limit: 3, defaultPeriod: "Weekly" },
    settingsFields: [
      {
        key: "limit",
        label: "Categories to Display",
        description: "Maximum number of top categories shown in breakdown.",
        type: "select",
        options: [
          { label: "3 categories (Default)", value: 3 },
          { label: "5 categories", value: 5 },
        ],
      },
      {
        key: "defaultPeriod",
        label: "Default Period",
        description: "Default category analysis period.",
        type: "select",
        options: [
          { label: "Weekly", value: "Weekly" },
          { label: "Today", value: "Today" },
          { label: "Monthly", value: "Monthly" },
        ],
      },
    ],
  },
  {
    type: "order_heatmap",
    name: "Order Statistics Heatmap",
    description: "Peak ordering hours and busy days of the week.",
    defaultPosition: { x: 8, y: 13, w: 4, h: 4 },
    minW: 3,
    minH: 3,
    maxW: 12,
    maxH: 8,
    component: OrderHeatmapWidget,
    supportsSettings: true,
    defaultSettings: { defaultPeriod: "Weekly" },
    settingsFields: [
      {
        key: "defaultPeriod",
        label: "Default Period",
        description: "Default heatmap aggregation timeframe.",
        type: "select",
        options: [
          { label: "Weekly", value: "Weekly" },
          { label: "Today", value: "Today" },
          { label: "Monthly", value: "Monthly" },
        ],
      },
    ],
  },
];

/**
 * Fast lookup registry mapping normalized type keys to definitions.
 */
const widgetMap = new Map<string, WidgetDefinition>();

function normalizeType(type: string): string {
  return type.toLowerCase().replace(/[\s-]+/g, "_");
}

for (const widget of REGISTERED_WIDGETS) {
  widgetMap.set(normalizeType(widget.type), widget);
}

// Register common aliases for convenience
widgetMap.set("dashboard_metrics_grid", widgetMap.get("metrics_grid")!);
widgetMap.set("metrics-grid", widgetMap.get("metrics_grid")!);
widgetMap.set("sales-purchase-chart", widgetMap.get("sales_purchase_chart")!);
widgetMap.set("sales_purchase", widgetMap.get("sales_purchase_chart")!);
widgetMap.set("overall-information", widgetMap.get("overall_information")!);
widgetMap.set("overall_info", widgetMap.get("overall_information")!);
widgetMap.set("top-selling-products", widgetMap.get("top_selling_products")!);
widgetMap.set("top_products", widgetMap.get("top_selling_products")!);
widgetMap.set("low-stock-products", widgetMap.get("low_stock_products")!);
widgetMap.set("low_stock", widgetMap.get("low_stock_products")!);
widgetMap.set("recent-sales", widgetMap.get("recent_sales")!);
widgetMap.set("top-customers", widgetMap.get("top_customers")!);
widgetMap.set("top-categories", widgetMap.get("top_categories")!);
widgetMap.set("order-statistics-heatmap", widgetMap.get("order_heatmap")!);
widgetMap.set("order_statistics_heatmap", widgetMap.get("order_heatmap")!);

/**
 * Lookup a widget definition by type.
 */
export function getWidgetDefinition(type: string): WidgetDefinition | undefined {
  return widgetMap.get(normalizeType(type));
}

/**
 * Retrieve all registered widget definitions.
 */
export function getAllWidgetDefinitions(): WidgetDefinition[] {
  return [...REGISTERED_WIDGETS];
}

/**
 * Dynamically register or override a widget definition.
 */
export function registerWidget(definition: WidgetDefinition): void {
  const norm = normalizeType(definition.type);
  widgetMap.set(norm, definition);
  const existingIdx = REGISTERED_WIDGETS.findIndex(
    (w) => normalizeType(w.type) === norm,
  );
  if (existingIdx >= 0) {
    REGISTERED_WIDGETS[existingIdx] = definition;
  } else {
    REGISTERED_WIDGETS.push(definition);
  }
}
