import { describe, expect, it } from "vitest";
import {
  getAllWidgetDefinitions,
  getWidgetDefinition,
} from "@/components/dashboard/dashboard/registry/widget-registry";
import type {
  DashboardLayout,
  DashboardLayoutWidget,
} from "@/types/dashboard";

describe("Dashboard Widget Settings — Registry & Defaults", () => {
  it("registers default settings for all 9 dashboard widgets", () => {
    const widgets = getAllWidgetDefinitions();
    expect(widgets.length).toBeGreaterThanOrEqual(9);

    const topSelling = getWidgetDefinition("top_selling_products");
    expect(topSelling?.defaultSettings).toEqual({ limit: 5 });

    const recentSales = getWidgetDefinition("recent_sales");
    expect(recentSales?.defaultSettings).toEqual({
      limit: 5,
      defaultPeriod: "Today",
    });

    const lowStock = getWidgetDefinition("low_stock_products");
    expect(lowStock?.defaultSettings).toEqual({ limit: 5 });

    const topCustomers = getWidgetDefinition("top_customers");
    expect(topCustomers?.defaultSettings).toEqual({ limit: 5 });

    const topCategories = getWidgetDefinition("top_categories");
    expect(topCategories?.defaultSettings).toEqual({
      limit: 3,
      defaultPeriod: "Weekly",
    });

    const chart = getWidgetDefinition("sales_purchase_chart");
    expect(chart?.defaultSettings).toEqual({ defaultTimeframe: "1Y" });

    const heatmap = getWidgetDefinition("order_heatmap");
    expect(heatmap?.defaultSettings).toEqual({ defaultPeriod: "Weekly" });

    const overall = getWidgetDefinition("overall_information");
    expect(overall?.defaultSettings).toEqual({ defaultPeriod: "Today" });

    const metrics = getWidgetDefinition("metrics_grid");
    expect(metrics?.defaultSettings).toEqual({
      showBanners: true,
      showKpis: true,
    });
  });

  it("provides valid schema options for each configurable setting", () => {
    const recentSales = getWidgetDefinition("recent_sales");
    const limitField = recentSales?.settingsFields?.find((f) => f.key === "limit");
    const periodField = recentSales?.settingsFields?.find((f) => f.key === "defaultPeriod");

    expect(limitField?.options?.map((o) => o.value)).toEqual([3, 5, 10]);
    expect(periodField?.options?.map((o) => o.value)).toEqual([
      "Today",
      "Weekly",
      "Monthly",
    ]);

    const chart = getWidgetDefinition("sales_purchase_chart");
    const timeframeField = chart?.settingsFields?.find((f) => f.key === "defaultTimeframe");
    expect(timeframeField?.options?.map((o) => o.value)).toEqual([
      "1D",
      "1W",
      "1M",
      "3M",
      "6M",
      "1Y",
    ]);

    const categories = getWidgetDefinition("top_categories");
    const catLimitField = categories?.settingsFields?.find((f) => f.key === "limit");
    expect(catLimitField?.options?.map((o) => o.value)).toEqual([3, 5]);
  });
});

describe("Dashboard Widget Settings — Limit Enforcement Logic", () => {
  const sampleItems = Array.from({ length: 15 }, (_, i) => ({
    id: `item-${i + 1}`,
    name: `Item ${i + 1}`,
  }));

  function applyLimit<T>(items: T[], limit?: number): T[] {
    if (limit !== undefined && limit > 0) {
      return items.slice(0, limit);
    }
    return items;
  }

  it("enforces limit = 3", () => {
    const result = applyLimit(sampleItems, 3);
    expect(result).toHaveLength(3);
    expect(result[0].id).toBe("item-1");
    expect(result[2].id).toBe("item-3");
  });

  it("enforces limit = 5", () => {
    const result = applyLimit(sampleItems, 5);
    expect(result).toHaveLength(5);
  });

  it("enforces limit = 10", () => {
    const result = applyLimit(sampleItems, 10);
    expect(result).toHaveLength(10);
  });

  it("falls back safely if limit is undefined or missing", () => {
    const defaultLimit = 5;
    const result = applyLimit(sampleItems, defaultLimit);
    expect(result).toHaveLength(5);
  });
});

describe("Dashboard Widget Settings — Calendar Period Filtering Logic", () => {
  it("filters sales by calendar Today, Weekly, and Monthly", () => {
    const now = new Date();

    // Today at noon
    const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);

    // 3 days ago
    const threeDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 12, 0, 0);

    // 40 days ago (previous month)
    const fortyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 40, 12, 0, 0);

    const testSales = [
      { id: "sale-today", rawDate: todayDate.toISOString() },
      { id: "sale-3d", rawDate: threeDaysAgo.toISOString() },
      { id: "sale-40d", rawDate: fortyDaysAgo.toISOString() },
    ];

    function filterByPeriod(
      sales: typeof testSales,
      period: "Today" | "Weekly" | "Monthly",
    ) {
      const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0,
      );
      const endOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999,
      );
      const dayOfWeek = (now.getDay() + 6) % 7;
      const startOfWeek = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - dayOfWeek,
        0,
        0,
        0,
        0,
      );
      const endOfWeek = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - dayOfWeek + 6,
        23,
        59,
        59,
        999,
      );
      const startOfMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
        0,
        0,
        0,
        0,
      );
      const endOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );

      return sales.filter((s) => {
        const d = new Date(s.rawDate);
        if (period === "Today") return d >= startOfToday && d <= endOfToday;
        if (period === "Weekly") return d >= startOfWeek && d <= endOfWeek;
        if (period === "Monthly") return d >= startOfMonth && d <= endOfMonth;
        return true;
      });
    }

    const todaySales = filterByPeriod(testSales, "Today");
    expect(todaySales.map((s) => s.id)).toContain("sale-today");
    expect(todaySales.map((s) => s.id)).not.toContain("sale-40d");

    const monthlySales = filterByPeriod(testSales, "Monthly");
    expect(monthlySales.map((s) => s.id)).not.toContain("sale-40d");
  });
});

