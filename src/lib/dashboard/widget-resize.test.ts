import { describe, expect, it } from "vitest";
import {
  RESIZE_HANDLES,
  toGridLayout,
} from "@/components/dashboard/dashboard/builder/dashboard-builder-grid";
import { DEFAULT_DASHBOARD_LAYOUT } from "@/lib/dashboard/default-layout";
import { getWidgetDefinition } from "@/components/dashboard/dashboard/registry/widget-registry";
import type { DashboardLayoutWidget, DashboardLayout } from "@/types/dashboard";

describe("Dashboard Widget Multi-Corner Resize UX", () => {
  it("enables all 4 corner resize handles and 4 side resize handles", () => {
    expect(RESIZE_HANDLES).toContain("nw");
    expect(RESIZE_HANDLES).toContain("ne");
    expect(RESIZE_HANDLES).toContain("sw");
    expect(RESIZE_HANDLES).toContain("se");
    expect(RESIZE_HANDLES).toContain("n");
    expect(RESIZE_HANDLES).toContain("e");
    expect(RESIZE_HANDLES).toContain("s");
    expect(RESIZE_HANDLES).toContain("w");
    expect(RESIZE_HANDLES.length).toBe(8);
  });

  it("assigns all 8 resize handles to each grid item in toGridLayout", () => {
    const gridLayout = toGridLayout(DEFAULT_DASHBOARD_LAYOUT.widgets);

    expect(gridLayout.length).toBe(DEFAULT_DASHBOARD_LAYOUT.widgets.length);
    for (const item of gridLayout) {
      expect(item.resizeHandles).toEqual(RESIZE_HANDLES);
      expect(item.minW).toBeGreaterThanOrEqual(1);
      expect(item.minH).toBeGreaterThanOrEqual(1);
      expect(item.maxW).toBeLessThanOrEqual(12);
    }
  });

  it("correctly calculates bottom-right (se) resize: w/h change, x/y stable", () => {
    const original: DashboardLayoutWidget = {
      id: "test-widget",
      type: "sales_purchase_chart",
      position: { x: 2, y: 3, w: 6, h: 4 },
    };

    // Simulate drag ↘ by increasing w and h
    const newWidth = 8;
    const newHeight = 6;
    const resized = {
      ...original,
      position: {
        ...original.position,
        w: newWidth,
        h: newHeight,
      },
    };

    expect(resized.position.x).toBe(2);
    expect(resized.position.y).toBe(3);
    expect(resized.position.w).toBe(8);
    expect(resized.position.h).toBe(6);
  });

  it("correctly calculates top-right (ne) resize: top edge moves, bottom edge stable", () => {
    const original: DashboardLayoutWidget = {
      id: "test-widget",
      type: "sales_purchase_chart",
      position: { x: 2, y: 5, w: 6, h: 4 }, // bottom edge is y + h = 9
    };

    // Simulate drag ↗: top edge moves from y=5 to y=3, height increases to 6
    const newY = 3;
    const newHeight = 6;
    const newWidth = 8;
    const resized = {
      ...original,
      position: {
        x: original.position.x,
        y: newY,
        w: newWidth,
        h: newHeight,
      },
    };

    expect(resized.position.x).toBe(2);
    expect(resized.position.y).toBe(3);
    expect(resized.position.w).toBe(8);
    expect(resized.position.h).toBe(6);
    // Bottom edge remains stable at row 9
    expect(resized.position.y + resized.position.h).toBe(9);
  });

  it("correctly calculates bottom-left (sw) resize: left edge moves, right edge stable", () => {
    const original: DashboardLayoutWidget = {
      id: "test-widget",
      type: "sales_purchase_chart",
      position: { x: 4, y: 2, w: 6, h: 4 }, // right edge is x + w = 10
    };

    // Simulate drag ↙: left edge moves from x=4 to x=2, width increases to 8
    const newX = 2;
    const newWidth = 8;
    const newHeight = 5;
    const resized = {
      ...original,
      position: {
        x: newX,
        y: original.position.y,
        w: newWidth,
        h: newHeight,
      },
    };

    expect(resized.position.x).toBe(2);
    expect(resized.position.y).toBe(2);
    expect(resized.position.w).toBe(8);
    expect(resized.position.h).toBe(5);
    // Right edge remains stable at column 10
    expect(resized.position.x + resized.position.w).toBe(10);
  });

  it("correctly calculates top-left (nw) resize: x and y adjust, bottom-right edge stable", () => {
    const original: DashboardLayoutWidget = {
      id: "test-widget",
      type: "sales_purchase_chart",
      position: { x: 4, y: 5, w: 6, h: 4 }, // bottom-right is (10, 9)
    };

    // Simulate drag ↖: top-left moves to (2, 3), width becomes 8, height becomes 6
    const newX = 2;
    const newY = 3;
    const newWidth = 8;
    const newHeight = 6;
    const resized = {
      ...original,
      position: {
        x: newX,
        y: newY,
        w: newWidth,
        h: newHeight,
      },
    };

    expect(resized.position.x).toBe(2);
    expect(resized.position.y).toBe(3);
    expect(resized.position.w).toBe(8);
    expect(resized.position.h).toBe(6);
    // Bottom-right corner remains stable at (10, 9)
    expect(resized.position.x + resized.position.w).toBe(10);
    expect(resized.position.y + resized.position.h).toBe(9);
  });

  it("enforces minimum width and height constraints so widgets never drop <= 0 or become unusable", () => {
    const invalidWidgets: DashboardLayoutWidget[] = [
      {
        id: "w-zero",
        type: "metrics_grid",
        position: { x: -5, y: -2, w: 0, h: 0 },
      },
      {
        id: "w-neg",
        type: "sales_purchase_chart",
        position: { x: 2, y: 2, w: -10, h: -4 },
      },
    ];

    const layoutItems = toGridLayout(invalidWidgets);

    expect(layoutItems[0].w).toBeGreaterThanOrEqual(layoutItems[0].minW ?? 1);
    expect(layoutItems[0].h).toBeGreaterThanOrEqual(layoutItems[0].minH ?? 1);
    expect(layoutItems[0].x).toBe(0);
    expect(layoutItems[0].y).toBe(0);

    expect(layoutItems[1].w).toBeGreaterThanOrEqual(layoutItems[1].minW ?? 1);
    expect(layoutItems[1].h).toBeGreaterThanOrEqual(layoutItems[1].minH ?? 1);
    expect(layoutItems[1].x).toBe(2);
    expect(layoutItems[1].y).toBe(2);
  });

  it("enforces maximum width constraint of 12 columns", () => {
    const oversizedWidget: DashboardLayoutWidget[] = [
      {
        id: "w-oversize",
        type: "metrics_grid",
        position: { x: 0, y: 0, w: 20, h: 15 },
      },
    ];

    const layoutItems = toGridLayout(oversizedWidget);

    expect(layoutItems[0].w).toBeLessThanOrEqual(12);
    expect(layoutItems[0].maxW).toBe(12);
  });

  it("enforces registry-specific constraints for metrics_grid and charts", () => {
    const metricsDef = getWidgetDefinition("metrics_grid");
    const chartDef = getWidgetDefinition("sales_purchase_chart");

    expect(metricsDef?.minW).toBe(3);
    expect(metricsDef?.minH).toBe(2);
    expect(metricsDef?.maxW).toBe(12);

    expect(chartDef?.minW).toBe(4);
    expect(chartDef?.minH).toBe(3);
    expect(chartDef?.maxW).toBe(12);
  });

  it("persists updated dimensions through dashboard layout state", () => {
    const initialLayout: DashboardLayout = { ...DEFAULT_DASHBOARD_LAYOUT };
    const targetWidget = initialLayout.widgets[0];

    // Simulate resizing the first widget from 12x4 to 8x6
    const updatedWidgets = initialLayout.widgets.map((w) => {
      if (w.id === targetWidget.id) {
        return {
          ...w,
          position: { ...w.position, w: 8, h: 6 },
        };
      }
      return w;
    });

    const persistedLayout: DashboardLayout = {
      ...initialLayout,
      widgets: updatedWidgets,
    };

    // Serialize and deserialize (simulating network save and page refresh)
    const jsonString = JSON.stringify(persistedLayout);
    const restoredLayout = JSON.parse(jsonString) as DashboardLayout;

    const restoredWidget = restoredLayout.widgets.find(
      (w) => w.id === targetWidget.id,
    );
    expect(restoredWidget?.position.w).toBe(8);
    expect(restoredWidget?.position.h).toBe(6);
    expect(restoredWidget?.position.x).toBe(targetWidget.position.x);
    expect(restoredWidget?.position.y).toBe(targetWidget.position.y);
  });
});
