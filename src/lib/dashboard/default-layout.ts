import type {
  DashboardLayout,
  DashboardTemplate,
  VisualTheme,
} from "@/types/dashboard";

/**
 * Canonical default dashboard layout configuration.
 * Fully serializable JSON with no React components or functions.
 * Preserves default widget settings matching the runtime Widget Registry.
 */
export const DEFAULT_DASHBOARD_LAYOUT: DashboardLayout = {
  version: 1,
  columns: 12,
  rowHeight: 80,
  widgets: [
    {
      id: "widget-metrics-grid",
      type: "metrics_grid",
      title: "Key Performance Indicators",
      position: { x: 0, y: 0, w: 12, h: 4 },
      settings: {
        showBanners: true,
        showKpis: true,
      },
    },
    {
      id: "widget-sales-purchase-chart",
      type: "sales_purchase_chart",
      title: "Sales & Purchase Trends",
      position: { x: 0, y: 4, w: 8, h: 5 },
      settings: {
        defaultTimeframe: "1Y",
      },
    },
    {
      id: "widget-overall-information",
      type: "overall_information",
      title: "Overall Information",
      position: { x: 8, y: 4, w: 4, h: 5 },
      settings: {
        defaultPeriod: "Today",
      },
    },
    {
      id: "widget-top-selling-products",
      type: "top_selling_products",
      title: "Top Selling Products",
      position: { x: 0, y: 9, w: 4, h: 4 },
      settings: {
        limit: 5,
      },
    },
    {
      id: "widget-low-stock-products",
      type: "low_stock_products",
      title: "Low Stock Alert",
      position: { x: 4, y: 9, w: 4, h: 4 },
      settings: {
        limit: 5,
      },
    },
    {
      id: "widget-recent-sales",
      type: "recent_sales",
      title: "Recent Sales",
      position: { x: 8, y: 9, w: 4, h: 4 },
      settings: {
        limit: 5,
        defaultPeriod: "Today",
      },
    },
    {
      id: "widget-top-customers",
      type: "top_customers",
      title: "Top Customers",
      position: { x: 0, y: 13, w: 4, h: 4 },
      settings: {
        limit: 5,
      },
    },
    {
      id: "widget-top-categories",
      type: "top_categories",
      title: "Top Categories",
      position: { x: 4, y: 13, w: 4, h: 4 },
      settings: {
        limit: 3,
        defaultPeriod: "Weekly",
      },
    },
    {
      id: "widget-order-heatmap",
      type: "order_heatmap",
      title: "Order Statistics Heatmap",
      position: { x: 8, y: 13, w: 4, h: 4 },
      settings: {
        defaultPeriod: "Weekly",
      },
    },
  ],
};

/**
 * System default Dashboard Template representing the canonical overview dashboard layout.
 */
export const DEFAULT_DASHBOARD_TEMPLATE: DashboardTemplate = {
  id: "template-default-overview",
  organizationId: null,
  name: "Default",
  description:
    "Standard Technova POS overview layout with KPIs, trends, and sales analytics.",
  category: "Overview",
  isSystem: true,
  layout: DEFAULT_DASHBOARD_LAYOUT,
  createdAt: "2026-09-08T00:00:00.000Z",
  updatedAt: "2026-09-08T00:00:00.000Z",
};

/**
 * Canonical Visual Theme representing the original Technova POS design styling.
 * Uses exact values defined in global.css.
 * Set as organization default theme.
 */
export const DEFAULT_VISUAL_THEME: VisualTheme = {
  id: "theme-technova-default",
  organizationId: "",
  name: "Default",
  isDefault: true,
  tokens: {
    mode: "light",
    primaryColor: "#0E9384",
    secondaryColor: "#092C4C",
    backgroundColor: "#F8FAFC",
    cardBackground: "#FFFFFF",
    surfaceColor: "#F1F5F9",
    textColor: "#1D2939",
    borderRadius: "16px",
    fontFamily: "Inter, sans-serif",
    customVariables: {
      "brand-stroke": "#E4E7EC",
      "brand-green-transparent": "#EEFFFD",
      "brand-orange": "#E26D1E",
      "brand-blue-action": "#1E6DE2",
    },
  },
  createdAt: "2026-09-08T00:00:00.000Z",
  updatedAt: "2026-09-08T00:00:00.000Z",
};
