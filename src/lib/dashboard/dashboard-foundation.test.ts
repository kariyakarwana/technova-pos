import { afterEach, describe, expect, it, vi } from "vitest";
import {
  applyDashboardTemplate,
  createDashboard,
  createDashboardTemplate,
  createVisualTheme,
  deleteDashboard,
  deleteDashboardTemplate,
  deleteVisualTheme,
  getDashboard,
  getDashboards,
  getDashboardTemplate,
  getDashboardTemplates,
  getVisualTheme,
  getVisualThemes,
  setDefaultVisualTheme,
  updateDashboard,
  updateDashboardLayout,
  updateDashboardTemplate,
  updateVisualTheme,
} from "@/lib/api/dashboard";
import {
  DEFAULT_DASHBOARD_LAYOUT,
  DEFAULT_DASHBOARD_TEMPLATE,
  DEFAULT_VISUAL_THEME,
} from "@/lib/dashboard/default-layout";
import {
  getAllWidgetDefinitions,
  getWidgetDefinition,
} from "@/components/dashboard/dashboard/registry/widget-registry";

const mockResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

describe("Dashboard Foundation — Layout & Registry", () => {
  it("provides a valid, fully serializable default dashboard layout", () => {
    expect(DEFAULT_DASHBOARD_LAYOUT.version).toBe(1);
    expect(DEFAULT_DASHBOARD_LAYOUT.columns).toBe(12);
    expect(DEFAULT_DASHBOARD_LAYOUT.rowHeight).toBe(80);
    expect(DEFAULT_DASHBOARD_LAYOUT.widgets).toHaveLength(9);

    // Verify it is strictly serializable JSON
    const jsonString = JSON.stringify(DEFAULT_DASHBOARD_LAYOUT);
    const parsed = JSON.parse(jsonString);
    expect(parsed).toEqual(DEFAULT_DASHBOARD_LAYOUT);
  });

  it("formalizes the Default Dashboard Template preserving layout and settings", () => {
    expect(DEFAULT_DASHBOARD_TEMPLATE.name).toBe("Default");
    expect(DEFAULT_DASHBOARD_TEMPLATE.isSystem).toBe(true);
    expect(DEFAULT_DASHBOARD_TEMPLATE.layout.widgets).toHaveLength(9);

    const metricsWidget = DEFAULT_DASHBOARD_TEMPLATE.layout.widgets.find(
      (w) => w.type === "metrics_grid",
    );
    expect(metricsWidget?.settings).toEqual({
      showBanners: true,
      showKpis: true,
    });

    const chartWidget = DEFAULT_DASHBOARD_TEMPLATE.layout.widgets.find(
      (w) => w.type === "sales_purchase_chart",
    );
    expect(chartWidget?.settings).toEqual({
      defaultTimeframe: "1Y",
    });

    const recentSalesWidget = DEFAULT_DASHBOARD_TEMPLATE.layout.widgets.find(
      (w) => w.type === "recent_sales",
    );
    expect(recentSalesWidget?.settings).toEqual({
      limit: 5,
      defaultPeriod: "Today",
    });
  });

  it("formalizes the Default Visual Theme with exact tokens and isDefault: true", () => {
    expect(DEFAULT_VISUAL_THEME.name).toBe("Default");
    expect(DEFAULT_VISUAL_THEME.isDefault).toBe(true);
    expect(DEFAULT_VISUAL_THEME.tokens.primaryColor).toBe("#0E9384");
    expect(DEFAULT_VISUAL_THEME.tokens.secondaryColor).toBe("#092C4C");
    expect(DEFAULT_VISUAL_THEME.tokens.backgroundColor).toBe("#F8FAFC");
    expect(DEFAULT_VISUAL_THEME.tokens.cardBackground).toBe("#FFFFFF");
    expect(DEFAULT_VISUAL_THEME.tokens.textColor).toBe("#1D2939");
    expect(DEFAULT_VISUAL_THEME.tokens.borderRadius).toBe("16px");
    expect(DEFAULT_VISUAL_THEME.tokens.fontFamily).toBe("Inter, sans-serif");
  });

  it("resolves all default widgets in the centralized Widget Registry", () => {
    for (const widget of DEFAULT_DASHBOARD_LAYOUT.widgets) {
      const def = getWidgetDefinition(widget.type);
      expect(def).toBeDefined();
      expect(def?.component).toBeDefined();
      expect(typeof def?.component).toBe("function");
    }
  });

  it("handles normalized type names and common aliases in widget registry", () => {
    expect(getWidgetDefinition("metrics_grid")).toBeDefined();
    expect(getWidgetDefinition("dashboard_metrics_grid")).toBeDefined();
    expect(getWidgetDefinition("metrics-grid")).toBeDefined();
    expect(getWidgetDefinition("sales-purchase-chart")).toBeDefined();
    expect(getWidgetDefinition("order-statistics-heatmap")).toBeDefined();
  });

  it("returns undefined for unknown widget types without throwing", () => {
    expect(getWidgetDefinition("non_existent_widget_type_xyz")).toBeUndefined();
    expect(getWidgetDefinition("")).toBeUndefined();
  });

  it("lists all registered widgets", () => {
    const all = getAllWidgetDefinitions();
    expect(all.length).toBeGreaterThanOrEqual(9);
    const types = all.map((w) => w.type);
    expect(types).toContain("metrics_grid");
    expect(types).toContain("sales_purchase_chart");
    expect(types).toContain("overall_information");
    expect(types).toContain("top_selling_products");
    expect(types).toContain("low_stock_products");
    expect(types).toContain("recent_sales");
    expect(types).toContain("top_customers");
    expect(types).toContain("top_categories");
    expect(types).toContain("order_heatmap");
  });
});