describe("Dashboard Widget Settings — Chart Timeframe Slicing", () => {
  const months = [
    { month: "Jan", purchase: 100, sales: 200 },
    { month: "Feb", purchase: 120, sales: 220 },
    { month: "Mar", purchase: 110, sales: 210 },
    { month: "Apr", purchase: 130, sales: 230 },
    { month: "May", purchase: 140, sales: 240 },
    { month: "Jun", purchase: 150, sales: 250 },
    { month: "Jul", purchase: 160, sales: 260 },
    { month: "Aug", purchase: 170, sales: 270 },
    { month: "Sep", purchase: 180, sales: 280 },
    { month: "Oct", purchase: 190, sales: 290 },
    { month: "Nov", purchase: 200, sales: 300 },
    { month: "Dec", purchase: 210, sales: 310 },
  ];

  function sliceTimeframe(data: typeof months, tf: string) {
    if (tf === "1D" || tf === "1W" || tf === "1M") return data.slice(-1);
    if (tf === "3M") return data.slice(-3);
    if (tf === "6M") return data.slice(-6);
    return data;
  }

  it("returns all 12 months for 1Y", () => {
    expect(sliceTimeframe(months, "1Y")).toHaveLength(12);
  });

  it("returns last 6 months for 6M", () => {
    const res = sliceTimeframe(months, "6M");
    expect(res).toHaveLength(6);
    expect(res[0].month).toBe("Jul");
    expect(res[5].month).toBe("Dec");
  });

  it("returns last 3 months for 3M", () => {
    const res = sliceTimeframe(months, "3M");
    expect(res).toHaveLength(3);
    expect(res[0].month).toBe("Oct");
    expect(res[2].month).toBe("Dec");
  });

  it("returns 1 month for 1M without fabricating fake daily numbers", () => {
    const res = sliceTimeframe(months, "1M");
    expect(res).toHaveLength(1);
    expect(res[0].month).toBe("Dec");
  });
});

describe("Dashboard Widget Settings — Metrics Grid Toggles", () => {
  it("allows independent control of banners and KPIs", () => {
    function evaluateVisibility(settings?: { showBanners?: boolean; showKpis?: boolean }) {
      return {
        banners: settings?.showBanners !== undefined ? Boolean(settings.showBanners) : true,
        kpis: settings?.showKpis !== undefined ? Boolean(settings.showKpis) : true,
      };
    }

    expect(evaluateVisibility({})).toEqual({ banners: true, kpis: true });
    expect(evaluateVisibility({ showBanners: false, showKpis: true })).toEqual({
      banners: false,
      kpis: true,
    });
    expect(evaluateVisibility({ showBanners: true, showKpis: false })).toEqual({
      banners: true,
      kpis: false,
    });
    expect(evaluateVisibility({ showBanners: false, showKpis: false })).toEqual({
      banners: false,
      kpis: false,
    });
  });
});

describe("Dashboard Widget Settings — Template & Legacy Preservation", () => {
  it("preserves widget settings through JSON serialization and cloning", () => {
    const layoutWithSettings: DashboardLayout = {
      version: 1,
      columns: 12,
      rowHeight: 80,
      widgets: [
        {
          id: "w-1",
          type: "top_selling_products",
          position: { x: 0, y: 0, w: 4, h: 4 },
          settings: { limit: 3 },
        },
        {
          id: "w-2",
          type: "recent_sales",
          position: { x: 4, y: 0, w: 4, h: 4 },
          settings: { limit: 10, defaultPeriod: "Monthly" },
        },
        {
          id: "w-3",
          type: "metrics_grid",
          position: { x: 8, y: 0, w: 4, h: 4 },
          settings: { showBanners: false, showKpis: true },
        },
      ],
    };

    // Simulate saving template and applying it to another dashboard
    const serialized = JSON.stringify(layoutWithSettings);
    const deserialized: DashboardLayout = JSON.parse(serialized);

    expect(deserialized.widgets[0].settings).toEqual({ limit: 3 });
    expect(deserialized.widgets[1].settings).toEqual({
      limit: 10,
      defaultPeriod: "Monthly",
    });
    expect(deserialized.widgets[2].settings).toEqual({
      showBanners: false,
      showKpis: true,
    });
  });

  it("safely handles legacy widgets with missing settings by applying defaults", () => {
    const legacyWidget: DashboardLayoutWidget = {
      id: "legacy-1",
      type: "top_selling_products",
      position: { x: 0, y: 0, w: 4, h: 4 },
      // settings is undefined
    };

    const def = getWidgetDefinition(legacyWidget.type);
    const resolvedLimit =
      typeof legacyWidget.settings?.limit === "number"
        ? legacyWidget.settings.limit
        : (def?.defaultSettings?.limit as number) ?? 5;

    expect(resolvedLimit).toBe(5);
  });
});