describe("Dashboard Foundation — API Functions", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("calls dashboard API endpoints using the existing apiClient proxy", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(mockResponse({ data: [], meta: { page: 1, pageSize: 10, total: 0, totalPages: 0 } }))
      .mockResolvedValueOnce(mockResponse({ id: "dash-1", name: "Main Dashboard" }))
      .mockResolvedValueOnce(mockResponse({ id: "dash-1", name: "Updated Dashboard" }))
      .mockResolvedValueOnce(mockResponse({ id: "dash-1", layout: DEFAULT_DASHBOARD_LAYOUT }))
      .mockResolvedValueOnce(mockResponse({ success: true, id: "dash-1" }))
      .mockResolvedValueOnce(mockResponse({ id: "dash-2" }))
      .mockResolvedValueOnce(mockResponse({ id: "dash-2", templateId: "tmpl-1" }));

    vi.stubGlobal("fetch", fetchMock);

    await getDashboards({ branchId: "b-1", isDefault: true });
    await getDashboard("dash-1");
    await updateDashboard("dash-1", { name: "Updated Dashboard" });
    await updateDashboardLayout("dash-1", DEFAULT_DASHBOARD_LAYOUT);
    await deleteDashboard("dash-1");
    await createDashboard({ name: "New Dashboard", layout: DEFAULT_DASHBOARD_LAYOUT });
    await applyDashboardTemplate("dash-2", "tmpl-1");

    expect(fetchMock).toHaveBeenCalledTimes(7);
    expect(fetchMock.mock.calls[0][0]).toBe(
      "/api/backend/dashboards?branchId=b-1&isDefault=true",
    );
    expect(fetchMock.mock.calls[1][0]).toBe("/api/backend/dashboards/dash-1");
    expect(fetchMock.mock.calls[2][0]).toBe("/api/backend/dashboards/dash-1");
    expect(fetchMock.mock.calls[2][1]?.method).toBe("PATCH");
    expect(fetchMock.mock.calls[3][0]).toBe("/api/backend/dashboards/dash-1/layout");
    expect(fetchMock.mock.calls[3][1]?.method).toBe("PUT");
    expect(fetchMock.mock.calls[4][0]).toBe("/api/backend/dashboards/dash-1");
    expect(fetchMock.mock.calls[4][1]?.method).toBe("DELETE");
    expect(fetchMock.mock.calls[5][0]).toBe("/api/backend/dashboards");
    expect(fetchMock.mock.calls[5][1]?.method).toBe("POST");
    expect(fetchMock.mock.calls[6][0]).toBe("/api/backend/dashboards/dash-2/apply-template");
    expect(fetchMock.mock.calls[6][1]?.method).toBe("POST");
  });

  it("calls template and theme API endpoints correctly", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(mockResponse({ data: [], meta: { page: 1, pageSize: 10, total: 0, totalPages: 0 } }))
      .mockResolvedValueOnce(mockResponse({ id: "tmpl-1" }))
      .mockResolvedValueOnce(mockResponse({ id: "tmpl-1" }))
      .mockResolvedValueOnce(mockResponse({ id: "tmpl-1" }))
      .mockResolvedValueOnce(mockResponse({ success: true, id: "tmpl-1" }))
      .mockResolvedValueOnce(mockResponse({ data: [], meta: { page: 1, pageSize: 10, total: 0, totalPages: 0 } }))
      .mockResolvedValueOnce(mockResponse({ id: "theme-1" }))
      .mockResolvedValueOnce(mockResponse({ id: "theme-1" }))
      .mockResolvedValueOnce(mockResponse({ id: "theme-1" }))
      .mockResolvedValueOnce(mockResponse({ id: "theme-1", isDefault: true }))
      .mockResolvedValueOnce(mockResponse({ success: true, id: "theme-1" }));

    vi.stubGlobal("fetch", fetchMock);

    await getDashboardTemplates({ category: "sales" });
    await getDashboardTemplate("tmpl-1");
    await createDashboardTemplate({ name: "Tmpl", layout: DEFAULT_DASHBOARD_LAYOUT });
    await updateDashboardTemplate("tmpl-1", { name: "Updated" });
    await deleteDashboardTemplate("tmpl-1");

    await getVisualThemes({ isDefault: true });
    await getVisualTheme("theme-1");
    await createVisualTheme({ name: "Theme", tokens: { primaryColor: "#000" } });
    await updateVisualTheme("theme-1", { name: "Theme 2" });
    await setDefaultVisualTheme("theme-1");
    await deleteVisualTheme("theme-1");

    expect(fetchMock).toHaveBeenCalledTimes(11);
    expect(fetchMock.mock.calls[0][0]).toBe(
      "/api/backend/dashboard-templates?category=sales",
    );
    expect(fetchMock.mock.calls[1][0]).toBe(
      "/api/backend/dashboard-templates/tmpl-1",
    );
    expect(fetchMock.mock.calls[5][0]).toBe(
      "/api/backend/visual-themes?isDefault=true",
    );
    expect(fetchMock.mock.calls[9][0]).toBe(
      "/api/backend/visual-themes/theme-1/set-default",
    );
  });

  it("handles personal dashboard persistence and user isolation operations", async () => {
    const personalDashboard = {
      id: "personal-dash-1",
      userId: "user-a",
      name: "My Dashboard",
      isDefault: true,
      layout: DEFAULT_DASHBOARD_LAYOUT,
    };

    const fetchMock = vi
      .fn()
      // 1. Initial dashboard fetch resolves user's personal default dashboard
      .mockResolvedValueOnce(
        mockResponse({
          data: [personalDashboard],
          meta: { page: 1, pageSize: 1, total: 1, totalPages: 1 },
        }),
      )
      // 2. User updates their own layout
      .mockResolvedValueOnce(
        mockResponse({
          ...personalDashboard,
          layout: { ...DEFAULT_DASHBOARD_LAYOUT, rowHeight: 90 },
        }),
      )
      // 3. User applies a template to their own dashboard
      .mockResolvedValueOnce(
        mockResponse({
          ...personalDashboard,
          layout: { ...DEFAULT_DASHBOARD_LAYOUT, widgets: [] },
        }),
      );

    vi.stubGlobal("fetch", fetchMock);

    // Fetch personal dashboard
    const response = await getDashboards({ isDefault: true, pageSize: 1 });
    expect(response.data[0].id).toBe("personal-dash-1");
    expect(response.data[0].userId).toBe("user-a");

    // Update layout on personal dashboard
    const updated = await updateDashboardLayout("personal-dash-1", {
      ...DEFAULT_DASHBOARD_LAYOUT,
      rowHeight: 90,
    });
    expect(updated.layout.rowHeight).toBe(90);

    // Apply template on personal dashboard
    const templated = await applyDashboardTemplate("personal-dash-1", "tpl-1");
    expect(templated.layout.widgets).toHaveLength(0);

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[0][0]).toBe(
      "/api/backend/dashboards?isDefault=true&pageSize=1",
    );
    expect(fetchMock.mock.calls[1][0]).toBe(
      "/api/backend/dashboards/personal-dash-1/layout",
    );
    expect(fetchMock.mock.calls[2][0]).toBe(
      "/api/backend/dashboards/personal-dash-1/apply-template",
    );
  });

  describe("Step 10 — Individual Widget Configuration / Settings", () => {
    it("all configurable widgets define supportsSettings, defaultSettings, and valid schema fields", () => {
      const all = getAllWidgetDefinitions();
      const configurable = all.filter((w) => w.supportsSettings);

      expect(configurable.length).toBeGreaterThanOrEqual(9);

      for (const widget of configurable) {
        expect(widget.defaultSettings).toBeDefined();
        expect(typeof widget.defaultSettings).toBe("object");

        // Validate that defaultSettings are strictly serializable JSON
        const serialized = JSON.stringify(widget.defaultSettings);
        expect(JSON.parse(serialized)).toEqual(widget.defaultSettings);

        // Validate settings schema fields
        expect(Array.isArray(widget.settingsFields)).toBe(true);
        expect(widget.settingsFields?.length).toBeGreaterThan(0);

        for (const field of widget.settingsFields || []) {
          expect(["select", "number", "boolean"]).toContain(field.type);
          expect(field.key).toBeTruthy();
          expect(field.label).toBeTruthy();
          if (field.type === "select") {
            expect(Array.isArray(field.options)).toBe(true);
            expect(field.options?.length).toBeGreaterThan(0);
          }
        }
      }
    });

    it("verifies expected default settings per widget type", () => {
      const metrics = getWidgetDefinition("metrics_grid");
      expect(metrics?.defaultSettings).toEqual({ showBanners: true, showKpis: true });

      const chart = getWidgetDefinition("sales_purchase_chart");
      expect(chart?.defaultSettings).toEqual({ defaultTimeframe: "1Y" });

      const products = getWidgetDefinition("top_selling_products");
      expect(products?.defaultSettings).toEqual({ limit: 5 });

      const recent = getWidgetDefinition("recent_sales");
      expect(recent?.defaultSettings).toEqual({ limit: 5, defaultPeriod: "Today" });

      const lowStock = getWidgetDefinition("low_stock_products");
      expect(lowStock?.defaultSettings).toEqual({ limit: 5 });

      const customers = getWidgetDefinition("top_customers");
      expect(customers?.defaultSettings).toEqual({ limit: 5 });

      const categories = getWidgetDefinition("top_categories");
      expect(categories?.defaultSettings).toEqual({ limit: 3, defaultPeriod: "Weekly" });

      const heatmap = getWidgetDefinition("order_heatmap");
      expect(heatmap?.defaultSettings).toEqual({ defaultPeriod: "Weekly" });

      const overall = getWidgetDefinition("overall_information");
      expect(overall?.defaultSettings).toEqual({ defaultPeriod: "Today" });
    });

    it("persists widget settings inside the layout without data loss", () => {
      const customLayout = {
        ...DEFAULT_DASHBOARD_LAYOUT,
        widgets: DEFAULT_DASHBOARD_LAYOUT.widgets.map((w) => {
          if (w.type === "top_selling_products") {
            return {
              ...w,
              title: "Custom Best Sellers",
              settings: { limit: 10 },
            };
          }
          if (w.type === "metrics_grid") {
            return {
              ...w,
              settings: { showBanners: false, showKpis: true },
            };
          }
          return w;
        }),
      };

      const serialized = JSON.stringify(customLayout);
      const parsed = JSON.parse(serialized);

      const modifiedProductWidget = parsed.widgets.find(
        (w: { type: string }) => w.type === "top_selling_products",
      );
      expect(modifiedProductWidget.title).toBe("Custom Best Sellers");
      expect(modifiedProductWidget.settings).toEqual({ limit: 10 });

      const modifiedMetricsWidget = parsed.widgets.find(
        (w: { type: string }) => w.type === "metrics_grid",
      );
      expect(modifiedMetricsWidget.settings).toEqual({
        showBanners: false,
        showKpis: true,
      });
    });
  });
});


